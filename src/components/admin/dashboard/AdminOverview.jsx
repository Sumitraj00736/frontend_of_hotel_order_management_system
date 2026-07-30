import React, { useState } from 'react';
import { Home, Wallet, ShoppingCart, Calendar, BellRing, Search, CircleCheckBig, ChevronDown } from 'lucide-react';
import OverviewDashboard from './overviewDashboard/OverviewDashboard.jsx';
import FinanceDashboard from './financeDashboard/FinanceDashboard.jsx';
import OrderDashboard from './orderDashboard/OrderDashboard.jsx';

const tabs = [
  { id: 'overview', label: 'Dashboard', icon: <Home size={16} /> },
  { id: 'finance', label: 'Finance', icon: <Wallet size={16} /> },
  { id: 'order', label: 'Order', icon: <ShoppingCart size={16} /> }
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
    <div className="min-h-screen bg-slate-50/60">
      {/* Dashboard Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 pt-5 pb-0 shadow-sm">
        {/* Top Row: Tabs + Alert */}
        <div className="flex items-center justify-between mb-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Alert Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <BellRing size={13} />
            Order alerts active
          </div>
        </div>

        {/* Bottom Row: Filters + Tools */}
        <div className="flex items-center justify-between pb-4">
          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all">
              <Calendar size={13} />
              Today
              <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all">
              Daybook: All
              <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all">
              <CircleCheckBig size={13} />
              Status: Confirmed
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-3">
            {/* Dashboard Toggle Options */}
            {dashboardOptions && onChangeDashboardOptions && (
              <div className="flex items-center gap-2">
                {[
                  { key: 'includeAnalytics', label: 'Analytics' },
                  { key: 'includeStock', label: 'Inventory' },
                  { key: 'includeHistory', label: 'History' }
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="accent-orange-500 w-3 h-3"
                      checked={dashboardOptions[opt.key]}
                      onChange={(e) =>
                        onChangeDashboardOptions({ ...dashboardOptions, [opt.key]: e.target.checked })
                      }
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}

            {/* Search */}
            <label className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-400 focus-within:border-orange-400 transition-colors">
              <Search size={14} />
              <input
                type="search"
                placeholder="Search..."
                aria-label="Search dashboard"
                className="text-xs font-semibold bg-transparent outline-none text-slate-700 placeholder-slate-400 w-32"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
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
    </div>
  );
};

export default AdminOverview;
