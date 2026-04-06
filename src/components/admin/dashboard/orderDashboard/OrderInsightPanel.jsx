import React from 'react';
import { Calendar } from 'lucide-react';

const OrderInsightPanel = () => (
  <div className="panel">
    <div className="panel-heading">
      <div>
        <div className="panel-title">Order Insight</div>
        <div className="panel-sub">Here is a live overview of your orders.</div>
      </div>
      <button className="chip ghost"><Calendar size={16} /> Today</button>
    </div>
    <div className="chart-placeholder">Line chart placeholder</div>
  </div>
);

export default OrderInsightPanel;
