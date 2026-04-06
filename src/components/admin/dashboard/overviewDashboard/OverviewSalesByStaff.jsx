import React from 'react';
import { Users } from 'lucide-react';

const OverviewSalesByStaff = ({ items = [] }) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">
        <span className="panel-icon blue"><Users size={18} /></span>
        Sales By Staff
      </div>
      <button className="panel-link">View All</button>
    </div>
    <div className="panel-sub">Top Staffs</div>
    {items.length === 0 ? (
      <div className="empty-illustration">No Orders By Staffs Yet!</div>
    ) : (
      <div className="list-stack">
        {items.map((row) => (
          <div key={row._id} className="list-row">
            <span>{row.name || 'Staff'}</span>
            <span className="fw-600">Rs {row.sales || 0}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OverviewSalesByStaff;
