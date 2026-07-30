import React from 'react';
import { ReceiptIndianRupee } from 'lucide-react';

const breakdownItems = [
  { label: 'Dish Discount',    value: 0, color: 'bg-indigo-500' },
  { label: 'General Discount', value: 0, color: 'bg-violet-500' },
  { label: 'Loyalty Discount', value: 0, color: 'bg-blue-500' },
  { label: 'Service Charge',   value: 0, color: 'bg-sky-300' },
];

const CheckoutBreakdownPanel = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
    {/* Header */}
    <div>
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <span className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-500">
          <ReceiptIndianRupee size={16} />
        </span>
        Checkout Breakdown
      </div>
      <p className="text-xs font-semibold text-slate-400 mt-1">Checkout breakdown of sales.</p>
    </div>

    {/* Empty state */}
    <div className="flex items-center justify-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 py-6 text-xs font-semibold text-slate-400">
      No data yet
    </div>

    {/* Breakdown rows */}
    <div className="flex flex-col gap-2">
      {breakdownItems.map((row) => (
        <div key={row.label} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
            <span className="text-xs font-semibold text-slate-700">{row.label}</span>
          </div>
          <strong className="text-xs font-black text-slate-800">Rs {row.value}</strong>
        </div>
      ))}
    </div>
  </div>
);

export default CheckoutBreakdownPanel;
