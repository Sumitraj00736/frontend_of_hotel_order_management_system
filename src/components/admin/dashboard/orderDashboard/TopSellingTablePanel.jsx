import React from 'react';
import { ShoppingBasket } from 'lucide-react';

const TopSellingTablePanel = () => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">
        <span className="panel-icon green"><ShoppingBasket size={18} /></span>
        Top Selling Table
      </div>
      <button className="panel-link">View All</button>
    </div>
    <div className="panel-sub">Here is your top selling table</div>
    <div className="empty-illustration">No Tables Sold Yet!</div>
  </div>
);

export default TopSellingTablePanel;
