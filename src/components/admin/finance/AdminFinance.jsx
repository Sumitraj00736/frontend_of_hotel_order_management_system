import React from 'react';
import FinanceDashboard from './dashboard/FinanceDashboard.jsx';
import DayBookPage from './dayBook/DayBookPage.jsx';
import DayBookHistoryPage from './dayBook/DayBookHistoryPage.jsx';
import TransactionsPage from './transactions/TransactionsPage.jsx';
import SalesPurchaseLayout from './salesPurchase/SalesPurchaseLayout.jsx';
import IncomePage from './income/IncomePage.jsx';
import ExpensesPage from './expenses/ExpensesPage.jsx';
import PaymentsPage from './payments/PaymentsPage.jsx';
import CashBanksPage from './cashbanks/CashBanksPage.jsx';
import FinanceReports from './reports/FinanceReports.jsx';
import { ChevronLeft } from 'lucide-react';
import '../../../common/css/admin/finance/finance.css';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',       icon: '🏠' },
  { id: 'transactions', label: 'Transactions',     icon: '↕️' },
  { id: 'daybook',      label: 'Day Book',         icon: '📖' },
  { id: 'sales-purchase', label: 'Sales',          icon: '🧾', sub: 'sales-invoices' },
  { id: 'purchase',     label: 'Purchase',         icon: '🛒', sub: 'purchase-bills' },
  { id: 'income',       label: 'Income',           icon: '💰' },
  { id: 'expenses',     label: 'Expenses',         icon: '💸' },
  { id: 'payments',     label: 'Payments',         icon: '💳' },
  { id: 'cashbanks',    label: 'Cash & Banks',     icon: '🏦' },
  { id: 'reports',      label: 'Reports',          icon: '📊' },
];

export default function AdminFinance({ section, onNavigate }) {
  const parts = String(section || 'finance:dashboard').split(':');
  const view  = parts[1] || 'dashboard';
  const sub   = parts[2];

  const activeId = view === 'sales-purchase' || view === 'purchase' ? 'sales-purchase' : view;

  const renderContent = () => {
    if (view === 'dashboard')       return <FinanceDashboard />;
    if (view === 'daybook-history') return <DayBookHistoryPage onBack={() => onNavigate('finance:daybook')} />;
    if (view === 'daybook')         return <DayBookPage onNavigateHistory={() => onNavigate('finance:daybook-history')} />;
    if (view === 'transactions')    return <TransactionsPage />;
    if (view === 'income')          return <IncomePage />;
    if (view === 'expenses')        return <ExpensesPage />;
    if (view === 'payments')        return <PaymentsPage />;
    if (view === 'cashbanks')       return <CashBanksPage />;
    if (view === 'reports')         return <FinanceReports />;
    if (view === 'sales-purchase' || view === 'purchase') {
      const tab = sub || (view === 'purchase' ? 'purchase-bills' : 'sales-invoices');
      return (
        <SalesPurchaseLayout
          activeTab={tab}
          onTabChange={(id) => onNavigate(`finance:sales-purchase:${id}`)}
        />
      );
    }
    return <FinanceDashboard />;
  };

  return (
    <div className="finance-container">
      {/* ── Sidebar ── */}
      <aside className="fin-sidebar">
        <div className="fin-sidebar-top">
          <button className="fin-back-btn" onClick={() => onNavigate?.('dashboard')}>
            <ChevronLeft size={16} />
          </button>
          <span className="fin-sidebar-title">Finance</span>
        </div>

        <nav className="fin-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = view === item.id ||
              (item.id === 'sales-purchase' && view === 'purchase') ||
              (item.id === 'sales-purchase' && view === 'sales-purchase');
            return (
              <button
                key={item.id}
                className={`fin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.id === 'purchase') {
                    onNavigate(`finance:sales-purchase:purchase-bills`);
                  } else if (item.sub) {
                    onNavigate(`finance:${item.id}:${item.sub}`);
                  } else {
                    onNavigate(`finance:${item.id}`);
                  }
                }}
              >
                <span className="fin-nav-icon">{item.icon}</span>
                <span className="fin-nav-label">{item.label}</span>
                {isActive && <span className="fin-nav-indicator" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Content ── */}
      <main className="fin-content">
        {renderContent()}
      </main>
    </div>
  );
}
