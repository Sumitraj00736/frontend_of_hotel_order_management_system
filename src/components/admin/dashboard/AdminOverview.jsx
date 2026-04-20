import React, { useState } from 'react';
import { Home, Wallet, ShoppingCart, Calendar, BellRing, Search, CircleCheckBig } from 'lucide-react';
import '../../../common/css/admin/dashboard/dashboard.css';
import OverviewDashboard from './overviewDashboard/OverviewDashboard.jsx';
import FinanceDashboard from './financeDashboard/FinanceDashboard.jsx';
import OrderDashboard from './orderDashboard/OrderDashboard.jsx';

const tabs = [
  { id: 'overview', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'finance', label: 'Finance', icon: <Wallet size={18} /> },
  { id: 'order', label: 'Order', icon: <ShoppingCart size={18} /> }
];

const AdminOverview = ({
  report,
  overview,
  orderDashboardData,
  overviewDashboardData,
  financeDashboardData,
  transactionHistory,
  transactionMeta,
  transactionFilters,
  onTransactionFilterChange,
  onTransactionPageChange,
  onTransactionLimitChange,
  onTransactionExport,
  dashboardOptions,
  onChangeDashboardOptions
}) => {
  const [tab, setTab] = useState('overview');

  return (
    <div className="dashboard-screen">
      <div className="dash-header dashboard-hero">
        <div className="dash-header-row">
          <div className="dash-tabs">
            {tabs.map((t) => (
              <button key={t.id} className={`dash-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
          <div className="dash-status-pill">
            <BellRing size={16} />
            Order alerts active
          </div>
        </div>
        <div className="dash-header-row">
          <div className="dash-filters">
            <button className="chip ghost"><Calendar size={16} /> Today</button>
            <button className="chip ghost">Daybook: All</button>
            <button className="chip ghost"><CircleCheckBig size={16} /> Status: Confirmed</button>
          </div>
          <div className="dash-header-tools">
            {dashboardOptions && onChangeDashboardOptions && (
              <div className="dash-toggles">
                {[
                  { key: 'includeAnalytics', label: 'Analytics' },
                  { key: 'includeStock', label: 'Inventory' },
                  { key: 'includeHistory', label: 'History' }
                ].map((opt) => (
                  <label key={opt.key} className="dash-toggle">
                    <input
                      type="checkbox"
                      checked={dashboardOptions[opt.key]}
                      onChange={(e) =>
                        onChangeDashboardOptions({ ...dashboardOptions, [opt.key]: e.target.checked })
                      }
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
            <label className="dash-search">
              <Search size={16} />
              <input type="search" placeholder="Search" aria-label="Search dashboard" />
            </label>
          </div>
        </div>
      </div>

      {tab === 'overview' && (
        <OverviewDashboard
          report={report}
          data={overviewDashboardData}
          transactions={transactionHistory}
          transactionMeta={transactionMeta}
          transactionFilters={transactionFilters}
          onTransactionFilterChange={onTransactionFilterChange}
          onTransactionPageChange={onTransactionPageChange}
          onTransactionLimitChange={onTransactionLimitChange}
          onTransactionExport={onTransactionExport}
        />
      )}

      {tab === 'finance' && (
        <FinanceDashboard
          report={report}
          data={financeDashboardData}
          transactions={transactionHistory}
          transactionMeta={transactionMeta}
          transactionFilters={transactionFilters}
          onTransactionFilterChange={onTransactionFilterChange}
          onTransactionPageChange={onTransactionPageChange}
          onTransactionLimitChange={onTransactionLimitChange}
          onTransactionExport={onTransactionExport}
        />
      )}

      {tab === 'order' && (
        <OrderDashboard overview={overview} data={orderDashboardData} />
      )}
    </div>
  );
};

export default AdminOverview;
