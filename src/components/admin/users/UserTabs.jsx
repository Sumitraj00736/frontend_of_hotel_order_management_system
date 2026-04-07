import React from 'react';

const UserTabs = ({ tab, counts, onChange }) => {
  return (
    <div className="users-tabs">
      {[
        { key: 'active', label: 'Active', count: counts.active },
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'inactive', label: 'Inactive', count: counts.inactive }
      ].map((t) => (
        <button
          key={t.key}
          className={`users-tab ${tab === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          <span className="users-count">{t.count}</span>
        </button>
      ))}
    </div>
  );
};

export default UserTabs;
