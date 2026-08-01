/**
 * kitchen/orders/KitchenOrdersGrid.jsx
 * Responsive grid wrapper for kitchen order cards.
 * AnimatePresence ensures slide-in runs on each new card mount.
 * All styling via Tailwind CSS (no custom CSS imports).
 */
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import KitchenOrderCard from './KitchenOrderCard.jsx';

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
      <ShoppingBag size={28} className="text-orange-300" />
    </div>
    <h3 className="text-[15px] font-bold text-slate-600">No orders right now</h3>
    <p className="text-[13px] text-slate-400 mt-1">New orders will appear here automatically</p>
  </div>
);

const KitchenOrdersGrid = ({ orders, onUpdateStatus }) => {
  if (!orders || orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
      <AnimatePresence>
        {orders.map((order) => (
          <KitchenOrderCard
            key={order._id}
            order={order}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default KitchenOrdersGrid;
