// Language Translate
let currentLang = 'bn';
const translations = {
  'bn': {
    'lang_label': 'ভাষা:',
    'association': 'বাংলাদেশ জুয়েলারি সমিতি',
    'last_up': 'সর্বশেষ আপডেট',
    'news_h1': 'সর্বশেষ সোনা ও রুপার মূল্য',
    'news_h2': 'হ্রাস/বৃদ্ধি',
    'today_gold': 'সোনার মূল্য',
    'today_silver': 'এবং, রূপার মূল্য',
    'status_dec': 'টাকা হ্রাস পেয়েছে',
    'status_inc': 'টাকা বৃদ্ধি পেয়েছে',
    'status_same': 'অপরিবর্তিতই আছে',
    'product': 'পণ্য',
    'desc': 'বিবরণ',
    'price_unit': 'মূল্য টাকা/গ্রাম',
    'cad': 'ক্যাডমিয়াম (হলমার্ককৃত)',
    'trad': 'সনাতন পদ্ধতির',
    'gold': 'স্বর্ণ',
    'silver': 'রূপা',
    'download': 'ডাউনলোড',
    'view': 'দেখুন',
    'copyright': '© কপিরাইট ২০২৬ বাংলাদেশ জুয়েলারি সমিতি (বাজুস)',
    'visitor': 'মোট ভিউয়ার্সঃ',
    'home': 'হোম',
    'latest': 'সর্বশেষ',
    'news': 'খবর',
    'international': 'আন্তর্জাতিক',
    'contact': 'যোগাযোগ'
  },
  'en': {
    'lang_label': 'Language:',
    'association': 'Bangladesh Jewellers Association',
    'last_up': 'Last Updated',
    'news_h1': 'Latest Gold & Silver Price',
    'news_h2': 'Increase/Decrease',
    // 2 change
    'today_gold': 'Gold Price',
    'today_silver': '& Silver Price',
    'status_dec': 'BDT Decreased',
    'status_inc': 'BDT Increased',
    'status_same': 'Remains Unchanged',
    'product': 'Product',
    'desc': 'Description',
    'price_unit': 'Price (BDT/Gram)',
    'cad': 'Cadmium (Hallmarked)',
    'trad': 'Traditional',
    'gold': 'Gold',
    'silver': 'Silver',
    'download': 'Download',
    'view': 'View',
    'copyright': '© Copyright 2026 Bangladesh Jewellers Association (BAJUS)',
    'visitor': 'Total Viewers:',
    'home': 'Home',
    'latest': 'Latest',
    'news': 'News',
    'international': 'International',
    'contact': 'Contact'
  }
};

function convertNum(str) {
  const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  const en = ['0','1','2','3','4','5','6','7','8','9'];
  for (let i = 0; i < 10; i++) {
    const regex = new RegExp(currentLang === 'en' ? bn[i] : en[i], 'g');
    str = str.toString().replace(regex, currentLang === 'en' ? en[i] : bn[i]);
  }
  return str;
}

