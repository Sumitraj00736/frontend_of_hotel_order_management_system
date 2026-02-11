import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession, getCurrentUser } from '../api/session.js';

const TopBar = ({ title }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 className="mb-0">{title}</h3>
        <small className="text-muted">{user?.name} ({user?.role})</small>
      </div>
      <button className="btn btn-outline-secondary" onClick={logout}>Logout</button>
    </div>
  );
};

export default TopBar;
