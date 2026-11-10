
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { ok: false, error: "Too many requests. Please wait 1 minute before trying again." },
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/", apiLimiter);


    'use strict';
/**
 * Insta Downloader – zero-dependency Node.js server (Node 18+).
 * Fixed for Render Port Scanning & Fallback UI
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const net = require('net');
const dns = require('dns').promises;
const { Readable } = require('stream');

/* ------------------------------------------------------------------ config */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = v;
  }
}
loadEnvFile(path.join(__dirname, '.env'));
const env = process.env;

const cfg = {
  port: parseInt(env.PORT, 10) || 10000,
  host: '0.0.0.0',
  siteUrl: (env.SITE_URL || '').replace(/\/+$/, ''),
  trustProxy: env.TRUST_PROXY === '1',
  rateLimit: parseInt(env.RATE_LIMIT_PER_MIN, 10) || 20,
  allowPrivate: env.ALLOW_PRIVATE_HOSTS === '1',
  provider: (env.PROVIDER || 'auto').toLowerCase(),
  graph: {
    token: env.IG_ACCESS_TOKEN || '',
    base: (env.IG_API_BASE || 'https://graph.instagram.com/v21.0').replace(/\/+$/, ''),
    maxPages: parseInt(env.IG_MAX_PAGES, 10) || 10,
  },
  custom: {
    url: env.CUSTOM_API_URL || '',
    method: (env.CUSTOM_API_METHOD || 'GET').toUpperCase(),
    headers: env.CUSTOM_API_HEADERS || '',
    body: env.CUSTOM_API_BODY || '',
    video: env.CUSTOM_VIDEO_PATH || '',
    thumb: env.CUSTOM_THUMB_PATH || '',
    title: env.CUSTOM_TITLE_PATH || '',
  },
  contactFile: env.CONTACT_FILE || path.join(__dirname, 'data', 'messages.jsonl'),
};

const VIEWS = path.join(__dirname, 'views');
const PUBLIC = path.join(__dirname, 'public');

/* ------------------------------------------------------------------ helpers */
class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

function parseInstagramUrl(input) {
  if (typeof input !== 'string' || input.length > 300) return null;
  let s = input.trim();
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch { return null; }
  const host = u.hostname.toLowerCase().replace(/^(www|m)\./, '');
  if (host !== 'instagram.com' && host !== 'instagr.am') return null;
  const m = u.pathname.match(/^\/(?:[A-Za-z0-9._]+\/)?(reels?|p|tv)\/([A-Za-z0-9_-]{5,})/);
  if (!m) return null;
  const kind = m[1] === 'reels' ? 'reel' : m[1];
  return {
    shortcode: m[2],
    type: kind === 'p' ? 'post' : kind === 'tv' ? 'igtv' : 'reel',
    canonical: `https://www.instagram.com/${kind}/${m[2]}/`,
  };
}

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
  }
  if (net.isIPv6(ip)) {
    const l = ip.toLowerCase();
    if (l === '::1' || l === '::') return true;
    if (l.startsWith('::ffff:')) return isPrivateIp(l.slice(7));
    return /^(fc|fd|fe8|fe9|fea|feb)/.test(l);
  }
  return true;
}

async function assertPublicUrl(urlStr) {
  let u;
  try { u = new URL(urlStr); } catch { throw new ApiError(502, 'UPSTREAM', 'Bad media URL'); }
  if (cfg.allowPrivate) return u;
  if (u.protocol !== 'https:') throw new ApiError(502, 'UPSTREAM', 'Media URL must be https');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) throw new ApiError(502, 'UPSTREAM', 'Blocked media host');
  return u;
}

async function safeFetch(url, init = {}, { timeout = 20000, maxRedirects = 3 } = {}) {
  let cur = url;
  for (let i = 0; i <= maxRedirects; i++) {
    await assertPublicUrl(cur);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let res;
    try { res = await fetch(cur, { ...init, redirect: 'manual', signal: controller.signal }); }
    finally { clearTimeout(timer); }
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      controller.abort();
      cur = new URL(res.headers.get('location'), cur).href;
      continue;
    }
    return { res, controller };
  }
  throw new ApiError(502, 'UPSTREAM', 'Too many redirects');
}

