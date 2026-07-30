import React from 'react';
import { ArrowUpRight, ReceiptText } from 'lucide-react';
import { formatCurrency, parseAmount } from './financeUtils.js';

const FinanceRecentTransactions = ({ rows = [] }) => {
  const recentRows = rows.slice(0, 5);
  const recentTotal = recentRows.reduce((sum, row) => sum + parseAmount(row.amount), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-500">
            <ReceiptText size={16} />
          </span>
          Recent movement
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">
          {formatCurrency(recentTotal)}
        </span>
      </div>
      <p className="text-xs font-semibold text-slate-400 -mt-2">The latest finance activity, trimmed for quick scanning.</p>

      {recentRows.length ? (
        <div className="flex flex-col gap-2">
          {recentRows.map((row, index) => (
            <div
              key={`${row.txnNo || row.particular || 'txn'}-${index}`}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-400 shrink-0">
                <ArrowUpRight size={13} />
              </span>
              <div className="flex flex-col flex-1 min-w-0">
                <strong className="text-xs font-bold text-slate-800 truncate">
                  {row.particular || row.txnType || 'Transaction entry'}
                </strong>
                <span className="text-[10px] font-semibold text-slate-400 truncate">
                  {row.parties || row.paymentMode || row.status || 'Finance log updated'}
                </span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <strong className="text-xs font-black text-slate-800">{formatCurrency(row.amount)}</strong>
                <span className="text-[10px] font-semibold text-slate-400">
                  {row.txnDate ? new Date(row.txnDate).toLocaleDateString() : 'No date'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center bg-slate-50/60 rounded-xl border border-slate-100 py-10 text-xs font-semibold text-slate-400">
          No payment history found
        </div>
      )}
    </div>
  );
};

export default FinanceRecentTransactions;
