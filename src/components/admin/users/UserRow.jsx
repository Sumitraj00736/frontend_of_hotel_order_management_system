import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const initials = (name = '') => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const UserRow = ({ index, user, onEdit, onLoadPromotions, onSetStatus }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="users-row">
      <span>{index}</span>
      <div className="users-cell user-info">
        <div className="user-avatar">{initials(user.name)}</div>
        <div>
          <div className="fw-600">{user.name}</div>
          <div className="users-handle">@{user.email?.split('@')[0] || 'user'}</div>
        </div>
      </div>
      <span className={`user-role role-${user.role}`}>{user.role}</span>
      <span>{user.role === 'admin' ? 'Owner' : user.role}</span>
      <span>{user.phone || '-'}</span>
      <span>{user.email || '-'}</span>
      <div className="users-actions-cell">
        <button className="icon-btn" onClick={() => setOpen((prev) => !prev)}>
          <MoreHorizontal size={16} />
        </button>
        {open && (
          <div className="users-menu" ref={menuRef}>
            <button onClick={() => onEdit?.(user)}>Edit</button>
            <button onClick={() => onLoadPromotions?.(user)}>Promotions</button>
            <button onClick={() => onSetStatus?.(user._id, 'active')}>Mark Active</button>
            <button onClick={() => onSetStatus?.(user._id, 'pending')}>Mark Pending</button>
            <button onClick={() => onSetStatus?.(user._id, 'inactive')}>Mark Inactive</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRow;
