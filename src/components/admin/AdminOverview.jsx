import React from 'react';

const AdminOverview = ({ report, overview }) => (
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
          <div className="fs-3">NPR {report.totalSales.toFixed(2)}</div>
        </div>
      </div>
    )}
    <div className="mt-4">
      <h6>Waiter Table Assignments</h6>
      {(!overview || overview.activeByWaiter?.length === 0) && (
        <div className="text-muted small">No active orders.</div>
      )}
      <ul className="small">
        {overview?.activeByWaiter?.map((entry) => (
          <li key={entry.waiter}>
            {entry.waiter}: {entry.tables.map((t) => `T${t.tableNumber} (${t.status})`).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default AdminOverview;
