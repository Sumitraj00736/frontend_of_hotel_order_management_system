import React from 'react';

const OrdersFilterTabs = ({ filter, onChange }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <button 
        className={`btn orders-filter-btn ${filter === 'active' ? 'active' : ''}`} 
        onClick={() => onChange('active')}
      >
        Recent Orders
      </button>
      <button 
        className={`btn orders-filter-btn ${filter === 'kot' ? 'active' : ''}`} 
        onClick={() => onChange('kot')}
      >
        KOT Tab
      </button>
      <button 
        className={`btn orders-filter-btn ${['paid', 'cancelled', 'all'].includes(filter) ? 'active' : ''}`} 
        onClick={() => onChange('all')}
      >
        Order History
      </button>
      <button 
        className={`btn orders-filter-btn ${filter === 'analytics' ? 'active' : ''}`} 
        onClick={() => onChange('analytics')}
      >
        Order Analytics
      </button>
    </div>
  );
};

export default OrdersFilterTabs;
