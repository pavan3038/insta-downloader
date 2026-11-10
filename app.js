/* Home page logic: validation, resolve, preview, download with progress, history. */
(function () {
  'use strict';
  var IG = window.IG, t = IG.t;
  var $ = function (id) { return document.getElementById(id); };

  var form = $('dl-form'), input = $('url'), goBtn = $('go-btn'), pasteBtn = $('paste-btn');
  var errBox = $('error-box'), errTitle = $('error-title'), errText = $('error-text'), apiNotice = $('api-notice');
  var result = $('result'), preview = $('preview'), rTitle = $('r-title'), rType = $('r-type');
  var dlBtn = $('dl-btn'), cancelBtn = $('cancel-btn'), shareBtn = $('share-btn'), copyBtn = $('copy-btn'), newBtn = $('new-btn');
  var progress = $('progress'), pNum = $('p-num'), pBar = $('p-bar'), pTrack = $('p-track'), pLabel = $('p-label');
  var success = $('success'), successText = $('success-text');
  var histList = $('hist-list'), histEmpty = $('hist-empty'), clearBtn = $('clear-hist');

  var current = null;      // resolved video info from the API
  var downloading = false;
  var abortCtl = null;
  var lastFile = null;     // File object kept for "Save to Photos" (iOS share sheet)
  var lastErr = null;      // { code | key } so the message can be re-translated

  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(navigator.userAgent);

  /* ---------- URL validation (mirrors the server) ---------- */
  function parseIG(raw) {
    var s = (raw || '').trim();
    if (!s) return null;
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    var u;
    try { u = new URL(s); } catch (e) { return null; }
    var host = u.hostname.toLowerCase().replace(/^(www|m)\./, '');
    if (host !== 'instagram.com' && host !== 'instagr.am') return null;
    var m = u.pathname.match(/^\/(?:[A-Za-z0-9._]+\/)?(reels?|p|tv)\/([A-Za-z0-9_-]{5,})/);
    if (!m) return null;
    var kind = m[1] === 'reels' ? 'reel' : m[1];
    return { shortcode: m[2], type: kind === 'p' ? 'post' : kind === 'tv' ? 'igtv' : 'reel',
             canonical: 'https://www.instagram.com/' + kind + '/' + m[2] + '/' };
  }

  /* ---------- error / status UI ---------- */
  function showError(code, key) {
    lastErr = { code: code, key: key };
    renderError();
  }
  function renderError() {
    if (!lastErr) return;
    errTitle.textContent = t('err.title') + ' ';
    errText.textContent = t(lastErr.key || ('err.' + lastErr.code)) ;
    errBox.hidden = false;
    input.setAttribute('aria-invalid', lastErr.code === 'INVALID_URL' || lastErr.code === 'EMPTY' ? 'true' : 'false');
  }
  function clearError() { lastErr = null; errBox.hidden = true; input.removeAttribute('aria-invalid'); }
  function messageKey(code) {
    var known = ['INVALID_URL','NO_PROVIDER','NOT_OWNED','NOT_FOUND','NOT_AUTHORIZED','TOKEN_INVALID','CONFIG','UPSTREAM','RATE_LIMIT','EXPIRED'];
    return known.indexOf(code) >= 0 ? 'err.' + code : 'err.generic';
  }

  fetch('/api/status').then(function (r) { return r.json(); }).then(function (s) {
    if (!s.configured) apiNotice.hidden = false;
  }).catch(function () {});

  /* ---------- history (localStorage only) ---------- */
  var HKEY = 'insta_dl_history_v1';
  function loadHist() { try { return JSON.parse(localStorage.getItem(HKEY)) || []; } catch (e) { return []; } }
  function saveHist(a) { try { localStorage.setItem(HKEY, JSON.stringify(a.slice(0, 30))); } catch (e) {} }
  function addHist(info) {
    var a = loadHist().filter(function (x) { return x.shortcode !== info.shortcode; });
    a.unshift({ shortcode: info.shortcode, url: info.url, title: info.title, type: info.type, ts: Date.now() });
    saveHist(a); renderHist();
  }
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleString(IG.lang() === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch (e) { return new Date(ts).toLocaleString(); }
  }
  function mkBtn(label, fn) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'icon-btn'; b.textContent = label; b.addEventListener('click', fn); return b;
  }
  function renderHist() {
    var a = loadHist();
    histList.textContent = '';
    histEmpty.hidden = a.length > 0;
    clearBtn.hidden = a.length === 0;
    a.forEach(function (h) {
      var li = document.createElement('li'); li.className = 'card';
      var main = document.createElement('div'); main.className = 'h-main';
      var tt = document.createElement('div'); tt.className = 'h-title'; tt.textContent = h.title || t('result.untitled');
      var sub = document.createElement('div'); sub.className = 'h-sub'; sub.textContent = t('type.' + h.type) + ' · ' + fmtDate(h.ts);
      main.appendChild(tt); main.appendChild(sub);
      var act = document.createElement('div'); act.className = 'h-act';
      act.appendChild(mkBtn(t('hist.again'), function () { input.value = h.url; syncPasteLabel(); window.scrollTo({ top: 0, behavior: 'smooth' }); form.requestSubmit(); }));
      act.appendChild(mkBtn(t('hist.copy'), function () { copyText(h.url); }));
      act.appendChild(mkBtn(t('hist.remove'), function () {
        saveHist(loadHist().filter(function (x) { return x.shortcode !== h.shortcode; })); renderHist(); IG.toast(t('toast.removed'));
      }));
      li.appendChild(main); li.appendChild(act); histList.appendChild(li);
    });
  }
  clearBtn.addEventListener('click', function () {
    if (!window.confirm(t('hist.confirm'))) return;
    try { localStorage.removeItem(HKEY); } catch (e) {}
    renderHist(); IG.toast(t('toast.cleared'), 'ok');
  });

  /* ---------- clipboard ---------- */
  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      ta.remove(); IG.toast(ok ? t('toast.copied') : t('toast.copyFail'), ok ? 'ok' : 'err');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { IG.toast(t('toast.copied'), 'ok'); }, fallback);
    } else fallback();
  }
  copyBtn.addEventListener('click', function () { if (current) copyText(current.url); });

  pasteBtn.addEventListener('click', function () {
    if (input.value) { input.value = ''; resetResult(); clearError(); input.focus(); syncPasteLabel(); return; }
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(function (txt) { input.value = (txt || '').trim(); syncPasteLabel(); input.focus(); },
        function () { IG.toast(t('toast.pasteFail'), 'err'); input.focus(); });
    } else { IG.toast(t('toast.pasteFail'), 'err'); input.focus(); }
  });
  function syncPasteLabel() { pasteBtn.textContent = input.value ? t('form.clear') : t('form.paste'); pasteBtn.setAttribute('data-i18n', input.value ? 'form.clear' : 'form.paste'); }
  input.addEventListener('input', function () { syncPasteLabel(); if (lastErr) clearError(); });

  /* ---------- resolve ---------- */
  function resetResult() {
    if (abortCtl) abortCtl.abort();
    result.hidden = true; progress.hidden = true; success.hidden = true;
    preview.removeAttribute('src'); preview.removeAttribute('poster'); preview.load && preview.load();
    current = null; lastFile = null; shareBtn.hidden = true;
  }
  function setBusy(b) {
    goBtn.disabled = b; input.readOnly = b;
    goBtn.textContent = '';
    if (b) { var s = document.createElement('span'); s.className = 'spin'; goBtn.appendChild(s); var l = document.createElement('span'); l.textContent = t('form.checking'); goBtn.appendChild(l); }
    else {
      goBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 20h16"/></svg><span data-i18n="form.submit"></span>';
      goBtn.querySelector('span').textContent = t('form.submit');
    }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (downloading) return;
    clearError(); resetResult();
    var raw = input.value.trim();
    if (!raw) { lastErr = { code: 'EMPTY', key: 'err.empty' }; renderError(); input.focus(); return; }
    var p = parseIG(raw);
    if (!p) { lastErr = { code: 'INVALID_URL', key: 'err.invalid' }; renderError(); input.focus(); return; }
    setBusy(true);
    fetch('/api/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: p.canonical }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (r) {
        setBusy(false);
        if (!r.ok) { showError(r.j.code, messageKey(r.j.code)); return; }
        showResult(r.j, p);
      })
      .catch(function () { setBusy(false); lastErr = { code: 'NETWORK', key: 'err.network' }; renderError(); });
  });

  function showResult(j, p) {
    var vEl = document.getElementById("preview");
    var iEl = document.getElementById("img-preview");
    var isPhoto = (j.type === "image") || (j.filename && j.filename.toLowerCase().includes(".jpg"));

    if (isPhoto) {
      if (vEl) { vEl.style.display = "none"; vEl.pause(); }
      if (iEl) { iEl.src = j.stream || j.thumbnail; iEl.style.display = "block"; }
      if (dlBtn) {
        var sp = dlBtn.querySelector("span");
        if (sp) { sp.removeAttribute("data-i18n"); sp.textContent = "Download Photo (JPG)"; }
        else dlBtn.textContent = "Download Photo (JPG)";
      }
      var metaItem = document.querySelector(".meta li:nth-child(2)");
      if (metaItem) metaItem.textContent = "JPG";
    } else {
      if (iEl) iEl.style.display = "none";
      if (vEl) { vEl.style.display = "block"; vEl.src = j.stream; }
      if (dlBtn) {
        var sp2 = dlBtn.querySelector("span");
        if (sp2) sp2.textContent = "Download MP4";
      }
    }

    var isImg = j.type === "image" || (j.filename && !j.filename.endsWith(".mp4"));
    
    // Fix preview container: video vs image
    var prevContainer = preview.parentElement;
    var imgPrev = document.getElementById("img-preview");
    if (!imgPrev && prevContainer) {
      imgPrev = document.createElement("img");
      imgPrev.id = "img-preview";
      imgPrev.style.width = "100%";
      imgPrev.style.borderRadius = "12px";
      imgPrev.style.display = "none";
      prevContainer.appendChild(imgPrev);
    }

    if (isImg) {
      preview.style.display = "none";
      if (imgPrev) {
        imgPrev.src = j.thumbnail || j.stream;
        imgPrev.style.display = "block";
      }
    } else {
      if (imgPrev) imgPrev.style.display = "none";
      preview.style.display = "block";
      preview.src = j.stream;
    }

    // Force button labels
    if (dlBtn) {
      var s = dlBtn.querySelector("span");
      var txt = isImg ? "Download Photo (JPG)" : "Download MP4";
      if (s) { s.textContent = txt; s.removeAttribute("data-i18n"); }
      else dlBtn.textContent = txt;
    }

    current = { id: j.id, url: p.canonical, shortcode: p.shortcode, type: j.type || p.type, title: j.title || '',
                download: j.download, filename: j.filename || ('insta-' + p.shortcode + '.mp4') };
    rTitle.textContent = current.title || t('result.untitled');
    rType.textContent = t('type.' + current.type);
    if (j.thumbnail) preview.setAttribute('poster', j.thumbnail);
    
    var isImg = (j.filename && !j.filename.endsWith(".mp4")) || (j.type === "image") || (j.stream && (j.stream.includes(".jpg") || j.stream.includes(".webp") || j.stream.includes(".png")));
    if (dlBtn) {
      var span = dlBtn.querySelector("span");
      if (span) {
        span.textContent = isImg ? "Download Photo (JPG)" : "Download MP4";
      } else {
        dlBtn.textContent = isImg ? "Download Photo (JPG)" : "Download MP4";
      }
    }
    if (rType) {
      rType.textContent = isImg ? "Photo" : "Video";
    }
    
    var isImagePost = j.type === "image" || (j.filename && j.filename.endsWith(".jpg"));
    if (dlBtn) {
      var span = dlBtn.querySelector("span");
      var text = isImagePost ? "Download Photo (JPG)" : "Download MP4";
      if (span) span.textContent = text;
      else dlBtn.textContent = text;
    }
    if (rType) {
      rType.textContent = isImagePost ? "Photo" : "Video";
    }
    preview.src = j.stream;
    if (isImagePost) {
      preview.setAttribute("poster", j.stream);
    }


    result.hidden = false; progress.hidden = true; success.hidden = true; shareBtn.hidden = true;
    dlBtn.disabled = false; cancelBtn.hidden = true;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  IG.onLang(function () {
    if (current) { rType.textContent = t('type.' + current.type); if (!current.title) rTitle.textContent = t('result.untitled'); }
    renderError(); renderHist(); syncPasteLabel();
    if (!success.hidden) successText.textContent = successMsg();
  });

  newBtn.addEventListener('click', function () {
    resetResult(); clearError(); input.value = ''; syncPasteLabel(); window.scrollTo({ top: 0, behavior: 'smooth' }); input.focus();
  });

  /* ---------- download with progress ---------- */
  function setProgress(pct, got, total) {
    if (pct == null) { pTrack.classList.add('indet'); pNum.textContent = (got / 1048576).toFixed(1) + ' MB'; pTrack.removeAttribute('aria-valuenow'); return; }
    pTrack.classList.remove('indet');
    pBar.style.width = pct + '%'; pTrack.setAttribute('aria-valuenow', String(Math.round(pct)));
    pNum.textContent = Math.round(pct) + '% · ' + (got / 1048576).toFixed(1) + ' / ' + (total / 1048576).toFixed(1) + ' MB';
  }
  function successMsg() { return isIOS ? t('success.ios') : isAndroid ? t('success.android') : t('success.pc'); }

  function saveBlob(blob, name) {
    var a = document.createElement('a');
    var url = URL.createObjectURL(blob);
    a.href = url; a.download = name; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
  }

  function finishUI() { downloading = false; abortCtl = null; dlBtn.disabled = false; cancelBtn.hidden = true; }

  dlBtn.addEventListener('click', function () {
    if (!current || downloading) return;
    downloading = true; dlBtn.disabled = true; cancelBtn.hidden = false; success.hidden = true; shareBtn.hidden = true; clearError();
    progress.hidden = false; pLabel.textContent = t('progress.downloading'); setProgress(0, 0, 1);
    abortCtl = new AbortController();
    var cur = current;
    fetch(cur.download, { signal: abortCtl.signal }).then(function (res) {
      if (!res.ok) return res.json().catch(function () { return {}; }).then(function (j) { var e = new Error('http'); e.code = j.code; throw e; });
      var total = parseInt(res.headers.get('content-length') || '0', 10);
      if (!res.body || !res.body.getReader) return res.blob().then(function (b) { return b; });
      var reader = res.body.getReader(), chunks = [], got = 0;
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: 'video/mp4' });
          chunks.push(r.value); got += r.value.length;
          setProgress(total ? Math.min(99, got * 100 / total) : null, got, total);
          return pump();
        });
      }
      return pump();
    }).then(function (blob) {
      pLabel.textContent = t('progress.saving'); setProgress(100, blob.size, blob.size);
      var mp4 = blob.type === 'video/mp4' ? blob : new Blob([blob], { type: 'video/mp4' });
      saveBlob(mp4, cur.filename);
      try { lastFile = new File([mp4], cur.filename, { type: 'video/mp4' }); } catch (e) { lastFile = null; }
      if (lastFile && navigator.canShare && navigator.share && (isIOS || window.matchMedia('(pointer:coarse)').matches)) {
        try { if (navigator.canShare({ files: [lastFile] })) shareBtn.hidden = false; } catch (e) {}
      }
      progress.hidden = true;
      successText.textContent = successMsg(); success.hidden = false;
      IG.toast(t('toast.done'), 'ok');
      addHist(cur); finishUI();
    }).catch(function (e) {
      progress.hidden = true; finishUI();
      if (e && e.name === 'AbortError') { IG.toast(t('err.cancelled')); return; }
      if (e && e.code) showError(e.code, messageKey(e.code)); else showError('NETWORK', 'err.network');
    });
  });
  cancelBtn.addEventListener('click', function () { if (abortCtl) abortCtl.abort(); });

  shareBtn.addEventListener('click', function () {
    if (!lastFile) return;
    navigator.share({ files: [lastFile] }).catch(function () {});
  });

  /* ---------- init ---------- */
  var q = new URLSearchParams(location.search).get('url');
  if (q) { input.value = q; }
  syncPasteLabel(); renderHist();
})();
