import React, { useEffect, useState } from 'react';

const NotificationSettings = ({ value, onSave }) => {
  const [sound, setSound] = useState(value?.newOrderSound || 'default');

  useEffect(() => {
    if (!value) return;
    setSound(value.newOrderSound || 'default');
  }, [value]);

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
      </div>
    </div>
  );
};

export default NotificationSettings;
