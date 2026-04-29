import React from 'react';

function fmt(n) { return `Rs ${Number(n || 0).toLocaleString()}`; }

const FinanceSalesSummary = ({ totalSales, loading }) => {
  return (
    <div className="fd-summary-card glass-card">
      <div className="fd-card-head">
        <div>
          <div className="fd-card-title">Sales Collection</div>
          <div className="fd-card-sub">Settlement breakdown</div>
        </div>
      </div>
      
      <div className="summary-main">
        <div className="total-label">Total Volume</div>
        <div className="total-value">
          {loading ? '—' : fmt(totalSales)}
        </div>
      </div>
      
      <div className="fd-summary-rows">
        <div className="fd-summary-row">
          <div className="row-label">
            <span className="fd-dot bg-success" /> Paid Invoices
          </div>
          <div className="row-value">{loading ? '—' : fmt(totalSales)}</div>
        </div>
        <div className="fd-summary-row">
          <div className="row-label">
            <span className="fd-dot bg-danger" /> Outstanding
          </div>
          <div className="row-value">Rs 0</div>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: '100%', background: '#16a34a' }} />
      </div>
      <div className="text-center mt-2 small text-muted">100% Collected</div>
    </div>
  );
};

export default FinanceSalesSummary;
