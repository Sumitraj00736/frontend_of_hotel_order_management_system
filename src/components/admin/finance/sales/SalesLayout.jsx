import React, { useState } from 'react';
import SalesInvoiceTab from './SalesInvoiceTab.jsx';
import SalesReturnsTab from './SalesReturnsTab.jsx';
import SectionHeader from '../shared/SectionHeader.jsx';

const TABS = [
  { id: 'invoices', label: 'Sales Invoices' },
  { id: 'returns', label: 'Sales Returns' }
];

export default function SalesLayout({ activeTab, onTabChange }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentTab = activeTab || 'invoices';

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="fd-root">
      <SectionHeader 
        title="Sales Management"
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onRefresh={handleRefresh}
        loading={loading}
      />

      <div style={{ padding: '0 24px' }}>
        <div className="fd-tab-bar" style={{ marginBottom: '24px' }}>
          {TABS.map(tab => (
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
          {currentTab === 'invoices' && (
            <SalesInvoiceTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
          {currentTab === 'returns' && (
            <SalesReturnsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
