importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDfE1U47NN332AkEczyUncL-KxnEIHw0dE",
  authDomain: "hoteloms-8563c.firebaseapp.com",
  projectId: "hoteloms-8563c",
  storageBucket: "hoteloms-8563c.firebasestorage.app",
  messagingSenderId: "205382028210",
  appId: "1:205382028210:web:f7b67f05259d51dd40b2ab"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

/* ---------------------------
   BACKGROUND MESSAGE
---------------------------- */
messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'MeroRestro';
  const body = payload?.notification?.body || '';

  self.registration.showNotification(title, {
    body,
    data: payload?.data || {}
  });
});

/* ---------------------------
   CLICK HANDLER
---------------------------- */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || '/';

  event.waitUntil(
    self.clients.openWindow(targetUrl)
  );
});

/* ---------------------------
   SKIP WAITING
---------------------------- */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
