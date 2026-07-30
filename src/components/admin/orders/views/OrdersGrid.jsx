import React from 'react';
import OrderCard from './OrderCard.jsx';
import KotTicketCard from './KotTicketCard.jsx';

const OrdersGrid = ({ orders, onOpen, filter, onStatusChange, onPrint }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <span className="text-4xl mb-3">🍽️</span>
        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">No orders found here</h4>
        <p className="text-xs font-semibold text-slate-400 mt-1 max-w-xs">
          Your active and historical orders will appear in this space.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {orders.map((order) => {
        if (filter === 'kot') {
          return (
            <KotTicketCard 
              key={order._id} 
              order={order} 
              onStatusChange={onStatusChange} 
              onPrint={onPrint} 
            />
          );
        }
        return (
          <OrderCard 
            key={order._id} 
            order={order} 
            onOpen={onOpen} 
            onPrint={onPrint} 
          />
        );
      })}
    </div>
  );
};

export default OrdersGrid;
