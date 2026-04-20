// Alert Message alert('"বর্তমানে ওয়েব সাইটটি শুধুমাত্র Android ইউজারদের জন্যই সীমাবদ্ধ রয়েছে, পরবর্তীতে PC উজারদের জন্যও এটি উন্মুক্ত করা হবে" ধন্যবাদ');
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
const LOGO_URL = 'https://bajus-live.github.io/icon-512x512.png';
const simplePopupHtml = `
  <div id="simple-pwa-popup" style="display: none; position: fixed; top: -80px; left: 0; width: 100%; background: #fff; color: #000; padding: 10px 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 99999; transition: top 0.4s ease-in-out; border-bottom: 1px solid #ddd; font-family: sans-serif; box-sizing: border-box;">
    <div style="display: flex; align-items: center; justify-content: space-between; max-width: 600px; margin: 0 auto;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="https://bajus-live.github.io/icon-512x512.png" alt="Logo" style="width: 35px; height: 35px; border-radius: 5px;">
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
window.addEventListener('contextmenu', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
}, false);

document.querySelectorAll('img').forEach(img => {
  img.setAttribute('draggable', 'false');
  img.style.webkitTouchCallout = 'none';
  img.style.webkitUserSelect = 'none';
});
