import React, { useState } from 'react';
import { Plus, ShoppingBag, RotateCw } from 'lucide-react';
import PurchaseBillsTab from './PurchaseBillsTab.jsx';
import PurchaseReturnsTab from './PurchaseReturnsTab.jsx';
import SectionHeader from '../shared/SectionHeader.jsx';
import PurchaseBillFormModal from './PurchaseBillFormModal.jsx';
import PurchaseReturnFormModal from './PurchaseReturnFormModal.jsx';

const TABS = [
  { id: 'bills', label: 'Purchase Bills', icon: ShoppingBag },
  { id: 'returns', label: 'Purchase Returns', icon: RotateCw }
];

export default function PurchaseLayout({ activeTab, onTabChange }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showAddBill, setShowAddBill] = useState(false);
  const [showAddReturn, setShowAddReturn] = useState(false);

  const currentTab = activeTab || 'bills';

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const renderHeaderAction = () => {
    if (currentTab === 'bills') {
      return (
        <button className="fd-action-btn primary" onClick={() => setShowAddBill(true)}>
          <Plus size={16} />
          <span>Add Purchase Bill</span>
        </button>
      );
    }
    if (currentTab === 'returns') {
      return (
        <button className="fd-action-btn primary" onClick={() => setShowAddReturn(true)}>
          <Plus size={16} />
          <span>Add Purchase Return</span>
        </button>
      );
    }
    return null;
  };

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
      >
        {renderHeaderAction()}
      </SectionHeader>

      <div style={{ padding: '0 24px' }}>
        <div className="fd-tab-bar" style={{ marginBottom: '24px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`fd-tab-item ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
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
      
      <PurchaseBillFormModal open={showAddBill} onClose={() => setShowAddBill(false)} onSaved={handleRefresh} />
      <PurchaseReturnFormModal open={showAddReturn} onClose={() => setShowAddReturn(false)} onSaved={handleRefresh} />
    </div>
  );
}
