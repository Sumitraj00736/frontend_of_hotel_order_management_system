import React from 'react';
import { Calendar } from 'lucide-react';

const FinanceSalesOverview = () => (
  <div className="panel">
    <div className="panel-heading">
      <div>
        <div className="panel-title">Sales Overview</div>
        <div className="panel-sub">Here is a live overview of your sales</div>
      </div>
      <button className="chip ghost"><Calendar size={16} /> Today</button>
    </div>
    <div className="chart-placeholder">Line chart placeholder</div>
  </div>
);

export default FinanceSalesOverview;
