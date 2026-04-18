import React from 'react';

const NotificationToasts = ({ notifications = [] }) => {
  const items = notifications.filter((note) => note.toast);
  return (
    <div className="toast-stack">
      {items.slice(0, 3).map((note) => (
        <div 
          key={note._id || note.id} 
          className={`toast-card ${note.onClick ? 'pointer' : ''}`}
          onClick={() => note.onClick?.()}
        >
          <div className="toast-title">{note.title || 'Notice'}</div>
          <div className="toast-body">{note.message || note.body || ''}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToasts;
