import React from 'react';
import '../../common/css/kitchen/kitchenSidebar.css';

const KitchenSidebar = ({ statusFilter, onChange }) => (
  <div className="sidebar kitchen-sidebar">
    <h5 className="mb-3">Filters</h5>
    <select className="form-select" value={statusFilter} onChange={(e) => onChange(e.target.value)}>
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="preparing">Preparing</option>
      <option value="ready">Ready</option>
      <option value="served">Served</option>
    </select>
  </div>
);

export default KitchenSidebar;
