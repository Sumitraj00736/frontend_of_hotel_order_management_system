import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';

const CustomerHeader = ({ search, onSearch, onAdd, onMenuToggle }) => (
  <div className="customers-header">
    <div>
      <div className="customers-title">Customers</div>
      <div className="customers-subtitle">Manage customer accounts</div>
    </div>
    <div className="customers-actions">
      <div className="customers-search">
        <Search size={16} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search"
        />
      </div>
      <button className="btn-primary" onClick={onAdd}>+ Add New</button>
      <button className="icon-btn" onClick={onMenuToggle}>
        <MoreHorizontal size={18} />
      </button>
    </div>
  </div>
);

export default CustomerHeader;
