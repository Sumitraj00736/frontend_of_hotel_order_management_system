import React from 'react';
import { AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { formatCurrency } from './financeUtils.js';

const FinanceVideoCard = ({ report, data, rows = [] }) => {
  const unpaid    = Number(report?.unpaid || 0);
  const paid      = Number(report?.paid   || 0);
  const expenses  = Number(data?.kpis?.expenses ?? report?.expenses ?? 0);
  const netCash   = Number(report?.paymentIn || 0) - Number(report?.paymentOut || 0);
  const busiestEntry = rows[0];

  const isHealthy = !(unpaid > paid * 0.45 || netCash < 0);
  const health = isHealthy
    ? { icon: <ShieldCheck size={18} />, label: 'Stable flow',       note: 'Collections are keeping pace with outgoing cash.', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' }
    : { icon: <AlertTriangle size={18} />, label: 'Needs attention', note: 'Outstanding balances or payout pressure are rising.', color: 'text-amber-500 bg-amber-50 border-amber-100' };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 border border-violet-100 rounded-full text-[10px] font-bold text-violet-600">
          <Sparkles size={11} />
          Smart insight
        </span>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[10px] font-bold ${health.color}`}>
          {health.icon}
          {health.label}
        </span>
      </div>

      {/* Content */}
      <div>
        <h4 className="text-sm font-bold text-slate-800">Finance focus for today</h4>
        <p className="text-xs font-semibold text-slate-400 mt-1">{health.note}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50/60 rounded-xl border border-slate-100 p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net cash</span>
          <strong className="text-sm font-black text-slate-800">{formatCurrency(netCash)}</strong>
        </div>
        <div className="bg-slate-50/60 rounded-xl border border-slate-100 p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expense load</span>
          <strong className="text-sm font-black text-slate-800">{formatCurrency(expenses)}</strong>
        </div>
        <div className="bg-slate-50/60 rounded-xl border border-slate-100 p-3 col-span-2 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest key entry</span>
          <strong className="text-xs font-black text-slate-800 truncate">
            {busiestEntry?.particular || busiestEntry?.txnType || 'No recent transaction'}
          </strong>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[10px] font-semibold text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
        Keep an eye on unpaid sales at <strong className="text-slate-600">{formatCurrency(unpaid)}</strong> while
        maintaining collected revenue of <strong className="text-slate-600">{formatCurrency(paid)}</strong>.
      </p>
    </div>
  );
};

export default FinanceVideoCard;
