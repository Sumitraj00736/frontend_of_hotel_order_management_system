import React from 'react';

const ReleaseNotes = () => (
  <div className="settings-page">
    <div className="settings-title">Release Notes</div>
    <div className="settings-card">
      <div className="settings-card-title">Latest updates</div>
      <ul className="release-list">
        <li>Phase 3 settings screens added.</li>
        <li>Role permissions are now enforced server side.</li>
        <li>Dashboard performance improvements shipped.</li>
      </ul>
    </div>
  </div>
);

export default ReleaseNotes;
