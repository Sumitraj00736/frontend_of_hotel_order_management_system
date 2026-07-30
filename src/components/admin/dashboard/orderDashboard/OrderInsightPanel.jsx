import React from 'react';
import { Calendar } from 'lucide-react';
import LineChart from '../reusable/LineChart.jsx';

const OrderInsightPanel = ({ series }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-bold text-slate-800">Order Insight</h4>
        <p className="text-xs font-semibold text-slate-400 mt-1">Here is a live overview of your orders.</p>
      </div>
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-orange-400 hover:text-orange-500 transition-all">
        <Calendar size={13} />
        Today
      </button>
    </div>
    {/* Chart */}
    <div className="pt-2">
      <LineChart data={series || []} xKey="month" yKey="orders" />
    </div>
  </div>
);

export default OrderInsightPanel;
