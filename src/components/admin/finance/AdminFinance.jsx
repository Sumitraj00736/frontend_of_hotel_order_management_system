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
import '../../../common/css/admin/finance/finance.css';

export default function AdminFinance({ section, onNavigate, financeDashboardData, report, transactionHistory }) {
  const parts = String(section || 'finance:dashboard').split(':');
  const view  = parts[1] || 'dashboard';
  const sub   = parts[2];

  const renderContent = () => {
    if (view === 'dashboard')       return <FinanceDashboard financeDashboardData={financeDashboardData} report={report} transactionHistory={transactionHistory} />;
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
    <div className="finance-container" style={{ display: 'block' }}>
      <main className="fin-content" style={{ height: 'auto', overflowY: 'visible', background: 'transparent' }}>
        {renderContent()}
      </main>
    </div>
  );
}
