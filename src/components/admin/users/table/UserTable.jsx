import React from 'react';
import { Users } from 'lucide-react';
import UserRow from './UserRow.jsx';

const COL_HEADERS = ['S.N.', 'User', 'Role', 'Position', 'Phone', 'Status', ''];

const UserTableEmpty = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
    <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
      <Users size={28} className="text-slate-400" />
    </div>
    <p className="text-sm font-bold text-slate-500">No users found</p>
    <p className="text-xs font-semibold text-slate-400">Try adjusting your search or invite a new staff member.</p>
  </div>
);

const UserTableHead = () => (
  <div className="grid grid-cols-[40px_1fr_120px_110px_140px_160px_48px] items-center gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl">
    {COL_HEADERS.map((h, i) => (
      <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</span>
    ))}
  </div>
);

const UserTable = ({ users, roles, onEdit, onLoadPromotions, onSetStatus, onAssignRole, onDelete, canEdit }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mx-6 my-5 relative">
    <UserTableHead />
    {users.length === 0
      ? <UserTableEmpty />
      : users.map((u, idx) => (
          <UserRow
            key={u._id}
            index={idx + 1}
            user={u}
            roles={roles}
            onEdit={onEdit}
            onLoadPromotions={onLoadPromotions}
            onSetStatus={onSetStatus}
            onAssignRole={onAssignRole}
            onDelete={onDelete}
            canEdit={canEdit}
          />
        ))
    }
  </div>
);

export default UserTable;
