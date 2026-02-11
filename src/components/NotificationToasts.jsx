import React from 'react';

const NotificationToasts = ({ notifications }) => (
  <div className="toast-stack">
    {/* {notifications.slice(0, 3).map((note) => (
      <div key={note._id || note.id} className="toast-card">
        <div className="toast-title">New update</div>
        <div className="toast-body">{note.message}</div>
      </div>
    ))} */}
  </div>
);

export default NotificationToasts;
