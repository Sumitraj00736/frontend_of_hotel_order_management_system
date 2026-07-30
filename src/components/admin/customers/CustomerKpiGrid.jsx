import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

const fmt = (v) => `Rs ${Number(v || 0).toLocaleString('en-IN')}`;

const kpiConfig = [
  { key: 'toReceive',    label: 'To Receive', icon: <ArrowUpRight size={18} />,   tone: 'emerald' },
  { key: 'toPay',        label: 'To Pay',     icon: <ArrowDownLeft size={18} />,  tone: 'rose' },
  { key: 'netToReceive', label: 'Net Amount', icon: <Wallet size={18} />,          tone: 'orange' },
];

const toneMap = {
  emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
  rose:    'bg-rose-50 border-rose-100 text-rose-600',
  orange:  'bg-orange-50 border-orange-100 text-orange-600',
};

const CustomerKpiGrid = ({ totals }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pt-5">
    {kpiConfig.map(({ key, label, icon, tone }) => (
      <div key={key} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${toneMap[tone]}`}>
        <div className={`p-3 rounded-xl border ${toneMap[tone]}`}>{icon}</div>
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{fmt(totals[key])}</p>
        </div>
      </div>
    ))}
  </div>
);

export default CustomerKpiGrid;