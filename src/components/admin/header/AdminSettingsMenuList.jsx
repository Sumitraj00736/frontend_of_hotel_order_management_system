import React from 'react';

const SETTINGS_GROUPS = [
  {
    title: 'General',
    items: [
      { id: 'restaurant-details', label: 'Restaurant Details' },
      { id: 'tax-rates', label: 'Tax & Rates' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'activity-log', label: 'Activity Log' },
      { id: 'department', label: 'Department' },
      { id: 'billing', label: 'Billing & Subscription' },
      { id: 'users-role', label: 'Users Role' },
      { id: 'trash', label: 'Trash' }
    ]
  },
  {
    title: 'Order',
    items: [
      { id: 'invoice-setting', label: 'Invoice Setting' },
      { id: 'kot-setting', label: 'KOT Setting' },
      { id: 'printer', label: 'Printer' }
    ]
  },
  {
    title: 'merorestro',
    items: [
      { id: 'support', label: 'Support & Feedback' },
      { id: 'release', label: 'Release Notes' }
    ]
  }
];

const AdminSettingsMenuList = ({ onSelect }) => (
  <div className="mobile-profile-settings-list">
    {SETTINGS_GROUPS.map((group) => (
      <div key={group.title} className="mobile-profile-settings-group">
        <div className="mobile-profile-settings-title">{group.title}</div>
        {group.items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="mobile-profile-settings-item"
            onClick={() => onSelect?.(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    ))}
  </div>
);

export default AdminSettingsMenuList;
