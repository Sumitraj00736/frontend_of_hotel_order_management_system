self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = {};
  }

  const title = payload.title || 'New Notification';
  const options = {
    body: payload.body || '',
    data: payload.data || {},
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url)) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
