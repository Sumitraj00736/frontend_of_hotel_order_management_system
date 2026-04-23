import React from 'react';
import RecentOrderCard from './RecentOrderCard.jsx';
import KotTicketCard from './KotTicketCard.jsx';

const OrdersGrid = ({ orders, onOpen, filter, onStatusChange, onPrint }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <div className="fs-1">🧾</div>
        <div>No orders in this category</div>
      </div>
    );
  }

  return (
    <div className={`orders-grid ${filter === 'kot' ? 'kot-ticket-masons' : 'kot-grid'}`} style={{ display: 'grid', gridTemplateColumns: filter === 'kot' ? 'repeat(auto-fill, minmax(320px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {orders.map((order) => {
        if (filter === 'kot') {
          return <KotTicketCard key={order._id} order={order} onStatusChange={onStatusChange} onPrint={onPrint} />;
        }
        return <RecentOrderCard key={order._id} order={order} onOpen={onOpen} />;
      })}
    </div>
  );
};

export default OrdersGrid;
