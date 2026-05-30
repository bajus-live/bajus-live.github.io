const firebaseConfig = {
    apiKey: "AIzaSyCGb4nMjRhK7yFJ3m4kR3rlT0oSnEEcxMo",
    authDomain: "bangladesh-jeweller-s-asso.firebaseapp.com",
    databaseURL: "https://bangladesh-jeweller-s-asso-default-rtdb.firebaseio.com/",
    projectId: "bangladesh-jeweller-s-asso",
    storageBucket: "bangladesh-jeweller-s-asso.firebasestorage.app",
    messagingSenderId: "646542194702",
    appId: "1:646542194702:web:f99399f05a199721c4a45f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 🔢 সংখ্যাকে ডাইনামিক কমা ফরম্যাটে রূপান্তর করার হেল্পার ফাংশন
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

// ডিফল্ট ব্যাকআপ ডাটা ম্যাট্রিক্স (ফায়ারবেস বা লোকাল স্টোরেজ কোনোটিই কাজ না করলে এটি লোড হবে)
const fallbackData = {
    gold: {
        badge: "Gold ↑ +৫০০৳ today",
        title: "স্বর্ণের বাজার দর",
        subtitle: "Last 7 Days Gold Price Trend",
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
        subtitle: "Last 7 Days Silver Price Trend",
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

// ==========================================
// 📈 কাস্টম SVG গ্রাফ ক্যালকুলেশন ও রেন্ডারিং ইঞ্জিন
// ==========================================
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

// ==========================================
// 🔄 ২. রিয়েল-টাইম ডাটা রেন্ডারিং ইঞ্জিন
// ==========================================
function renderUI(type, liveData) {
    const badge = liveData.badge || fallbackData[type].badge;
    const title = fallbackData[type].title;
    const subtitle = fallbackData[type].subtitle;
    const color = fallbackData[type].color;
    
    
    
    
    
    
    
    
    
    
    
    
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
                    <p class="yesterday">(গতকাল: ${formattedYesterday})</p>
                </div>
            `;
        });




// ৩. মেইন রেন্ডারিং ইঞ্জিন
function renderUI(type, liveData) {
    const badge = liveData.badge || "Live Update";
    const grid = document.getElementById('priceGrid');
    if (liveData.updateTime) {
        document.getElementById('lastUpdatedTime').innerText = `Updated: ${liveData.updateTime}`;
    }
    if (liveData.updateDate) {
        document.getElementById('currentBanglaDate').innerText = `(${liveData.updateDate})`;
    }
}
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
                <span style="color:var(--text-muted); font-weight:normal; font-size:10px;">(গতকাল: ${formattedTopYesterday})</span>
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
                    const banglaDigits = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','⑥':'6','৭':'7','৮':'8','৯':'9'};
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

// ফায়ারবেস রিয়েল-টাইম লিসেনার + লোকাল স্টোরেজ ক্যাশিং অব অপ্টিমাইজেশন (অফলাইন সাপোর্ট)
function listenToLivePrices(type) {
    // ১. প্রথমে লোকাল স্টোরেজ থেকে সেভ থাকা আগের ক্যাশ ডাটা দ্রুত লোড করা
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

    // ২. এবার ফায়ারবেস থেকে লাইভ ডাটা আনা এবং ক্যাশে আপডেট করা
    database.ref('prices/' + type).on('value', (snapshot) => {
        const liveData = snapshot.val();
        if (liveData && liveData.cards) {
            renderUI(type, liveData);
            // লোকাল স্টোরেজে ডাটা ক্যাশ (সেভ) করে রাখা
            localStorage.setItem(`cached_prices_${type}`, JSON.stringify(liveData));
        }
    }, (error) => {
        console.error("Firebase Read Error: ", error);
    });
}

// ট্যাব সুইচিং লজিক
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

// ==========================================
// ⏳ ③. স্প্ল্যাশ স্ক্রিন ও প্রিলোভ থিম অ্যাক্টিভেশন
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // 🌗 [রিলোড মেমোরি] অ্যাপ খোলার সাথে সাথে লোকাল স্টোরেজ থেকে থিম লোড করা
    const savedTheme = localStorage.getItem('user_app_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        if (savedTheme === 'light') {
            themeBtn.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeBtn.classList.replace('fa-sun', 'fa-moon');
        }
    }

    switchTab('gold');
    
    const progressCircle = document.getElementById('loaderProgress');
    const progressText = document.getElementById('progressText');
    const splashScreen = document.getElementById('splashScreen');
    
    let count = 0;
    const circumference = 2 * Math.PI * 30;
    
    const loaderInterval = setInterval(() => {
        count += 5;
        if (count > 100) count = 100;
        
        const offset = circumference - (count / 100) * circumference;
        if (progressCircle) progressCircle.style.strokeDashoffset = offset;
        if (progressText) progressText.innerText = `${count}%`;
        
        if (count === 100) {
            clearInterval(loaderInterval);
            setTimeout(() => {
                if (splashScreen) splashScreen.classList.add('splash-fade-out');
                const bottomNav = document.querySelector('.bottom-nav');
                if (bottomNav) bottomNav.style.display = 'flex';
            }, 300);
        }
    }, 40);
});

// ==========================================
// 📊 ৪. সাইড ড্রয়ার মেনু ও নোটিফিকেশন লজিক
// ==========================================
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

// ==========================================
// 🌗 五. লাইট/ডার্ক থিম সুইচার ইঞ্জিন (মেমোরি সেভিং সহ)
// ==========================================
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        if (currentTheme === 'dark') {
            newTheme = 'light';
            themeBtn.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeBtn.classList.replace('fa-sun', 'fa-moon');
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        // লোকাল স্টোরেজে ইউজারের পছন্দের থিমটি চিরতরে সেভ করে রাখা
        localStorage.setItem('user_app_theme', newTheme);
    });
}

// ==========================================
// 📱 六. PWA ইনস্টল ব্যানার ও ইউটিলিটি লজিক
// ==========================================
const installBanner = document.getElementById('installBanner');
const btnInstall = document.getElementById('btnInstall');

if (btnInstall) {
    btnInstall.addEventListener('click', () => {
        alert('BAJUS Live PWA ট্র্যাকার ইনস্টল করার জন্য ধন্যবাদ!');
        if (installBanner) installBanner.style.display = 'none';
    });
}

function resetHeight() {
    document.body.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resetHeight);
window.addEventListener("orientationchange", resetHeight);
resetHeight();

document.addEventListener("DOMContentLoaded", () => {
    const shareBtn = document.querySelector(".share-btn") || document.querySelector("[class*='Share']");
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

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

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
