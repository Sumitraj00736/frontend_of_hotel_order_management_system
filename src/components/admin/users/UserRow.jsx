import React, { useEffect, useRef, useState } from 'react';
import {
  MoreHorizontal,
  Pencil,
  BadgePercent,
  UserPlus,
  CheckCircle2,
  Clock3,
  XCircle,
  Shield,
  ChefHat,
  UtensilsCrossed,
  Trash2
} from 'lucide-react';

const initials = (name = '') => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const UserRow = ({ index, user, roles = [], onEdit, onLoadPromotions, onSetStatus, onAssignRole, onDelete, canEdit }) => {
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
            {canEdit && (
              <button onClick={() => onEdit?.(user)}>
                <Pencil size={14} /> Edit
              </button>
            )}
            <button onClick={() => onLoadPromotions?.(user)}>
              <BadgePercent size={14} /> Promotions
            </button>
            {!user.isOwner && roles.length > 0 && <div className="users-menu-divider">Assign Role</div>}
            {!user.isOwner &&
              roles.map((role) => (
                <button
                  key={role.id || role._id || role.value || role.name}
                  onClick={() => {
                    onAssignRole?.(user._id, role);
                    setOpen(false);
                  }}
                >
                  {(role.value || role.name) === 'superadmin' && <Shield size={14} />}
                  {(role.value || role.name) === 'admin' && <UserPlus size={14} />}
                  {(role.value || role.name) === 'kitchen' && <ChefHat size={14} />}
                  {(role.value || role.name) === 'waiter' && <UtensilsCrossed size={14} />}
                  {role.label || role.name || role.value}
                </button>
              ))}
            {!user.isOwner && (
              <>
                <button onClick={() => onSetStatus?.(user._id, 'active')}>
                  <CheckCircle2 size={14} /> Mark Active
                </button>
                <button onClick={() => onSetStatus?.(user._id, 'pending')}>
                  <Clock3 size={14} /> Mark Pending
                </button>
                <button onClick={() => onSetStatus?.(user._id, 'inactive')}>
                  <XCircle size={14} /> Mark Inactive
                </button>
              </>
            )}
            {canEdit && !user.isOwner && (
              <button
                className="users-danger"
                onClick={() => {
                  onDelete?.(user);
                  setOpen(false);
                }}
              >
                <Trash2 size={14} /> Delete User
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRow;
