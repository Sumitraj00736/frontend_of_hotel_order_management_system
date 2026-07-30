import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import LineChart from '../reusable/LineChart.jsx';
import { formatCompactCurrency } from './financeUtils.js';

const FinanceSalesOverview = ({ series, report }) => {
  const chartSeries = series || [];
  const values = chartSeries.map((item) => Number(item?.sales || item?.value || 0));
  const highest = values.length ? Math.max(...values) : 0;
  const lowest  = values.length ? Math.min(...values) : 0;
  const average = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <span className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-500">
              <Sparkles size={16} />
            </span>
            Revenue flow
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-1">A visual view of how sales are moving across the selected period.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-all">
          <Calendar size={13} />
          Active Range
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Peak',      value: highest },
          { label: 'Average',   value: average },
          { label: 'Floor',     value: lowest },
          { label: 'Net sales', value: report?.totalSales || 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-50/60 rounded-xl p-3 border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
            <strong className="text-sm font-black text-slate-800">{formatCompactCurrency(stat.value)}</strong>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="pt-2">
        <LineChart data={chartSeries} xKey="month" yKey="sales" />
      </div>
    </div>
  );
};

export default FinanceSalesOverview;
