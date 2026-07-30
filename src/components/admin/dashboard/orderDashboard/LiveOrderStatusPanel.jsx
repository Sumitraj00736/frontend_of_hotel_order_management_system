import React from 'react';

const LiveOrderStatusPanel = ({ overview, data }) => {
  const completed = (data?.liveStatus?.completed ?? overview?.completedOrders) || 0;
  const pending   = (data?.liveStatus?.pending   ?? overview?.pendingOrders)   || 0;
  const cancelled = (data?.liveStatus?.cancelled ?? overview?.cancelledOrders) || 0;
  const total     = completed + pending + cancelled;

  const statRows = [
    { label: 'Completed Order', count: completed, dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Pending Order',   count: pending,   dot: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50' },
    { label: 'Cancelled Order', count: cancelled, dot: 'bg-rose-500',    text: 'text-rose-700',    bg: 'bg-rose-50' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h4 className="text-sm font-bold text-slate-800">Live Order Status</h4>
        <p className="text-xs font-semibold text-slate-400 mt-1">Here is a live overview of your order status.</p>
      </div>

      {/* Donut + Stats */}
      <div className="flex items-center gap-6">
        {/* SVG Donut */}
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
            {total > 0 && (
              <>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#34d399" strokeWidth="3.5"
                  strokeDasharray={`${(completed / total) * 100} ${100 - (completed / total) * 100}`}
                  strokeDashoffset="0"
                />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fbbf24" strokeWidth="3.5"
                  strokeDasharray={`${(pending / total) * 100} ${100 - (pending / total) * 100}`}
                  strokeDashoffset={`${-(completed / total) * 100}`}
                />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f43f5e" strokeWidth="3.5"
                  strokeDasharray={`${(cancelled / total) * 100} ${100 - (cancelled / total) * 100}`}
                  strokeDashoffset={`${-((completed + pending) / total) * 100}`}
                />
              </>
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-800">{total}</span>
            <span className="text-[10px] font-semibold text-slate-400">Orders</span>
          </div>
        </div>

        {/* Stats List */}
        <div className="flex flex-col gap-2 flex-1">
          {statRows.map((row) => (
            <div key={row.label} className={`flex items-center justify-between py-2 px-3 rounded-xl ${row.bg} border border-transparent`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${row.dot}`} />
                <span className="text-xs font-semibold text-slate-700">{row.label}</span>
              </div>
              <strong className={`text-sm font-black ${row.text}`}>{row.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveOrderStatusPanel;
