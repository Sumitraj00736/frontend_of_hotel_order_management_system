import React from 'react';
import { Landmark, WalletCards } from 'lucide-react';
import { formatCurrency, parseAmount } from './financeUtils.js';

const barColors = ['bg-orange-400', 'bg-amber-400', 'bg-blue-400', 'bg-violet-400'];

const FinancePaymentMethods = ({ rows = [] }) => {
  const grouped = rows.reduce((acc, row) => {
    const key = String(row.paymentMode || 'Unknown').trim() || 'Unknown';
    acc[key] = (acc[key] || 0) + parseAmount(row.amount);
    return acc;
  }, {});

  const methods = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const total   = methods.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-500">
            <WalletCards size={16} />
          </span>
          Payment modes
        </div>
        <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black rounded-lg">
          {formatCurrency(total)}
        </span>
      </div>
      <p className="text-xs font-semibold text-slate-400 -mt-2">Which channels are carrying the most transaction value.</p>

      {methods.length ? (
        <div className="flex flex-col gap-4">
          {methods.map(([method, amount], idx) => {
            const width = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={method} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
                      <Landmark size={13} />
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{method}</span>
                  </div>
                  <strong className="text-xs font-black text-slate-800">{formatCurrency(amount)}</strong>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColors[idx] || 'bg-slate-400'}`}
                    style={{ width: `${Math.max(width, 8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-slate-50/60 rounded-xl border border-slate-100">
          <span className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 font-black">+</span>
          <div>
            <p className="text-xs font-bold text-slate-700">No payment modes yet</p>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">As transactions arrive, the preferred payment mix will show here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePaymentMethods;
