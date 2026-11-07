(function () {
  'use strict';
  var root = document.documentElement;
  var I = window.I18N;

  /* ---------- Toasts ---------- */
  function toast(msg, type) {
    var box = document.getElementById('toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toasts';
      box.className = 'toasts';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      document.body.appendChild(box);
    }
    var el = document.createElement('div');
    el.className = 'toast' + (type === 'err' ? ' err' : '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3200);
  }
  window.toast = toast;

  /* ---------- Theme ---------- */
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Language ---------- */
  var langBtn = document.getElementById('lang-btn');
  var langLabel = document.getElementById('lang-label');
  function syncLangLabel() {
    if (langLabel) langLabel.textContent = I.getLang() === 'hi' ? 'English' : 'हिंदी';
  }
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      I.setLang(I.getLang() === 'hi' ? 'en' : 'hi');
    });
  }
  document.addEventListener('langchange', syncLangLabel);
  syncLangLabel();

  /* ---------- Mobile menu ---------- */
  var header = document.querySelector('.site-header');
  var menuBtn = document.getElementById('menu-btn');
  function setMenu(open) {
    if (!header || !menuBtn) return;
    header.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!header.classList.contains('open'));
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    var navLinks = document.querySelectorAll('#nav a');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () { setMenu(false); });
    }
  }

  /* ---------- Footer year ---------- */
  var years = document.querySelectorAll('[data-year]');
  for (var j = 0; j < years.length; j++) years[j].textContent = String(new Date().getFullYear());
})();
