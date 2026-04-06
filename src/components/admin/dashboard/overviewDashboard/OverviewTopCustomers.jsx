import React from 'react';
import { UserRound } from 'lucide-react';

const OverviewTopCustomers = ({ items = [] }) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">
        <span className="panel-icon purple"><UserRound size={18} /></span>
        Top Customers
      </div>
      <button className="panel-link">View All</button>
    </div>
    <div className="panel-sub">Customers By Spend.</div>
    {items.length === 0 ? (
      <div className="empty-illustration">No Customer Orders Yet!</div>
    ) : (
      <div className="list-stack">
        {items.map((row) => (
          <div key={row._id || row.name} className="list-row">
            <span>{row._id || row.name || 'Customer'}</span>
            <span className="fw-600">Rs {row.total || 0}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OverviewTopCustomers;
