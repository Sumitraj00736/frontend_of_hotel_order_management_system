import React, { useEffect, useState } from 'react';
import { getPushStatus, isPushSupported, subscribePush, unsubscribePush, sendTestPush } from '../../../../utils/pushClient.js';

const NotificationSettings = ({ value, onSave }) => {
  const [sound, setSound] = useState(value?.newOrderSound || 'default');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [testStatus, setTestStatus] = useState('');
  const [pushError, setPushError] = useState('');

  useEffect(() => {
    if (!value) return;
    setSound(value.newOrderSound || 'default');
  }, [value]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const supported = await isPushSupported();
      if (!mounted) return;
      setPushSupported(Boolean(supported));
      if (!supported) return;
      try {
        const status = await getPushStatus();
        if (!mounted) return;
        if (status?.exists) {
          setPushEnabled(Boolean(status?.enabled));
          return;
        }
        if (Notification.permission !== 'denied') {
          await subscribePush();
          if (mounted) {
            setPushEnabled(true);
            setPushError('');
          }
        }
      } catch (err) {
        if (mounted) {
          setPushEnabled(false);
          setPushError(err?.message || 'Push setup failed');
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="settings-page">
      <div className="settings-title">Notification</div>
      <div className="settings-card">
        <div className="notification-settings">
          <div>
            <div className="settings-card-title">New Order</div>
            <p className="settings-hint">
              This will cover all order notification from Delivery Menu, Order from staff, Order via customer through QR code.
            </p>
          </div>
          <div>
            <label className="field-label">Sound *</label>
            <select
              className="field-input"
              value={sound}
              onChange={(e) => {
                setSound(e.target.value);
                onSave?.({ newOrderSound: e.target.value });
              }}
            >
              <option value="default">Default Ringtone System</option>
              <option value="bell">Bell</option>
              <option value="ding">Ding</option>
            </select>
          </div>
        </div>
        <div className="notification-push-row">
          <div>
            <div className="settings-card-title">Push Notifications</div>
            <p className="settings-hint">
              Enable push notifications for this device only. Other devices remain unchanged.
            </p>
          </div>
          <div className={`push-toggle ${pushEnabled ? 'on' : 'off'} ${!pushSupported ? 'disabled' : ''}`}>
            <span>{pushEnabled ? 'On' : 'Off'}</span>
            <label className="switch-lite">
              <input
                type="checkbox"
                checked={pushEnabled}
                disabled={!pushSupported || pushLoading}
                onChange={async () => {
                  if (pushLoading || !pushSupported) return;
                  setPushLoading(true);
                    try {
                      if (pushEnabled) {
                        await unsubscribePush();
                        setPushEnabled(false);
                        setPushError('');
                      } else {
                        await subscribePush();
                        setPushEnabled(true);
                        setPushError('');
                      }
                    } finally {
                      setPushLoading(false);
                    }
                  }}
              />
              <span />
            </label>
            <button
              type="button"
              className="chip"
              disabled={!pushEnabled || pushLoading}
              onClick={async () => {
                setTestStatus('');
                try {
                  await sendTestPush();
                  setTestStatus('Test sent');
                } catch (err) {
                  setTestStatus('Test failed');
                }
              }}
            >
              Test Push
            </button>
          </div>
        </div>
        {testStatus && <div className="settings-hint">{testStatus}</div>}
        {pushError && <div className="settings-hint" style={{ color: '#dc2626' }}>{pushError}</div>}
      </div>
    </div>
  );
};

export default NotificationSettings;
