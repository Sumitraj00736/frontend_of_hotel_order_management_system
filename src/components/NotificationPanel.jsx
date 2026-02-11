import React from 'react';

const NotificationPanel = ({ notifications, onMarkAll }) => (
  <div className="notification-panel">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h6 className="mb-0">Notifications</h6>
      <button className="btn btn-sm btn-outline-light" onClick={onMarkAll}>Mark all read</button>
    </div>
    {notifications.length === 0 && <div className="text-muted">No notifications yet.</div>}
    <ul className="list-group">
      {notifications.map((note) => (
        <li key={note._id || note.id} className={`list-group-item ${note.read ? '' : 'fw-bold'}`}>
          <div>{note.message}</div>
          {note.createdAt && <small className="text-muted">{new Date(note.createdAt).toLocaleString()}</small>}
        </li>
      ))}
    </ul>
  </div>
);

export default NotificationPanel;
