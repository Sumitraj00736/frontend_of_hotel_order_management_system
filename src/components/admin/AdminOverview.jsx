import React from 'react';

const AdminOverview = ({ report }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Overview</h5>
    {report && (
      <div className="d-flex gap-4">
        <div>
          <div className="text-muted">Total Orders</div>
          <div className="fs-3">{report.totalOrders}</div>
        </div>
        <div>
          <div className="text-muted">Total Sales</div>
          <div className="fs-3">${report.totalSales.toFixed(2)}</div>
        </div>
      </div>
    )}
  </div>
);

export default AdminOverview;
