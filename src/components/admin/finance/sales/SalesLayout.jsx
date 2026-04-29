import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SalesInvoiceTab from './SalesInvoiceTab.jsx';
import SalesReturnsTab from './SalesReturnsTab.jsx';
import SectionHeader from '../shared/SectionHeader.jsx';
import SalesReturnFormModal from './SalesReturnFormModal.jsx';

const TABS = [
  { id: 'invoices', label: 'Sales Invoices' },
  { id: 'returns', label: 'Sales Returns' }
];

export default function SalesLayout({ activeTab, onTabChange }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showAddReturn, setShowAddReturn] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);

  const currentTab = activeTab || 'invoices';

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const renderHeaderAction = () => {
    if (currentTab === 'invoices') {
      return (
        <button className="fd-action-btn primary" onClick={() => setShowAddInvoice(true)}>
          <Plus size={16} />
          <span>New Invoice</span>
        </button>
      );
    }
    if (currentTab === 'returns') {
      return (
        <button className="fd-action-btn primary" onClick={() => setShowAddReturn(true)}>
          <Plus size={16} />
          <span>Add Sales Return</span>
        </button>
      );
    }
    return null;
  };

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
              {tab.label}
            </button>
          ))}
        </div>

        <div className="fd-content-body">
          {currentTab === 'invoices' && (
            <SalesInvoiceTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />
          )}
          {currentTab === 'returns' && (
            <SalesReturnsTab 
              dateFrom={dateFrom} 
              dateTo={dateTo} 
              refreshKey={refreshKey} 
              setLoading={setLoading}
              showAddExternal={showAddReturn}
              setShowAddExternal={setShowAddReturn}
            />
          )}
        </div>
      </div>
      
      <SalesReturnFormModal open={showAddReturn} onClose={() => setShowAddReturn(false)} onSaved={handleRefresh} />
      {/* Sales Invoice Modal could be added here if needed */}
    </div>
  );
}
