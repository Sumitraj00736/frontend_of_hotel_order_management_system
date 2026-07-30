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
    <div className="flex flex-col gap-6">
      <OrderKpiGrid overview={overview} data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderInsightPanel series={data?.orderSeries} />
        <LiveOrderStatusPanel overview={overview} data={data} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CheckoutBreakdownPanel />
        <OrderServicesPanel />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingTablePanel />
        <SalesBySubmenusPanel />
      </div>
    </div>
  );
};

export default OrderDashboard;
