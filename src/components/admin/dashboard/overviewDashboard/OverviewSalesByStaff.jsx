import React from 'react';
import { Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OverviewSalesByStaff = ({ items = [] }) => {
  const topFive = items.slice(0, 5);
  const chartData = topFive.map((row) => ({
    name: (row.name || 'Staff').split(' ')[0],
    sales: Number(row.sales) || 0,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-500">
              <Users size={16} />
            </span>
            Sales by Staff
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-1">Top performing staff members</p>
        </div>
        <button className="text-xs font-bold text-orange-500 hover:underline">View All</button>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center justify-center bg-slate-50/60 rounded-xl border border-slate-100 py-10 text-xs font-semibold text-slate-400">
          No orders by staff yet.
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{ fontSize: 12, fontWeight: 700, borderRadius: 10, border: '1px solid #f1f5f9' }}
                />
                <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Staff List */}
          <div className="flex flex-col gap-1 mt-1">
            {topFive.map((row, index) => (
              <div key={row._id || row.name || index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{row.name || 'Staff'}</span>
                </div>
                <span className="text-xs font-black text-slate-800">Rs {(Number(row.sales) || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OverviewSalesByStaff;