function toggleLanguage() {
  currentLang = currentLang === 'bn' ? 'en' : 'bn';
  document.getElementById('lang-btn').innerText = currentLang === 'bn' ? 'EN' : 'BN';

  const label = document.querySelector('.lang-label');
  if (label) label.innerText = translations[currentLang]['lang_label'];

  document.querySelector('.top-logo-text').innerText = translations[currentLang]['association'];

  const newsH = document.querySelectorAll('.news-th');
  if (newsH[0]) newsH[0].innerText = translations[currentLang]['news_h1'];
  if (newsH[1]) newsH[1].innerText = translations[currentLang]['news_h2'];

  const newsD = document.querySelectorAll('.news-td');
  if (newsD[0]) newsD[0].innerText = translations[currentLang]['today_gold'];
  if (newsD[1]) newsD[1].innerText = translations[currentLang]['today_silver'];
  const statusCells = document.querySelectorAll('.news-td-c');
  statusCells.forEach(cell => {
    let text = cell.innerText;
    if (currentLang === 'en')
    // 2 Change
    {
      text = text.replace('অপরিবর্তিত আছে','Remains Unchanged').replace('অপরিবর্তিতই আছে', 'Remains Unchanged');
    } else {
      text = text.replace('BDT Decreased', 'টাকা হ্রাস পেয়েছে').replace('Remains Unchanged', 'অপরিবর্তিতই আছে');
    }
    cell.innerText = convertNum(text);
  });

  const headers = document.querySelectorAll('#main_text_gold_banner, #main_text_silver_banner');
  headers.forEach((h, i) => {
    if (i % 3 === 0) h.innerText = translations[currentLang]['product'];
    if (i % 3 === 1) h.innerText = translations[currentLang]['desc'];
    if (i % 3 === 2) h.innerHTML = translations[currentLang]['price_unit'];
  });

  const allProducts = document.querySelectorAll('.product1, .product2');
  allProducts.forEach(p => {
    let text = p.innerHTML;
    if (currentLang === 'en') {
      text = text
        .replace(/২২ ক্যারেট/g, '22K')
        .replace(/২১ ক্যারেট/g, '21K')
        .replace(/১৮ ক্যারেট/g, '18K')
        .replace(/সনাতন পদ্ধতির/g, translations[currentLang]['trad'])
        .replace(/স্বর্ণ/g, translations[currentLang]['gold'])
        .replace(/রূপা/g, translations[currentLang]['silver']);
    } else {
      text = text
        .replace(/22K/g, '২২ ক্যারেট')
        .replace(/21K/g, '২১ ক্যারেট')
        .replace(/18K/g, '১৮ ক্যারেট')
        .replace(/Traditional/g, 'সনাতন পদ্ধতির')
        .replace(/Gold/g, translations[currentLang]['gold'])
        .replace(/Silver/g, translations[currentLang]['silver']);
    }
    p.innerHTML = text;
  });

  const allDescs = document.querySelectorAll('.desc1, .desc2');
  allDescs.forEach(d => {
    if (d.innerText.includes('ক্যাডমিয়াম') || d.innerText.includes('Cadmium')) {
      d.innerText = translations[currentLang]['cad'];
    }
  });

  const lastUpdateH = document.querySelector('.last-update-h');
  if (lastUpdateH) lastUpdateH.innerText = translations[currentLang]['last_up'];

  const lastUpdatePs = document.querySelectorAll('.last-update-b');
  if (lastUpdatePs.length >= 2) {
    let dateText = lastUpdatePs[0].innerText;
    let timeText = lastUpdatePs[1].innerText;
    // 2 change area last AM PM
    if (currentLang === 'en') {
      dateText = dateText.replace('তারিখ:', 'Date:').replace('মার্চ', 'March');
      timeText = timeText
      .replace('সময়:', 'Time:')
      .replace('সকাল', '')
      .replace('দুপুর', '')
      .replace('বিকাল', '')
      .replace('সন্ধ্যা', '')
      .replace('রাত', '').replace('ঘটিকা', "AM");
    } else {
      dateText = dateText.replace('Date:', 'তারিখ:').replace('March', 'মার্চ');
      
      
      
      
      
      timeText = timeText.replace('Time:', 'সময়:').replace('Morning', 'সকাল')
      
      .replace('PM', 'ঘটিকা').replace('AM', 'ঘটিকা');
      
      
      
      
    }
    lastUpdatePs[0].innerText = convertNum(dateText);
    lastUpdatePs[1].innerText = convertNum(timeText);
  }
  
  
  
    // টিকার
  const ticker = document.querySelector('.ticker .text');
  if (ticker) {
    let tText = ticker.innerHTML;
    if (currentLang === 'en') {
      tText = tText
        .replace(/২২ ক্যারেট/g, '22K')
        .replace(/২১ ক্যারেট/g, '21K')
        .replace(/১৮ ক্যারেট/g, '18K')
        .replace(/ক্যাডমিয়াম \(হলমার্ককৃত\)/g, translations[currentLang]['cad'])
        .replace(/প্রতি গ্রাম স্বর্ণের মূল্য/g, 'per Gram Gold Price')
        .replace(/প্রতি গ্রাম রূপার মূল্য/g, 'per Gram Silver Price');
    } else {
      tText = tText
        .replace(/22K/g, '২২ ক্যারেট')
        .replace(/21K/g, '২১ ক্যারেট')
        .replace(/18K/g, '১৮ ক্যারেট')
        .replace(/Cadmium \(Hallmarked\)/g, translations[currentLang]['cad'])
        .replace(/per Gram Gold Price/g, 'প্রতি গ্রাম স্বর্ণের মূল্য')
        .replace(/per Gram Silver Price/g, 'প্রতি গ্রাম রূপার মূল্য');
    }
    ticker.innerHTML = convertNum(tText);
    
    // GIF 
const tickerImgs = ticker.querySelectorAll('img');
tickerImgs.forEach(img => {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  ['src', 'width', 'height'].forEach(attr => {
    let val = img.getAttribute(attr);
    if (val) {
      for (let i = 0; i < 10; i++) {
        val = val.replace(new RegExp(bn[i], 'g'), en[i]);
      }
      img.setAttribute(attr, val);
    }
  });
});
  }
  const allPrices = document.querySelectorAll('.price1, .price2');
  allPrices.forEach(p => {
    p.innerText = convertNum(p.innerText);
  });

  const navSpans = document.querySelectorAll('.navbar .nav-item span');
  if (navSpans.length === 5) {
    if (currentLang === 'en') {
      navSpans[0].innerText = translations['en']['home'];
      navSpans[1].innerText = translations['en']['latest'];
      navSpans[2].innerText = translations['en']['news'];
      navSpans[3].innerText = translations['en']['international'];
      navSpans[4].innerText = translations['en']['contact'];
    } else {
      navSpans[0].innerText = translations['bn']['home'];
      navSpans[1].innerText = translations['bn']['latest'];
      navSpans[2].innerText = translations['bn']['news'];
      navSpans[3].innerText = translations['bn']['international'];
      navSpans[4].innerText = translations['bn']['contact'];
    }
  }

  const btns = document.querySelectorAll('.btn-text');
  btns.forEach(b => {
    if (b.innerText === 'ডাউনলোড' || b.innerText === 'Download') b.innerText = translations[currentLang]['download'];
    if (b.innerText === 'দেখুন' || b.innerText === 'View') b.innerText = translations[currentLang]['view'];
  });

  document.querySelector('.copyright').innerText = translations[currentLang]['copyright'];
  const visitorDiv = document.querySelector('.visitor_c');
  if (visitorDiv) visitorDiv.firstChild.textContent = translations[currentLang]['visitor'] + " ";
}








    // scroll up button
     
    var scrollButton = document.getElementById("scrollUpButton");


    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {

      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollButton.style.display = "block";
      } else {
        scrollButton.style.display = "none";
      }
    }

    scrollButton.onclick = function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }


