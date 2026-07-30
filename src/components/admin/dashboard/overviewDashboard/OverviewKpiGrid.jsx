import React from 'react';
import { DollarSign, ArrowDownUp, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const toneMap = {
  orange: 'bg-orange-50 border-orange-100 text-orange-600',
  sand:   'bg-amber-50 border-amber-100 text-amber-600',
  mint:   'bg-emerald-50 border-emerald-100 text-emerald-600',
  cream:  'bg-rose-50 border-rose-100 text-rose-600',
};

const OverviewKpiGrid = ({ report }) => {
  const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;
  const items = [
    { title: 'Sales',    value: report?.totalSales || 0, tone: 'orange', icon: <DollarSign size={18} />,  noteIcon: <ArrowUpRight size={14} />,   action: 'View Breakdowns' },
    { title: 'Purchase', value: report?.purchase   || 0, tone: 'sand',   icon: <ArrowDownUp size={18} />, noteIcon: <ArrowDownRight size={14} />, action: 'Add Purchase' },
    { title: 'Income',   value: report?.income     || 0, tone: 'mint',   icon: <TrendingUp size={18} />,  noteIcon: <ArrowUpRight size={14} />,   action: null },
    { title: 'Expenses', value: report?.expenses   || 0, tone: 'cream',  icon: <TrendingDown size={18} />,noteIcon: <ArrowDownRight size={14} />, action: null },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.title}
          className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow ${toneMap[item.tone]}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <span className={`p-2 rounded-xl border ${toneMap[item.tone]}`}>{item.icon}</span>
              {item.title}
            </div>
            {item.action && (
              <button className="text-[10px] font-bold text-slate-400 hover:text-orange-500 transition-colors border border-slate-200 hover:border-orange-300 px-2 py-0.5 rounded-md">
                {item.action}
              </button>
            )}
          </div>
          <div className="text-xl font-black text-slate-800">{formatCurrency(item.value)}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            {item.noteIcon}
            No change
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewKpiGrid;
