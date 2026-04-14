import api from '../api/client.js';

const DEVICE_KEY = 'push_device_id';

const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `device_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const isPushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window;

export const getPushStatus = async () => {
  const deviceId = getDeviceId();
  const res = await api.get('/api/push/status', { params: { deviceId } });
  return res.data;
};

export const subscribePush = async () => {
  if (!isPushSupported()) {
    throw new Error('Push not supported');
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const deviceId = getDeviceId();
  const keyRes = await api.get('/api/push/public-key');
  const publicKey = keyRes.data?.publicKey;
  if (!publicKey) {
    throw new Error('Missing VAPID public key');
  }

  const registration = await navigator.serviceWorker.register('/sw.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  await api.post('/api/push/subscribe', {
    subscription: subscription.toJSON(),
    deviceId,
    platform: 'web'
  });

  return { enabled: true };
};

export const unsubscribePush = async () => {
  const deviceId = getDeviceId();
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
  }
  await api.post('/api/push/unsubscribe', { deviceId });
  return { enabled: false };
};