async function jsonFetch(url, init = {}) {
  let res;
  try { res = await fetch(url, { ...init, signal: AbortSignal.timeout(45000) }); }
  catch(e) { console.error("[CUSTOM FETCH ERR]:", e.message); throw new ApiError(502, "UPSTREAM", "API service unreachable: " + e.message); }
  let data = null;
  try { data = await res.json(); } catch { /* not JSON */ }
  if (!res.ok) {
    const code = data && data.error && data.error.code;
    if (res.status === 401 || (res.status === 403 && code === 190) || code === 190) throw new ApiError(502, 'TOKEN_INVALID', 'API token invalid or expired');
    if (res.status === 404) throw new ApiError(404, 'NOT_FOUND', 'Video not found');
    if (res.status === 403) throw new ApiError(403, 'NOT_AUTHORIZED', 'Not authorised');
    if (res.status === 429) throw new ApiError(429, 'RATE_LIMIT', 'Upstream rate limit');
    throw new ApiError(502, 'UPSTREAM', 'API service error (' + res.status + ')');
  }
  if (data === null) throw new ApiError(502, 'UPSTREAM', 'API returned invalid JSON');
  return data;
}

function pick(obj, spec) {
  for (const p of String(spec || '').split(',').map((x) => x.trim()).filter(Boolean)) {
    let v = obj;
    for (const k of p.split('.')) { if (v == null) break; v = v[k]; }
    if (typeof v === 'string' && v) return v;
  }
  return '';
}
const shortTitle = (s) => (s ? String(s).split('\n')[0].trim().slice(0, 120) : '');

/* ------------------------------------------------------------------ providers */
const graphProvider = {
  name: 'graph',
  configured: () => !!cfg.graph.token,
  async resolve(parsed) {
    const { token, base, maxPages } = cfg.graph;
    const baseHost = new URL(base).host;
    const fields = 'id,media_type,media_url,permalink,thumbnail_url,caption,timestamp';
    let next = `${base}/me/media?fields=${fields}&limit=50&access_token=${encodeURIComponent(token)}`;
    for (let page = 0; page < maxPages && next; page++) {
      const data = await jsonFetch(next);
      for (const m of data.data || []) {
        if (!m.permalink || !m.permalink.includes('/' + parsed.shortcode + '/')) continue;
        let video = m.media_type === 'VIDEO' ? m : null;
        if (m.media_type === 'CAROUSEL_ALBUM') {
          const kids = await jsonFetch(`${base}/${encodeURIComponent(m.id)}/children?fields=id,media_type,media_url,thumbnail_url&access_token=${encodeURIComponent(token)}`);
          video = (kids.data || []).find((k) => k.media_type === 'VIDEO') || null;
        }
        if (!video || !video.media_url) throw new ApiError(404, 'NOT_FOUND', 'This post has no video');
        return {
          videoUrl: video.media_url,
          thumbUrl: video.thumbnail_url || m.thumbnail_url || '',
          title: shortTitle(m.caption),
        };
      }
      const n = data.paging && data.paging.next;
      next = n && new URL(n).host === baseHost ? n : null;
    }
    throw new ApiError(404, 'NOT_OWNED', 'Video is not in the connected account');
  },
};

