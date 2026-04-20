import React from 'react';
import { Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OverviewSalesByStaff = ({ items = [] }) => {
  const maxSales = Math.max(...items.map((row) => Number(row.sales) || 0), 1);
  const topFive = items.slice(0, 5);

  const chartData = topFive.map((row) => ({
    name: (row.name || 'Staff').split(' ')[0],
    sales: Number(row.sales) || 0,
  }));

  return (
    <div className="panel panel-staff">
      <div className="panel-heading">
        <div>
          <div className="panel-title">
            <span className="panel-icon orange"><Users size={18} /></span>
            Sales by Staff
          </div>
          <div className="panel-sub">Top staffs</div>
        </div>
        <button className="panel-link">View All</button>
      </div>
      {items.length === 0 ? (
        <div className="empty-illustration">No orders by staff yet.</div>
      ) : (
        <div className="staff-panel-body">
          <div className="staff-chart" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="list-stack compact">
            {topFive.map((row, index) => (
              <div key={row._id || row.name || index} className="list-row list-row-strong">
                <span>{row.name || 'Staff'}</span>
                <span className="fw-600">Rs {(Number(row.sales) || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewSalesByStaff;
