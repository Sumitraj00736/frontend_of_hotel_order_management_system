import React from 'react';
import { Search, Plus, Users } from 'lucide-react';

/* ── UserSearch ─────────────────────────────────────────────── */
const UserSearch = ({ search, onSearch }) => (
  <div className="relative flex-1 max-w-xs">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      value={search}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search by name or email…"
      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all"
    />
  </div>
);

/* ── UserInviteButton ───────────────────────────────────────── */
const UserInviteButton = ({ onInvite }) => (
  <button
    onClick={onInvite}
    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-sm shadow-orange-200 transition-all active:scale-95"
  >
    <Plus size={18} strokeWidth={2.5} />
    <span className="hidden sm:inline">Invite Staff</span>
  </button>
);

/* ── UserHeaderTitle ────────────────────────────────────────── */
const UserHeaderTitle = () => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
      <Users size={20} className="text-orange-500" />
    </div>
    <div>
      <h2 className="text-base font-black text-slate-800 leading-tight">Staff Management</h2>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">Monitor and manage your team access</p>
    </div>
  </div>
);

/* ── UserHeader (composed) ──────────────────────────────────── */
const UserHeader = ({ search, onSearch, onInvite }) => (
  <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
    <UserHeaderTitle />
    <div className="flex items-center gap-3 ml-auto">
      <UserSearch search={search} onSearch={onSearch} />
      <UserInviteButton onInvite={onInvite} />
    </div>
  </div>
);

export { UserHeaderTitle, UserSearch, UserInviteButton };
export default UserHeader;
