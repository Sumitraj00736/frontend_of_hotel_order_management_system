import React from 'react';
import NotificationItem from './NotificationItem.jsx';

const formatDayLabel = (date) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate  = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfDate) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const NotificationGroup = ({ day, items, tab }) => {
  const label = formatDayLabel(items[0]?.date || new Date(day));
  return (
    <div className="flex flex-col">
      {/* Day label */}
      <div className="flex items-center gap-3 px-5 py-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] font-bold text-slate-300">{items.length}</span>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mx-5 overflow-hidden">
        {items.map((n, idx) => (
          <NotificationItem key={idx} notification={n} tab={tab} />
        ))}
      </div>
    </div>
  );
};

export default NotificationGroup;
