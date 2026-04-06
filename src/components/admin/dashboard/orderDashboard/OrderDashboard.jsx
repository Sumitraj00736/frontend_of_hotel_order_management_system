import React from 'react';
import OrderKpiGrid from './OrderKpiGrid.jsx';
import OrderInsightPanel from './OrderInsightPanel.jsx';
import LiveOrderStatusPanel from './LiveOrderStatusPanel.jsx';
import CheckoutBreakdownPanel from './CheckoutBreakdownPanel.jsx';
import OrderServicesPanel from './OrderServicesPanel.jsx';
import TopSellingTablePanel from './TopSellingTablePanel.jsx';
import SalesBySubmenusPanel from './SalesBySubmenusPanel.jsx';

const OrderDashboard = ({ overview, data }) => {
  return (
    <div className="dash-tab-stack">
      <OrderKpiGrid overview={overview} data={data} />
      <div className="panel-grid two-col">
        <OrderInsightPanel series={data?.orderSeries} />
        <LiveOrderStatusPanel overview={overview} data={data} />
      </div>
      <div className="panel-grid two-col">
        <CheckoutBreakdownPanel />
        <OrderServicesPanel />
      </div>
      <div className="panel-grid two-col">
        <TopSellingTablePanel />
        <SalesBySubmenusPanel />
      </div>
    </div>
  );
};

export default OrderDashboard;
