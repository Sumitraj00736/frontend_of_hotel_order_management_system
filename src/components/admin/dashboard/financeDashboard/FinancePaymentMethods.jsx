import React from 'react';
import { Landmark, WalletCards } from 'lucide-react';
import { formatCurrency, parseAmount } from './financeUtils.js';

const FinancePaymentMethods = ({ rows = [] }) => {
  const grouped = rows.reduce((acc, row) => {
    const key = String(row.paymentMode || 'Unknown').trim() || 'Unknown';
    acc[key] = (acc[key] || 0) + parseAmount(row.amount);
    return acc;
  }, {});

  const methods = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const total = methods.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <div className="panel finance-method-panel">
      <div className="panel-heading finance-panel-heading">
        <div>
          <div className="panel-title">
            <span className="panel-icon sand">
              <WalletCards size={18} />
            </span>
            Payment modes
          </div>
          <div className="panel-sub">Which channels are carrying the most transaction value.</div>
        </div>
        <div className="finance-mini-badge alt">{formatCurrency(total)}</div>
      </div>
      {methods.length ? (
        <div className="finance-method-list">
          {methods.map(([method, amount]) => {
            const width = total > 0 ? (amount / total) * 100 : 0;
            return (
              <div key={method} className="finance-method-item">
                <div className="finance-method-row">
                  <div className="finance-method-name">
                    <span className="payment-method-icon">
                      <Landmark size={16} />
                    </span>
                    <span>{method}</span>
                  </div>
                  <strong>{formatCurrency(amount)}</strong>
                </div>
                <div className="finance-method-bar">
                  <div className="finance-method-fill" style={{ width: `${Math.max(width, 8)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="payment-method-card">
          <div className="payment-method-icon">+</div>
          <div>
            <div className="fw-600">No payment modes yet</div>
            <div className="panel-sub">As transactions arrive, the preferred payment mix will show here.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePaymentMethods;
