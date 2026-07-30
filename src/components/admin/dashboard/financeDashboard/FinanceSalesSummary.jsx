import React from 'react';
import { ArrowDownRight, ArrowUpRight, BadgePercent, HandCoins } from 'lucide-react';
import { formatCurrency, formatPercent } from './financeUtils.js';

const FinanceSalesSummary = ({ paid = 0, unpaid = 0, paymentIn = 0, paymentOut = 0, expenses = 0 }) => {
  const totalSales = paid + unpaid;
  const collectionRate = totalSales > 0 ? (paid / totalSales) * 100 : 0;
  const expenseRatio   = totalSales > 0 ? (expenses / totalSales) * 100 : 0;

  const rows = [
    { label: 'Paid sales',  icon: <ArrowUpRight size={14} />,   value: paid,       variant: 'text-emerald-600' },
    { label: 'Unpaid sales',icon: <BadgePercent size={14} />,   value: unpaid,     variant: 'text-amber-600' },
    { label: 'Payment in',  icon: <ArrowUpRight size={14} />,   value: paymentIn,  variant: 'text-blue-600' },
    { label: 'Payment out', icon: <ArrowDownRight size={14} />, value: paymentOut, variant: 'text-rose-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <span className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-500">
          <HandCoins size={16} />
        </span>
        Collection summary
      </div>
      <p className="text-xs font-semibold text-slate-400 -mt-2">A compact breakdown of sales recovery and payout pressure.</p>

      {/* Total */}
      <div className="flex items-center justify-between py-3 px-4 bg-slate-50/60 rounded-xl border border-slate-100">
        <span className="text-xs font-semibold text-slate-500">Total sales window</span>
        <strong className="text-sm font-black text-slate-800">{formatCurrency(totalSales)}</strong>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Collected</span>
          <strong className="text-xs font-black text-slate-800">{formatPercent(collectionRate)}</strong>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(collectionRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Row List */}
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className={`flex items-center gap-2 text-xs font-semibold ${row.variant}`}>
              {row.icon}
              {row.label}
            </div>
            <strong className="text-xs font-black text-slate-800">{formatCurrency(row.value)}</strong>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
        <span className="text-xs font-semibold text-slate-400">Expense ratio</span>
        <strong className="text-xs font-black text-slate-700">{formatPercent(expenseRatio)}</strong>
      </div>
    </div>
  );
};

export default FinanceSalesSummary;
