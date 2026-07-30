import React from 'react';
import { Search, Plus, MoreHorizontal, Users } from 'lucide-react';

/* ── Sub-components ─────────────────────────────────────────── */

const CustomerHeaderTitle = () => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
      <Users size={20} className="text-orange-500" />
    </div>
    <div>
      <h2 className="text-base font-black text-slate-800 leading-tight">Customers</h2>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage customer accounts and balances</p>
    </div>
  </div>
);

const CustomerSearch = ({ search, onSearch }) => (
  <div className="relative flex-1 max-w-xs">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      value={search}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search by name, email or phone…"
      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all"
    />
  </div>
);

const CustomerAddButton = ({ onAdd }) => (
  <button
    onClick={onAdd}
    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-sm shadow-orange-200 transition-all active:scale-95"
  >
    <Plus size={18} strokeWidth={2.5} />
    <span className="hidden sm:inline">Add New</span>
  </button>
);

const CustomerMenuButton = ({ onMenuToggle }) => (
  <button
    onClick={onMenuToggle}
    aria-label="More options"
    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
  >
    <MoreHorizontal size={18} />
  </button>
);

/* ── Composed CustomerHeader ────────────────────────────────── */

const CustomerHeader = ({ search, onSearch, onAdd, onMenuToggle }) => (
  <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
    <CustomerHeaderTitle />
    <div className="flex items-center gap-3 ml-auto">
      <CustomerSearch search={search} onSearch={onSearch} />
      <CustomerAddButton onAdd={onAdd} />
      <CustomerMenuButton onMenuToggle={onMenuToggle} />
    </div>
  </div>
);

export { CustomerHeaderTitle, CustomerSearch, CustomerAddButton, CustomerMenuButton };
export default CustomerHeader;
