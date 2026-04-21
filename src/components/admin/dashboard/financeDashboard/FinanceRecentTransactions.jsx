import React from 'react';
import { ArrowUpRight, ReceiptText } from 'lucide-react';
import { formatCurrency, parseAmount } from './financeUtils.js';

const FinanceRecentTransactions = ({ rows = [] }) => {
  const recentRows = rows.slice(0, 5);
  const recentTotal = recentRows.reduce((sum, row) => sum + parseAmount(row.amount), 0);

  return (
    <div className="panel finance-feed-panel">
      <div className="panel-heading finance-panel-heading">
        <div>
          <div className="panel-title">
            <span className="panel-icon">
              <ReceiptText size={18} />
            </span>
            Recent movement
          </div>
          <div className="panel-sub">The latest finance activity, trimmed for quick scanning.</div>
        </div>
        <div className="finance-mini-badge">{formatCurrency(recentTotal)}</div>
      </div>
      {recentRows.length ? (
        <div className="finance-activity-list">
          {recentRows.map((row, index) => (
            <div key={`${row.txnNo || row.particular || 'txn'}-${index}`} className="finance-activity-item">
              <div className="finance-activity-icon">
                <ArrowUpRight size={15} />
              </div>
              <div className="finance-activity-copy">
                <strong>{row.particular || row.txnType || 'Transaction entry'}</strong>
                <span>{row.parties || row.paymentMode || row.status || 'Finance log updated'}</span>
              </div>
              <div className="finance-activity-meta">
                <strong>{formatCurrency(row.amount)}</strong>
                <span>{row.txnDate ? new Date(row.txnDate).toLocaleDateString() : 'No date'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-illustration">No payment history found</div>
      )}
    </div>
  );
};

export default FinanceRecentTransactions;
