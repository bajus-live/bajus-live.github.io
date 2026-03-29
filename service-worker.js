// service-worker.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // ক্রোমকে শান্ত রাখার জন্য এই ডামি ফেচ রিকোয়েস্ট
});
