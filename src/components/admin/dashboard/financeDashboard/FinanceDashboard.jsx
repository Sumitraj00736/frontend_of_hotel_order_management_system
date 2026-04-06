import React from 'react';
import FinanceKpiGrid from './FinanceKpiGrid.jsx';
import FinanceSalesOverview from './FinanceSalesOverview.jsx';
import FinanceSalesSummary from './FinanceSalesSummary.jsx';
import FinanceRecentTransactions from './FinanceRecentTransactions.jsx';
import FinancePaymentMethods from './FinancePaymentMethods.jsx';
import FinanceVideoCard from './FinanceVideoCard.jsx';
import FinanceTransactionHistory from './FinanceTransactionHistory.jsx';

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
  return (
    <div className="dash-tab-stack">
      <FinanceKpiGrid report={report} data={data} />
      <div className="panel-grid two-col">
        <FinanceSalesOverview series={data?.salesSeries} />
        <FinanceSalesSummary paid={report?.paid || 0} unpaid={report?.unpaid || 0} />
      </div>
      <div className="panel-grid three-col">
        <FinanceRecentTransactions />
        <FinancePaymentMethods />
        <FinanceVideoCard />
      </div>
      <FinanceTransactionHistory
        rows={transactions || []}
        page={transactionMeta?.page}
        limit={transactionMeta?.limit}
        total={transactionMeta?.total}
        filters={transactionFilters}
        onFilterChange={onTransactionFilterChange}
        onPageChange={onTransactionPageChange}
        onLimitChange={onTransactionLimitChange}
        onExport={onTransactionExport}
      />
    </div>
  );
};

export default FinanceDashboard;
