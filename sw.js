const CACHE_NAME = "bajus-v3.4";

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./favicon.png",
        "./icon(192×192).png",
        "./icon(512×512).png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// পুরনো ক্যাশ অটোমেটিক মুছে ফেলবে
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log("পুরনো ক্যাশ ডিলিট করা হলো:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// আগে গিটহাব চেক করবে, নেট না থাকলে ক্যাশ দেখাবে)
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
