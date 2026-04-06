import React from 'react';
import { Calendar } from 'lucide-react';
import LineChart from '../common/LineChart.jsx';

const OrderInsightPanel = ({ series }) => (
  <div className="panel">
    <div className="panel-heading">
      <div>
        <div className="panel-title">Order Insight</div>
        <div className="panel-sub">Here is a live overview of your orders.</div>
      </div>
      <button className="chip ghost"><Calendar size={16} /> Today</button>
    </div>
    <LineChart data={series || []} xKey="month" yKey="orders" />
  </div>
);

export default OrderInsightPanel;
