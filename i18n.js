(function () {
  'use strict';

  var D = {
    en: {
      'meta.home.title': 'Insta Downloader – Free Instagram Video Downloader (MP4)',
      'meta.home.desc': 'Download Instagram Reels and videos you own or have permission to save, as MP4. Fast, free and mobile-friendly, with preview, live progress and history.',
      'meta.contact.title': 'Contact Us – Insta Downloader',
      'meta.contact.desc': 'Questions, feedback or content removal requests? Send us a message.',
      'meta.privacy.title': 'Privacy Policy – Insta Downloader',
      'meta.privacy.desc': 'How Insta Downloader handles your information, history and preferences.',
      'meta.terms.title': 'Terms and Conditions – Insta Downloader',
      'meta.terms.desc': 'The rules for using Insta Downloader responsibly.',

      'a11y.skip': 'Skip to content',
      'nav.download': 'Download',
      'nav.how': 'How it works',
      'nav.features': 'Features',
      'nav.history': 'History',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      'lang.toggle': 'Change language',
      'theme.toggle': 'Switch light / dark mode',
      'menu.toggle': 'Open menu',

      'hero.badge': 'Free · No sign-up · Fast',
      'hero.title': 'Download Instagram Videos in <span class="grad">MP4</span>',
      'hero.sub': 'Paste the link of a public Reel or your own video, preview it, and save it in its original quality, wherever downloading is permitted.',
      'input.label': 'Instagram video link',
      'input.placeholder': 'https://www.instagram.com/reel/...',
      'btn.paste': 'Paste',
      'btn.clear': 'Clear',
      'btn.download': 'Download',
      'btn.checking': 'Checking…',
      'hint.note': 'Only download videos you own or have permission to save. Please respect creators’ rights.',

      'result.preview': 'Preview',
      'result.untitled': 'Instagram video',
      'result.noreencode': 'No re-encoding',
      'result.source.instagram_graph': 'Official Instagram API',
      'result.source.custom': 'Authorized API',
      'btn.mp4': 'Download MP4',
      'btn.save_video': 'Save Video',
      'btn.copy': 'Copy Link',
      'btn.cancel': 'Cancel',
      'progress.preparing': 'Preparing download…',
      'progress.downloading': 'Downloading…',
      'progress.done': 'Download complete',
      'success.desktop': 'Video downloaded successfully! It was saved to your browser’s Downloads folder.',
      'success.android': 'Video downloaded successfully! You can find it in your Downloads folder.',
      'success.ios': 'Video is ready! Tap “Save Video”, then choose “Save Video” in the share sheet to add it to Photos.',
      'success.ios_saved': 'Done! If you chose “Save Video”, it is now in your Photos app.',
      'success.ios_fallback': 'The video opened in a new tab. Use the share button there and choose “Save Video”.',

      'err.empty': 'Please paste an Instagram video link first.',
      'err.invalid': 'This doesn’t look like a valid Instagram Reel/video link. Example: https://www.instagram.com/reel/XXXXXXXX/',
      'err.invalid_url': 'This doesn’t look like a valid Instagram Reel/video link. Example: https://www.instagram.com/reel/XXXXXXXX/',
      'err.no_provider': 'The download service is not available right now: the site owner has not connected an authorized Instagram API yet.',
      'err.not_found': 'This video could not be found, or it is not available for download through the authorized API. Only your own videos and videos you have permission to download are supported.',
      'err.not_video': 'This link does not point to a video.',
      'err.not_downloadable': 'The source did not provide a downloadable file for this video.',
      'err.provider_auth': 'The API access token is invalid or has expired. The site owner needs to renew it.',
      'err.provider_error': 'The API returned an error. Please try again in a moment.',
      'err.provider_rate_limit': 'The API is receiving too many requests. Please try again later.',
      'err.rate_limited': 'Too many requests. Please wait a minute and try again.',
      'err.network': 'Network error. Please check your internet connection and try again.',
      'err.too_large': 'This video is larger than the allowed size limit.',
      'err.expired': 'This download link has expired. Please press Download at the top again.',
      'err.not_found_link': 'This download link has expired. Please press Download at the top again.',
      'err.upstream': 'Could not fetch the video file from the source. Please try again.',
      'err.media_host_blocked': 'The video file location is blocked by the server’s security rules.',
      'err.bad_request': 'Invalid request. Please reload the page and try again.',
      'err.internal': 'Something went wrong. Please try again.',

      'toast.copied': 'Link copied!',
      'toast.copy_failed': 'Could not copy the link.',
      'toast.pasted': 'Link pasted',
      'toast.paste_failed': 'Could not read the clipboard. Long-press the box and choose Paste.',
      'toast.cleared': 'History cleared',
      'toast.removed': 'Removed from history',
      'toast.cancelled': 'Download cancelled',

      'how.title': 'How to download',
      'how.sub': 'Four quick steps, on any phone or computer.',
      'how.1.t': 'Copy the link',
      'how.1.d': 'Open the Reel in Instagram, tap Share, then choose Copy link.',
      'how.2.t': 'Paste it here',
      'how.2.d': 'Paste the link into the box above and press Download.',
      'how.3.t': 'Check the preview',
      'how.3.d': 'We verify the link and show you a preview of the video.',
      'how.4.t': 'Save the MP4',
      'how.4.d': 'Tap Download MP4. On iPhone, tap Save Video and choose Save Video in the share sheet.',

      'feat.title': 'Why Insta Downloader?',
      'feat.sub': 'Simple, quick and respectful of creators.',
      'feat.1.t': 'Fast and lightweight',
      'feat.1.d': 'No heavy scripts or ads. Pages load quickly, even on slow networks.',
      'feat.2.t': 'Original quality',
      'feat.2.d': 'We pass through the file your source provides, with no re-encoding.',
      'feat.3.t': 'Works on every device',
      'feat.3.d': 'Responsive design for Android, iPhone and desktop browsers.',
      'feat.4.t': 'Private by design',
      'feat.4.d': 'No sign-up. Your download history stays in your own browser.',
      'feat.5.t': 'Live progress',
      'feat.5.d': 'Watch the download progress and get a clear success message.',
      'feat.6.t': 'Light, dark, हिंदी, English',
      'feat.6.d': 'Pick the theme and language that suit you. We remember your choice.',

      'sup.title': 'What you can download',
      'sup.sub': 'We only work with content you are allowed to save.',
      'sup.1': 'Public Reels, where authorized access is available',
      'sup.2': 'Videos from your own Instagram account',
      'sup.3': 'Videos you have permission to download',
      'sup.note': 'Private accounts and content you have no rights to are not supported.',

      'hist.title': 'Download history',
      'hist.sub': 'Saved only in this browser, never on our server.',
      'hist.empty': 'No downloads yet. Your completed downloads will appear here.',
      'hist.clear': 'Clear History',
      'hist.confirm': 'Clear all download history?',
      'hist.count': '{n} item(s)',
      'hist.copy': 'Copy link',
      'hist.redo': 'Open again',
      'hist.remove': 'Remove',

      'faq.title': 'Frequently asked questions',
      'faq.1.q': 'Is Insta Downloader free?',
      'faq.1.a': 'Yes. There is no sign-up and no fee for using the website.',
      'faq.2.q': 'Which videos can I download?',
      'faq.2.a': 'Public Reels where authorized access is available, videos from your own account, and videos you have permission to download.',
      'faq.3.q': 'Can I download videos from private accounts?',
      'faq.3.a': 'No. Private content is never accessed. Please respect the privacy and rights of creators.',
      'faq.4.q': 'Where is the video saved?',
      'faq.4.a': 'On Android and desktop, the video goes to your browser’s Downloads folder. On iPhone, tap Save Video and choose Save Video in the share sheet to add it to Photos.',
      'faq.5.q': 'Is the original quality kept?',
      'faq.5.a': 'Yes. We pass through the exact file provided by the source and never re-encode it. If the source only offers a lower quality, that is what you will get.',
      'faq.6.q': 'Do you store my videos or links?',
      'faq.6.a': 'No video files are stored on our server. Your download history lives only in your browser, and you can clear it any time.',
      'faq.7.q': 'Why do I see “download service is not available”?',
      'faq.7.a': 'The site owner has not connected an authorized Instagram API yet, or the API access has expired. Please try again later.',
      'faq.8.q': 'Is this affiliated with Instagram?',
      'faq.8.a': 'No. Insta Downloader is an independent tool and is not affiliated with, endorsed by or sponsored by Instagram or Meta.',

      'footer.tag': 'A free Instagram video downloader for content you are allowed to save.',
      'footer.pages': 'Pages',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms and Conditions',
      'footer.contact': 'Contact Us',
      'footer.disc': 'Insta Downloader is not affiliated with, endorsed by or sponsored by Instagram or Meta. Instagram is a trademark of Meta Platforms, Inc.',
      'footer.rights': 'All rights reserved.',

      'contact.title': 'Contact us',
      'contact.sub': 'Questions, feedback or content removal requests? We read every message.',
      'contact.name': 'Your name',
      'contact.email': 'Email address',
      'contact.message': 'Message',
      'contact.send': 'Send message',
      'contact.sending': 'Sending…',
      'contact.ok': 'Thank you! Your message has been sent.',
      'contact.fail': 'Could not send your message. Please try again.',
      'contact.invalid': 'Please fill in all fields correctly (the message needs at least 10 characters).',
      'contact.note': 'We only use your details to reply to you.',
      'err.invalid_input': 'Please fill in all fields correctly (the message needs at least 10 characters).'
    },

    hi: {
      'meta.home.title': 'Insta Downloader – मुफ़्त Instagram वीडियो डाउनलोडर (MP4)',
      'meta.home.desc': 'जिन Instagram Reels और वीडियो के आप मालिक हैं या जिन्हें सेव करने की अनुमति है, उन्हें MP4 में डाउनलोड करें। तेज़, मुफ़्त और मोबाइल-फ्रेंडली, प्रिव्यू, लाइव प्रोग्रेस और हिस्ट्री के साथ।',
      'meta.contact.title': 'संपर्क करें – Insta Downloader',
      'meta.contact.desc': 'सवाल, सुझाव या कंटेंट हटाने का अनुरोध? हमें संदेश भेजें।',
      'meta.privacy.title': 'प्राइवेसी पॉलिसी – Insta Downloader',
      'meta.privacy.desc': 'Insta Downloader आपकी जानकारी, हिस्ट्री और पसंद को कैसे संभालता है।',
      'meta.terms.title': 'नियम और शर्तें – Insta Downloader',
      'meta.terms.desc': 'Insta Downloader को ज़िम्मेदारी से इस्तेमाल करने के नियम।',

      'a11y.skip': 'सीधे कंटेंट पर जाएँ',
      'nav.download': 'डाउनलोड',
      'nav.how': 'कैसे काम करता है',
      'nav.features': 'ख़ासियतें',
      'nav.history': 'हिस्ट्री',
      'nav.faq': 'FAQ',
      'nav.contact': 'संपर्क',
      'lang.toggle': 'भाषा बदलें',
      'theme.toggle': 'लाइट / डार्क मोड बदलें',
      'menu.toggle': 'मेन्यू खोलें',

      'hero.badge': 'मुफ़्त · बिना साइन-अप · तेज़',
      'hero.title': 'Instagram वीडियो <span class="grad">MP4</span> में डाउनलोड करें',
      'hero.sub': 'किसी पब्लिक Reel या अपने वीडियो का लिंक पेस्ट करें, प्रिव्यू देखें और जहाँ डाउनलोड की अनुमति हो वहाँ ओरिजिनल क्वालिटी में सेव करें।',
      'input.label': 'Instagram वीडियो का लिंक',
      'input.placeholder': 'https://www.instagram.com/reel/...',
      'btn.paste': 'पेस्ट',
      'btn.clear': 'साफ़ करें',
      'btn.download': 'डाउनलोड',
      'btn.checking': 'जाँच रहा है…',
      'hint.note': 'सिर्फ़ वही वीडियो डाउनलोड करें जिनके आप मालिक हैं या जिन्हें सेव करने की अनुमति है। क्रिएटर्स के अधिकारों का सम्मान करें।',

      'result.preview': 'प्रिव्यू',
      'result.untitled': 'Instagram वीडियो',
      'result.noreencode': 'बिना री-एन्कोडिंग',
      'result.source.instagram_graph': 'आधिकारिक Instagram API',
      'result.source.custom': 'अधिकृत API',
      'btn.mp4': 'MP4 डाउनलोड करें',
      'btn.save_video': 'Save Video',
      'btn.copy': 'लिंक कॉपी करें',
      'btn.cancel': 'रद्द करें',
      'progress.preparing': 'डाउनलोड तैयार हो रहा है…',
      'progress.downloading': 'डाउनलोड हो रहा है…',
      'progress.done': 'डाउनलोड पूरा हुआ',
      'success.desktop': 'वीडियो सफलतापूर्वक डाउनलोड हो गया! यह आपके ब्राउज़र के Downloads फ़ोल्डर में सेव हुआ है।',
      'success.android': 'वीडियो सफलतापूर्वक डाउनलोड हो गया! इसे अपने Downloads फ़ोल्डर में देखें।',
      'success.ios': 'वीडियो तैयार है! “Save Video” बटन दबाएँ, फिर शेयर शीट में “Save Video” चुनें। वीडियो Photos में सेव हो जाएगा।',
      'success.ios_saved': 'हो गया! अगर आपने “Save Video” चुना था, तो वीडियो अब आपके Photos ऐप में है।',
      'success.ios_fallback': 'वीडियो नए टैब में खुल गया है। वहाँ शेयर बटन दबाकर “Save Video” चुनें।',

      'err.empty': 'कृपया पहले Instagram वीडियो का लिंक पेस्ट करें।',
      'err.invalid': 'यह वैध Instagram Reel/वीडियो लिंक नहीं लगता। उदाहरण: https://www.instagram.com/reel/XXXXXXXX/',
      'err.invalid_url': 'यह वैध Instagram Reel/वीडियो लिंक नहीं लगता। उदाहरण: https://www.instagram.com/reel/XXXXXXXX/',
      'err.no_provider': 'डाउनलोड सेवा अभी उपलब्ध नहीं है: वेबसाइट के मालिक ने अभी तक कोई अधिकृत Instagram API कनेक्ट नहीं किया है।',
      'err.not_found': 'यह वीडियो नहीं मिला, या अधिकृत API से डाउनलोड के लिए उपलब्ध नहीं है। सिर्फ़ आपके अपने वीडियो और वे वीडियो सपोर्टेड हैं जिन्हें डाउनलोड करने की अनुमति है।',
      'err.not_video': 'यह लिंक किसी वीडियो का नहीं है।',
      'err.not_downloadable': 'स्रोत ने इस वीडियो के लिए डाउनलोड करने योग्य फ़ाइल उपलब्ध नहीं कराई।',
      'err.provider_auth': 'API एक्सेस टोकन अमान्य है या एक्सपायर हो गया है। वेबसाइट के मालिक को इसे रिन्यू करना होगा।',
      'err.provider_error': 'API से त्रुटि मिली। कृपया थोड़ी देर बाद फिर कोशिश करें।',
      'err.provider_rate_limit': 'API पर बहुत ज़्यादा अनुरोध आ रहे हैं। कृपया बाद में कोशिश करें।',
      'err.rate_limited': 'बहुत ज़्यादा अनुरोध। कृपया एक मिनट रुककर फिर कोशिश करें।',
      'err.network': 'नेटवर्क त्रुटि। कृपया इंटरनेट कनेक्शन जाँचकर फिर कोशिश करें।',
      'err.too_large': 'यह वीडियो अनुमत साइज़ सीमा से बड़ा है।',
      'err.expired': 'यह डाउनलोड लिंक एक्सपायर हो गया है। कृपया ऊपर फिर से Download दबाएँ।',
      'err.not_found_link': 'यह डाउनलोड लिंक एक्सपायर हो गया है। कृपया ऊपर फिर से Download दबाएँ।',
      'err.upstream': 'स्रोत से वीडियो फ़ाइल नहीं मिल सकी। कृपया फिर कोशिश करें।',
      'err.media_host_blocked': 'वीडियो फ़ाइल का पता सर्वर के सुरक्षा नियमों द्वारा रोका गया है।',
      'err.bad_request': 'अमान्य अनुरोध। कृपया पेज रीलोड करके फिर कोशिश करें।',
      'err.internal': 'कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।',

      'toast.copied': 'लिंक कॉपी हो गया!',
      'toast.copy_failed': 'लिंक कॉपी नहीं हो सका।',
      'toast.pasted': 'लिंक पेस्ट हो गया',
      'toast.paste_failed': 'क्लिपबोर्ड नहीं पढ़ सके। बॉक्स को देर तक दबाकर Paste चुनें।',
      'toast.cleared': 'हिस्ट्री साफ़ हो गई',
      'toast.removed': 'हिस्ट्री से हटाया गया',
      'toast.cancelled': 'डाउनलोड रद्द किया गया',

      'how.title': 'डाउनलोड कैसे करें',
      'how.sub': 'किसी भी फ़ोन या कंप्यूटर पर सिर्फ़ चार आसान स्टेप।',
      'how.1.t': 'लिंक कॉपी करें',
      'how.1.d': 'Instagram में Reel खोलें, Share दबाएँ और Copy link चुनें।',
      'how.2.t': 'यहाँ पेस्ट करें',
      'how.2.d': 'ऊपर के बॉक्स में लिंक पेस्ट करें और Download दबाएँ।',
      'how.3.t': 'प्रिव्यू देखें',
      'how.3.d': 'हम लिंक की जाँच करके वीडियो का प्रिव्यू दिखाते हैं।',
      'how.4.t': 'MP4 सेव करें',
      'how.4.d': 'MP4 डाउनलोड करें दबाएँ। iPhone में Save Video दबाकर शेयर शीट में Save Video चुनें।',

      'feat.title': 'Insta Downloader क्यों?',
      'feat.sub': 'आसान, तेज़ और क्रिएटर्स का सम्मान करने वाला।',
      'feat.1.t': 'तेज़ और हल्का',
      'feat.1.d': 'भारी स्क्रिप्ट या विज्ञापन नहीं। धीमे नेटवर्क पर भी पेज जल्दी खुलते हैं।',
      'feat.2.t': 'ओरिजिनल क्वालिटी',
      'feat.2.d': 'स्रोत जो फ़ाइल देता है, हम वही बिना री-एन्कोडिंग के आप तक पहुँचाते हैं।',
      'feat.3.t': 'हर डिवाइस पर काम करता है',
      'feat.3.d': 'Android, iPhone और कंप्यूटर ब्राउज़र के लिए रेस्पॉन्सिव डिज़ाइन।',
      'feat.4.t': 'प्राइवेसी पहले',
      'feat.4.d': 'साइन-अप की ज़रूरत नहीं। आपकी हिस्ट्री सिर्फ़ आपके ब्राउज़र में रहती है।',
      'feat.5.t': 'लाइव प्रोग्रेस',
      'feat.5.d': 'डाउनलोड की प्रोग्रेस देखें और पूरा होने पर साफ़ सक्सेस मैसेज पाएँ।',
      'feat.6.t': 'Light, Dark, हिंदी, English',
      'feat.6.d': 'अपनी पसंद की थीम और भाषा चुनें। हम आपकी पसंद याद रखते हैं।',

      'sup.title': 'आप क्या डाउनलोड कर सकते हैं',
      'sup.sub': 'हम सिर्फ़ उसी कंटेंट के साथ काम करते हैं जिसे सेव करने की आपको अनुमति है।',
      'sup.1': 'पब्लिक Reels, जहाँ अधिकृत तरीके से उपलब्ध हों',
      'sup.2': 'आपके अपने Instagram अकाउंट के वीडियो',
      'sup.3': 'ऐसे वीडियो जिन्हें डाउनलोड करने की आपको अनुमति है',
      'sup.note': 'प्राइवेट अकाउंट और जिन कंटेंट पर आपका कोई अधिकार नहीं है, वे सपोर्टेड नहीं हैं।',

      'hist.title': 'डाउनलोड हिस्ट्री',
      'hist.sub': 'सिर्फ़ इसी ब्राउज़र में सेव, हमारे सर्वर पर कभी नहीं।',
      'hist.empty': 'अभी तक कोई डाउनलोड नहीं। पूरे हुए डाउनलोड यहाँ दिखेंगे।',
      'hist.clear': 'हिस्ट्री साफ़ करें',
      'hist.confirm': 'क्या पूरी डाउनलोड हिस्ट्री साफ़ करें?',
      'hist.count': '{n} आइटम',
      'hist.copy': 'लिंक कॉपी करें',
      'hist.redo': 'फिर से खोलें',
      'hist.remove': 'हटाएँ',

      'faq.title': 'अक्सर पूछे जाने वाले सवाल',
      'faq.1.q': 'क्या Insta Downloader मुफ़्त है?',
      'faq.1.a': 'हाँ। वेबसाइट इस्तेमाल करने के लिए न साइन-अप चाहिए और न कोई शुल्क लगता है।',
      'faq.2.q': 'कौन-से वीडियो डाउनलोड हो सकते हैं?',
      'faq.2.a': 'पब्लिक Reels (जहाँ अधिकृत तरीके से उपलब्ध हों), आपके अपने अकाउंट के वीडियो और वे वीडियो जिन्हें डाउनलोड करने की आपको अनुमति है।',
      'faq.3.q': 'क्या प्राइवेट अकाउंट के वीडियो डाउनलोड हो सकते हैं?',
      'faq.3.a': 'नहीं। प्राइवेट कंटेंट तक कभी पहुँच नहीं बनाई जाती। कृपया क्रिएटर्स की प्राइवेसी और अधिकारों का सम्मान करें।',
      'faq.4.q': 'वीडियो कहाँ सेव होता है?',
      'faq.4.a': 'Android और कंप्यूटर पर वीडियो आपके ब्राउज़र के Downloads फ़ोल्डर में जाता है। iPhone में Save Video दबाकर शेयर शीट में Save Video चुनें, वीडियो Photos में सेव हो जाएगा।',
      'faq.5.q': 'क्या ओरिजिनल क्वालिटी बनी रहती है?',
      'faq.5.a': 'हाँ। स्रोत जो फ़ाइल देता है, हम वही बिना री-एन्कोडिंग के आपको देते हैं। अगर स्रोत सिर्फ़ कम क्वालिटी देता है, तो वही मिलेगी।',
      'faq.6.q': 'क्या आप मेरे वीडियो या लिंक स्टोर करते हैं?',
      'faq.6.a': 'हमारे सर्वर पर कोई वीडियो फ़ाइल स्टोर नहीं होती। आपकी हिस्ट्री सिर्फ़ आपके ब्राउज़र में रहती है और आप उसे कभी भी साफ़ कर सकते हैं।',
      'faq.7.q': '“डाउनलोड सेवा उपलब्ध नहीं है” क्यों दिख रहा है?',
      'faq.7.a': 'वेबसाइट के मालिक ने अभी तक अधिकृत Instagram API कनेक्ट नहीं किया है, या API का एक्सेस एक्सपायर हो गया है। कृपया बाद में कोशिश करें।',
      'faq.8.q': 'क्या यह Instagram से जुड़ा हुआ है?',
      'faq.8.a': 'नहीं। Insta Downloader एक स्वतंत्र टूल है और Instagram या Meta से संबद्ध, समर्थित या प्रायोजित नहीं है।',

      'footer.tag': 'उस कंटेंट के लिए मुफ़्त Instagram वीडियो डाउनलोडर जिसे सेव करने की आपको अनुमति है।',
      'footer.pages': 'पेज',
      'footer.privacy': 'प्राइवेसी पॉलिसी',
      'footer.terms': 'नियम और शर्तें',
      'footer.contact': 'संपर्क करें',
      'footer.disc': 'Insta Downloader, Instagram या Meta से संबद्ध, समर्थित या प्रायोजित नहीं है। Instagram, Meta Platforms, Inc. का ट्रेडमार्क है।',
      'footer.rights': 'सर्वाधिकार सुरक्षित।',

      'contact.title': 'संपर्क करें',
      'contact.sub': 'सवाल, सुझाव या कंटेंट हटाने का अनुरोध? हम हर संदेश पढ़ते हैं।',
      'contact.name': 'आपका नाम',
      'contact.email': 'ईमेल पता',
      'contact.message': 'संदेश',
      'contact.send': 'संदेश भेजें',
      'contact.sending': 'भेज रहे हैं…',
      'contact.ok': 'धन्यवाद! आपका संदेश भेज दिया गया है।',
      'contact.fail': 'आपका संदेश नहीं भेजा जा सका। कृपया फिर कोशिश करें।',
      'contact.invalid': 'कृपया सभी फ़ील्ड सही भरें (संदेश कम से कम 10 अक्षर का हो)।',
      'contact.note': 'हम आपकी जानकारी सिर्फ़ आपको जवाब देने के लिए इस्तेमाल करते हैं।',
      'err.invalid_input': 'कृपया सभी फ़ील्ड सही भरें (संदेश कम से कम 10 अक्षर का हो)।'
    }
  };

  function getLang() {
    return document.documentElement.getAttribute('lang') === 'hi' ? 'hi' : 'en';
  }

  function has(key) {
    return Object.prototype.hasOwnProperty.call(D[getLang()], key) || Object.prototype.hasOwnProperty.call(D.en, key);
  }

  function t(key, params) {
    var s = D[getLang()][key];
    if (s === undefined) s = D.en[key];
    if (s === undefined) s = key;
    if (params) {
      Object.keys(params).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(params[k]));
      });
    }
    return s;
  }

  function apply(root) {
    root = root || document;
    var i, n, el, pairs, p, idx;

    n = root.querySelectorAll('[data-i18n]');
    for (i = 0; i < n.length; i++) {
      el = n[i];
      el.textContent = t(el.getAttribute('data-i18n'));
    }
    n = root.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < n.length; i++) {
      el = n[i];
      el.innerHTML = t(el.getAttribute('data-i18n-html')); // trusted, bundled strings only
    }
    n = root.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < n.length; i++) {
      el = n[i];
      pairs = el.getAttribute('data-i18n-attr').split(';');
      for (p = 0; p < pairs.length; p++) {
        idx = pairs[p].indexOf(':');
        if (idx > 0) {
          el.setAttribute(pairs[p].slice(0, idx).trim(), t(pairs[p].slice(idx + 1).trim()));
        }
      }
    }
  }

  function setLang(lang) {
    lang = lang === 'hi' ? 'hi' : 'en';
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    apply(document);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  window.I18N = { t: t, has: has, apply: apply, getLang: getLang, setLang: setLang };
  apply(document);
})();
