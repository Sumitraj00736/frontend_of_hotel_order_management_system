import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2, ShieldCheck } from 'lucide-react';

const UserRow = ({ index, user, roles, onEdit, onSetStatus, onDelete, canEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  return (
    <div className="users-row">
      <span data-label="S.N.">{index}</span>
      <div className="user-info d-flex align-items-center">
        <div className="user-avatar">{user.name?.[0].toUpperCase()}</div>
        <div>
          <div className="fw-bold">{user.name}</div>
          <div className="text-muted small">{user.email}</div>
        </div>
      </div>
      <span data-label="Role">
        <span className={`badge-role ${user.role}`} style={{ color: '#fc8019' }}>
          {user.role}
        </span>
      </span>
      <span data-label="Position">{user.role === 'admin' ? 'Owner' : 'Staff'}</span>
      <span data-label="Phone">{user.phone || 'N/A'}</span>
      <span data-label="Status">
        <span className={`status-dot ${user.status || 'active'}`} />
        {user.status || 'active'}
      </span>
      
      <div className="users-actions-cell">
        <button className="btn btn-light btn-sm" onClick={() => setShowMenu(!showMenu)}>
          <MoreHorizontal size={18} />
        </button>
        {showMenu && (
          <div className="users-dropdown-menu" ref={menuRef}>
            <button onClick={() => onEdit(user)}><Pencil size={14} /> Edit Staff</button>
            {!user.isOwner && (
               <button className="text-danger" onClick={() => onDelete(user)}>
                 <Trash2 size={14} /> Remove
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRow;