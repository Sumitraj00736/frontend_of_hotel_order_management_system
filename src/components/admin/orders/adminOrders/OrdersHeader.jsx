import React from 'react';

const OrdersHeader = ({ title, countLabel, onNewOrder }) => {
  return (
    <div className="orders-header-container d-flex justify-content-between align-items-center p-3 mb-0 bg-white border-bottom">
      <div className="d-flex gap-3 align-items-center">
        <h4 className="fw-800 m-0 text-dark" style={{ letterSpacing: '-0.02em' }}>{title}</h4>
        <div className="orders-count-pill">
          {countLabel}
        </div>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-light border fw-600 rounded-3 shadow-sm px-3" onClick={onNewOrder}>
           + New Order
        </button>
        <button className="btn btn-primary fw-600 rounded-3 shadow-sm px-3" onClick={() => (window.location.href = '/admin#tables')}>
          + Add Table
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;