// PWA অটো-রিফ্রেশ
window.addEventListener('load', function() {
    if (!sessionStorage.getItem('pwa_auto_reloaded')) {
        sessionStorage.setItem('pwa_auto_reloaded', 'true');
        location.reload();
    }
});











// --- সাধারণ PWA ইনস্টল প্রম্পট ---

let deferredPrompt;
const LOGO_URL = 'icon-512x512.png'; // আপনার লোগো ফাইলের নাম এখানে দিন

// ১. ডাইনামিক্যালি সাধারণ পপআপ তৈরি করা (HTML ও CSS আলাদা ফাইলে হাত দিতে হবে না)
const simplePopupHtml = `
  <div id="simple-pwa-popup" style="display: none; position: fixed; top: -80px; left: 0; width: 100%; background: #fff; color: #000; padding: 10px 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 99999; transition: top 0.4s ease-in-out; border-bottom: 1px solid #ddd; font-family: sans-serif; box-sizing: border-box;">
    <div style="display: flex; align-items: center; justify-content: space-between; max-width: 600px; margin: 0 auto;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${LOGO_URL}" alt="Logo" style="width: 35px; height: 35px; border-radius: 5px;">
        <span style="font-size: 14px; font-weight: bold;">অ্যাপ ইনস্টল করুন</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button id="simple-install-btn" style="background: #007bff; color: #fff; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">ইনস্টল</button>
        <button id="simple-close-btn" style="background: transparent; color: #888; border: none; font-size: 18px; cursor: pointer; padding: 0 5px;">✖</button>
      </div>
    </div>
  </div>
`;

// বডির শুরুতে পপআপটি যুক্ত করা
document.body.insertAdjacentHTML('afterbegin', simplePopupHtml);

// ২. ব্রাউজারের ডিফল্ট প্রম্পট আটকে দেওয়া এবং আমাদের পপআপ দেখানো
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // ডিফল্ট পপআপ আটকানো
  deferredPrompt = e;
  
  // পেজ লোড হওয়ার ৩ সেকেন্ড (৩০০০ মিলি সেকেন্ড) পর পপআপ দেখানো
  setTimeout(() => {
    const popup = document.getElementById('simple-pwa-popup');
    if (popup) {
      popup.style.display = 'block';
      setTimeout(() => {
        popup.style.top = '0px'; // স্লাইড হয়ে নেমে আসবে
      }, 10);
    }
  }, 3000);
});

// ৩. ইনস্টল বাটনের কাজ
document.getElementById('simple-install-btn').addEventListener('click', async () => {
  const popup = document.getElementById('simple-pwa-popup');
  if (deferredPrompt) {
    // ব্রাউজারের আসল ইনস্টল ডায়ালগ দেখানো
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null; // প্রম্পট একবার ব্যবহার হলে নাল করে দেওয়া
    hideSimplePopup();
  } else {
    // যদি কোনো কারণে প্রম্পট না থাকে, তবে ব্যবহারকারীকে ম্যানুয়ালি ইনস্টল করতে বলা
    alert('অনুগ্রহ করে ব্রাউজার মেনু থেকে "Add to Home Screen" অপশনটি ব্যবহার করুন।');
  }
});

// ৪. ক্লোজ বাটনের কাজ
document.getElementById('simple-close-btn').addEventListener('click', () => {
  hideSimplePopup();
});

// পপআপ লুকানোর ফাংশন
function hideSimplePopup() {
  const popup = document.getElementById('simple-pwa-popup');
  if (popup) {
    popup.style.top = '-80px'; // ওপরে উঠে লুকিয়ে যাবে
    setTimeout(() => {
      popup.style.display = 'none';
    }, 400);
  }
}




// Will not download Any image
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
  img.addEventListener('dragstart', e => e.preventDefault());
});
