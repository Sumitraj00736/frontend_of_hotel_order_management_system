import React from 'react';
import { UserRound, Download } from 'lucide-react';

const OverviewTopCustomers = ({ items = [] }) => {
  const topTotal = items[0]?.total || 0;
  const topFour = items.slice(0, 4);

  return (
    <div className="panel panel-customers">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <span className="panel-icon sand"><UserRound size={18} /></span>
            Top Customers
          </div>
          <div className="panel-sub">Customers by spend</div>
        </div>
        <button className="panel-link">View All</button>
      </div>
      {items.length === 0 ? (
        <div className="empty-illustration">No customer orders yet.</div>
      ) : (
        <div className="customer-panel-body">
          <div className="customer-chart-wrap">
            <div className="customer-donut">
              <div className="customer-donut-core">
                <span>Top</span>
                <strong>{items.length}</strong>
              </div>
            </div>
            <div className="customer-legend">
              {topFour.map((row, idx) => (
                <div key={row._id || row.name || idx} className="legend-row">
                  <span className={`dot legend-${idx + 1}`} />
                  <span>{row._id || row.name || 'Customer'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="customer-highlight">
            <div className="customer-highlight-label">Top Customer</div>
            <div className="customer-highlight-card">
              <span>{items[0]?._id || items[0]?.name || 'Customer'}</span>
              <strong>Rs {Number(topTotal || 0).toLocaleString()}</strong>
            </div>
            <button className="chip chip-export"><Download size={14} /> Export Customer Data</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTopCustomers;
