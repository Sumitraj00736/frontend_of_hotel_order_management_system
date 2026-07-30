import React from 'react';
import OverviewKpiGrid from './OverviewKpiGrid.jsx';
import OverviewSalesByStaff from './OverviewSalesByStaff.jsx';
import OverviewTopCustomers from './OverviewTopCustomers.jsx';
import OverviewBestSellingBanner from './OverviewBestSellingBanner.jsx';
import OverviewTransactionHistory from './OverviewTransactionHistory.jsx';

const OverviewDashboard = ({
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
    <div className="flex flex-col gap-6">
      <OverviewKpiGrid report={report} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverviewSalesByStaff items={data?.salesByStaff || []} />
        <OverviewTopCustomers items={data?.topCustomers || []} />
      </div>
      <OverviewBestSellingBanner bestSelling={data?.bestSelling} />
      <OverviewTransactionHistory
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

export default OverviewDashboard;
