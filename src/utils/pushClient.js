import { getToken as firebaseGetToken, deleteToken } from 'firebase/messaging';
import api from '../api/client.js';
import { getMessagingInstance, isMessagingSupported } from './firebase.js';

const DEVICE_KEY = 'push_device_id';

/* ---------------------------
   DEVICE ID
---------------------------- */
const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `device_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
};

const extractApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

/* ---------------------------
   SUPPORT CHECK
---------------------------- */
export const isPushSupported = async () => {
  const supported = await isMessagingSupported();
  return supported && 'serviceWorker' in navigator && 'PushManager' in window;
};

/* ---------------------------
   STATUS
---------------------------- */
export const getPushStatus = async () => {
  const deviceId = getDeviceId();
  try {
    const res = await api.get('/api/push/status', {
      params: { deviceId }
    });
    return res.data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'Push status check failed'));
  }
};

/* ---------------------------
   SUBSCRIBE PUSH (FIXED)
---------------------------- */
export const subscribePush = async () => {
  const supported = await isPushSupported();
  if (!supported) {
    throw new Error('Push not supported');
  }

  // 1. Permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const deviceId = getDeviceId();

  // 2. Register Service Worker (IMPORTANT FIX)
  await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const registration = await navigator.serviceWorker.ready;

  // 3. Firebase messaging instance
  const messaging = await getMessagingInstance();
  if (!messaging) {
    throw new Error('Messaging not available');
  }

  // 4. Get VAPID key
  const configRes = await api.get('/api/push/config');
  const vapidKey =
    configRes.data?.vapidKey ||
    import.meta.env.VITE_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    throw new Error('Missing FCM VAPID key');
  }

  console.log('Using VAPID key:', vapidKey);

  // 5. Get FCM token (FIXED FLOW)
  let fcmToken;
  try {
    fcmToken = await firebaseGetToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration
    });
  } catch (err) {
    throw new Error(
      `FCM getToken failed: ${err?.message || err?.code || err}`
    );
  }

  if (!fcmToken) {
    throw new Error('Failed to generate FCM token');
  }

  // 6. Send to backend
  try {
    const res = await api.post('/api/push/subscribe', {
      fcmToken,
      deviceId,
      platform: 'web'
    });

    return {
      enabled: true,
      token: fcmToken,
      message: res.data?.message || 'Subscribed',
      subscriptionId: res.data?.subscriptionId
    };
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'Push subscribe failed'));
  }
};

/* ---------------------------
   GET CURRENT TOKEN (NEW)
---------------------------- */
export const getCurrentBrowserToken = async () => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;
    
    // Register SW first to ensure registration is available
    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const registration = await navigator.serviceWorker.ready;

    const configRes = await api.get('/api/push/config');
    const vapidKey = configRes.data?.vapidKey || import.meta.env.VITE_FIREBASE_VAPID_KEY;
    
    return await firebaseGetToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration
    });
  } catch (err) {
    console.warn('Failed to get current FCM token:', err);
    return null;
  }
};

/* ---------------------------
   UNSUBSCRIBE
---------------------------- */
export const unsubscribePush = async () => {
  const deviceId = getDeviceId();

  const messaging = await getMessagingInstance();
  if (messaging) {
    try {
      await deleteToken(messaging);
    } catch (err) {
      console.warn('deleteToken failed:', err);
    }
  }

  try {
    const res = await api.post('/api/push/unsubscribe', { deviceId });
    return {
      enabled: false,
      message: res.data?.message || 'Unsubscribed'
    };
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'Push unsubscribe failed'));
  }
};

/* ---------------------------
   TEST PUSH
---------------------------- */
export const sendTestPush = async () => {
  // Smart Test: Check if we are actually subscribed first
  const status = await getPushStatus();
  if (!status.enabled) {
    console.log('[PushClient] Auto-subscribing before test...');
    await subscribePush();
  }

  try {
    const res = await api.post('/api/push/test', {
      title: 'Test Notification',
      body: 'Push is working ✅'
    });
    return res.data;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'Test push failed'));
  }
};
