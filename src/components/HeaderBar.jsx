import React from 'react';
import { getCurrentUser, clearSession } from '../api/session.js';

const HeaderBar = ({ title, unreadCount, onToggleNotifications, onToggleSidebar }) => {
  const user = getCurrentUser();

  return (
    <div className="header-bar">
      <div>
        <h2 className="mb-0 d-flex align-items-center gap-2">
          {onToggleSidebar && (
            <button className="icon-button ghost" onClick={onToggleSidebar} aria-label="Toggle sidebar">
              ☰
            </button>
          )}
          {title}
        </h2>
        <small>{user?.name} ({user?.role})</small>
      </div>
      <div className="d-flex align-items-center gap-3">
        <button className="icon-button" onClick={onToggleNotifications}>
          <span className="bell-icon">NOTIFY</span>
          {unreadCount > 0 && <span className="badge bg-danger ms-1">{unreadCount}</span>}
        </button>
        <button
          className="btn btn-outline-light"
          onClick={() => {
            clearSession();
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
