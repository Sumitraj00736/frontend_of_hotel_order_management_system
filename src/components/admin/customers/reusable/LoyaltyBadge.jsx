import React from 'react';

const LoyaltyBadge = ({ discount = 0 }) => (
  <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
    {discount}%
  </span>
);

export default LoyaltyBadge;
