import React from 'react';
import { Bell, CheckCheck, FlaskConical, SlidersHorizontal } from 'lucide-react';
import PushToggle from '../reusable/PushToggle.jsx';

/* ── Sub-components ─────────────────────────────────────────── */

const NotificationHeaderTitle = () => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
      <Bell size={20} className="text-orange-500" />
    </div>
    <div>
      <h2 className="text-base font-black text-slate-800 leading-tight">Notifications</h2>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">Stay updated on all activity</p>
    </div>
  </div>
);

const MarkAllReadButton = ({ onMarkAll }) => (
  <button
    onClick={onMarkAll}
    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
  >
    <CheckCheck size={14} className="text-emerald-500" />
    Mark all read
  </button>
);

const TestPushButton = ({ onTest }) => (
  <button
    onClick={onTest}
    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
  >
    <FlaskConical size={14} className="text-blue-400" />
    Test Push
  </button>
);

const FilterToggleButton = ({ filterOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all
      ${filterOpen
        ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200'
        : 'text-slate-600 bg-white border-slate-200 hover:border-orange-400 hover:text-orange-500'
      }`}
  >
    <SlidersHorizontal size={14} />
    Filter
  </button>
);

/* ── Composed NotificationHeader ────────────────────────────── */
const NotificationHeader = ({
  tab,
  filterOpen,
  onFilterToggle,
  onMarkAll,
  pushSupported,
  pushEnabled,
  pushLoading,
  onPushToggle,
  onTestPush,
}) => (
  <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center gap-3 flex-wrap">
    <NotificationHeaderTitle />
    <div className="flex items-center gap-2 ml-auto flex-wrap">
      <PushToggle
        supported={pushSupported}
        enabled={pushEnabled}
        loading={pushLoading}
        onToggle={onPushToggle}
      />
      {pushSupported && pushEnabled && <TestPushButton onTest={onTestPush} />}
      {tab === 'activity' && (
        <FilterToggleButton filterOpen={filterOpen} onToggle={onFilterToggle} />
      )}
      <MarkAllReadButton onMarkAll={onMarkAll} />
    </div>
  </div>
);

export {
  NotificationHeaderTitle,
  MarkAllReadButton,
  TestPushButton,
  FilterToggleButton,
};
export default NotificationHeader;
