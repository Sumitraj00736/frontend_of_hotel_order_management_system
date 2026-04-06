import React from 'react';
import { DollarSign, ArrowDownUp, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const OverviewKpiGrid = ({ report }) => {
  const items = [
    { title: 'Sales', value: report?.totalSales || 0, tone: 'blue', icon: <DollarSign size={18} />, noteIcon: <ArrowUpRight size={14} /> },
    { title: 'Purchase', value: report?.purchase || 0, tone: 'amber', icon: <ArrowDownUp size={18} />, noteIcon: <ArrowDownRight size={14} /> },
    { title: 'Income', value: report?.income || 0, tone: 'green', icon: <TrendingUp size={18} />, noteIcon: <ArrowUpRight size={14} /> },
    { title: 'Expenses', value: report?.expenses || 0, tone: 'red', icon: <TrendingDown size={18} />, noteIcon: <ArrowDownRight size={14} /> }
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
          <div className="dash-kpi-note">{item.noteIcon} No changes!</div>
        </div>
      ))}
      <div className="dash-kpi tone-amber slim">
        <div className="dash-kpi-title">Takeaway Services</div>
        <div className="dash-kpi-value">Rs {report?.takeaway || 0}</div>
      </div>
    </div>
  );
};

export default OverviewKpiGrid;
