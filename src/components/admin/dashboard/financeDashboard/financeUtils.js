export const formatCurrency = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export const formatCompactCurrency = (value = 0) =>
  `Rs ${Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(Number(value || 0))}`;

export const formatPercent = (value = 0) => `${Math.round(Number(value || 0))}%`;

export const parseAmount = (value) => Number(value || 0);
