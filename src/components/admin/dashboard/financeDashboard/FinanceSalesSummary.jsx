import React from 'react';
import { ArrowDownRight, ArrowUpRight, BadgePercent, HandCoins } from 'lucide-react';
import { formatCurrency, formatPercent } from './financeUtils.js';

const FinanceSalesSummary = ({ paid = 0, unpaid = 0, paymentIn = 0, paymentOut = 0, expenses = 0 }) => {
  const totalSales = paid + unpaid;
  const collectionRate = totalSales > 0 ? (paid / totalSales) * 100 : 0;
  const expenseRatio = totalSales > 0 ? (expenses / totalSales) * 100 : 0;

  return (
    <div className="panel finance-summary-panel">
      <div className="panel-heading finance-panel-heading">
        <div>
          <div className="panel-title">
            <span className="panel-icon sand">
              <HandCoins size={18} />
            </span>
            Collection summary
          </div>
          <div className="panel-sub">A compact breakdown of sales recovery and payout pressure.</div>
        </div>
      </div>
      <div className="finance-summary-top">
        <span>Total sales window</span>
        <strong>{formatCurrency(totalSales)}</strong>
      </div>
      <div className="finance-progress-block">
        <div className="finance-progress-labels">
          <span>Collected</span>
          <strong>{formatPercent(collectionRate)}</strong>
        </div>
        <div className="finance-progress-track">
          <div className="finance-progress-fill" style={{ width: `${Math.min(collectionRate, 100)}%` }} />
        </div>
      </div>
      <div className="finance-summary-list">
        <div className="finance-summary-row positive">
          <div className="finance-summary-row-label">
            <ArrowUpRight size={16} />
            Paid sales
          </div>
          <strong>{formatCurrency(paid)}</strong>
        </div>
        <div className="finance-summary-row caution">
          <div className="finance-summary-row-label">
            <BadgePercent size={16} />
            Unpaid sales
          </div>
          <strong>{formatCurrency(unpaid)}</strong>
        </div>
        <div className="finance-summary-row neutral">
          <div className="finance-summary-row-label">
            <ArrowUpRight size={16} />
            Payment in
          </div>
          <strong>{formatCurrency(paymentIn)}</strong>
        </div>
        <div className="finance-summary-row danger">
          <div className="finance-summary-row-label">
            <ArrowDownRight size={16} />
            Payment out
          </div>
          <strong>{formatCurrency(paymentOut)}</strong>
        </div>
      </div>
      <div className="finance-summary-foot">
        <span>Expense ratio</span>
        <strong>{formatPercent(expenseRatio)}</strong>
      </div>
    </div>
  );
};

export default FinanceSalesSummary;
