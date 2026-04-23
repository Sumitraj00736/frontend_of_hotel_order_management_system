import React from 'react';

const OrdersFilterTabs = ({ filter, onChange }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <button 
        className="btn fw-600 rounded-pill px-4" 
        style={filter === 'active' ? { backgroundColor: '#FC8019', color: '#fff', border: '1px solid #FC8019' } : { backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}
        onClick={() => onChange('active')}
      >
        Recent Orders
      </button>
      <button 
        className="btn fw-600 rounded-pill px-4" 
        style={filter === 'kot' ? { backgroundColor: '#FC8019', color: '#fff', border: '1px solid #FC8019' } : { backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}
        onClick={() => onChange('kot')}
      >
        KOT Tab
      </button>
      <button 
        className="btn fw-600 rounded-pill px-4" 
        style={['paid', 'cancelled', 'all'].includes(filter) ? { backgroundColor: '#FC8019', color: '#fff', border: '1px solid #FC8019' } : { backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}
        onClick={() => onChange('all')}
      >
        Order History
      </button>
    </div>
  );
};

export default OrdersFilterTabs;
