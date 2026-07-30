import React from 'react';

const statusConfig = {
  active: {
    dot:  'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    label: 'Active',
  },
  pending: {
    dot:  'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 border-amber-100',
    label: 'Pending',
  },
  inactive: {
    dot:  'bg-rose-500',
    pill: 'bg-rose-50 text-rose-700 border-rose-100',
    label: 'Inactive',
  },
};

const UserStatusBadge = ({ status = 'active' }) => {
  const cfg = statusConfig[status] || statusConfig.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wide ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default UserStatusBadge;
