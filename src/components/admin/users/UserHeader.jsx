import React from 'react';
import { Search, Plus } from 'lucide-react';

const UserHeader = ({ search, onSearch, onInvite }) => {
  return (
    <div className="users-header">
      <div>
        <div className="users-title">Staff</div>
        <div className="users-subtitle">Manage staff accounts</div>
      </div>
      <div className="users-actions">
        <div className="users-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search"
          />
        </div>
        <button className="btn btn-primary users-invite" onClick={onInvite}>
          <Plus size={16} />
          Invite Staff
        </button>
      </div>
    </div>
  );
};

export default UserHeader;
