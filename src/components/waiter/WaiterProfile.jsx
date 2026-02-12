import React from 'react';

const WaiterProfile = ({ profile }) => (
  <div className="card glass-card">
    <h5 className="mb-3">My Profile</h5>
    <div className="small">Name: {profile?.name}</div>
    <div className="small">Email: {profile?.email}</div>
    <div className="small">Role: {profile?.role}</div>
    <div className="small">Date of Joining: {profile?.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString() : 'N/A'}</div>
    <div className="small">Salary: {profile?.salary ?? 'N/A'}</div>
    <div className="small">Shift: {profile?.shiftStart || '--'} - {profile?.shiftEnd || '--'}</div>
  </div>
);

export default WaiterProfile;
