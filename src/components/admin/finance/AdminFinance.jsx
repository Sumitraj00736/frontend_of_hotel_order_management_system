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

  const navigationItems = [
    { id: 'daybook', label: 'Day Book', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'sales-purchase', label: 'Sales & Purchase', icon: '🛒' },
  ];

  const renderContent = () => {
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
  };

  return (
    <div className="finance-container">
      <div className="finance-sidebar">
        <div className="finance-sidebar-header">
          <h2>Finance</h2>
          <p>Management Dashboard</p>
        </div>
        <nav className="finance-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`finance-nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(`finance:${item.id}`)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="finance-content">
        {renderContent()}
      </div>
    </div>
  );
}
