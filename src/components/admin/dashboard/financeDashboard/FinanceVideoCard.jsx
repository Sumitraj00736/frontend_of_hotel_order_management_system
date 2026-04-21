import React from 'react';
import { AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { formatCurrency } from './financeUtils.js';

const FinanceVideoCard = ({ report, data, rows = [] }) => {
  const unpaid = Number(report?.unpaid || 0);
  const paid = Number(report?.paid || 0);
  const expenses = Number(data?.kpis?.expenses ?? report?.expenses ?? 0);
  const netCash = Number(report?.paymentIn || 0) - Number(report?.paymentOut || 0);
  const busiestEntry = rows[0];

  const health = unpaid > paid * 0.45 || netCash < 0
    ? {
        icon: <AlertTriangle size={18} />,
        label: 'Needs attention',
        note: 'Outstanding balances or payout pressure are rising.'
      }
    : {
        icon: <ShieldCheck size={18} />,
        label: 'Stable flow',
        note: 'Collections are keeping pace with outgoing cash.'
      };

  return (
    <div className="panel finance-insight-panel">
      <div className="finance-insight-header">
        <span className="finance-insight-badge">
          <Sparkles size={14} />
          Smart insight
        </span>
        <div className="finance-health-pill">
          {health.icon}
          {health.label}
        </div>
      </div>
      <div className="panel-title">Finance focus for today</div>
      <div className="panel-sub">{health.note}</div>
      <div className="finance-insight-grid">
        <div className="finance-insight-stat">
          <span>Net cash</span>
          <strong>{formatCurrency(netCash)}</strong>
        </div>
        <div className="finance-insight-stat">
          <span>Expense load</span>
          <strong>{formatCurrency(expenses)}</strong>
        </div>
        <div className="finance-insight-stat wide">
          <span>Latest key entry</span>
          <strong>{busiestEntry?.particular || busiestEntry?.txnType || 'No recent transaction'}</strong>
        </div>
      </div>
      <div className="finance-insight-footer">
        Keep an eye on unpaid sales at <strong>{formatCurrency(unpaid)}</strong> while maintaining collected revenue of <strong>{formatCurrency(paid)}</strong>.
      </div>
    </div>
  );
};

export default FinanceVideoCard;