const customProvider = {
  name: 'custom',
  configured: () => !!(cfg.custom.url && cfg.custom.video),
  async resolve(parsed) {
    const c = cfg.custom;
    const fill = (s, enc) => s.replace(/\{url\}/g, enc ? encodeURIComponent(parsed.canonical) : parsed.canonical).replace(/\{shortcode\}/g, parsed.shortcode);
    const init = { method: c.method, headers: { Accept: 'application/json' } };
    try {
      if (c.headers) Object.assign(init.headers, JSON.parse(fill(c.headers, false)));
    } catch { throw new ApiError(500, 'CONFIG', 'CUSTOM_API_HEADERS is not valid JSON'); }
    if (c.method !== 'GET' && c.body) { init.body = fill(c.body, false); init.headers['Content-Type'] = init.headers['Content-Type'] || 'application/json'; }
    const data = await jsonFetch(fill(c.url, true), init);
    const videoUrl = pick(data, c.video);
    if (!/^https?:\/\//i.test(videoUrl)) throw new ApiError(404, 'NOT_FOUND', 'API did not return a video URL');
    return { videoUrl, thumbUrl: pick(data, c.thumb), title: shortTitle(pick(data, c.title)) };
  },
};

function activeProviders() {
  const all = [graphProvider, customProvider].filter((p) => p.configured());
  return cfg.provider === 'auto' ? all : all.filter((p) => p.name === cfg.provider);
}

/* ------------------------------------------------------------------ media store */
const store = new Map();
const TTL = 15 * 60 * 1000;
function putEntry(e) {
  if (store.size >= 500) store.delete(store.keys().next().value);
  const id = crypto.randomBytes(12).toString('base64url');
  store.set(id, { ...e, expires: Date.now() + TTL });
  return id;
}
function getEntry(id) {
  const e = store.get(id);
  if (!e) return null;
  if (e.expires < Date.now()) { store.delete(id); return null; }
  return e;
}
setInterval(() => { const n = Date.now(); for (const [k, v] of store) if (v.expires < n) store.delete(k); }, 60000).unref();

/* ------------------------------------------------------------------ rate limit */
const hits = new Map();
function clientIp(req) {
  if (cfg.trustProxy && req.headers['x-forwarded-for']) return String(req.headers['x-forwarded-for']).split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}
function limited(req, bucket, max) {
  const key = bucket + '|' + clientIp(req), now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < 60000);
  arr.push(now); hits.set(key, arr);
  return arr.length > max;
}
setInterval(() => { const n = Date.now(); for (const [k, v] of hits) if (!v.some((t) => n - t < 60000)) hits.delete(k); }, 60000).unref();

/* ------------------------------------------------------------------ http utils */
const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *; media-src 'self' blob: *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' *;",
};

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { ...SEC_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function readJson(req, limit = 16 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0, over = false; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > limit) over = true; else chunks.push(c); });
    req.on('error', reject);
    req.on('end', () => {
      if (over) return reject(new ApiError(413, 'TOO_LARGE', 'Request too large'));
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(new ApiError(400, 'INVALID', 'Invalid JSON')); }
    });
  });
}

function baseUrl(req) {
  if (cfg.siteUrl) return cfg.siteUrl;
  const host = String(req.headers.host || 'localhost').replace(/[^a-zA-Z0-9.:\-\[\]]/g, '');
  return `${req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${host}`;
}

/* ------------------------------------------------------------------ API handlers */
async function handleResolve(req, res) {
  if (limited(req, 'resolve', cfg.rateLimit)) throw new ApiError(429, 'RATE_LIMIT', 'Too many requests');
  const body = await readJson(req);
  const parsed = parseInstagramUrl(body.url);
  if (!parsed) throw new ApiError(400, 'INVALID_URL', 'Not a valid Instagram Reel/video link');
  const providers = activeProviders();
  if (!providers.length) throw new ApiError(503, 'NO_PROVIDER', 'No authorised API is configured on this server');

  let lastErr = null, found = null, source = '';
  for (const p of providers) {
    try { found = await p.resolve(parsed); source = p.name; break; }
    catch (e) { lastErr = e instanceof ApiError ? e : new ApiError(502, 'UPSTREAM', 'API error'); }
  }
  if (!found) throw lastErr;
  await assertPublicUrl(found.videoUrl);

  const filename = `insta-${parsed.shortcode}.mp4`;
  const id = putEntry({ videoUrl: found.videoUrl, thumbUrl: found.thumbUrl, filename });
  sendJson(res, 200, {
    id, source, type: parsed.type, shortcode: parsed.shortcode, title: found.title, filename,
    thumbnail: found.thumbUrl ? `/api/thumb/${id}` : null,
    stream: `/api/stream/${id}`,
    download: `/api/download/${id}`,
  });
}

