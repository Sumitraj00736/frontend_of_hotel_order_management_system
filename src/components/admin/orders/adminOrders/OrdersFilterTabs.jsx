import React from 'react';

const OrdersFilterTabs = ({ filter, onChange }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <button 
        className="btn fw-700 rounded-pill px-3 py-1" 
        style={filter === 'active' ? { backgroundColor: '#FC8019', color: '#fff', border: '1px solid #FC8019', fontSize: '0.85rem' } : { backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
        onClick={() => onChange('active')}
      >
        Recent Orders
      </button>
      <button 
        className="btn fw-700 rounded-pill px-3 py-1" 
        style={filter === 'kot' ? { backgroundColor: '#FC8019', color: '#fff', border: '1px solid #FC8019', fontSize: '0.85rem' } : { backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
        onClick={() => onChange('kot')}
      >
        KOT Tab
      </button>
      <button 
        className="btn fw-700 rounded-pill px-3 py-1" 
        style={['paid', 'cancelled', 'all'].includes(filter) ? { backgroundColor: '#FC8019', color: '#fff', border: '1px solid #FC8019', fontSize: '0.85rem' } : { backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
        onClick={() => onChange('all')}
      >
        Order History
      </button>
    </div>
  );
};

export default OrdersFilterTabs;
