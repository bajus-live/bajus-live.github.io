const CACHE_NAME = "bajus-v1.2";

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



// Firebase Background Messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');
firebase.initializeApp({
    apiKey: "AIzaSyCJm0C-1TCoR3B1kjNEf13uvvcO9C1lIU8",
    authDomain: "bajus-d2fdd.firebaseapp.com",
    projectId: "bajus-d2fdd",
    storageBucket: "bajus-d2fdd.firebasestorage.app",
    messagingSenderId: "300016752497",
    appId: "1:300016752497:web:e8d409a90a9bebc5df48d0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './favicon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
