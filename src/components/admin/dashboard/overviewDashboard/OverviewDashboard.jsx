import React from 'react';
import OverviewKpiGrid from './OverviewKpiGrid.jsx';
import OverviewSalesByStaff from './OverviewSalesByStaff.jsx';
import OverviewTopCustomers from './OverviewTopCustomers.jsx';
import OverviewBestSellingBanner from './OverviewBestSellingBanner.jsx';
import OverviewTransactionHistory from './OverviewTransactionHistory.jsx';

const OverviewDashboard = ({ report, data, transactions }) => {
  return (
    <div className="dash-tab-stack">
      <OverviewKpiGrid report={report} />
      <div className="panel-grid two-col">
        <OverviewSalesByStaff items={data?.salesByStaff || []} />
        <OverviewTopCustomers items={data?.topCustomers || []} />
      </div>
      <OverviewBestSellingBanner bestSelling={data?.bestSelling} />
      <OverviewTransactionHistory rows={transactions || []} />
    </div>
  );
};

export default OverviewDashboard;
