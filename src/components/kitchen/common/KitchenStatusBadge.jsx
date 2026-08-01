/**
 * kitchen/common/KitchenStatusBadge.jsx
 * Reusable status chip for kitchen orders.
 */
import React from 'react';

const STATUS_STYLES = {
  pending:   'bg-orange-50  text-orange-500 border-orange-200',
  preparing: 'bg-blue-50    text-blue-700   border-blue-200',
  ready:     'bg-amber-50   text-amber-700  border-amber-200',
  served:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  paid:      'bg-orange-100 text-orange-700 border-orange-300',
};

const STATUS_DOTS = {
  pending:   'bg-orange-400 animate-pulse',
  preparing: 'bg-blue-500   animate-pulse',
  ready:     'bg-amber-500  animate-pulse',
  served:    'bg-emerald-500',
  paid:      'bg-orange-500',
};

const KitchenStatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const dot   = STATUS_DOTS[status]   || STATUS_DOTS.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border capitalize ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {status || 'pending'}
    </span>
  );
};

export default KitchenStatusBadge;
