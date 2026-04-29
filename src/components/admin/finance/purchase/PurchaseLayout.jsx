import React, { useState } from 'react';
import PurchaseBillsTab from './PurchaseBillsTab.jsx';
import PurchaseReturnsTab from './PurchaseReturnsTab.jsx';
import SectionHeader from '../shared/SectionHeader.jsx';

const TABS = [
  { id: 'bills', label: 'Purchase Bills' },
  { id: 'returns', label: 'Purchase Returns' }
];

export default function PurchaseLayout({ activeTab, onTabChange }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentTab = activeTab || 'bills';

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="fd-root">
      <SectionHeader 
        title="Purchase Management"
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
          {currentTab === 'bills' && (
            <PurchaseBillsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
          {currentTab === 'returns' && (
            <PurchaseReturnsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
