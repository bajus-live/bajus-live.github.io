// ==========================================
// 🚀 international.js - পূর্ণাঙ্গ ও সংশোধিত
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // ১. এলিমেন্ট সিলেক্ট করা
  const internationalContainer = document.getElementById('internationalContainer');
  const menuBtn = document.getElementById('menuBtn');
  const notifBtn = document.getElementById('notifBtn');
  const closeNotifBtn = document.getElementById('closeNotifBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const leftDrawer = document.getElementById('leftDrawer');
  const rightDrawer = document.getElementById('rightDrawer');
  const themeBtn = document.getElementById('themeBtn');
  
  // স্প্ল্যাশ স্ক্রিন এলিমেন্ট (লোটি)
  const splashScreen = document.getElementById('splashScreen');
  
  // ২. লোটি অ্যানিমেশন সহ স্প্ল্যাশ স্ক্রিন (৪ সেকেন্ড পর স্বয়ংক্রিয়ভাবে লুকাবে)
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.classList.add('splash-fade-out');
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 550);
    }, 4000);
  }
  
  // ৪. ড্রয়ার কন্ট্রোল
  function closeDrawers() {
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    if (leftDrawer) leftDrawer.style.left = '-285px';
    if (rightDrawer) rightDrawer.style.right = '-285px';
  }
  
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawers();
      drawerOverlay.classList.add('open');
      leftDrawer.style.left = '0';
    });
  }
  
  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawers();
      drawerOverlay.classList.add('open');
      rightDrawer.style.right = '0';
      leftDrawer.style.left = '-285px'; // বাম ড্রয়ার বন্ধ রাখতে
      
      // 🆕 লাল ডট হাইড ও লাস্ট রিড সেভ
      const notifBadge = document.getElementById('notifBadge');
      if (notifBadge) notifBadge.style.display = 'none';
      
      database.ref('notifications/latest').once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data && data.id) {
          localStorage.setItem('last_read_notif_id', data.id);
        }
      });
    });
  }
  
  if (closeNotifBtn) {
    closeNotifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawers();
    });
  }
  
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeDrawers();
    });
  }
  
  // ৫. থিম টগল
  const savedTheme = localStorage.getItem('user_app_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (themeBtn) {
    themeBtn.classList.toggle('fa-moon', savedTheme === 'dark');
    themeBtn.classList.toggle('fa-sun', savedTheme === 'light');
    
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('user_app_theme', newTheme);
      themeBtn.classList.toggle('fa-moon', newTheme === 'dark');
      themeBtn.classList.toggle('fa-sun', newTheme === 'light');
    });
  }
  
  // ৬. ফায়ারবেস থেকে ইতিহাস ডেটা লোড
  if (internationalContainer) {
    database.ref('international').once('value').then((snapshot) => {
      if (snapshot.exists()) {
        internationalContainer.innerHTML = '<h3>মূল্য তালিকা ইতিহাস</h3>';
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          internationalContainer.innerHTML += `
                        <div class="history-card">
                            <div class="history-date">${data.date || data.updateDate || 'তারিখ নেই'}</div>
                            <div class="history-content">
                                <p><strong>গোল্ড:</strong> ${data.goldPrice || data.gold || 'N/A'}</p>
                                <p><strong>সিলভার:</strong> ${data.silverPrice || 'N/A'}</p>
                            </div>
                        </div>`;
        });
      }
    }).catch(err => console.error("History Error:", err));
  }
});

// Admin Password Protected page
function showAdminLogin() {
  const password = prompt("Enter Admin Password:");
  if (password === null || password === "") {
    return;
  }
  if (password === "admin123") {
    window.location.href = "admin.html";
  } else {
    alert("Access Denied!");
  }
}


// ==========================================
// 🔔 রিয়েল-টাইম নোটিফিকেশন (পপ-আপ ও লাল ডট)
// ==========================================
function showMiddlePopup(message) {
  const oldPopup = document.getElementById('customMiddlePopup');
  if (oldPopup) oldPopup.remove();
  
  const popup = document.createElement('div');
  popup.id = 'customMiddlePopup';
  popup.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.7);
        background: #1e293b; color: #ffffff; padding: 20px 30px; border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); z-index: 10000; text-align: center;
        max-width: 320px; width: 80%; border: 2px solid #ffc107; opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
  
  popup.innerHTML = `
        <div style="font-size: 40px; color: #ffc107; margin-bottom: 12px;"><i class="fa-solid fa-bell animate-bounce"></i></div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #ffc107;">নতুন নোটিফিকেশন!</h3>
        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.4; color: #cbd5e1;">${message}</p>
        <button id="closePopupBtn" style="background: #ffc107; color: #000; border: none; padding: 8px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">ঠিক আছে</button>
    `;
  
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 50);
  
  const closeBtn = popup.querySelector('#closePopupBtn');
  const closePopup = () => {
    popup.style.opacity = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.7)';
    setTimeout(() => popup.remove(), 400);
  };
  closeBtn.addEventListener('click', closePopup);
  setTimeout(closePopup, 8000);
}

