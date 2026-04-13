const APP_NOTIFICATION_TAG = 'hotel-oms';

export const ensureNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    return false;
  }
};

export const pushSystemNotification = async ({ title, body, tag }) => {
  const ok = await ensureNotificationPermission();
  if (!ok) return;
  try {
    new Notification(title || 'Hotel OMS', {
      body: body || '',
      tag: `${APP_NOTIFICATION_TAG}:${tag || 'general'}`
    });
  } catch (error) {
    // Ignore browser notification errors.
  }
};
