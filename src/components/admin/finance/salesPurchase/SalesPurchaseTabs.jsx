import React from 'react';

const TABS = [
  { id: 'sales-invoices', label: 'Sales Invoice' },
  { id: 'purchase-bills', label: 'Purchase Bills' },
  { id: 'sales-returns', label: 'Sales Returns' },
  { id: 'purchase-returns', label: 'Purchase Returns' }
];

export default function SalesPurchaseTabs({ active, onChange }) {
  return (
    <div className="finance-tabs" role="tablist">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          className={active === t.id ? 'active' : ''}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
