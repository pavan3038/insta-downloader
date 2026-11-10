(function () {
  'use strict';

  var I = window.I18N;
  var t = I.t;
  var $ = function (s) { return document.querySelector(s); };

  var IG_RE = /^https?:\/\/(?:www\.|m\.)?instagram\.com\/(?:[A-Za-z0-9._]+\/)?(?:reel|reels|p|tv)\/[A-Za-z0-9_-]{5,}\/?(?:\?.*)?(?:#.*)?$/i;
  var HISTORY_KEY = 'insta_dl_history_v1';
  var HISTORY_MAX = 30;

  var UA = navigator.userAgent || '';
  var isIOS = /iP(hone|ad|od)/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(UA);

  var el = {
    form: $('#dl-form'), input: $('#url-input'), paste: $('#paste-btn'), clear: $('#clear-input'),
    submit: $('#submit-btn'), submitLabel: $('#submit-label'),
    banner: $('#config-banner'),
    errBox: $('#error-box'), errText: $('#error-text'),
    result: $('#result'), video: $('#preview-video'),
    rTitle: $('#r-title'), rAuthor: $('#r-author'), rSource: $('#r-source'),
    dlBtn: $('#download-btn'), saveBtn: $('#save-btn'), copyBtn: $('#copy-btn'),
    progress: $('#progress'), pLabel: $('#p-label'), pPct: $('#p-pct'), pTrack: $('#p-track'),
    pBar: $('#p-bar'), pSize: $('#p-size'), cancel: $('#cancel-btn'),
    okBox: $('#success-box'), okText: $('#success-text'),
    hList: $('#hist-list'), hEmpty: $('#hist-empty'), hCount: $('#hist-count'), hClear: $('#hist-clear')
  };

  var current = null;      // resolved video info
  var resolving = false;
  var downloading = false;
  var abortCtl = null;
  var readyFile = null;    // File prepared for iOS share sheet
  var state = { errCode: null, errMsg: null, okKey: null };

  /* ---------- helpers ---------- */
  function show(n) { n.hidden = false; }
  function hide(n) { n.hidden = true; }
  function mb(bytes) { return (bytes / 1048576).toFixed(1); }

  function apiError(code, message) {
    var e = new Error(message || code);
    e.code = code;
    return e;
  }

  function errorText(code, fallback) {
    var key = 'err.' + String(code || 'internal').toLowerCase();
    if (I.has(key)) return t(key);
    return fallback || t('err.internal');
  }

  function showError(code, fallback) {
    state.errCode = code;
    state.errMsg = fallback || null;
    el.errText.textContent = errorText(code, fallback);
    show(el.errBox);
    if (el.errBox.scrollIntoView) el.errBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function hideError() {
    state.errCode = null;
    hide(el.errBox);
  }

  function setSuccess(key) {
    state.okKey = key;
    if (key) {
      el.okText.textContent = t(key);
      show(el.okBox);
    } else {
      hide(el.okBox);
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  function copyLink(url) {
    copyText(url).then(
      function () { window.toast(t('toast.copied')); },
      function () { window.toast(t('toast.copy_failed'), 'err'); }
    );
  }

  /* ---------- input state ---------- */
  function syncClear() { el.clear.hidden = !el.input.value; }

  function setBusy(on) {
    resolving = on;
    el.submit.disabled = on;
    el.submit.classList.toggle('is-busy', on);
    el.submitLabel.textContent = t(on ? 'btn.checking' : 'btn.download');
  }

  function resetResult() {
    current = null;
    readyFile = null;
    hide(el.result);
    hide(el.progress);
    hide(el.saveBtn);
    setSuccess(null);
    try { el.video.pause(); el.video.removeAttribute('src'); el.video.removeAttribute('poster'); el.video.load(); } catch (e) { /* ignore */ }
  }

  /* ---------- resolve ---------- */
  function resolve(url) {
    if (resolving) return;
    hideError();
    resetResult();
    setBusy(true);

    fetch('/api/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (j) { return { r: r, j: j }; });
    }).then(function (x) {
      if (!x.r.ok || !x.j || !x.j.ok) {
        showError((x.j && x.j.code) || 'INTERNAL', x.j && x.j.message);
        return;
      }
      current = x.j.data;
      current.pageUrl = url;
      renderResult();
    }).catch(function () {
      showError('NETWORK');
    }).then(function () {
      setBusy(false);
    });
  }

  function renderSource() {
    if (!current) return;
    var key = 'result.source.' + current.source;
    el.rSource.textContent = I.has(key) ? t(key) : t('result.source.custom');
  }

  function renderResult() {
    el.rTitle.textContent = current.title || t('result.untitled');
    el.rAuthor.textContent = current.author ? '@' + current.author : '';
    el.rAuthor.hidden = !current.author;
    renderSource();
    if (current.thumbnail) el.video.setAttribute('poster', current.thumbnail);
    el.video.setAttribute('src', current.previewUrl);
    show(el.result);
    if (el.result.scrollIntoView) el.result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ---------- download with progress ---------- */
  function setProgress(got, total) {
    var determinate = total > 0;
    el.pTrack.classList.toggle('indeterminate', !determinate);
    if (determinate) {
      var pct = Math.min(100, Math.floor((got / total) * 100));
      el.pBar.style.width = pct + '%';
      el.pPct.textContent = pct + '%';
      el.pTrack.setAttribute('aria-valuenow', String(pct));
      el.pSize.textContent = mb(got) + ' / ' + mb(total) + ' MB';
    } else {
      el.pPct.textContent = '';
      el.pSize.textContent = got ? mb(got) + ' MB' : '';
    }
  }

  function startDownload() {
    if (!current || downloading) return;
    downloading = true;
    hideError();
    setSuccess(null);
    hide(el.saveBtn);
    readyFile = null;
    el.dlBtn.disabled = true;
    el.pLabel.textContent = t('progress.preparing');
    el.pBar.style.width = '0%';
    setProgress(0, 0);
    show(el.progress);

    abortCtl = new AbortController();
    var total = 0;

    fetch(current.downloadUrl, { signal: abortCtl.signal, cache: 'no-store' }).then(function (res) {
      if (!res.ok) {
        return res.json().catch(function () { return null; }).then(function (j) {
          throw apiError((j && j.code) || 'UPSTREAM', j && j.message);
        });
      }
      total = parseInt(res.headers.get('Content-Length') || '0', 10) || 0;
      el.pLabel.textContent = t('progress.downloading');

      if (!res.body || !res.body.getReader) {
        return res.blob().then(function (b) { setProgress(b.size, b.size); return b; });
      }
      var reader = res.body.getReader();
      var chunks = [];
      var got = 0;
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: 'video/mp4' });
          chunks.push(r.value);
          got += r.value.length;
          setProgress(got, total);
          return pump();
        });
      }
      return pump();
    }).then(function (blob) {
      if (!blob || !blob.size) throw apiError('UPSTREAM');
      finishDownload(blob);
    }).catch(function (e) {
      hide(el.progress);
      if (e && e.name === 'AbortError') {
        window.toast(t('toast.cancelled'));
      } else if (e && e.code) {
        showError(e.code, e.message);
      } else {
        showError('NETWORK');
      }
    }).then(function () {
      downloading = false;
      abortCtl = null;
      el.dlBtn.disabled = false;
    });
  }

  function fileName() {
    return 'insta-downloader-' + (current.shortcode || Date.now()) + '.mp4';
  }

  function finishDownload(blob) {
    el.pLabel.textContent = t('progress.done');
    el.pTrack.classList.remove('indeterminate');
    el.pBar.style.width = '100%';
    el.pPct.textContent = '100%';
    el.pTrack.setAttribute('aria-valuenow', '100');
    el.pSize.textContent = mb(blob.size) + ' MB';

    addHistory({
      url: current.pageUrl,
      title: current.title || '',
      author: current.author || '',
      shortcode: current.shortcode || '',
      ts: Date.now()
    });

    if (isIOS) {
      try { readyFile = new File([blob], fileName(), { type: 'video/mp4' }); } catch (e) { readyFile = null; }
      show(el.saveBtn);
      setSuccess('success.ios');
      return;
    }

    var a = document.createElement('a');
    var href = URL.createObjectURL(blob);
    a.href = href;
    a.download = fileName();
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(href); }, 120000);
    setSuccess(isAndroid ? 'success.android' : 'success.desktop');
  }

  function saveVideo() {
    if (!readyFile) return;
    var canShare = false;
    try { canShare = !!(navigator.canShare && navigator.canShare({ files: [readyFile] })); } catch (e) { canShare = false; }

    if (canShare) {
      navigator.share({ files: [readyFile] }).then(function () {
        setSuccess('success.ios_saved');
      }).catch(function (e) {
        if (e && e.name === 'AbortError') return;
        openBlobFallback();
      });
    } else {
      openBlobFallback();
    }
  }

  function openBlobFallback() {
    var url = URL.createObjectURL(readyFile);
    window.open(url, '_blank');
    setSuccess('success.ios_fallback');
  }

  /* ---------- history ---------- */
  function loadHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveHistory(arr) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr)); } catch (e) { /* ignore */ }
  }

  function addHistory(item) {
    var arr = loadHistory().filter(function (x) { return x.url !== item.url; });
    arr.unshift(item);
    saveHistory(arr.slice(0, HISTORY_MAX));
    renderHistory();
  }

  function iconBtn(act, icon, label, ts) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'icon-btn sm';
    b.setAttribute('data-act', act);
    b.setAttribute('data-ts', String(ts));
    b.setAttribute('aria-label', label);
    b.title = label;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ic');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '/icons.svg#' + icon);
    svg.appendChild(use);
    b.appendChild(svg);
    return b;
  }

  function renderHistory() {
    var arr = loadHistory();
    el.hList.textContent = '';
    el.hEmpty.hidden = arr.length > 0;
    el.hList.hidden = arr.length === 0;
    el.hClear.hidden = arr.length === 0;
    el.hCount.textContent = arr.length ? t('hist.count', { n: arr.length }) : '';
    var locale = I.getLang() === 'hi' ? 'hi-IN' : 'en-IN';

    arr.forEach(function (it) {
      var li = document.createElement('li');
      li.className = 'hist-item card';

      var main = document.createElement('div');
      main.className = 'hist-main';
      var title = document.createElement('div');
      title.className = 'hist-title';
      title.textContent = it.title || it.url;
      var meta = document.createElement('div');
      meta.className = 'hist-meta';
      var when = '';
      try { when = new Date(it.ts).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { when = ''; }
      meta.textContent = (it.author ? '@' + it.author + ' · ' : '') + when;
      main.appendChild(title);
      main.appendChild(meta);

      var actions = document.createElement('div');
      actions.className = 'hist-actions';
      actions.appendChild(iconBtn('copy', 'i-copy', t('hist.copy'), it.ts));
      actions.appendChild(iconBtn('redo', 'i-refresh', t('hist.redo'), it.ts));
      actions.appendChild(iconBtn('remove', 'i-trash', t('hist.remove'), it.ts));

      li.appendChild(main);
      li.appendChild(actions);
      el.hList.appendChild(li);
    });
  }

  el.hList.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-act]');
    if (!btn) return;
    var ts = Number(btn.getAttribute('data-ts'));
    var arr = loadHistory();
    var item = arr.filter(function (x) { return x.ts === ts; })[0];
    if (!item) return;
    var act = btn.getAttribute('data-act');
    if (act === 'copy') {
      copyLink(item.url);
    } else if (act === 'redo') {
      el.input.value = item.url;
      syncClear();
      var top = $('#download');
      if (top && top.scrollIntoView) top.scrollIntoView({ behavior: 'smooth' });
      resolve(item.url);
    } else if (act === 'remove') {
      saveHistory(arr.filter(function (x) { return x.ts !== ts; }));
      renderHistory();
      window.toast(t('toast.removed'));
    }
  });

  el.hClear.addEventListener('click', function () {
    if (!window.confirm(t('hist.confirm'))) return;
    saveHistory([]);
    renderHistory();
    window.toast(t('toast.cleared'));
  });

  /* ---------- events ---------- */
  el.form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = el.input.value.trim();
    if (!v) { showError('EMPTY'); return; }
    if (!IG_RE.test(v)) { showError('INVALID'); return; }
    resolve(v);
  });

  el.input.addEventListener('input', function () {
    syncClear();
    if (state.errCode) hideError();
  });

  el.clear.addEventListener('click', function () {
    el.input.value = '';
    syncClear();
    hideError();
    resetResult();
    el.input.focus();
  });

  el.paste.addEventListener('click', function () {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      window.toast(t('toast.paste_failed'), 'err');
      el.input.focus();
      return;
    }
    navigator.clipboard.readText().then(function (text) {
      text = (text || '').trim();
      if (!text) { window.toast(t('toast.paste_failed'), 'err'); return; }
      el.input.value = text;
      syncClear();
      hideError();
      window.toast(t('toast.pasted'));
    }).catch(function () {
      window.toast(t('toast.paste_failed'), 'err');
      el.input.focus();
    });
  });

  el.dlBtn.addEventListener('click', startDownload);
  el.saveBtn.addEventListener('click', saveVideo);
  el.copyBtn.addEventListener('click', function () { if (current) copyLink(current.pageUrl); });
  el.cancel.addEventListener('click', function () { if (abortCtl) abortCtl.abort(); });

  document.addEventListener('langchange', function () {
    setBusy(resolving);
    renderHistory();
    renderSource();
    if (state.errCode) el.errText.textContent = errorText(state.errCode, state.errMsg);
    if (state.okKey) el.okText.textContent = t(state.okKey);
    if (current && !el.result.hidden && !current.title) el.rTitle.textContent = t('result.untitled');
  });

  /* ---------- init ---------- */
  renderHistory();
  syncClear();

  fetch('/api/config', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (c) {
    if (c && c.ready === false) show(el.banner);
  }).catch(function () { /* banner stays hidden */ });

  try {
    var q = new URLSearchParams(location.search).get('url');
    if (q && IG_RE.test(q.trim())) { el.input.value = q.trim(); syncClear(); }
  } catch (e) { /* ignore */ }
})();
