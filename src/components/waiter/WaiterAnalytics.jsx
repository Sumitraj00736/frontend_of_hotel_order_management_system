import React from 'react';

const WaiterAnalytics = ({ analytics }) => (
  <div className="card glass-card">
    <h5 className="mb-3">My Analytics</h5>
    <div className="small">Total Orders: {analytics?.summary?.totalOrders || 0}</div>
    <div className="small">Total Sales: NPR {analytics?.summary?.totalSales?.toFixed(2) || '0.00'}</div>
  </div>
);

export default WaiterAnalytics;
