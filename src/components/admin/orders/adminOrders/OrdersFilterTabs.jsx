import React from 'react';

const OrdersFilterTabs = ({ filter, onChange }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <button className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => onChange('active')}>Active Orders</button>
      <button className={`btn ${filter === 'paid' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => onChange('paid')}>Paid Orders</button>
      <button className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => onChange('cancelled')}>Cancelled Orders</button>
    </div>
  );
};

export default OrdersFilterTabs;
