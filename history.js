let currentLang = 'bn';
const translations = {
  'bn': {
    'lang_label': 'ভাষাঃ',
    'association': 'বাংলাদেশ জুয়েলারি সমিতি',
    'last_rate': 'সর্বশেষ মূল্য তালিকাসমূহ',
    'date_label': 'তারিখ',
    'pdf_label': 'পিডিএফ',
    'price_label': 'মূল্য (হ্রাস/বৃদ্ধি)',
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
    'last_rate': 'Latest Price List',
    'date_label': 'DATE',
    'pdf_label': 'PDF',
    'price_label': 'Price (Increase/Decrease)',
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
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = str.toString();
  for (let i = 0; i < 10; i++) {
    const regex = new RegExp(currentLang === 'en' ? bn[i] : en[i], 'g');
    result = result.replace(regex, currentLang === 'en' ? en[i] : bn[i]);
  }
  return result;
}

function toggleLanguage() {
  currentLang = currentLang === 'bn' ? 'en' : 'bn';
  document.getElementById('lang-btn').innerText = currentLang === 'bn' ? 'EN' : 'BN';
  

  const label = document.querySelector('.lang-label');
  if (label) label.innerText = translations[currentLang]['lang_label'];
  
  const logoText = document.querySelector('.top-logo-text');
  if (logoText) logoText.innerText = translations[currentLang]['association'];
  

  const titles = document.querySelectorAll('h1, h2, h3, h4, h5, h6, center, div');
  titles.forEach(el => {
    const txt = el.innerText.trim();
    if (txt === 'সর্বশেষ মূল্য তালিকাসমূহ' || txt === 'Latest Price List') {

      el.innerHTML = `<h4 style="text-align: center; width: 100%; margin: 10px 0;">${translations[currentLang]['last_rate']}</h4>`;
    }
  });
  

  const headers = document.querySelectorAll('th');
  headers.forEach(th => {
    let hText = th.innerText.trim();
    if (hText === 'তারিখ' || hText === 'DATE') th.innerText = translations[currentLang]['date_label'];
    if (hText === 'পিডিএফ' || hText === 'PDF') th.innerText = translations[currentLang]['pdf_label'];
    if (hText.includes('মূল্য') || hText.includes('Price')) th.innerText = translations[currentLang]['price_label'];
  });
  

  function replaceTextInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;
      if (text.trim() !== "") {
        if (currentLang === 'en') {
          text = text.replace(/টাকা/g, 'BDT');
        } else {
          text = text.replace(/BDT/g, 'টাকা');
        }
        node.nodeValue = convertNum(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'A') return;
      
      for (let i = 0; i < node.childNodes.length; i++) {
        replaceTextInNode(node.childNodes[i]);
      }
    }
  }
  
  const cells = document.querySelectorAll('td');
  cells.forEach(td => {
    replaceTextInNode(td);
  });
  
  const navSpans = document.querySelectorAll('.navbar .nav-item span');
  const keys = ['home', 'latest', 'news', 'international', 'contact'];
  navSpans.forEach((span, i) => {
    if (keys[i]) span.innerText = translations[currentLang][keys[i]];
  });
  

  const copyright = document.querySelector('.copyright');
  if (copyright) copyright.innerText = translations[currentLang]['copyright'];
  
  const visitorDiv = document.querySelector('.visitor_c');
  if (visitorDiv) {
    visitorDiv.childNodes[0].textContent = translations[currentLang]['visitor'] + " ";
    if (visitorDiv.childNodes[1]) {
      visitorDiv.childNodes[1].textContent = convertNum(visitorDiv.childNodes[1].textContent);
    }
  }
const allHeaders = document.querySelectorAll('th');
allHeaders.forEach(th => {
  th.style.width = '33.33%';
});
  
  
  
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