async function handleMedia(req, res, id, kind) {
  const e = getEntry(id);
  if (!e) throw new ApiError(404, 'EXPIRED', 'Link expired');
  const target = kind === 'thumb' ? e.thumbUrl : e.videoUrl;
  if (!target) throw new ApiError(404, 'NOT_FOUND', 'Not available');
  const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; InstaDownloader/1.0)' };
  if (kind !== 'thumb' && req.headers.range) headers.range = req.headers.range;

  let up;
  try { up = await safeFetch(target, { headers }); }
  catch (err) { throw err instanceof ApiError ? err : new ApiError(502, 'UPSTREAM', 'Could not fetch media'); }
  const { res: r, controller } = up;
  if (!(r.ok || r.status === 206) || !r.body) { controller.abort(); throw new ApiError(502, 'UPSTREAM', 'Media host returned ' + r.status); }

  let ct = (r.headers.get('content-type') || '').toLowerCase();
  const out = { ...SEC_HEADERS, 'Cache-Control': 'private, max-age=600' };
  if (kind === 'thumb') {
    if (!ct.startsWith('image/')) { controller.abort(); throw new ApiError(502, 'UPSTREAM', 'Bad thumbnail'); }
  } else {
    if (ct.startsWith('text/') || ct.includes('json') || ct.includes('html')) { controller.abort(); throw new ApiError(502, 'UPSTREAM', 'Media host did not return a video'); }
    if (!ct.startsWith('video/') && !ct.startsWith('image/')) ct = 'video/mp4';
    out['Accept-Ranges'] = 'bytes';
  }
  out['Content-Type'] = ct;
  for (const h of ['content-length', 'content-range']) { const v = r.headers.get(h); if (v) out[h] = v; }
  if (kind === 'download') out['Content-Disposition'] = `attachment; filename="${ct.startsWith('image/') ? e.filename.replace(/\.mp4$/i, '.jpg') : e.filename}"; filename*=UTF-8''${encodeURIComponent(e.filename)}`;

  res.writeHead(r.status, out);
  if (req.method === 'HEAD') { controller.abort(); return res.end(); }
  res.on('close', () => controller.abort());
  Readable.fromWeb(r.body).on('error', () => res.destroy()).pipe(res);
}

async function handleContact(req, res) {
  if (limited(req, 'contact', 5)) throw new ApiError(429, 'RATE_LIMIT', 'Too many requests');
  const b = await readJson(req);
  if (b.website) return sendJson(res, 200, { ok: true });
  const name = String(b.name || '').trim().slice(0, 100), email = String(b.email || '').trim().slice(0, 200), message = String(b.message || '').trim().slice(0, 3000);
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new ApiError(400, 'INVALID', 'Please fill all fields correctly');
  fs.mkdirSync(path.dirname(cfg.contactFile), { recursive: true });
  fs.appendFileSync(cfg.contactFile, JSON.stringify({ ts: new Date().toISOString(), name, email, message }) + '\n');
  sendJson(res, 200, { ok: true });
}

/* ------------------------------------------------------------------ static & views */
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
const PAGES = { '/': 'index.html', '/contact': 'contact.html', '/privacy': 'privacy.html', '/terms': 'terms.html' };
const fileCache = new Map();

function cachedFile(file, base) {
  if (!fs.existsSync(file)) return null;
  const st = fs.statSync(file);
  const key = file + '|' + base;
  const hit = fileCache.get(key);
  if (hit && hit.mtime === st.mtimeMs) return hit;
  let buf = fs.readFileSync(file);
  const ext = path.extname(file);
  if (ext === '.html') {
    const part = (n) => {
      const p = path.join(VIEWS, n);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    };
    buf = Buffer.from(buf.toString('utf8').replace('<!--@header-->', part('_header.html')).replace('<!--@footer-->', part('_footer.html')).replace(/__SITE_URL__/g, base));
  }
  const compressible = /^(text\/|application\/(json|xml)|image\/svg)/.test(MIME[ext] || '');
  const entry = { mtime: st.mtimeMs, buf, gz: compressible && buf.length > 512 ? zlib.gzipSync(buf, { level: 9 }) : null,
    etag: '"' + crypto.createHash('sha1').update(buf).digest('base64url').slice(0, 20) + '"', type: MIME[ext] || 'application/octet-stream' };
  fileCache.set(key, entry);
  return entry;
}

function serveFile(req, res, file, base, status = 200) {
  let f;
  try { f = cachedFile(file, base); } catch { return false; }
  if (!f) return false;
  const html = f.type.startsWith('text/html');
  const h = { ...SEC_HEADERS, 'Content-Type': f.type, ETag: f.etag, Vary: 'Accept-Encoding',
    'Cache-Control': html ? 'no-cache' : 'public, max-age=3600' };
  if (status === 200 && req.headers['if-none-match'] === f.etag) { res.writeHead(304, h); res.end(); return true; }
  const useGz = f.gz && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  const body = useGz ? f.gz : f.buf;
  if (useGz) h['Content-Encoding'] = 'gzip';
  h['Content-Length'] = body.length;
  res.writeHead(status, h);
  res.end(req.method === 'HEAD' ? undefined : body);
  return true;
}

