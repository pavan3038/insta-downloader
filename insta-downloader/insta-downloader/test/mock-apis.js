'use strict';
/* Local mock of (a) an Instagram Graph API and (b) a generic provider API + a CDN, for tests only. */
const http = require('http');

const VIDEO = Buffer.alloc(3 * 1024 * 1024 + 123, 7); // fake 3 MB "mp4"
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

function start(port) {
  const origin = `http://127.0.0.1:${port}`;
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, origin);
    const json = (o, s = 200) => { res.writeHead(s, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };

    if (u.pathname === '/cdn/video.mp4') {                       // CDN with Range support
      const r = req.headers.range && /bytes=(\d+)-(\d*)/.exec(req.headers.range);
      if (r) {
        const s = +r[1], e = r[2] ? +r[2] : VIDEO.length - 1;
        res.writeHead(206, { 'Content-Type': 'video/mp4', 'Content-Range': `bytes ${s}-${e}/${VIDEO.length}`, 'Content-Length': e - s + 1, 'Accept-Ranges': 'bytes' });
        return res.end(VIDEO.subarray(s, e + 1));
      }
      res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': VIDEO.length, 'Accept-Ranges': 'bytes' });
      return res.end(VIDEO);
    }
    if (u.pathname === '/cdn/thumb.png') { res.writeHead(200, { 'Content-Type': 'image/png' }); return res.end(PNG); }
    if (u.pathname === '/cdn/page.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<html>nope</html>'); }

    // --- mock Instagram Graph API ---
    if (u.pathname === '/v21.0/me/media') {
      if (u.searchParams.get('access_token') !== 'GOOD_TOKEN') return json({ error: { message: 'Invalid OAuth access token', code: 190 } }, 400);
      if (u.searchParams.get('page') === '2') {
        return json({ data: [{ id: '3', media_type: 'VIDEO', media_url: origin + '/cdn/video.mp4', thumbnail_url: origin + '/cdn/thumb.png', permalink: 'https://www.instagram.com/reel/PAGE2video/', caption: 'Second page reel' }] });
      }
      return json({
        data: [
          { id: '1', media_type: 'IMAGE', media_url: origin + '/cdn/thumb.png', permalink: 'https://www.instagram.com/p/IMAGEonly1/' },
          { id: '2', media_type: 'VIDEO', media_url: origin + '/cdn/video.mp4', thumbnail_url: origin + '/cdn/thumb.png', permalink: 'https://www.instagram.com/reel/OWNreel123/', caption: 'My own reel\nsecond line' },
          { id: '9', media_type: 'VIDEO', media_url: origin + '/cdn/page.html', permalink: 'https://www.instagram.com/reel/BADhtml99/', caption: 'bad' },
        ],
        paging: { next: `${origin}/v21.0/me/media?page=2&access_token=GOOD_TOKEN` },
      });
    }

    // --- mock generic provider ---
    if (u.pathname === '/provider') {
      if (req.headers['x-api-key'] !== 'KEY123') return json({ error: 'unauthorized' }, 401);
      const target = u.searchParams.get('url') || '';
      if (target.includes('MISSING')) return json({ data: {} });
      return json({ data: { medias: [{ url: origin + '/cdn/video.mp4' }], title: 'Provider video', thumb: origin + '/cdn/thumb.png' } });
    }
    res.writeHead(404); res.end();
  });
  return new Promise((r) => server.listen(port, '127.0.0.1', () => r({ server, origin, VIDEO })));
}
module.exports = { start };
if (require.main === module) start(+process.env.MOCK_PORT || 4010).then((m) => console.log('mock on', m.origin));
