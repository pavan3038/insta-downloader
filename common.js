/* Shared: translations (Hindi / English), theme + language toggles, toasts. */
(function () {
  'use strict';

  var D = {
    hi: {
      'a11y.skip': 'मुख्य सामग्री पर जाएँ', 'a11y.lang': 'भाषा बदलें', 'a11y.theme': 'थीम बदलें',
      'nav.home': 'होम', 'nav.how': 'कैसे डाउनलोड करें', 'nav.history': 'हिस्ट्री', 'nav.faq': 'सवाल-जवाब', 'nav.contact': 'संपर्क',
      'foot.privacy': 'प्राइवेसी पॉलिसी', 'foot.terms': 'नियम और शर्तें',
      'foot.disclaimer': 'यह वेबसाइट Instagram या Meta से संबद्ध, स्वीकृत या प्रायोजित नहीं है। Instagram उसके मालिक का ट्रेडमार्क है। सिर्फ़ वही कंटेंट डाउनलोड करें जो आपका हो या जिसकी आपको अनुमति हो।',
      'meta.home': 'Insta Downloader – Instagram रील और वीडियो डाउनलोडर (MP4)',
      'meta.contact': 'संपर्क करें – Insta Downloader', 'meta.privacy': 'प्राइवेसी पॉलिसी – Insta Downloader', 'meta.terms': 'नियम और शर्तें – Insta Downloader',
      'hero.badge': 'तेज़ · आसान · MP4', 'hero.t1': 'Instagram रील', 'hero.t2': 'डाउनलोडर',
      'hero.sub': 'रील का लिंक पेस्ट करें, प्रीव्यू देखें और MP4 वीडियो ओरिजिनल क्वालिटी में सेव करें — उन वीडियो के लिए जो आपके हैं या जिन्हें डाउनलोड करने की आपको अनुमति है।',
      'form.placeholder': 'Instagram Reel का लिंक यहाँ पेस्ट करें…', 'form.label': 'Instagram लिंक', 'form.paste': 'पेस्ट', 'form.clear': 'हटाएँ',
      'form.submit': 'डाउनलोड', 'form.checking': 'जाँच हो रही है…',
      'form.note': 'सिर्फ़ वही कंटेंट डाउनलोड करें जो आपका हो या जिसकी आपको अनुमति हो।',
      'chip.1': 'MP4 वीडियो', 'chip.2': 'ओरिजिनल क्वालिटी', 'chip.3': 'लॉगिन की ज़रूरत नहीं', 'chip.4': 'Android · iPhone · PC',
      'status.title': 'API कॉन्फ़िगर नहीं है. ',
      'status.body': 'साइट एडमिन ने अभी अधिकृत API (Token/Key) सेट नहीं किया है, इसलिए डाउनलोड अभी उपलब्ध नहीं है।',
      'err.empty': 'कृपया Instagram Reel का लिंक डालें।',
      'err.invalid': 'यह मान्य Instagram लिंक नहीं लगता। लिंक ऐसा होना चाहिए: instagram.com/reel/…',
      'err.title': 'डाउनलोड नहीं हो सका',
      'err.INVALID_URL': 'यह मान्य Instagram Reel/वीडियो लिंक नहीं है।',
      'err.NO_PROVIDER': 'अधिकृत API अभी कॉन्फ़िगर नहीं है। साइट एडमिन को .env में API Key/Token जोड़ना होगा।',
      'err.NOT_OWNED': 'यह वीडियो कनेक्टेड Instagram अकाउंट का नहीं है। आधिकारिक API सिर्फ़ आपके अपने अकाउंट के वीडियो देती है।',
      'err.NOT_FOUND': 'इस लिंक का वीडियो उपलब्ध नहीं मिला। वह Private हो सकता है, हट चुका हो सकता है, या डाउनलोड के लिए अधिकृत नहीं है।',
      'err.NOT_AUTHORIZED': 'इस वीडियो को डाउनलोड करने की अनुमति नहीं है।',
      'err.TOKEN_INVALID': 'API Token अमान्य या एक्सपायर हो चुका है। एडमिन को नया Token डालना होगा।',
      'err.CONFIG': 'सर्वर की API सेटिंग में गड़बड़ी है। कृपया एडमिन से संपर्क करें।',
      'err.UPSTREAM': 'API सेवा से जवाब नहीं मिला। कृपया थोड़ी देर बाद फिर कोशिश करें।',
      'err.RATE_LIMIT': 'बहुत ज़्यादा अनुरोध। कृपया एक मिनट बाद फिर कोशिश करें।',
      'err.EXPIRED': 'डाउनलोड लिंक की समय-सीमा खत्म हो गई। कृपया फिर से लिंक डालें।',
      'err.network': 'सर्वर तक नहीं पहुँच सके। इंटरनेट जाँचें और फिर कोशिश करें।',
      'err.generic': 'कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।',
      'err.cancelled': 'डाउनलोड रद्द किया गया।',
      'result.quality': 'ओरिजिनल क्वालिटी', 'type.reel': 'Reel', 'type.post': 'पोस्ट वीडियो', 'type.igtv': 'IGTV', 'result.untitled': 'Instagram वीडियो',
      'btn.download': 'MP4 डाउनलोड करें', 'btn.cancel': 'रद्द करें', 'btn.save': 'Photos में सेव करें', 'btn.copy': 'लिंक कॉपी करें', 'btn.new': 'नया वीडियो',
      'progress.downloading': 'डाउनलोड हो रहा है…', 'progress.aria': 'डाउनलोड प्रगति', 'progress.saving': 'फ़ाइल सेव हो रही है…',
      'success.title': 'डाउनलोड पूरा हुआ! ✅',
      'success.pc': ' वीडियो आपके ब्राउज़र के डाउनलोड फ़ोल्डर में सेव हो गया है।',
      'success.android': ' वीडियो आपके फ़ोन के Downloads फ़ोल्डर में सेव हो गया है।',
      'success.ios': ' वीडियो Files → Downloads में सेव हुआ। गैलरी में रखने के लिए "Photos में सेव करें" दबाएँ और Share शीट में "Save Video" चुनें।',
      'toast.copied': 'लिंक कॉपी हो गया', 'toast.copyFail': 'कॉपी नहीं हो सका', 'toast.pasteFail': 'क्लिपबोर्ड से पेस्ट नहीं हो सका — कृपया खुद पेस्ट करें',
      'toast.cleared': 'हिस्ट्री साफ़ हो गई', 'toast.removed': 'हटा दिया गया', 'toast.done': 'वीडियो डाउनलोड हो गया!',
      'feat.h': 'Insta Downloader क्यों?', 'feat.p': 'साफ़-सुथरा, तेज़ और अधिकृत स्रोतों पर आधारित।',
      'feat.1h': 'तेज़', 'feat.1p': 'हल्के पेज और सीधी स्ट्रीमिंग — कोई भारी स्क्रिप्ट नहीं।',
      'feat.2h': 'पहले प्रीव्यू', 'feat.2p': 'सेव करने से पहले वीडियो देख लें।',
      'feat.3h': 'अधिकृत और सुरक्षित', 'feat.3p': 'आधिकारिक API सपोर्ट। API Keys सर्वर पर रहती हैं, ब्राउज़र में कभी नहीं।',
      'feat.4h': 'हर डिवाइस पर', 'feat.4p': 'Android, iPhone और कंप्यूटर — Light या Dark मोड में।',
      'how.h': 'कैसे डाउनलोड करें', 'how.p': 'सिर्फ़ तीन आसान स्टेप।',
      'how.1h': 'लिंक कॉपी करें', 'how.1p': 'Instagram में रील खोलें, Share → Copy link दबाएँ।',
      'how.2h': 'पेस्ट करें और जाँचें', 'how.2p': 'ऊपर बॉक्स में पेस्ट करें और डाउनलोड दबाएँ। लिंक की जाँच होगी और प्रीव्यू दिखेगा।',
      'how.3h': 'MP4 सेव करें', 'how.3p': '"MP4 डाउनलोड करें" दबाएँ। Android: Downloads फ़ोल्डर। iPhone: Files, या "Photos में सेव करें"।',
      'sup.h': 'कौन-सा कंटेंट सपोर्टेड है', 'sup.okh': '✅ सपोर्टेड', 'sup.noh': '⛔ सपोर्टेड नहीं',
      'sup.ok1': 'Public Reels, जहाँ अधिकृत स्रोत से उपलब्ध हों', 'sup.ok2': 'आपके अपने (कनेक्टेड) अकाउंट के वीडियो', 'sup.ok3': 'ऐसे वीडियो जिन्हें डाउनलोड करने की आपको अनुमति है',
      'sup.no1': 'Private अकाउंट या Private कंटेंट', 'sup.no2': 'ऐसा कंटेंट जिसे कॉपी/री-पोस्ट करने का आपके पास अधिकार नहीं', 'sup.no3': 'जिसके लिए आपका Instagram पासवर्ड चाहिए',
      'hist.h': 'डाउनलोड हिस्ट्री', 'hist.clear': 'हिस्ट्री साफ़ करें', 'hist.empty': 'अभी कोई डाउनलोड नहीं। हिस्ट्री सिर्फ़ इसी ब्राउज़र में सेव होती है।',
      'hist.again': 'फिर से', 'hist.copy': 'कॉपी', 'hist.remove': 'हटाएँ', 'hist.confirm': 'क्या पूरी डाउनलोड हिस्ट्री हटानी है?',
      'faq.h': 'अक्सर पूछे जाने वाले सवाल',
      'contact.h': 'संपर्क करें', 'contact.p': 'सवाल, सुझाव, बग या कंटेंट हटाने का अनुरोध? हमें संदेश भेजें।',
      'contact.name': 'नाम', 'contact.email': 'ईमेल', 'contact.msg': 'संदेश', 'contact.send': 'संदेश भेजें', 'contact.sending': 'भेज रहे हैं…',
      'contact.ok': 'धन्यवाद! आपका संदेश मिल गया है।', 'contact.invalid': 'कृपया नाम, सही ईमेल और संदेश भरें।',
      'nf.p': 'यह पेज नहीं मिला।'
    },
    en: {
      'a11y.skip': 'Skip to content', 'a11y.lang': 'Change language', 'a11y.theme': 'Toggle theme',
      'nav.home': 'Home', 'nav.how': 'How to', 'nav.history': 'History', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'foot.privacy': 'Privacy Policy', 'foot.terms': 'Terms & Conditions',
      'foot.disclaimer': 'Not affiliated with, endorsed by or sponsored by Instagram or Meta. Instagram is a trademark of its owner. Download only content you own or have permission to save.',
      'meta.home': 'Insta Downloader – Instagram Reel & Video Downloader (MP4)',
      'meta.contact': 'Contact Us – Insta Downloader', 'meta.privacy': 'Privacy Policy – Insta Downloader', 'meta.terms': 'Terms & Conditions – Insta Downloader',
      'hero.badge': 'Fast · Simple · MP4', 'hero.t1': 'Instagram Reel', 'hero.t2': 'Downloader',
      'hero.sub': 'Paste the Reel link, preview it and save the MP4 in original quality — for videos you own or are allowed to download.',
      'form.placeholder': 'Paste the Instagram Reel link here…', 'form.label': 'Instagram link', 'form.paste': 'Paste', 'form.clear': 'Clear',
      'form.submit': 'Download', 'form.checking': 'Checking…',
      'form.note': 'Only download content you own or have permission to save.',
      'chip.1': 'MP4 video', 'chip.2': 'Original quality', 'chip.3': 'No login needed', 'chip.4': 'Android · iPhone · PC',
      'status.title': 'API not configured. ',
      'status.body': 'The site admin has not set an authorised API (token/key) yet, so downloads are unavailable right now.',
      'err.empty': 'Please enter an Instagram Reel link.',
      'err.invalid': "That doesn't look like a valid Instagram link. It should look like: instagram.com/reel/…",
      'err.title': 'Could not download',
      'err.INVALID_URL': 'This is not a valid Instagram Reel/video link.',
      'err.NO_PROVIDER': 'No authorised API is configured yet. The site admin must add an API key/token in .env.',
      'err.NOT_OWNED': "This video does not belong to the connected Instagram account. The official API only returns your own account's videos.",
      'err.NOT_FOUND': 'No downloadable video was found for this link. It may be private, removed, or not authorised for download.',
      'err.NOT_AUTHORIZED': 'You are not authorised to download this video.',
      'err.TOKEN_INVALID': 'The API token is invalid or has expired. The admin must provide a new token.',
      'err.CONFIG': 'The server API settings are incorrect. Please contact the admin.',
      'err.UPSTREAM': 'The API service did not respond. Please try again shortly.',
      'err.RATE_LIMIT': 'Too many requests. Please try again in a minute.',
      'err.EXPIRED': 'The download link has expired. Please paste the link again.',
      'err.network': 'Could not reach the server. Check your internet connection and try again.',
      'err.generic': 'Something went wrong. Please try again.',
      'err.cancelled': 'Download cancelled.',
      'result.quality': 'Original quality', 'type.reel': 'Reel', 'type.post': 'Post video', 'type.igtv': 'IGTV', 'result.untitled': 'Instagram video',
      'btn.download': 'Download MP4', 'btn.cancel': 'Cancel', 'btn.save': 'Save to Photos', 'btn.copy': 'Copy link', 'btn.new': 'New video',
      'progress.downloading': 'Downloading…', 'progress.aria': 'Download progress', 'progress.saving': 'Saving file…',
      'success.title': 'Download complete! ✅',
      'success.pc': ' The video was saved to your browser’s download folder.',
      'success.android': ' The video was saved to your phone’s Downloads folder.',
      'success.ios': ' The video was saved to Files → Downloads. To put it in your gallery tap “Save to Photos” and choose “Save Video” in the share sheet.',
      'toast.copied': 'Link copied', 'toast.copyFail': 'Could not copy', 'toast.pasteFail': 'Could not read the clipboard — please paste manually',
      'toast.cleared': 'History cleared', 'toast.removed': 'Removed', 'toast.done': 'Video downloaded!',
      'feat.h': 'Why Insta Downloader?', 'feat.p': 'Clean, fast and built around authorised sources.',
      'feat.1h': 'Fast', 'feat.1p': 'Lightweight pages and direct streaming — no heavy scripts.',
      'feat.2h': 'Preview first', 'feat.2p': 'Watch the video before you save it.',
      'feat.3h': 'Authorised & safe', 'feat.3p': 'Official API support. Keys stay on the server, never in your browser.',
      'feat.4h': 'Every device', 'feat.4p': 'Android, iPhone and desktop, in light or dark mode.',
      'how.h': 'How to download', 'how.p': 'Three simple steps.',
      'how.1h': 'Copy the link', 'how.1p': 'In Instagram open the Reel, tap Share → Copy link.',
      'how.2h': 'Paste & check', 'how.2p': 'Paste it above and press Download. The link is verified and a preview appears.',
      'how.3h': 'Save the MP4', 'how.3p': 'Press Download MP4. Android: Downloads folder. iPhone: Files, or Save to Photos.',
      'sup.h': 'Supported content', 'sup.okh': '✅ Supported', 'sup.noh': '⛔ Not supported',
      'sup.ok1': 'Public Reels, where an authorised source makes them available', 'sup.ok2': 'Videos from your own (connected) account', 'sup.ok3': 'Videos you have permission to download',
      'sup.no1': 'Private accounts or private content', 'sup.no2': 'Content you have no right to copy or re-post', 'sup.no3': 'Anything that needs your Instagram password',
      'hist.h': 'Download history', 'hist.clear': 'Clear history', 'hist.empty': 'No downloads yet. History is saved only in this browser.',
      'hist.again': 'Again', 'hist.copy': 'Copy', 'hist.remove': 'Remove', 'hist.confirm': 'Delete the whole download history?',
      'faq.h': 'Frequently asked questions',
      'contact.h': 'Contact Us', 'contact.p': 'Questions, feedback, bug reports or a content-removal request? Send us a message.',
      'contact.name': 'Name', 'contact.email': 'Email', 'contact.msg': 'Message', 'contact.send': 'Send message', 'contact.sending': 'Sending…',
      'contact.ok': 'Thank you! Your message has been received.', 'contact.invalid': 'Please fill in your name, a valid email and a message.',
      'nf.p': 'This page was not found.'
    }
  };

  var root = document.documentElement;
  var listeners = [];
  function lang() { return root.getAttribute('lang') === 'en' ? 'en' : 'hi'; }
  function t(key, vars) {
    var s = (D[lang()] && D[lang()][key]) || D.en[key] || key;
    if (vars) for (var k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function apply() {
    var n, i;
    n = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < n.length; i++) n[i].textContent = t(n[i].getAttribute('data-i18n'));
    n = document.querySelectorAll('[data-i18n-placeholder]');
    for (i = 0; i < n.length; i++) n[i].setAttribute('placeholder', t(n[i].getAttribute('data-i18n-placeholder')));
    n = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < n.length; i++) n[i].setAttribute('aria-label', t(n[i].getAttribute('data-i18n-aria')));
    var page = document.body.getAttribute('data-page');
    if (page) document.title = t('meta.' + page);
    var lt = document.getElementById('lang-toggle');
    if (lt) lt.textContent = lang() === 'hi' ? 'EN' : 'हिंदी';
    for (i = 0; i < listeners.length; i++) listeners[i](lang());
  }
  function setLang(l) { root.setAttribute('lang', l); store('insta_lang', l); apply(); }
  function setTheme(th) { root.setAttribute('data-theme', th); store('insta_theme', th); }

  function toast(msg, type) {
    var box = document.getElementById('toasts'); if (!box) return;
    var el = document.createElement('div'); el.className = 'toast ' + (type || ''); el.textContent = msg;
    box.appendChild(el); setTimeout(function () { el.remove(); }, 3200);
  }

  window.IG = { t: t, lang: lang, toast: toast, onLang: function (cb) { listeners.push(cb); } };

  document.addEventListener('DOMContentLoaded', function () {
    var lt = document.getElementById('lang-toggle'), tt = document.getElementById('theme-toggle');
    if (lt) lt.addEventListener('click', function () { setLang(lang() === 'hi' ? 'en' : 'hi'); });
    if (tt) tt.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
    apply();
  });
})();
