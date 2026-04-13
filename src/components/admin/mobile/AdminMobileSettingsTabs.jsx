import React from 'react';

const MOBILE_SETTINGS_VIEWS = [
  { id: 'restaurant-details', label: 'Restaurant' },
  { id: 'tax-rates', label: 'Tax' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'activity-log', label: 'Activity' },
  { id: 'department', label: 'Department' },
  { id: 'billing', label: 'Billing' },
  { id: 'users-role', label: 'Roles' },
  { id: 'trash', label: 'Trash' },
  { id: 'invoice-setting', label: 'Invoice' },
  { id: 'kot-setting', label: 'KOT' },
  { id: 'printer', label: 'Printer' },
  { id: 'support', label: 'Support' },
  { id: 'release', label: 'Release' }
];

const AdminMobileSettingsTabs = ({ isMobile = false, activeView = 'restaurant-details', onSelect }) => {
  if (!isMobile) return null;

  return (
    <div className="mobile-settings-tabs">
      {MOBILE_SETTINGS_VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          className={`mobile-settings-tab ${activeView === view.id ? 'active' : ''}`}
          onClick={() => onSelect?.(view.id)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default AdminMobileSettingsTabs;
