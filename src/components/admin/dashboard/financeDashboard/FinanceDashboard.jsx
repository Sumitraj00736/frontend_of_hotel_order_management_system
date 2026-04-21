import React from 'react';
import { ArrowUpRight, CalendarRange, CircleDollarSign, Wallet } from 'lucide-react';
import FinanceKpiGrid from './FinanceKpiGrid.jsx';
import FinanceSalesOverview from './FinanceSalesOverview.jsx';
import FinanceSalesSummary from './FinanceSalesSummary.jsx';
import FinanceRecentTransactions from './FinanceRecentTransactions.jsx';
import FinancePaymentMethods from './FinancePaymentMethods.jsx';
import FinanceVideoCard from './FinanceVideoCard.jsx';
import FinanceTransactionHistory from './FinanceTransactionHistory.jsx';
import { formatCompactCurrency, formatCurrency, parseAmount } from './financeUtils.js';

const FinanceDashboard = ({
  report,
  data,
  transactions,
  transactionMeta,
  transactionFilters,
  onTransactionFilterChange,
  onTransactionPageChange,
  onTransactionLimitChange,
  onTransactionExport
}) => {
  const rows = transactions || [];
  const paymentIn = Number(report?.paymentIn ?? data?.kpis?.paymentIn ?? 0);
  const paymentOut = Number(report?.paymentOut ?? data?.kpis?.paymentOut ?? 0);
  const paid = Number(report?.paid || 0);
  const unpaid = Number(report?.unpaid || 0);
  const totalSales = Number(data?.kpis?.sales ?? report?.totalSales ?? 0);
  const totalExpenses = Number(data?.kpis?.expenses ?? report?.expenses ?? 0);
  const netPosition = paymentIn - paymentOut;
  const collectionRate = paid + unpaid > 0 ? (paid / (paid + unpaid)) * 100 : 0;
  const recentVolume = rows.slice(0, 6).reduce((sum, row) => sum + parseAmount(row.amount), 0);
  const outstandingBalance = Math.max(unpaid, totalExpenses - paymentIn, 0);

  return (
    <div className="dash-tab-stack finance-dashboard-shell">
      <section className="finance-spotlight">
        <div className="finance-spotlight-copy">
          <span className="finance-spotlight-badge">
            <CircleDollarSign size={15} />
            Finance Control Center
          </span>
          <h2 className="finance-spotlight-title">A cleaner daily money view for faster decisions.</h2>
          <p className="finance-spotlight-text">
            Track inflow, expenses, collections, and recent movement from one place without digging through separate pages.
          </p>
          <div className="finance-spotlight-metrics">
            <div className="finance-inline-stat">
              <span>Net cash position</span>
              <strong>{formatCurrency(netPosition)}</strong>
            </div>
            <div className="finance-inline-stat">
              <span>Collection rate</span>
              <strong>{Math.round(collectionRate)}%</strong>
            </div>
            <div className="finance-inline-stat">
              <span>Recent 6 txn volume</span>
              <strong>{formatCurrency(recentVolume)}</strong>
            </div>
          </div>
        </div>
        <div className="finance-spotlight-card">
          <div className="finance-spotlight-card-head">
            <div>
              <div className="finance-card-eyebrow">Today&apos;s pulse</div>
              <div className="finance-card-title">Treasury snapshot</div>
            </div>
            <div className="finance-glass-icon">
              <Wallet size={18} />
            </div>
          </div>
          <div className="finance-balance-amount">{formatCompactCurrency(totalSales - totalExpenses)}</div>
          <div className="finance-balance-note">
            {netPosition >= 0 ? 'Healthy positive movement from collections and cash-in.' : 'Cash-out is leading, so payables need attention.'}
          </div>
          <div className="finance-balance-grid">
            <div>
              <span>Paid sales</span>
              <strong>{formatCurrency(paid)}</strong>
            </div>
            <div>
              <span>Outstanding</span>
              <strong>{formatCurrency(outstandingBalance)}</strong>
            </div>
            <div>
              <span>Cash in</span>
              <strong>{formatCurrency(paymentIn)}</strong>
            </div>
            <div>
              <span>Cash out</span>
              <strong>{formatCurrency(paymentOut)}</strong>
            </div>
          </div>
        </div>
      </section>

      <FinanceKpiGrid report={report} data={data} />

      <div className="panel-grid two-col finance-story-grid">
        <FinanceSalesOverview series={data?.salesSeries} report={report} />
        <FinanceSalesSummary
          paid={paid}
          unpaid={unpaid}
          paymentIn={paymentIn}
          paymentOut={paymentOut}
          expenses={totalExpenses}
        />
      </div>

      <div className="panel-grid three-col finance-support-grid">
        <FinanceRecentTransactions rows={rows} />
        <FinancePaymentMethods rows={rows} />
        <FinanceVideoCard report={report} data={data} rows={rows} />
      </div>

      <FinanceTransactionHistory
        rows={rows}
        page={transactionMeta?.page}
        limit={transactionMeta?.limit}
        total={transactionMeta?.total}
        filters={transactionFilters}
        onFilterChange={onTransactionFilterChange}
        onPageChange={onTransactionPageChange}
        onLimitChange={onTransactionLimitChange}
        onExport={onTransactionExport}
      />

      <section className="finance-footer-note">
        <CalendarRange size={16} />
        <span>Keep using the date filters below to inspect a custom window and export finance activity whenever needed.</span>
        <ArrowUpRight size={16} />
      </section>
    </div>
  );
};

export default FinanceDashboard;