function listenToNotifications() {
  database.ref('notifications/latest').on('value', (snapshot) => {
    const data = snapshot.val();
    const notifBadge = document.getElementById('notifBadge');
    if (data && data.message) {
      const lastNotifId = localStorage.getItem('last_read_notif_id') || '';
      if (data.id !== lastNotifId) {
        if (notifBadge) notifBadge.style.display = 'block';
        showMiddlePopup(data.message);
      } else {
        // আগেরটা পড়া হয়ে গেলে লাল ডট আড়াল
        if (notifBadge) notifBadge.style.display = 'none';
      }
    } else {
      // কোনো নোটিফিকেশন না থাকলে ডট হাইড
      if (notifBadge) notifBadge.style.display = 'none';
    }
  });
  
  database.ref('notifications/list').on('value', (snapshot) => {
    const notifList = snapshot.val();
    const dynamicContainer = document.getElementById('dynamicNotifList');
    if (!dynamicContainer) return;
    
    let htmlContent = '';
    if (notifList) {
      const keys = Object.keys(notifList).reverse();
      keys.forEach(key => {
        const item = notifList[key];
        htmlContent += `
                    <div class="notif-card" style="background: #2a3547; padding: 14px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #ffc107;">
                        <p style="margin: 0 0 6px 0; font-size: 14px; color: #ffffff; line-height: 1.4;">${item.message}</p>
                        <span class="notif-time" style="font-size: 11px; color: #94a3b8; display: block; text-align: right;"><i class="fa-regular fa-clock"></i> ${item.time || 'এইমাত্র'}</span>
                    </div>
                `;
      });
    } else {
      htmlContent = `<p style="text-align:center; color:#94a3b8; margin-top:20px;">কোনো নোটিফিকেশন পাওয়া যায়নি</p>`;
    }
    dynamicContainer.innerHTML = htmlContent;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  listenToNotifications();
});


// --------------- মেনু মডেল কন্টেন্ট ও লজিক ---------------
const menuContents = {
  profile: {
    title: 'সদস্য প্রোফাইল',
    body: `
            <p>স্বাগতম! সদস্য প্রোফাইলের মাধ্যমে আপনি আপনার ব্যক্তিগত তথ্য, সদস্যপদ নম্বর ও লেনদেনের ইতিহাস দেখতে পারবেন।</p>
            <p style="margin-top:10px;">বর্তমানে এই ফিচারটি উন্নয়নের অধীনে রয়েছে। খুব শীঘ্রই এটি চালু হবে।</p>
            <p style="margin-top:10px;"><strong>হেল্পলাইন: +880241031722</strong> </p>
        `
  },
  report: {
        title: 'বাজার বিশ্লেষণ রিপোর্ট',
        body: `
            <p style="text-align:center; font-size:16px; font-weight:bold; margin-bottom:15px;">সর্বশেষ বাজার বিশ্লেষণ রিপোর্ট</p>
            <p style="text-align:center;">নিচের লিংক থেকে PDF ডাউনলোড করুন:</p>
            <div style="text-align:center; margin: 20px 0;">
                <a href="https://bajus-live.github.io/storage/files/market_report_may_2026.pdf" 
                   target="_blank" 
                   style="background: var(--accent-gold); color: #000; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                    <i class="fa-solid fa-download"></i> PDF ডাউনলোড করুন
                </a>
            </div>
            <p style="text-align:center; font-size:13px; margin-top:10px; color: var(--text-muted);">
                সর্বশেষ আপডেট: ০৩ জুন ২০২৬
            </p>
        `
    },
  policy: {
    title: 'সমিতি নীতিমালা',
    body: `
            <p><strong>বাংলাদেশ জুয়েলার্স সমিতির (BAJUS) নীতিমালা:</strong></p>
            <ul style="padding-left:20px; margin-top:10px;">
                <li>সকল সদস্যকে অবশ্যই নীতিমালা মেনে চলতে হবে।</li>
                <li>হলমার্কিং বাধ্যতামূলক।</li>
                <li>মূল্য নির্ধারণে স্বচ্ছতা বজায় রাখতে হবে।</li>
                <li>ক্রেতাদের অভিযোগ দ্রুত নিষ্পত্তি করতে হবে।</li>
            </ul>
            <p style="margin-top:10px;">পূর্ণাঙ্গ নীতিমালা PDF আকারে শীঘ্রই আপলোড করা হবে।</p>
        `
  },
  contact: {
    title: 'যোগাযোগ ও সহায়তা',
    body: `
            <p><i class="fa-solid fa-location-dot"></i> <strong>ঠিকানা:</strong> 15, New Eskaton Road, Level-6, Moghbazar, Ramna, Dhaka-1000, Bangladesh.</p>
            <p style="margin-top:10px;"><i class="fa-solid fa-phone"></i> <strong>ফোন:</strong> +880241031722<br><br>
            <strong>
            <i class="fa fa-whatsapp" style="font-size:18px"></i> Whatsapp:</strong><p> +8801817538878</p></p>
            <p style="margin-top:10px;"><i class="fa-solid fa-envelope"></i> <strong>ইমেইল:</strong> info@bajus.org.bd</p>
            <p style="margin-top:10px;"><i class="fa-solid fa-clock"></i> <strong>অফিস সময়:</strong> রবি-বৃহস্পতি, সকাল ১০টা থেকে বিকাল ৫টা</p>
        `
  }
};
// মেনু আইটেম ক্লিক ইভেন্ট
document.getElementById('menu-profile').addEventListener('click', () => openMenuModal('profile'));
document.getElementById('menu-report').addEventListener('click', () => openMenuModal('report'));
document.getElementById('menu-policy').addEventListener('click', () => openMenuModal('policy'));
document.getElementById('menu-contact').addEventListener('click', () => openMenuModal('contact'));

function openMenuModal(key) {
  const modal = document.getElementById('menuModal');
  const title = document.getElementById('menuModalTitle');
  const body = document.getElementById('menuModalBody');
  if (menuContents[key]) {
    title.innerText = menuContents[key].title;
    body.innerHTML = menuContents[key].body;
    modal.classList.add('open');
    closeDrawers(); // বাম ড্রয়ার বন্ধ করবে
  }
}

// মডেল বন্ধ করা
document.getElementById('closeMenuModal').addEventListener('click', () => {
  document.getElementById('menuModal').classList.remove('open');
});

document.getElementById('menuModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.remove('open');
  }
});
