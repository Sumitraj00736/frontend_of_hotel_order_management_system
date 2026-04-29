import React from 'react';
import { 
  TrendingUp, ShoppingCart, DollarSign, 
  ArrowDownCircle, ArrowUpCircle, Wallet 
} from 'lucide-react';
import { formatMoney } from '../../shared/formatMoney.js';

const KPI_CONFIG = [
  { key: 'sales',      label: 'Sales',       icon: TrendingUp,      color: '#7c3aed' },
  { key: 'purchase',   label: 'Purchase',    icon: ShoppingCart,    color: '#ea580c' },
  { key: 'income',     label: 'Income',      icon: DollarSign,      color: '#16a34a' },
  { key: 'expenses',   label: 'Expenses',    icon: ArrowDownCircle, color: '#dc2626' },
  { key: 'paymentIn',  label: 'Payment In',  icon: ArrowUpCircle,   color: '#0d9488' },
  { key: 'paymentOut', label: 'Payment Out', icon: Wallet,          color: '#9333ea' }
];

const TransactionKpiGrid = ({ kpis }) => {
  if (!kpis) return null;

  return (
    <div className="fd-kpi-grid">
      {KPI_CONFIG.map((item, idx) => (
        <div 
          key={item.key} 
          className="fd-kpi-card"
          style={{ '--card-index': idx }}
        >
          <div 
            className="fd-account-icon" 
            style={{ background: `${item.color}15`, color: item.color }}
          >
            <item.icon size={20} />
          </div>
          <div>
            <div className="fd-account-label">{item.label}</div>
            <div className="fd-account-balance" style={{ fontSize: '18px' }}>
              {formatMoney(kpis[item.key] ?? 0)}
            </div>
          </div>
          <div className="fd-kpi-accent" style={{ background: item.color }} />
        </div>
      ))}
    </div>
  );
};

export default TransactionKpiGrid;
