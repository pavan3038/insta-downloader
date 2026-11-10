/* Runs before first paint: apply saved theme + language to avoid flicker. */
(function () {
  var theme = null, lang = null;
  try { theme = localStorage.getItem('insta_theme'); lang = localStorage.getItem('insta_lang'); } catch (e) {}
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (lang !== 'hi' && lang !== 'en') {
    lang = (navigator.language || 'hi').toLowerCase().indexOf('en') === 0 ? 'en' : 'hi';
  }
  var h = document.documentElement;
  h.setAttribute('data-theme', theme);
  h.setAttribute('lang', lang);
})();
