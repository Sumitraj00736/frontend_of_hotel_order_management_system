import React from 'react';
import SalesPurchaseTabs from './SalesPurchaseTabs.jsx';
import SalesInvoiceTab from './SalesInvoiceTab.jsx';
import PurchaseBillsTab from './PurchaseBillsTab.jsx';
import SalesReturnsTab from './SalesReturnsTab.jsx';
import PurchaseReturnsTab from './PurchaseReturnsTab.jsx';
import '../../../../common/css/admin/finance/finance.css';

export default function SalesPurchaseLayout({ activeTab, onTabChange }) {
  const tab = activeTab || 'sales-invoices';

  return (
    <div className="finance-screen">
      <div className="finance-page-head">
        <div>
          <h1 className="finance-page-title">Sales & Purchase</h1>
          <div className="finance-breadcrumb">Finance / Sales & Purchase</div>
        </div>
      </div>
      <SalesPurchaseTabs active={tab} onChange={onTabChange} />
      {tab === 'sales-invoices' && <SalesInvoiceTab />}
      {tab === 'purchase-bills' && <PurchaseBillsTab />}
      {tab === 'sales-returns' && <SalesReturnsTab />}
      {tab === 'purchase-returns' && <PurchaseReturnsTab />}
    </div>
  );
}
