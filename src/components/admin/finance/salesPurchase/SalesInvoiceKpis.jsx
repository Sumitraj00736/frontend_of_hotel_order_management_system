import React from 'react';
import { formatMoney } from '../shared/formatMoney.js';

export default function SalesInvoiceKpis({ summary }) {
  if (!summary) return null;
  return (
    <div className="finance-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
      <div className="finance-kpi-card">
        <div className="label">Total Orders</div>
        <div className="value">{summary.totalOrders ?? 0}</div>
      </div>
      <div className="finance-kpi-card">
        <div className="label">Total Sales</div>
        <div className="value">{formatMoney(summary.totalSales)}</div>
      </div>
      <div className="finance-kpi-card">
        <div className="label">Leading Payment Mode</div>
        <div className="value" style={{ fontSize: '0.95rem' }}>
          {summary.leadingPaymentMode || '—'}
        </div>
      </div>
      <div className="finance-kpi-card">
        <div className="label">Most Used Order Type</div>
        <div className="value" style={{ fontSize: '0.95rem' }}>
          {summary.mostUsedOrderType || '—'}
        </div>
      </div>
    </div>
  );
}
