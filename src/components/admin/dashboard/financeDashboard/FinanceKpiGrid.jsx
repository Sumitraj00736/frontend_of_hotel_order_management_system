import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCompactCurrency } from './financeUtils.js';

const toneMap = {
  blue:   'bg-blue-50 border-blue-100 text-blue-600',
  amber:  'bg-amber-50 border-amber-100 text-amber-600',
  green:  'bg-emerald-50 border-emerald-100 text-emerald-600',
  red:    'bg-rose-50 border-rose-100 text-rose-600',
  teal:   'bg-teal-50 border-teal-100 text-teal-600',
  purple: 'bg-violet-50 border-violet-100 text-violet-600',
};

const FinanceKpiGrid = ({ report, data }) => {
  const kpis = data?.kpis || {};
  const items = [
    { title: 'Sales',       value: (kpis.sales      ?? report?.totalSales)   || 0, tone: 'blue',   icon: <DollarSign size={18} />,    note: 'Gross revenue captured' },
    { title: 'Purchase',    value: (kpis.purchase   ?? report?.purchase)      || 0, tone: 'amber',  icon: <ShoppingBag size={18} />,   note: 'Supplier-side buying' },
    { title: 'Income',      value: (kpis.income     ?? report?.income)        || 0, tone: 'green',  icon: <TrendingUp size={18} />,    note: 'Total money coming in' },
    { title: 'Expenses',    value: (kpis.expenses   ?? report?.expenses)      || 0, tone: 'red',    icon: <TrendingDown size={18} />,  note: 'Operational spend' },
    { title: 'Payment In',  value: (kpis.paymentIn  ?? report?.paymentIn)     || 0, tone: 'teal',   icon: <ArrowDownLeft size={18} />, note: 'Collections received' },
    { title: 'Payment Out', value: (kpis.paymentOut ?? report?.paymentOut)    || 0, tone: 'purple', icon: <ArrowUpRight size={18} />,  note: 'Payouts completed' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <div
          key={item.title}
          className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow ${toneMap[item.tone]}`}
        >
          <div className="flex items-center justify-between">
            <span className={`p-2 rounded-xl border ${toneMap[item.tone]}`}>{item.icon}</span>
            <span className="text-[10px] font-bold text-slate-400 text-right leading-tight">{item.note}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">{item.title}</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">{formatCompactCurrency(item.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinanceKpiGrid;
