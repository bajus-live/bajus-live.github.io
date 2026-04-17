const CACHE_NAME = "bajus-v5";

self.addEventListener("install", e => {
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



// Background Notification Handling
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AlzaSyCJm0C-1TCoR3BtkjNEf13avvcO9C11lU8",
    projectId: "bajus-d2fdd",
    messagingSenderId: "300016752497",
    appId: "1:300016752497:web:e8d419a90a9bebc5df48d0"
});

const messaging = firebase.messaging();
