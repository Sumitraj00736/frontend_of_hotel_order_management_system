import React from 'react';

const DueBadge = ({ amount = 0 }) => {
  const hasDue = Number(amount) > 0;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border
      ${hasDue
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }`}>
      Rs {Number(amount).toLocaleString('en-IN')}
    </span>
  );
};

export default DueBadge;
