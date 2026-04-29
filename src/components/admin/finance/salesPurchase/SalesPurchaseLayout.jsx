import React, { useState, useCallback } from 'react';
import SalesPurchaseTabs from './SalesPurchaseTabs.jsx';
import SalesInvoiceTab from './SalesInvoiceTab.jsx';
import PurchaseBillsTab from './PurchaseBillsTab.jsx';
import SalesReturnsTab from './SalesReturnsTab.jsx';
import PurchaseReturnsTab from './PurchaseReturnsTab.jsx';
import '../../../../common/css/admin/finance/finance.css';

// Modular Components
import SalesPurchaseHeader from './components/SalesPurchaseHeader.jsx';
import SalesPurchaseFilters from './components/SalesPurchaseFilters.jsx';

export default function SalesPurchaseLayout({ activeTab, onTabChange }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const tab = activeTab || 'sales-invoices';

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="fd-root">
      <SalesPurchaseHeader>
        <SalesPurchaseFilters 
          dateFrom={dateFrom} 
          setDateFrom={setDateFrom} 
          dateTo={dateTo} 
          setDateTo={setDateTo} 
          loading={loading}
          onRefresh={handleRefresh}
        />
      </SalesPurchaseHeader>

      <SalesPurchaseTabs active={tab} onChange={onTabChange} />

      <div style={{ marginTop: '24px' }}>
        {tab === 'sales-invoices' && <SalesInvoiceTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />}
        {tab === 'purchase-bills' && <PurchaseBillsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />}
        {tab === 'sales-returns' && <SalesReturnsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />}
        {tab === 'purchase-returns' && <PurchaseReturnsTab dateFrom={dateFrom} dateTo={dateTo} refreshKey={refreshKey} setLoading={setLoading} />}
      </div>
    </div>
  );
}
