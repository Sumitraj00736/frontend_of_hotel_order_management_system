import React from 'react';

const Stat = ({ label, value, sub, accent = 'primary' }) => (
  <div className={`stat-tile accent-${accent}`}>
    <div className="text-muted tiny-text">{label}</div>
    <div className="fs-4 fw-semibold">{value}</div>
    {sub && <div className="text-muted tiny-text">{sub}</div>}
  </div>
);

const Bar = ({ label, value, max }) => (
  <div className="d-flex flex-column gap-1">
    <div className="d-flex justify-content-between tiny-text">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${max === 0 ? 0 : Math.min(100, (value / max) * 100)}%` }} />
    </div>
  </div>
);

const Pill = ({ label, value, tone }) => (
  <div className={`pill pill-${tone || 'neutral'}`}>
    <span className="tiny-text text-uppercase">{label}</span>
    <strong>{value}</strong>
  </div>
);

const AdminOverview = ({ report, overview }) => {
  const topWaiter = overview?.topWaiter;
  const topKitchen = overview?.topKitchen;
  const activeCount = overview?.activeOrders || 0;
  const unpaidCount = overview?.unpaidOrders || 0;
  const totalOrders = report?.totalOrders || 0;
  const totalSales = report?.totalSales || 0;
  const avgOrder = totalOrders ? (totalSales / totalOrders).toFixed(2) : '0.00';
  const activeWaiters = overview?.activeByWaiter || [];
  const kitchenLoads = overview?.kitchenLoads || [];
  const statusCounts = overview?.statusCounts || {};
  const paidCount = statusCounts.paid || 0;
  const pending = statusCounts.pending || 0;
  const preparing = statusCounts.preparing || 0;
  const ready = statusCounts.ready || 0;
  const served = statusCounts.served || 0;

  const maxTables = Math.max(1, ...(overview?.activeByWaiter || []).map((w) => w.tables.length));
  const maxKitchen = Math.max(1, ...kitchenLoads.map((k) => k.orders));

  return (
    <div className="card glass-card full-width-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-0">Overview</h5>
          <small className="text-muted">Live snapshot of floor + kitchen</small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Pill label="Active" value={activeCount} tone="blue" />
          <Pill label="Unpaid" value={unpaidCount} tone="amber" />
          <Pill label="Paid" value={paidCount} tone="green" />
        </div>
      </div>

      <div className="overview-grid horizontal">
        <Stat label="Total Orders" value={totalOrders} sub="All time" accent="blue" />
        <Stat label="Total Sales" value={`NPR ${totalSales.toFixed(2)}`} sub="All time" accent="green" />
        <Stat label="Average Order" value={`NPR ${avgOrder}`} sub="Sales / Orders" accent="purple" />
        <Stat label="Preparing" value={preparing} sub="Kitchen in progress" accent="orange" />
        <Stat label="Ready/Served" value={`${ready}/${served}`} sub="Ready / Served" accent="teal" />
      </div>

      <div className="load-row">
        <div className="soft-card load-card">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Waiter Load</h6>
            {topWaiter && <span className="pill">Top: {topWaiter.waiter}</span>}
          </div>
          {activeWaiters.length === 0 && <div className="text-muted small">No active orders.</div>}
          <div className="d-flex flex-column gap-2">
            {activeWaiters.map((entry) => (
              <Bar key={entry.waiter} label={entry.waiter} value={entry.tables.length} max={maxTables} />
            ))}
          </div>
        </div>

        <div className="soft-card load-card">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Kitchen Load</h6>
            {topKitchen && <span className="pill">Top: {topKitchen.name}</span>}
          </div>
          {kitchenLoads.length === 0 && <div className="text-muted small">No active kitchen assignments.</div>}
          <div className="d-flex flex-column gap-2">
            {kitchenLoads.map((k) => (
              <Bar key={k.name} label={k.name} value={k.orders} max={maxKitchen} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
