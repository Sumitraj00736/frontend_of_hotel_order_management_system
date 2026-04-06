import React from 'react';

const LiveOrderStatusPanel = ({ overview, data }) => {
  const completed = (data?.liveStatus?.completed ?? overview?.completedOrders) || 0;
  const pending = (data?.liveStatus?.pending ?? overview?.pendingOrders) || 0;
  const cancelled = (data?.liveStatus?.cancelled ?? overview?.cancelledOrders) || 0;
  const total = completed + pending + cancelled;

  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="panel-title">Live Order Status</div>
        <div className="panel-sub">Here is a live overview of your orders status.</div>
      </div>
      <div className="live-order-status">
        <div className="live-order-donut">
          <div className="live-order-count">{total || 0}</div>
          <div className="live-order-label">Orders</div>
        </div>
        <div className="summary-body">
          <div className="summary-row"><span className="dot green" /> Completed Order <span className="fw-600">{completed}</span></div>
          <div className="summary-row"><span className="dot amber" /> Pending Order <span className="fw-600">{pending}</span></div>
          <div className="summary-row"><span className="dot red" /> Cancelled Order <span className="fw-600">{cancelled}</span></div>
        </div>
      </div>
    </div>
  );
};

export default LiveOrderStatusPanel;
