import React from 'react';
import { PanelsTopLeft } from 'lucide-react';

const SalesBySubmenusPanel = () => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">
        <span className="panel-icon green"><PanelsTopLeft size={18} /></span>
        Sales by Submenus
      </div>
      <button className="panel-link">View All</button>
    </div>
    <div className="panel-sub">Top Submenus</div>
    <div className="empty-illustration">No Sub Menus Sold Yet!</div>
  </div>
);

export default SalesBySubmenusPanel;