function serveStatic(req, res, pathname) {
  const base = baseUrl(req);
  if (pathname === '/robots.txt') {
    const t = `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`;
    res.writeHead(200, { ...SEC_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' }); return res.end(t);
  }
  if (pathname === '/sitemap.xml') {
    const urls = Object.keys(PAGES).map((p) => `<url><loc>${base}${p === '/' ? '/' : p}</loc></url>`).join('');
    res.writeHead(200, { ...SEC_HEADERS, 'Content-Type': 'application/xml; charset=utf-8' });
    return res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
  }
  const clean = pathname.replace(/\.html$/, '').replace(/(.)\/$/, '$1');
  if (PAGES[clean]) {
    const ok = serveFile(req, res, path.join(VIEWS, PAGES[clean]), base);
    if (ok) return;
  }
  if (pathname === '/favicon.ico') {
    if (serveFile(req, res, path.join(PUBLIC, 'assets', 'favicon.svg'), base)) return;
  }
  if (pathname.startsWith('/assets/')) {
    const file = path.normalize(path.join(PUBLIC, pathname));
    if (file.startsWith(PUBLIC + path.sep) && !path.basename(file).startsWith('.') && fs.existsSync(file) && fs.statSync(file).isFile()) {
      if (serveFile(req, res, file, base)) return;
    }
  }
  notFound(req, res, base);
}

function notFound(req, res, base) { 
  if (!serveFile(req, res, path.join(VIEWS, '404.html'), base, 404)) { 
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); 
    res.end('<h1>404 Not Found</h1><p>The requested page was not found.</p>'); 
  } 
}

/* ------------------------------------------------------------------ server */
const server = http.createServer(async (req, res) => {
  try {
    let pathname;
    try { 
      pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname); 
    } catch { 
      res.writeHead(400); 
      return res.end('Bad request');
      }
    const get = req.method === 'GET' || req.method === 'HEAD';

    // RENDER HEALTH CHECK PROBE (Ensures 200 OK immediately during Port Scan)
    if (pathname === '/healthz' || (pathname === '/' && req.headers['user-agent'] && req.headers['user-agent'].includes('Render'))) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('OK');
    }

    if (pathname === '/api/status' && get) {
      const ps = activeProviders();
      return sendJson(res, 200, { configured: ps.length > 0, providers: ps.map((p) => p.name) });
    }
    if (pathname === '/api/resolve' && req.method === 'POST') return await handleResolve(req, res);
    if (pathname === '/api/contact' && req.method === 'POST') return await handleContact(req, res);
    const m = pathname.match(/^\/api\/(download|stream|thumb)\/([A-Za-z0-9_-]{8,40})$/);
    if (m && get) return await handleMedia(req, res, m[2], m[1]);
    if (pathname.startsWith('/api/')) throw new ApiError(404, 'NOT_FOUND', 'Unknown endpoint');
    if (!get) { res.writeHead(405, { Allow: 'GET, HEAD, POST' }); return res.end(); }

    serveStatic(req, res, pathname);
  } catch (e) {
    if (res.headersSent) return res.destroy();
    if (e instanceof ApiError) return sendJson(res, e.status, { error: e.message, code: e.code });
    console.error('Unhandled error:', e && e.message);
    sendJson(res, 500, { error: 'Internal server error', code: 'INTERNAL' });
  }
});

/* ------------------------------------------------------------------ start listen */
if (require.main === module) {
  const PORT = parseInt(process.env.PORT, 10) || 10000;
  // Binding to 0.0.0.0 specifically for Render / Cloud Containers
  server.listen(PORT, '0.0.0.0', () => {
    const ps = activeProviders().map((p) => p.name);
    console.log(`Insta Downloader running on http://0.0.0.0:${PORT}`);
    console.log(ps.length ? `Active providers: ${ps.join(', ')}` : 'WARNING: no API provider configured – downloads will fail');
  });
}

module.exports = { server, parseInstagramUrl, isPrivateIp };
      
