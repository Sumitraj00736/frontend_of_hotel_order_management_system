import React from 'react';
import { UserRound, Download } from 'lucide-react';

const dotColors = ['bg-orange-400', 'bg-amber-400', 'bg-emerald-400', 'bg-blue-400'];

const OverviewTopCustomers = ({ items = [] }) => {
  const topFour = items.slice(0, 4);
  const topTotal = items[0]?.total || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-500">
              <UserRound size={16} />
            </span>
            Top Customers
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-1">Customers by spend</p>
        </div>
        <button className="text-xs font-bold text-orange-500 hover:underline">View All</button>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center justify-center bg-slate-50/60 rounded-xl border border-slate-100 py-10 text-xs font-semibold text-slate-400">
          No customer orders yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Donut + Legend */}
          <div className="flex items-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                {topFour.map((row, idx) => {
                  const pct = 100 / topFour.length;
                  const colors = ['#fb923c', '#fbbf24', '#34d399', '#60a5fa'];
                  const offset = idx * pct;
                  return (
                    <circle
                      key={row._id || idx}
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke={colors[idx]}
                      strokeWidth="3"
                      strokeDasharray={`${pct} ${100 - pct}`}
                      strokeDashoffset={`${-offset}`}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-semibold text-slate-400">Top</span>
                <span className="text-lg font-black text-slate-800">{items.length}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 flex-1">
              {topFour.map((row, idx) => (
                <div key={row._id || row.name || idx} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColors[idx]}`} />
                  <span className="text-xs font-semibold text-slate-600 truncate">
                    {row._id || row.name || 'Customer'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight Top Customer */}
          <div className="bg-slate-50/60 rounded-xl border border-slate-100 p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Top Customer</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-800">{items[0]?._id || items[0]?.name || 'Customer'}</span>
              <span className="text-sm font-black text-orange-500">Rs {Number(topTotal || 0).toLocaleString()}</span>
            </div>
            <button className="flex items-center gap-2 w-full justify-center py-2 text-xs font-bold border border-slate-200 rounded-lg text-slate-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all">
              <Download size={13} />
              Export Customer Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTopCustomers;
