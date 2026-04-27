import React from 'react';
import UserSelfProfile from '../../profile/UserSelfProfile.jsx';

const WaiterProfile = ({ profile, onLogout, onSave, saving }) => (
  <div className="analytics-card-container w-100 h-100">
    <UserSelfProfile profile={profile} onLogout={onLogout} onSave={onSave} saving={saving} />
  </div>
);

export default WaiterProfile;
