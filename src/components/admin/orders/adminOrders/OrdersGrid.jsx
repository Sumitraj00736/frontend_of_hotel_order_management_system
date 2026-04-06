import React from 'react';
import OrderCard from './OrderCard.jsx';

const OrdersGrid = ({ orders, onOpen }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <div className="fs-1">🧾</div>
        <div>No orders in this category</div>
      </div>
    );
  }

  return (
    <div className="orders-grid kot-grid">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default OrdersGrid;
