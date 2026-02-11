import React from 'react';

const AdminSidebar = ({ activeSection, onSelect }) => (
  <div className="sidebar">
    <h5 className="mb-3">Dashboard</h5>
    {['overview', 'orders', 'users', 'tables', 'menus', 'reports', 'history'].map((section) => (
      <button
        key={section}
        className={`sidebar-button ${activeSection === section ? 'active' : ''}`}
        onClick={() => onSelect(section)}
      >
        {section.toUpperCase()}
      </button>
    ))}
  </div>
);

export default AdminSidebar;
