import React from 'react';

const TrashSettings = () => (
  <div className="settings-page">
    <div className="settings-title">Trash</div>
    <div className="settings-card">
      <div className="settings-card-title">Recycle Bin</div>
      <div className="settings-hint">No deleted items yet.</div>
      <button className="btn btn-ghost" disabled>Empty Trash</button>
    </div>
  </div>
);

export default TrashSettings;
