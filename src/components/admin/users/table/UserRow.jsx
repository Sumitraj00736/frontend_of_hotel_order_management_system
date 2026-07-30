import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import UserAvatar from '../reusable/UserAvatar.jsx';
import UserStatusBadge from '../reusable/UserStatusBadge.jsx';
import RoleBadge from '../reusable/RoleBadge.jsx';

const UserRow = ({ index, user, roles, onEdit, onSetStatus, onDelete, canEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  return (
    <div className="grid grid-cols-[40px_1fr_120px_110px_140px_160px_48px] items-center gap-4 px-5 py-3.5 border-b border-slate-50 hover:bg-orange-50/30 transition-colors group">

      {/* S.N. */}
      <span className="text-xs font-bold text-slate-400 text-center">{index}</span>

      {/* User info */}
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar name={user.name} image={user.image} size="md" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
          <p className="text-xs font-semibold text-slate-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Role */}
      <div><RoleBadge role={user.role} /></div>

      {/* Position */}
      <span className="text-xs font-semibold text-slate-600">
        {user.isOwner ? 'Owner' : user.role === 'admin' ? 'Admin' : 'Staff Member'}
      </span>

      {/* Phone */}
      <span className="text-xs font-semibold text-slate-600">{user.phone || '—'}</span>

      {/* Status */}
      <div><UserStatusBadge status={user.status || 'active'} /></div>

      {/* Actions */}
      <div className="relative flex justify-center" ref={menuRef}>
        <button
          onClick={() => setShowMenu((v) => !v)}
          className={`p-1.5 rounded-lg transition-all
            ${showMenu
              ? 'bg-orange-100 text-orange-600'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 opacity-0 group-hover:opacity-100'
            }`}
        >
          <MoreHorizontal size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 z-40 py-1.5 origin-top-right animate-[scale-in_0.1s_ease]">
            <p className="px-3 pt-1 pb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</p>

            <button
              onClick={() => { onEdit(user); setShowMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Pencil size={15} className="text-slate-400" /> Edit Profile
            </button>

            {canEdit && !user.isOwner && (
              <button
                onClick={() => { onDelete(user); setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 size={15} className="text-rose-400" /> Remove Staff
              </button>
            )}

            <div className="my-1 border-t border-slate-100" />
            <p className="px-3 pt-1 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Status</p>

            {!user.isOwner && (
              <>
                <button onClick={() => { onSetStatus(user._id, 'active'); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition-colors">
                  <CheckCircle2 size={15} className="text-emerald-500" /> Mark Active
                </button>
                <button onClick={() => { onSetStatus(user._id, 'pending'); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 transition-colors">
                  <Clock3 size={15} className="text-amber-500" /> Mark Pending
                </button>
                <button onClick={() => { onSetStatus(user._id, 'inactive'); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-rose-50 transition-colors">
                  <XCircle size={15} className="text-rose-500" /> Mark Inactive
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
