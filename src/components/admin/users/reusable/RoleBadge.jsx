import React from 'react';

const roleBadgeConfig = {
  admin:   'bg-violet-50 text-violet-700 border-violet-200',
  waiter:  'bg-blue-50 text-blue-700 border-blue-200',
  kitchen: 'bg-orange-50 text-orange-700 border-orange-200',
  manager: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const RoleBadge = ({ role = '' }) => {
  const config = roleBadgeConfig[role] || 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-bold capitalize ${config}`}>
      {role || 'No role'}
    </span>
  );
};

export default RoleBadge;
