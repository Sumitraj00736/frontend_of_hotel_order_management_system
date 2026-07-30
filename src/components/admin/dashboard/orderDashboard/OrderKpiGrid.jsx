import React from 'react';
import { UtensilsCrossed, CheckSquare, ClipboardList, Calculator } from 'lucide-react';

const toneMap = {
  green:  'bg-emerald-50 border-emerald-100 text-emerald-600',
  amber:  'bg-amber-50 border-amber-100 text-amber-600',
  blue:   'bg-blue-50 border-blue-100 text-blue-600',
  pink:   'bg-pink-50 border-pink-100 text-pink-600',
};

const OrderKpiGrid = ({ overview, data }) => {
  const kpis = data?.kpis || {};
  const items = [
    { title: 'Sales',            value: (kpis.sales          ?? overview?.orderSales) || 0, tone: 'green', icon: <UtensilsCrossed size={18} />, prefix: 'Rs ' },
    { title: 'Order Served',     value: (kpis.orderServed    ?? overview?.served)      || 0, tone: 'amber', icon: <CheckSquare size={18} />,    prefix: '' },
    { title: 'KOT Taken',        value: (kpis.kotTaken       ?? overview?.kot)          || 0, tone: 'blue',  icon: <ClipboardList size={18} />,  prefix: '' },
    { title: 'Avg Order Amount', value: (kpis.avgOrderAmount ?? overview?.avgOrder)     || 0, tone: 'pink',  icon: <Calculator size={18} />,     prefix: 'Rs ' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.title}
          className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow ${toneMap[item.tone]}`}
        >
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl border ${toneMap[item.tone]}`}>{item.icon}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">{item.title}</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{item.prefix}{item.value.toLocaleString()}</p>
          </div>
          <div className="text-[11px] font-semibold text-slate-400">No changes!</div>
        </div>
      ))}
    </div>
  );
};

export default OrderKpiGrid;
