import React from 'react';
import RecentOrderCard from '../cards/RecentOrderCard.jsx';
import KotTicketCard from '../cards/KotTicketCard.jsx';

const OrdersGrid = ({ orders, onOpen, filter, onStatusChange, onPrint }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-5 rounded-4">
        <div className="fs-1 mb-2">🍽️</div>
        <div className="fw-700 text-dark opacity-75">No orders found here</div>
        <div className="text-muted small">Your active and historical orders will appear in this space.</div>
      </div>
    );
  }

  return (
    <div className={`orders-grid ${filter === 'kot' ? 'kot-ticket-masons' : 'kot-grid'}`}>
      {orders.map((order) => {
        if (filter === 'kot') {
          return <KotTicketCard key={order._id} order={order} onStatusChange={onStatusChange} onPrint={onPrint} />;
        }
        return <RecentOrderCard key={order._id} order={order} onOpen={onOpen} onPrint={onPrint} />;
      })}
    </div>
  );
};

export default OrdersGrid;
