import React from 'react';
import { Search, Plus, Users } from 'lucide-react';

const UserHeader = ({ search, onSearch, onInvite }) => {
  return (
    <div className="users-header">
      <div className="d-flex align-items-center gap-3">
        <div className="icon-box" style={{ background: '#fff0e6', padding: '10px', borderRadius: '12px' }}>
          <Users color="#fc8019" size={24} />
        </div>
        <div>
          <h4 className="mb-0 fw-bold">Staff Management</h4>
          <p className="text-muted small mb-0">Monitor and manage your team access</p>
        </div>
      </div>
      
      <div className="d-flex gap-3 align-items-center flex-grow-1 justify-content-end">
        <div className="users-search">
          <Search size={18} className="search-icon" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name or email..."
          />
        </div>
        <button 
          className="btn text-white d-flex align-items-center gap-2 px-4 shadow-sm" 
          onClick={onInvite}
          style={{ background: '#fc8019', borderRadius: '12px', height: '48px', fontWeight: '600' }}
        >
          <Plus size={20} strokeWidth={3} />
          <span className="d-none d-md-inline">Invite Staff</span>
        </button>
      </div>
    </div>
  );
};

export default UserHeader;

