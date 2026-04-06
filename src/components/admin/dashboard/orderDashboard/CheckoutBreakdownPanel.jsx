import React from 'react';
import { ReceiptIndianRupee } from 'lucide-react';

const CheckoutBreakdownPanel = () => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">
        <span className="panel-icon orange"><ReceiptIndianRupee size={18} /></span>
        Checkout Breakdown
      </div>
      <div className="panel-sub">Checkout breakdown of sales.</div>
    </div>
    <div className="empty-illustration">No data yet</div>
    <div className="breakdown">
      {[
        { label: 'Dish Discount', value: 0, color: '#4f46e5' },
        { label: 'General Discount', value: 0, color: '#6366f1' },
        { label: 'Loyalty Discount', value: 0, color: '#3b82f6' },
        { label: 'Service Charge', value: 0, color: '#93c5fd' }
      ].map((row) => (
        <div key={row.label} className="breakdown-row">
          <span className="dot" style={{ background: row.color }} />
          <span>{row.label}</span>
          <span className="fw-600">Rs {row.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CheckoutBreakdownPanel;
