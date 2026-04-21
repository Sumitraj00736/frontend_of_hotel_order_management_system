import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import LineChart from '../common/LineChart.jsx';
import { formatCompactCurrency } from './financeUtils.js';

const FinanceSalesOverview = ({ series, report }) => {
  const chartSeries = series || [];
  const values = chartSeries.map((item) => Number(item?.sales || item?.value || 0));
  const highest = values.length ? Math.max(...values) : 0;
  const lowest = values.length ? Math.min(...values) : 0;
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

  return (
    <div className="panel finance-chart-panel">
      <div className="panel-heading finance-panel-heading">
        <div>
          <div className="panel-title">
            <span className="panel-icon">
              <Sparkles size={18} />
            </span>
            Revenue flow
          </div>
          <div className="panel-sub">A visual view of how sales are moving across the selected period.</div>
        </div>
        <button className="chip ghost"><Calendar size={16} /> Active Range</button>
      </div>
      <div className="finance-chart-body">
        <div className="finance-chart-stats">
          <div className="finance-chart-stat">
            <span>Peak</span>
            <strong>{formatCompactCurrency(highest)}</strong>
          </div>
          <div className="finance-chart-stat">
            <span>Average</span>
            <strong>{formatCompactCurrency(average)}</strong>
          </div>
          <div className="finance-chart-stat">
            <span>Floor</span>
            <strong>{formatCompactCurrency(lowest)}</strong>
          </div>
          <div className="finance-chart-stat">
            <span>Net sales</span>
            <strong>{formatCompactCurrency(report?.totalSales || 0)}</strong>
          </div>
        </div>
        <div className="finance-chart-canvas">
          <LineChart data={chartSeries} xKey="month" yKey="sales" />
        </div>
      </div>
    </div>
  );
};

export default FinanceSalesOverview;
