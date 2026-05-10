import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, Pencil, Trash2, CheckCircle2, 
  Clock3, XCircle, UserCircle 
} from 'lucide-react';
import '../../../common/css/admin/users/userrow.css';

const UserRow = ({ index, user, roles, onEdit, onSetStatus, onDelete, canEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [showMenu]);

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="users-row">
      <span className="sn-cell" data-label="S.N.">{index}</span>
      
      <div className="user-info-cell">
        <div className="user-avatar-wrapper">
          {user.image ? (
            <img src={user.image} alt={user.name} className="user-avatar-img" />
          ) : (
            <div className="user-avatar-initials">{getInitials(user.name)}</div>
          )}
        </div>
        <div className="user-details">
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>

      <span className="role-cell" data-label="Role">
        <span className={`badge-role ${user.role}`}>
          {user.role}
        </span>
      </span>

      <span className="position-cell" data-label="Position">
        {user.role === 'admin' ? 'Owner' : 'Staff Member'}
      </span>

      <span className="phone-cell" data-label="Phone">{user.phone || '—'}</span>

      <span className="status-cell" data-label="Status">
        <div className={`status-pill ${user.status || 'active'}`}>
          <span className="status-dot" />
          {user.status || 'active'}
        </div>
      </span>
      
      <div className="users-actions-cell" ref={menuRef}>
        <button 
          className={`action-trigger-btn ${showMenu ? 'active' : ''}`} 
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreHorizontal size={20} />
        </button>

        {showMenu && (
          <div className="actions-dropdown-menu animate-scale-in">
            <div className="menu-section-label">Management</div>
            <button onClick={() => { onEdit(user); setShowMenu(false); }}>
              <Pencil size={16} /> Edit Profile
            </button>
            
            {canEdit && !user.isOwner && (
              <button className="users-danger" onClick={() => { onDelete(user); setShowMenu(false); }}>
                <Trash2 size={16} /> Remove Staff
              </button>
            )}

            <div className="dropdown-divider" />
            <div className="menu-section-label">Quick Status</div>
            
            {!user.isOwner && (
              <>
                <button onClick={() => { onSetStatus(user._id, 'active'); setShowMenu(false); }}>
                  <CheckCircle2 size={16} className="text-success" /> Mark Active
                </button>
                <button onClick={() => { onSetStatus(user._id, 'pending'); setShowMenu(false); }}>
                  <Clock3 size={16} className="text-warning" /> Mark Pending
                </button>
                <button onClick={() => { onSetStatus(user._id, 'inactive'); setShowMenu(false); }}>
                  <XCircle size={16} className="text-danger" /> Mark Inactive
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRow;