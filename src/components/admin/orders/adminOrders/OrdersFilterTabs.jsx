import React from 'react';

const OrdersFilterTabs = ({ filter, onChange }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <button className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => onChange('active')}>Recent Orders</button>
      <button className={`btn ${filter === 'kot' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => onChange('kot')}>KOT Tab</button>
    </div>
  );
};

export default OrdersFilterTabs;
