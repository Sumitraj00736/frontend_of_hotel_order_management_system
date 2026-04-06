import React from 'react';
import { UtensilsCrossed, CheckSquare, ClipboardList, Calculator } from 'lucide-react';

const OrderKpiGrid = ({ overview, data }) => {
  const kpis = data?.kpis || {};
  const items = [
    { title: 'Sales', value: (kpis.sales ?? overview?.orderSales) || 0, tone: 'green', icon: <UtensilsCrossed size={18} /> },
    { title: 'Order Served', value: (kpis.orderServed ?? overview?.served) || 0, tone: 'amber', icon: <CheckSquare size={18} /> },
    { title: 'KOT Taken', value: (kpis.kotTaken ?? overview?.kot) || 0, tone: 'blue', icon: <ClipboardList size={18} /> },
    { title: 'Avg Order Amount', value: (kpis.avgOrderAmount ?? overview?.avgOrder) || 0, tone: 'pink', icon: <Calculator size={18} /> }
  ];

  return (
    <div className="dash-kpi-grid order-kpi-grid">
      {items.map((item) => (
        <div key={item.title} className={`dash-kpi tone-${item.tone}`}>
          <div className="dash-kpi-title">
            <span className="kpi-icon">{item.icon}</span>
            {item.title}
          </div>
          <div className="dash-kpi-value">{item.title === 'Sales' ? 'Rs ' : ''}{item.value}</div>
          <div className="dash-kpi-note">No changes!</div>
        </div>
      ))}
    </div>
  );
};

export default OrderKpiGrid;
