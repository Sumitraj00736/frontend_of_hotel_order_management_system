import React from 'react';

const FinanceSalesSummary = ({ paid = 0, unpaid = 0 }) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">Sales Summary</div>
      <div className="panel-sub">Real-time sales tracking.</div>
    </div>
    <div className="summary-body">
      <div className="text-muted tiny-text mb-2">Total Sales</div>
      <div className="panel-value mb-3">Rs {paid + unpaid}</div>
      <div className="summary-row"><span className="dot blue" /> Paid <span className="fw-600">Rs {paid}</span></div>
      <div className="summary-row"><span className="dot red" /> Unpaid Sales <span className="fw-600">Rs {unpaid}</span></div>
    </div>
  </div>
);

export default FinanceSalesSummary;
