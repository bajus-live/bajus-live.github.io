const firebaseConfig = {
    apiKey: "AIzaSyCGb4nMjRhK7yFJ3m4kR3rlT0oSnEEcxMo",
    authDomain: "bangladesh-jeweller-s-asso.firebaseapp.com",
    databaseURL: "https://bangladesh-jeweller-s-asso-default-rtdb.firebaseio.com/",
    projectId: "bangladesh-jeweller-s-asso",
    storageBucket: "bangladesh-jeweller-s-asso.firebasestorage.app",
    messagingSenderId: "646542194702",
    appId: "1:646542194702:web:f99399f05a199721c4a45f"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function formatMyPrice(num) {
    if (num === null || num === undefined || num === '') return "0";
    let numStr = String(num).trim();
    let isNegative = numStr.startsWith('-');
    let cleanNumberStr = numStr.replace(/[^\d]/g, '');
    if (!cleanNumberStr) return "0";
    let number = parseFloat(cleanNumberStr);
    let formatted = number.toLocaleString('en-IN');
    return isNegative ? '-' + formatted : formatted;
}

const fallbackData = {
    gold: {
        badge: "Gold ↑ +৫০০৳ today",
        title: "স্বর্ণের বাজার দর",
        subtitle: "গত ৭ দিনের সোনার মূল্যের গ্রাফ",
        cards: [
            { karat: "২২ ক্যারেট", price: "20850", change: "+356", yesterday: "20500" },
            { karat: "২১ ক্যারেট", price: "19910", change: "+320", yesterday: "19590" },
            { karat: "১৮ ক্যারেট", price: "17806", change: "+280", yesterday: "17526" },
            { karat: "সনাতন", price: "15550", change: "+250", yesterday: "15250" }
        ],
        line: "M 10 100 L 75 85 L 140 90 L 205 60 L 270 50 L 335 35 L 390 20",
        fill: "M 10 100 L 75 85 L 140 90 L 205 60 L 270 50 L 335 35 L 390 20 L 390 120 L 10 120 Z",
        nodes: [{ x: 10, y: 100 }, { x: 75, y: 85 }, { x: 140, y: 90 }, { x: 205, y: 60 }, { x: 270, y: 50 }, { x: 335, y: 35 }, { x: 390, y: 20 }],
        dates: ["18 May", "19 May", "20 May", "21 May", "22 May", "23 May", "24 May"],
        color: "#ffc107"
    },
    silver: {
        badge: "Silver ↑ +১৫৳ today",
        title: "রূপার বাজার দর",
        subtitle: "গত ৭ দিনের রূপার মূল্যের গ্রাফ",
        cards: [
            { karat: "২২ ক্যারেট রূপা", price: "1850", change: "+45", yesterday: "1800" },
            { karat: "২১ ক্যারেট রূপা", price: "1780", change: "+40", yesterday: "1740" },
            { karat: "১৮ ক্যারেট রূপা", price: "1550", change: "+30", yesterday: "1510" },
            { karat: "সনাতন রূপা", price: "1200", change: "+10", yesterday: "1150" }
        ],
        line: "M 10 80 L 75 85 L 140 75 L 205 78 L 270 65 L 335 58 L 390 45",
        fill: "M 10 80 L 75 85 L 140 75 L 205 78 L 270 65 L 335 58 L 390 45 L 390 120 L 10 120 Z",
        nodes: [{ x: 10, y: 80 }, { x: 75, y: 85 }, { x: 140, y: 75 }, { x: 205, y: 78 }, { x: 270, y: 65 }, { x: 335, y: 58 }, { x: 390, y: 45 }],
        dates: ["18 May", "19 May", "20 May", "21 May", "22 May", "23 May", "24 May"],
        color: "#cbd5e1"
    }
};

let currentTab = 'gold';

function drawLiveSVGChart(dates, prices, color) {
    const xAxisContainer = document.getElementById('chartXAxis');
    const chartLineStroke = document.getElementById('chartLineStroke');
    const chartAreaFill = document.getElementById('chartAreaFill');
    const nodesGroup = document.getElementById('chartNodesGroup');

    if (!xAxisContainer || !chartLineStroke) return;

    xAxisContainer.innerHTML = '';
    dates.forEach(date => {
        const span = document.createElement('span');
        span.innerText = date;
        xAxisContainer.appendChild(span);
    });

    const svgWidth = 400;
    const svgHeight = 120;
    const padding = 20;
    
    const minPrice = Math.min(...prices) || 0;
    const maxPrice = Math.max(...prices) || 100;
    const priceRange = (maxPrice - minPrice) === 0 ? 1 : (maxPrice - minPrice);

    const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * svgWidth;
        const y = svgHeight - padding - ((price - minPrice) / priceRange) * (svgHeight - padding * 2);
        return { x, y };
    });

    let pathData = '';
    points.forEach((point, index) => {
        if (index === 0) {
            pathData += `M ${point.x} ${point.y}`;
        } else {
            pathData += ` L ${point.x} ${point.y}`;
        }
    });

    chartLineStroke.setAttribute('d', pathData);
    chartLineStroke.setAttribute('stroke', color);

    if (points.length > 0) {
        let fillData = `${pathData} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;
        chartAreaFill.setAttribute('d', fillData);
        chartAreaFill.setAttribute('fill', color);
    }

    nodesGroup.innerHTML = '';
    points.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'chart-node-dot');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#fff');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '2');
        nodesGroup.appendChild(circle);
    });
}

function renderUI(type, liveData) {
    const badge = liveData.badge || fallbackData[type].badge;
    const title = fallbackData[type].title;
    const subtitle = fallbackData[type].subtitle;
    const color = fallbackData[type].color;

    if (liveData.updateTime) {
        const upperTime = document.getElementById('lastUpdatedTime');
        if (upperTime) upperTime.innerText = `Updated: ${liveData.updateTime}`;
        const lowerTime = document.querySelector('.update-info #lastUpdatedTime');
        if (lowerTime) lowerTime.innerText = `Updated: ${liveData.updateTime}`;
    }
    if (liveData.updateDate) {
        const lowerDate = document.getElementById('currentBanglaDate');
        if (lowerDate) lowerDate.innerText = `(${liveData.updateDate})`;
    }

    const grid = document.getElementById('priceGrid');
    if (grid && liveData.cards) {
        grid.innerHTML = '';
        liveData.cards.forEach(item => {
            const rawChange = item.change || "0";
            const rawPrice = item.price || "0";
            const rawYesterday = item.yesterday || "0";
            
            const formattedPrice = formatMyPrice(rawPrice);
            const formattedYesterday = formatMyPrice(rawYesterday);
            
            let statusColor = '#10b981'; 
            let statusIcon = 'fa-arrow-trend-up';
            let prefix = '+';
            
            if (String(rawChange).includes('-')) {
                statusColor = '#ef4444'; 
                statusIcon = 'fa-arrow-trend-down';
                prefix = '';
            }
            
            const formattedChange = prefix + formatMyPrice(rawChange);
            
            grid.innerHTML += `
                <div class="price-card animate-fade">
                    <span class="karat-tag">${item.karat}</span>
                    <div class="price-amount">${formattedPrice} <span class="unit">/ভরি</span></div>
                    <div class="changeup" style="color: ${statusColor}"><i class="fa-solid ${statusIcon}"></i> ${formattedChange}</div>
                    <p class="yesterday">(পূর্ববর্তী বাজার: ${formattedYesterday})</p>
                </div>
            `;
        });
    }

    const chartBriefArea = document.getElementById('chartBriefArea');
    if (chartBriefArea && liveData.cards && liveData.cards[0]) {
        const topKarat = liveData.cards[0].karat;
        const rawTopPrice = liveData.cards[0].price || "0";
        const rawTopChange = liveData.cards[0].change || "0";
        const rawTopYesterday = liveData.cards[0].yesterday || "0";
        
        const formattedTopPrice = formatMyPrice(rawTopPrice);
        const formattedTopYesterday = formatMyPrice(rawTopYesterday);
        const accentColor = type === 'gold' ? 'var(--accent-gold)' : 'var(--accent-silver)';

        let topStatusColor = '#10b981'; 
        let topStatusIcon = 'fa-arrow-trend-up';
        let topPrefix = '+';
        
        if (String(rawTopChange).includes('-')) {
            topStatusColor = '#ef4444'; 
            topStatusIcon = 'fa-arrow-trend-down';
            topPrefix = '';
        }

        const formattedTopChange = topPrefix + formatMyPrice(rawTopChange);

        chartBriefArea.innerHTML = `
            <span class="karat-tag" style="color:${accentColor}">${topKarat}</span>
            <div class="price-amount">${formattedTopPrice} <span class="unit">/ভরি</span></div>
            <div class="changeup" style="color: ${topStatusColor}">
                <i class="fa-solid ${topStatusIcon}"></i> ${formattedTopChange} 
                <span style="color:var(--text-muted); font-weight:normal; font-size:10px;">(পূর্ববর্তী বাজার: ${formattedTopYesterday})</span>
            </div>
        `;
    }

    if (document.getElementById('heroBadge')) document.getElementById('heroBadge').innerHTML = badge;
    if (document.getElementById('chartTitle')) document.getElementById('chartTitle').innerText = title;
    if (document.getElementById('chartSubtitle')) document.getElementById('chartSubtitle').innerText = subtitle;
    
    if (liveData.graphData) {
        const datesArray = [];
        const pricesArray = [];

        for (let i = 0; i < 7; i++) {
            if (liveData.graphData[i]) {
                datesArray.push(liveData.graphData[i].date || `Day ${i+1}`);
                let cleanPrice = liveData.graphData[i].change || liveData.graphData[i].price || "0";
                
                if (typeof cleanPrice === 'string') {
                    const banglaDigits = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','⑤':'5','⑥':'6','৭':'7','৮':'8','৯':'9'};
                    cleanPrice = cleanPrice.replace(/[০-৯]/g, match => banglaDigits[match]);
                    cleanPrice = cleanPrice.replace(/[৳,+-]/g, '').trim();
                }
                pricesArray.push(Number(cleanPrice) || 0);
            }
        }
        drawLiveSVGChart(datesArray, pricesArray, color);
    } else {
        drawLiveSVGChart(fallbackData[type].dates, fallbackData[type].nodes.map(n => 120 - n.y), color);
    }
}

function listenToLivePrices(type) {
    const cachedData = localStorage.getItem(`cached_prices_${type}`);
    if (cachedData) {
        try {
            renderUI(type, JSON.parse(cachedData));
        } catch (e) {
            console.error("Cache read error", e);
        }
    } else {
        renderUI(type, fallbackData[type]);
    }

    database.ref('prices/' + type).on('value', (snapshot) => {
        const liveData = snapshot.val();
        if (liveData && liveData.cards) {
            renderUI(type, liveData);
            localStorage.setItem(`cached_prices_${type}`, JSON.stringify(liveData));
        }
    }, (error) => {
        console.error("Firebase Read Error: ", error);
    });
}

function switchTab(type) {
    currentTab = type;
    const goldBtn = document.getElementById('goldTabBtn');
    const silverBtn = document.getElementById('silverTabBtn');
    const tabImage = document.getElementById('tabImage');
    
    if (type === 'gold') {
        if (goldBtn) goldBtn.classList.add('active');
        if (silverBtn) silverBtn.classList.remove('active');
        if (tabImage) tabImage.src = 'https://bajus-live.github.io/storage/photos/gold_bar.png';
    } else {
        if (silverBtn) silverBtn.classList.add('active');
        if (goldBtn) goldBtn.classList.remove('active');
        if (tabImage) tabImage.src = 'https://bajus-live.github.io/storage/photos/gold_bar.png';
    }
    
    database.ref('prices/gold').off();
    database.ref('prices/silver').off();
    
    listenToLivePrices(type);
}

function updateDynamicBanglaDate() {
    const banglaDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    const now = new Date();
    const dayName = banglaDays[now.getDay()];
    const date = now.getDate();
    const monthName = banglaMonths[now.getMonth()];
    const year = now.getFullYear();
    
    const formatted = `${dayName}, ${date} ${monthName} ${year}`;
    const span = document.getElementById('dynamicBanglaDate');
    if (span) {
        span.textContent = `(${formatted})`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('user_app_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('themeBtn');
    // start
    if (themeBtn) {
    if (savedTheme === 'light') {
        themeBtn.classList.add('fa-moon');
        themeBtn.classList.remove('fa-sun');
    } else {
        themeBtn.classList.add('fa-sun');
        themeBtn.classList.remove('fa-moon');
    }
}
// end

    switchTab('gold');
    updateDynamicBanglaDate();

    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('splash-fade-out');
            const bottomNav = document.querySelector('.bottom-nav');
            if (bottomNav) bottomNav.style.display = 'flex';
        }, 4000);
    }
});

// --------------- সাইড ড্রয়ার ---------------
const overlay = document.getElementById('drawerOverlay');
const leftDrawer = document.getElementById('leftDrawer');
const rightDrawer = document.getElementById('rightDrawer');
const menuBtn = document.getElementById('menuBtn');
const notifBtn = document.getElementById('notifBtn');
const closeNotifBtn = document.getElementById('closeNotifBtn');

function closeDrawers() {
    if (overlay) overlay.classList.remove('open');
    if (leftDrawer) leftDrawer.style.left = '-285px';
    if (rightDrawer) rightDrawer.style.right = '-285px';
}

if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (overlay) overlay.classList.add('open');
        if (leftDrawer) leftDrawer.style.left = '0';
        if (rightDrawer) rightDrawer.style.right = '-285px';
    });
}

if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (overlay) overlay.classList.add('open');
        if (rightDrawer) rightDrawer.style.right = '0';
        if (leftDrawer) leftDrawer.style.left = '-285px';
        
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

if (closeNotifBtn) closeNotifBtn.addEventListener('click', closeDrawers);
if (overlay) {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDrawers();
    });
}

// --------------- থিম সুইচ ---------------
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        // start     
        if (currentTheme === 'dark') {
    newTheme = 'light';
    themeBtn.classList.add('fa-moon');
    themeBtn.classList.remove('fa-sun');
} else {
    newTheme = 'dark';
    themeBtn.classList.add('fa-sun');
    themeBtn.classList.remove('fa-moon');
}
// end
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('user_app_theme', newTheme);
    });
}

// --------------- শেয়ার বাটন ---------------
document.addEventListener("DOMContentLoaded", () => {
    const shareBtn = document.querySelector(".share-btn");
    if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'বাজুস লাইভ - স্বর্ণ ও রূপার বাজার দর',
                        text: 'বাংলাদেশের লাইভ স্বর্ণ ও রূপার সঠিক বাজার দর জানুন এক ক্লিকেই।',
                        url: window.location.href
                    });
                } catch (error) {
                    console.log('শেয়ার এরর:', error);
                }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("🔗 ওয়েবসাইটের লিঙ্কটি কপি করা হয়েছে!");
            }
        });
    }
});

// --------------- বটম নেভ ---------------
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// --------------- নোটিফিকেশন পপআপ ও রিয়েল-টাইম ---------------
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
            } else {
                const notifBadge = document.getElementById('notifBadge');
                if (notifBadge) notifBadge.style.display = 'none';
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

// --------------- অ্যাডমিন লগইন ---------------
function showAdminLogin() {
    const password = prompt("Enter Admin Password:");
    if (password === null || password === "") return;
    if (password === "@dmin853775") {
        window.location.href = "admin.html";
    } else {
        alert("Access Denied!");
    }
}

// --------------- 🆕 মেনু মডেল কন্টেন্ট ও লজিক ---------------
const menuModal = document.getElementById('menuModal');
const closeMenuModalBtn = document.getElementById('closeMenuModal');
const menuModalTitle = document.getElementById('menuModalTitle');
const menuModalBody = document.getElementById('menuModalBody');

// কন্টেন্ট ডাটা
const menuContents = {
    profile: {
        title: 'সদস্য প্রোফাইল',
        body: `
            <p>স্বাগতম! সদস্য প্রোফাইলের মাধ্যমে আপনি আপনার ব্যক্তিগত তথ্য, সদস্যপদ নম্বর ও লেনদেনের ইতিহাস দেখতে পারবেন।</p>
            <p style="margin-top:10px;">বর্তমানে এই ফিচারটি উন্নয়নের অধীনে রয়েছে। খুব শীঘ্রই এটি চালু হবে।</p>
            <p style="margin-top:10px;"><strong>হেল্পলাইন:</strong> +880241031722</p>
        `
    },
    // Bazar bishlasan report 
    report: {
  title: 'বাজার বিশ্লেষণ রিপোর্ট',
  body: `
            <p style="text-align:center; font-size:16px; font-weight:bold; margin-bottom:15px;">সর্বশেষ বাজার বিশ্লেষণ রিপোর্ট</p>
            <p style="text-align:center;">নিচের লিংক থেকে PDF ডাউনলোড করুন:</p>
            <div style="text-align:center; margin: 20px 0;">
                <a href="https://bajus-live.github.io/storage/bazar_analysis_report/may-2026.pdf" 
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
    if (menuContents[key]) {
        menuModalTitle.innerText = menuContents[key].title;
        menuModalBody.innerHTML = menuContents[key].body;
        menuModal.classList.add('open');
        closeDrawers(); // বাম ড্রয়ার বন্ধ করবে
    }
}

// মডেল বন্ধ করা
closeMenuModalBtn.addEventListener('click', () => {
    menuModal.classList.remove('open');
});

// মডেলের বাইরে ক্লিক করলে বন্ধ
menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) {
        menuModal.classList.remove('open');
    }
});


