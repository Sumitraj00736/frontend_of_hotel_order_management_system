/**
 * kitchen/header/KitchenHeader.jsx
 * Sticky top header for the kitchen dashboard.
 * Shows section title, live order stats, filter selector, and refresh.
 */
import React from 'react';
import { Menu, RefreshCw, Clock, Flame, CheckCircle2, ChefHat } from 'lucide-react';

const StatPill = ({ label, count, icon: Icon, colorClass }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12px] font-semibold ${colorClass}`}>
    <Icon size={13} strokeWidth={2.5} />
    <span>{count}</span>
    <span className="text-[11px] font-medium opacity-70 hidden sm:inline">{label}</span>
  </div>
);

const SECTION_LABELS = {
  orders:        'Kitchen Orders',
  notifications: 'Notifications',
  profile:       'My Profile',
};

const STATUS_OPTIONS = [
  { value: '',          label: 'All Orders' },
  { value: 'pending',   label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready',     label: 'Ready' },
  { value: 'served',    label: 'Served' },
];

const KitchenHeader = ({
  isMobile,
  onToggleSidebar,
  activeSection,
  orders = [],
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}) => {
  const pending   = orders.filter((o) => o.status === 'pending').length;
  const preparing = orders.filter((o) => o.status === 'preparing').length;
  const ready     = orders.filter((o) => o.status === 'ready').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-3 px-4 py-3">

        {/* Hamburger (mobile) */}
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow shadow-orange-200 shrink-0">
            <ChefHat size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[15px] font-extrabold text-slate-900 leading-none tracking-tight">
              {SECTION_LABELS[activeSection] || 'Kitchen'}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
              Live updates · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Live stats — only shown on orders section */}
        {activeSection === 'orders' && (
          <div className="hidden md:flex items-center gap-2">
            <StatPill
              label="Pending"
              count={pending}
              icon={Clock}
              colorClass="bg-slate-50 border-slate-200 text-slate-700"
            />
            <StatPill
              label="Preparing"
              count={preparing}
              icon={Flame}
              colorClass="bg-blue-50 border-blue-200 text-blue-700"
            />
            <StatPill
              label="Ready"
              count={ready}
              icon={CheckCircle2}
              colorClass="bg-emerald-50 border-emerald-200 text-emerald-700"
            />
          </div>
        )}

        {/* Status filter */}
        {activeSection === 'orders' && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="text-[12px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none hover:border-slate-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        {/* Refresh */}
        {activeSection === 'orders' && (
          <button
            onClick={onRefresh}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-all shrink-0"
            title="Refresh orders"
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>

      {/* Mobile stats row */}
      {activeSection === 'orders' && (
        <div className="md:hidden flex items-center gap-2 px-4 pb-3">
          <StatPill label="Pending"   count={pending}   icon={Clock}         colorClass="bg-slate-50 border-slate-200 text-slate-700" />
          <StatPill label="Preparing" count={preparing} icon={Flame}         colorClass="bg-blue-50 border-blue-200 text-blue-700" />
          <StatPill label="Ready"     count={ready}     icon={CheckCircle2}  colorClass="bg-emerald-50 border-emerald-200 text-emerald-700" />
        </div>
      )}
    </header>
  );
};

export default KitchenHeader;
