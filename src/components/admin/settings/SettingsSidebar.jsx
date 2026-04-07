import React from 'react';
import { hasPermission } from '../../../api/session.js';

const navSections = [
  {
    title: 'General Setting',
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
    title: 'Order Setting',
    items: [
      { id: 'invoice-setting', label: 'Invoice Setting' },
      { id: 'kot-setting', label: 'KOT Setting' },
      { id: 'printer', label: 'Printer' }
    ]
  },
  {
    title: 'RestroX',
    items: [
      { id: 'support', label: 'Support & Feedback' },
      { id: 'release', label: 'Release Notes' }
    ]
  }
];

const SettingsSidebar = ({ active, onSelect, onBack }) => (
  <div className="settings-sidebar">
    <button className="settings-back" onClick={onBack}>
      <span className="back-arrow">&lt;</span> Back to business
    </button>
    {navSections.map((section) => (
      <div key={section.title} className="settings-nav-section">
        <div className="settings-nav-title">{section.title}</div>
        <div className="settings-nav-items">
          {section.items
            .filter((item) => hasPermission('settings:view'))
            .map((item) => (
            <button
              key={item.id}
              className={`settings-nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => onSelect?.(item.id)}
            >
              <span className="dot" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default SettingsSidebar;
