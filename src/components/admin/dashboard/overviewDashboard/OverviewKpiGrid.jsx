import React from 'react';
import { DollarSign, ArrowDownUp, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const OverviewKpiGrid = ({ report }) => {
  const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;
  const items = [
    { title: 'Sales', value: report?.totalSales || 0, tone: 'orange', icon: <DollarSign size={18} />, noteIcon: <ArrowUpRight size={14} />, action: 'View Breakdowns' },
    { title: 'Purchase', value: report?.purchase || 0, tone: 'sand', icon: <ArrowDownUp size={18} />, noteIcon: <ArrowDownRight size={14} />, action: 'Add Purchase' },
    { title: 'Income', value: report?.income || 0, tone: 'mint', icon: <TrendingUp size={18} />, noteIcon: <ArrowUpRight size={14} />, action: null },
    { title: 'Expenses', value: report?.expenses || 0, tone: 'cream', icon: <TrendingDown size={18} />, noteIcon: <ArrowDownRight size={14} />, action: null }
  ];

  return (
    <div className="dash-kpi-grid">
      {items.map((item) => (
        <div key={item.title} className={`dash-kpi tone-${item.tone}`}>
          <div className="dash-kpi-title">
            <div className="dash-kpi-title-main">
              <span className="kpi-icon">{item.icon}</span>
              <span>{item.title}</span>
            </div>
            {item.action && <button className="dash-kpi-action">{item.action}</button>}
          </div>
          <div className="dash-kpi-value">{formatCurrency(item.value)}</div>
          <div className="dash-kpi-note">{item.noteIcon} No changed</div>
        </div>
      ))}
    </div>
  );
};

export default OverviewKpiGrid;
