import React from 'react';
import { formatMoney } from '../shared/formatMoney.js';

const items = [
  { key: 'sales', label: 'Sales', color: '#7c3aed' },
  { key: 'purchase', label: 'Purchase', color: '#ea580c' },
  { key: 'income', label: 'Income', color: '#16a34a' },
  { key: 'expenses', label: 'Expenses', color: '#dc2626' },
  { key: 'paymentIn', label: 'Payment In', color: '#0d9488' },
  { key: 'paymentOut', label: 'Payment Out', color: '#9333ea' }
];

export default function TransactionKpiCards({ kpis }) {
  if (!kpis) return null;
  return (
    <div className="finance-kpi-grid">
      {items.map(({ key, label, color }) => (
        <div key={key} className="finance-kpi-card" style={{ borderLeft: `3px solid ${color}` }}>
          <div className="label">{label}</div>
          <div className="value">{formatMoney(kpis[key] ?? 0)}</div>
        </div>
      ))}
    </div>
  );
}
