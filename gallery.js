

document.addEventListener('DOMContentLoaded', () => {
    // ১. এলিমেন্ট সিলেক্ট করা
    const galleryContainer = document.getElementById('galleryContainer');
    const menuBtn = document.getElementById('menuBtn');
    const notifBtn = document.getElementById('notifBtn');
    const closeNotifBtn = document.getElementById('closeNotifBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const leftDrawer = document.getElementById('leftDrawer');
    const rightDrawer = document.getElementById('rightDrawer');
    const themeBtn = document.getElementById('themeBtn');
    
    // স্প্ল্যাশ স্ক্রিন এলিমেন্ট
    const splashScreen = document.getElementById('splashScreen');
    const progressCircle = document.getElementById('loaderProgress');
    const progressText = document.getElementById('progressText');
    
    // ২. উন্নত স্প্ল্যাশ স্ক্রিন লোডার লজিক
    let count = 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }
    
    const loaderInterval = setInterval(() => {
        count += 2;
        if (count > 100) count = 100;
        
        if (progressText) progressText.innerText = `${count}%`;
        
        if (progressCircle) {
            const offset = circumference - (count / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
        
        if (count >= 100) {
            clearInterval(loaderInterval);
            if (splashScreen) {
                splashScreen.classList.add('splash-fade-out');
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 550);
            }
        }
    }, 40);
    

    
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
    if (galleryContainer) {
        database.ref('gallery').once('value').then((snapshot) => {
            if (snapshot.exists()) {
                galleryContainer.innerHTML = '<h3>মূল্য তালিকা ইতিহাস</h3>';
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    galleryContainer.innerHTML += `
                        <div class="gallery-card">
                            <div class="gallery-date">${data.date || data.updateDate || 'তারিখ নেই'}</div>
                            <div class="gallery-content">
                                <p><strong>গোল্ড:</strong> ${data.goldPrice || data.gold || 'N/A'}</p>
                                <p><strong>সিলভার:</strong> ${data.silverPrice || 'N/A'}</p>
                            </div>
                        </div>`;
                });
            }
        }).catch(err => console.error("Gallery Error:", err));
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
// 🔔 ৭. রিয়েল-টাইম নোটিফিকেশন, পপ-আপ ও লাল ডট ইঞ্জিন
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
        if (data && data.message) {
            const lastNotifId = localStorage.getItem('last_read_notif_id') || '';
            if (data.id !== lastNotifId) {
                const notifBadge = document.getElementById('notifBadge');
                if (notifBadge) notifBadge.style.display = 'block';
                showMiddlePopup(data.message);
            }
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

// Work

function addGalleryEntry(date, price, status) {
    const list = document.getElementById('gallery-list');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // স্ট্যাটাস অনুযায়ী রং নির্ধারণ
    const statusClass = status === 'up' ? 'status-up' : 'status-down';
    
    item.innerHTML = `
        <span>${date}</span>
        <span>${price}</span>
        <span class="${statusClass}">${status === 'up' ? '▲ বৃদ্ধি' : '▼ হ্রাস'}</span>
    `;
    
    // এখানে prepend ব্যবহার করা হয়েছে যাতে নতুন ডেটা উপরে আসে
    list.prepend(item);
}
