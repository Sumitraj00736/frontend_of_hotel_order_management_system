import { getToken, deleteToken } from 'firebase/messaging';
import api from '../api/client.js';
import { getMessagingInstance, isMessagingSupported } from './firebase.js';

const DEVICE_KEY = 'push_device_id';

const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `device_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
};

export const isPushSupported = async () => {
  const supported = await isMessagingSupported();
  return supported && 'serviceWorker' in navigator;
};

export const getPushStatus = async () => {
  const deviceId = getDeviceId();
  const res = await api.get('/api/push/status', { params: { deviceId } });
  return res.data;
};

export const subscribePush = async () => {
  const supported = await isPushSupported();
  if (!supported) {
    throw new Error('Push not supported');
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const deviceId = getDeviceId();
  const existing = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
  const registration = existing || (await navigator.serviceWorker.register('/firebase-messaging-sw.js'));
  await navigator.serviceWorker.ready;
  const messaging = await getMessagingInstance();
  if (!messaging) {
    throw new Error('Push not supported');
  }

  const configRes = await api.get('/api/push/config');
  const vapidKey = configRes.data?.vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    throw new Error('Missing FCM VAPID key');
  }

  const fcmToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  if (!fcmToken) {
    throw new Error('Unable to get FCM token');
  }

  await api.post('/api/push/subscribe', {
    fcmToken,
    deviceId,
    platform: 'web'
  });

  return { enabled: true };
};

export const unsubscribePush = async () => {
  const deviceId = getDeviceId();
  const messaging = await getMessagingInstance();
  if (messaging) {
    try {
      await deleteToken(messaging);
    } catch (error) {
      // ignore
    }
  }
  await api.post('/api/push/unsubscribe', { deviceId });
  return { enabled: false };
};

export const sendTestPush = async () => {
  const res = await api.post('/api/push/test', { title: 'Test Notification', body: 'Push is working ✅' });
  return res.data;
};
