// firebase-messaging-sw.js (Version: 1.0)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCGb4nMjRhK7yFJ3m4kR3rlT0oSnEEcxMo",
    authDomain: "bangladesh-jeweller-s-asso.firebaseapp.com",
    databaseURL: "https://bangladesh-jeweller-s-asso-default-rtdb.firebaseio.com/",
    projectId: "bangladesh-jeweller-s-asso",
    storageBucket: "bangladesh-jeweller-s-asso.firebasestorage.app",
    messagingSenderId: "646542194702",
    appId: "1:646542194702:web:f99399f05a199721c4a45f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://bajus-live.github.io/icon_(512×512).png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
