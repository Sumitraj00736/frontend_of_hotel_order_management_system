import React from 'react';
import { 
  ShoppingBag, TrendingUp, CreditCard, Layers 
} from 'lucide-react';
import { formatMoney } from '../../shared/formatMoney.js';

const SalesInvoiceKpiGrid = ({ summary }) => {
  if (!summary) return null;

  const items = [
    { label: 'Total Orders', value: summary.totalOrders ?? 0, icon: ShoppingBag, color: '#7c3aed' },
    { label: 'Total Sales', value: formatMoney(summary.totalSales), icon: TrendingUp, color: '#16a34a' },
    { label: 'Top Payment', value: summary.leadingPaymentMode || '—', icon: CreditCard, color: '#f5a524' },
    { label: 'Top Type', value: summary.mostUsedOrderType || '—', icon: Layers, color: '#0d9488' }
  ];

  return (
    <div className="fd-kpi-grid">
      {items.map((item, idx) => (
        <div key={idx} className="fd-kpi-card" style={{ '--card-index': idx }}>
          <div className="fd-account-icon" style={{ background: `${item.color}15`, color: item.color }}>
            <item.icon size={20} />
          </div>
          <div>
            <div className="fd-account-label">{item.label}</div>
            <div className="fd-account-balance" style={{ fontSize: '18px' }}>{item.value}</div>
          </div>
          <div className="fd-kpi-accent" style={{ background: item.color }} />
        </div>
      ))}
    </div>
  );
};

export default SalesInvoiceKpiGrid;
