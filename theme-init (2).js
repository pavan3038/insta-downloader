(function () {
  var d = document.documentElement;
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'dark' && t !== 'light') {
      t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    d.setAttribute('data-theme', t);
    var l = localStorage.getItem('lang');
    if (l !== 'hi' && l !== 'en') {
      l = (navigator.language || '').toLowerCase().indexOf('hi') === 0 ? 'hi' : 'en';
    }
    d.setAttribute('lang', l);
  } catch (e) {
    d.setAttribute('data-theme', 'light');
  }
})();
