import React from 'react';
import { Search, MoreHorizontal, Plus } from 'lucide-react';

const CustomerHeader = ({ search, onSearch, onAdd, onMenuToggle }) => (
  <div className="customers-header-container">
    <div className="header-title-group">
      <h1 className="customers-title">Customers</h1>
      <p className="customers-subtitle">Manage customer accounts and balances</p>
    </div>
    
    <div className="customers-actions-group">
      <div className="customers-search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="header-search-input"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
        />
      </div>
      
      <div className="button-group">
        <button className="add-customer-btn" onClick={onAdd}>
          <Plus size={18} />
          <span>Add New</span>
        </button>
        
        <button className="header-menu-btn" onClick={onMenuToggle} aria-label="More options">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  </div>
);

export default CustomerHeader;