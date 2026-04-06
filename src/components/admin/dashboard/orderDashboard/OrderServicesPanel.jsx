import React from 'react';
import { Users } from 'lucide-react';

const OrderServicesPanel = () => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">
        <span className="panel-icon green"><Users size={18} /></span>
        Order Services
      </div>
      <div className="panel-sub">Top Services</div>
    </div>
    <div className="empty-illustration">No Orders Yet!</div>
  </div>
);

export default OrderServicesPanel;
