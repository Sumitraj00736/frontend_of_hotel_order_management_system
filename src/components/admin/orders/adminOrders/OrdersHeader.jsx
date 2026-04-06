import React from 'react';

const OrdersHeader = ({ title, countLabel }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex gap-2 align-items-center">
        <h5 className="mb-0">{title}</h5>
        <span className="badge bg-secondary px-3 py-2 rounded-pill">{countLabel}</span>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-outline-light" onClick={() => (window.location.href = '/waiter')}>
          + Book Order
        </button>
        <button className="btn btn-primary" onClick={() => (window.location.href = '/admin#tables')}>
          + Add Table
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;
