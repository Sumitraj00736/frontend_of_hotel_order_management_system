import React from 'react';
import DayBookPage from './dayBook/DayBookPage.jsx';
import DayBookHistoryPage from './dayBook/DayBookHistoryPage.jsx';
import TransactionsPage from './transactions/TransactionsPage.jsx';
import SalesPurchaseLayout from './salesPurchase/SalesPurchaseLayout.jsx';

/**
 * section examples:
 * - finance:daybook
 * - finance:daybook-history
 * - finance:transactions
 * - finance:sales-purchase:sales-invoices
 */
export default function AdminFinance({ section, onNavigate }) {
  const parts = String(section || 'finance:daybook').split(':');
  const view = parts[1] || 'daybook';
  const sub = parts[2];

  if (view === 'daybook-history') {
    return <DayBookHistoryPage onBack={() => onNavigate('finance:daybook')} />;
  }

  if (view === 'daybook') {
    return <DayBookPage onNavigateHistory={() => onNavigate('finance:daybook-history')} />;
  }

  if (view === 'transactions') {
    return <TransactionsPage />;
  }

  if (view === 'sales-purchase') {
    const tab = sub || 'sales-invoices';
    return (
      <SalesPurchaseLayout
        activeTab={tab}
        onTabChange={(id) => onNavigate(`finance:sales-purchase:${id}`)}
      />
    );
  }

  return <DayBookPage onNavigateHistory={() => onNavigate('finance:daybook-history')} />;
}
