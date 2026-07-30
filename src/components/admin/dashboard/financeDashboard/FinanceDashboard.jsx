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
  const paymentIn  = Number(report?.paymentIn  ?? data?.kpis?.paymentIn  ?? 0);
  const paymentOut = Number(report?.paymentOut ?? data?.kpis?.paymentOut ?? 0);
  const paid       = Number(report?.paid    || 0);
  const unpaid     = Number(report?.unpaid  || 0);
  const totalSales = Number(data?.kpis?.sales    ?? report?.totalSales ?? 0);
  const totalExpenses = Number(data?.kpis?.expenses ?? report?.expenses  ?? 0);
  const netPosition = paymentIn - paymentOut;
  const collectionRate = paid + unpaid > 0 ? (paid / (paid + unpaid)) * 100 : 0;
  const recentVolume = rows.slice(0, 6).reduce((sum, row) => sum + parseAmount(row.amount), 0);
  const outstandingBalance = Math.max(unpaid, totalExpenses - paymentIn, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Spotlight Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-7 shadow-xl flex flex-col lg:flex-row gap-8">
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Left Copy */}
        <div className="relative z-10 flex flex-col gap-4 lg:w-1/2">
          <span className="inline-flex items-center gap-2 w-fit px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-bold text-orange-400">
            <CircleDollarSign size={13} />
            Finance Control Center
          </span>
          <h2 className="text-2xl font-black text-white leading-tight">
            A cleaner daily money view for faster decisions.
          </h2>
          <p className="text-sm font-semibold text-slate-400">
            Track inflow, expenses, collections, and recent movement from one place without digging through separate pages.
          </p>
          <div className="flex items-center gap-6 pt-2">
            {[
              { label: 'Net cash position', value: formatCurrency(netPosition) },
              { label: 'Collection rate',   value: `${Math.round(collectionRate)}%` },
              { label: 'Recent 6 txn vol',  value: formatCurrency(recentVolume) },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <strong className="text-base font-black text-white">{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card */}
        <div className="relative z-10 flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today's pulse</p>
              <p className="text-sm font-bold text-slate-200 mt-0.5">Treasury snapshot</p>
            </div>
            <span className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
              <Wallet size={18} />
            </span>
          </div>
          <div className="text-3xl font-black text-white">{formatCompactCurrency(totalSales - totalExpenses)}</div>
          <p className="text-xs font-semibold text-slate-400">
            {netPosition >= 0
              ? 'Healthy positive movement from collections and cash-in.'
              : 'Cash-out is leading, so payables need attention.'}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { label: 'Paid sales',   value: paid },
              { label: 'Outstanding',  value: outstandingBalance },
              { label: 'Cash in',      value: paymentIn },
              { label: 'Cash out',     value: paymentOut },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-slate-500">{stat.label}</span>
                <strong className="text-sm font-black text-white">{formatCurrency(stat.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <FinanceKpiGrid report={report} data={data} />

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceSalesOverview series={data?.salesSeries} report={report} />
        <FinanceSalesSummary
          paid={paid}
          unpaid={unpaid}
          paymentIn={paymentIn}
          paymentOut={paymentOut}
          expenses={totalExpenses}
        />
      </div>

      {/* Support Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinanceRecentTransactions rows={rows} />
        <FinancePaymentMethods rows={rows} />
        <FinanceVideoCard report={report} data={data} rows={rows} />
      </div>

      {/* Full Transaction History */}
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

      {/* Footer Note */}
      <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-500">
        <CalendarRange size={15} className="shrink-0 text-slate-400" />
        <span>Keep using the date filters below to inspect a custom window and export finance activity whenever needed.</span>
        <ArrowUpRight size={15} className="shrink-0 text-slate-400 ml-auto" />
      </div>
    </div>
  );
};

export default FinanceDashboard;
