import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCompactCurrency } from './financeUtils.js';

const FinanceKpiGrid = ({ report, data }) => {
  const kpis = data?.kpis || {};
  const items = [
    {
      title: 'Sales',
      value: (kpis.sales ?? report?.totalSales) || 0,
      tone: 'blue',
      icon: <DollarSign size={18} />,
      note: 'Gross revenue captured'
    },
    {
      title: 'Purchase',
      value: (kpis.purchase ?? report?.purchase) || 0,
      tone: 'amber',
      icon: <ShoppingBag size={18} />,
      note: 'Supplier-side buying'
    },
    {
      title: 'Income',
      value: (kpis.income ?? report?.income) || 0,
      tone: 'green',
      icon: <TrendingUp size={18} />,
      note: 'Total money coming in'
    },
    {
      title: 'Expenses',
      value: (kpis.expenses ?? report?.expenses) || 0,
      tone: 'red',
      icon: <TrendingDown size={18} />,
      note: 'Operational spend'
    },
    {
      title: 'Payment In',
      value: (kpis.paymentIn ?? report?.paymentIn) || 0,
      tone: 'teal',
      icon: <ArrowDownLeft size={18} />,
      note: 'Collections received'
    },
    {
      title: 'Payment Out',
      value: (kpis.paymentOut ?? report?.paymentOut) || 0,
      tone: 'purple',
      icon: <ArrowUpRight size={18} />,
      note: 'Payouts completed'
    }
  ];

  return (
    <div className="dash-kpi-grid finance-kpi-grid">
      {items.map((item) => (
        <div key={item.title} className={`dash-kpi tone-${item.tone} finance-kpi-card`}>
          <div className="dash-kpi-title finance-kpi-head">
            <div className="dash-kpi-title-main">
              <span className="kpi-icon">{item.icon}</span>
              {item.title}
            </div>
            <span className="finance-kpi-chip">{item.note}</span>
          </div>
          <div className="dash-kpi-value">{formatCompactCurrency(item.value)}</div>
          <div className="dash-kpi-note">{item.note}</div>
        </div>
      ))}
    </div>
  );
};

export default FinanceKpiGrid;
