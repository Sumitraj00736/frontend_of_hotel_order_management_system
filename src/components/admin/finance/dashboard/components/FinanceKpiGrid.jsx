import React from 'react';
import { 
  TrendingUp, ShoppingCart, DollarSign, Receipt, 
  ArrowDownCircle, ArrowUpCircle 
} from 'lucide-react';

const KPI_CONFIG = [
  { key: 'sales',      label: 'Sales',       icon: TrendingUp,      color: '#7c3aed', bg: '#f5f3ff' },
  { key: 'purchase',   label: 'Purchase',    icon: ShoppingCart,    color: '#ea580c', bg: '#fff7ed' },
  { key: 'income',     label: 'Income',      icon: DollarSign,      color: '#16a34a', bg: '#f0fdf4' },
  { key: 'expenses',   label: 'Expenses',    icon: Receipt,         color: '#dc2626', bg: '#fef2f2' },
  { key: 'paymentIn',  label: 'Payment In',  icon: ArrowDownCircle, color: '#0891b2', bg: '#ecfeff' },
  { key: 'paymentOut', label: 'Payment Out', icon: ArrowUpCircle,   color: '#9333ea', bg: '#faf5ff' },
];

function fmt(n) { return `Rs ${Number(n || 0).toLocaleString()}`; }

const FinanceKpiGrid = ({ kpis, loading }) => {
  return (
    <div className="fd-kpi-grid">
      {KPI_CONFIG.map((cfg, index) => {
        const Icon = cfg.icon;
        const val = kpis?.[cfg.key] ?? 0;
        return (
          <div 
            key={cfg.key} 
            className="fd-kpi-card glass-card" 
            style={{ '--card-index': index }}
          >
            <div className="fd-kpi-icon" style={{ background: cfg.bg, color: cfg.color }}>
              <Icon size={20} />
            </div>
            <div className="fd-kpi-body">
              <div className="fd-kpi-label">{cfg.label}</div>
              <div className="fd-kpi-value">{loading ? '—' : fmt(val)}</div>
            </div>
            <div className="fd-kpi-accent" style={{ background: cfg.color }} />
          </div>
        );
      })}
    </div>
  );
};

export default FinanceKpiGrid;
