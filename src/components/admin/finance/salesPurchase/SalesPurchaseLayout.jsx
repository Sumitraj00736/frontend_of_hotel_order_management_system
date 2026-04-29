import React, { useState } from 'react';
import SalesInvoiceTab from './SalesInvoiceTab.jsx';
import PurchaseBillsTab from './PurchaseBillsTab.jsx';
import SalesReturnsTab from './SalesReturnsTab.jsx';
import PurchaseReturnsTab from './PurchaseReturnsTab.jsx';
import SectionHeader from './components/SectionHeader.jsx';

const MODULE_TABS = {
  sales: [
    { id: 'sales-invoices', label: 'Sales Invoices' },
    { id: 'sales-returns', label: 'Sales Returns' }
  ],
  purchase: [
    { id: 'purchase-bills', label: 'Purchase Bills' },
    { id: 'purchase-returns', label: 'Purchase Returns' }
  ]
};

export default function SalesPurchaseLayout({ module = 'sales', activeTab, onTabChange }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const tabs = MODULE_TABS[module] || MODULE_TABS.sales;
  const currentTab = activeTab || tabs[0].id;

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="fd-root">
      <SectionHeader 
        title={module === 'sales' ? 'Sales Management' : 'Purchase Management'}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onRefresh={handleRefresh}
        loading={loading}
      />

      <div style={{ padding: '0 24px' }}>
        <div className="fd-tab-bar" style={{ marginBottom: '24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`fd-tab-item ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="fd-content-body">
          {currentTab === 'sales-invoices' && (
            <SalesInvoiceTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
          {currentTab === 'purchase-bills' && (
            <PurchaseBillsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
          {currentTab === 'sales-returns' && (
            <SalesReturnsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
          {currentTab === 'purchase-returns' && (
            <PurchaseReturnsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
