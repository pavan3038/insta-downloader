(function () {
  'use strict';
  var I = window.I18N;
  var t = I.t;
  var form = document.getElementById('contact-form');
  var ok = document.getElementById('c-ok');
  var err = document.getElementById('c-err');
  var errText = document.getElementById('c-err-text');
  var btn = document.getElementById('c-send');
  var label = document.getElementById('c-send-label');
  var busy = false;
  var errKey = null;

  function showErr(key) {
    errKey = key;
    errText.textContent = t(key);
    err.hidden = false;
  }

  function setBusy(on) {
    busy = on;
    btn.disabled = on;
    btn.classList.toggle('is-busy', on);
    label.textContent = t(on ? 'contact.sending' : 'contact.send');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    ok.hidden = true;
    err.hidden = true;
    errKey = null;

    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
      website: form.elements.website.value
    };
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) || data.message.length < 10) {
      showErr('contact.invalid');
      return;
    }

    setBusy(true);
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (j) { return { r: r, j: j }; });
    }).then(function (x) {
      if (x.r.ok && x.j && x.j.ok) {
        ok.hidden = false;
        form.reset();
      } else if (x.j && x.j.code === 'INVALID_INPUT') {
        showErr('contact.invalid');
      } else if (x.j && x.j.code === 'RATE_LIMITED') {
        showErr('err.rate_limited');
      } else {
        showErr('contact.fail');
      }
    }).catch(function () {
      showErr('contact.fail');
    }).then(function () {
      setBusy(false);
    });
  });

  document.addEventListener('langchange', function () {
    label.textContent = t(busy ? 'contact.sending' : 'contact.send');
    if (errKey) errText.textContent = t(errKey);
  });
})();
