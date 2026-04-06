import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const FinanceKpiGrid = ({ report, data }) => {
  const kpis = data?.kpis || {};
  const items = [
    { title: 'Sales', value: (kpis.sales ?? report?.totalSales) || 0, tone: 'blue', icon: <DollarSign size={18} /> },
    { title: 'Purchase', value: (kpis.purchase ?? report?.purchase) || 0, tone: 'amber', icon: <ShoppingBag size={18} /> },
    { title: 'Income', value: (kpis.income ?? report?.income) || 0, tone: 'green', icon: <TrendingUp size={18} /> },
    { title: 'Expenses', value: (kpis.expenses ?? report?.expenses) || 0, tone: 'red', icon: <TrendingDown size={18} /> },
    { title: 'Payment In', value: (kpis.paymentIn ?? report?.paymentIn) || 0, tone: 'teal', icon: <ArrowDownLeft size={18} /> },
    { title: 'Payment Out', value: (kpis.paymentOut ?? report?.paymentOut) || 0, tone: 'purple', icon: <ArrowUpRight size={18} /> }
  ];

  return (
    <div className="dash-kpi-grid">
      {items.map((item) => (
        <div key={item.title} className={`dash-kpi tone-${item.tone}`}>
          <div className="dash-kpi-title">
            <span className="kpi-icon">{item.icon}</span>
            {item.title}
          </div>
          <div className="dash-kpi-value">Rs {item.value}</div>
          <div className="dash-kpi-note">No changes!</div>
        </div>
      ))}
    </div>
  );
};

export default FinanceKpiGrid;
