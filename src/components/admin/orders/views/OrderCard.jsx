import React, { useState } from 'react';
import { Plus, Printer, FileText, Utensils, Bike, ShoppingBag, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
};

const OrderCard = ({ order, onOpen, onPrint }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Derive display values
  let identifierStr = `Table ${order.table?.tableNumber || '?'}`;
  let TypeIcon = Utensils;

  if (order.orderType === 'delivery') {
    identifierStr = `Delivery #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
    TypeIcon = Truck;
  } else if (order.orderType === 'takeaway') {
    identifierStr = `Takeaway #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
    TypeIcon = ShoppingBag;
  } else if (order.orderType === 'pickup') {
    identifierStr = `Pickup #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
    TypeIcon = Bike;
  }
  
  const typeStr = order.orderType === 'dine_in' ? 'Dine In' :
                  order.orderType === 'delivery' ? 'Delivery' :
                  order.orderType === 'pickup' ? 'Pick up' : 'Takeaway';

  const timeStr = timeAgo(order.createdAt);
  const totalDishes = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmt = order.finalAmount || order.totalAmount || 0;

  return (
    <div 
      className="relative w-full h-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Orange accent line on top that expands on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-orange-500 transition-colors duration-300" />

      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div 
            key="normal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full p-5"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 truncate max-w-[150px]" title={identifierStr}>
                  {identifierStr}
                </h3>
                <span className="flex items-center gap-1 mt-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <TypeIcon size={12} className="text-orange-500" />
                  {typeStr}
                </span>
              </div>
              <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                {timeStr}
              </span>
            </div>
            
            {/* Card Items List */}
            <div className="flex-1 bg-orange-50/30 rounded-xl p-3 border border-orange-100/40 flex flex-col gap-2 overflow-hidden">
              {order.items.slice(0, 3).map((item, idx) => (
                <div className="flex justify-between items-center text-xs text-slate-600" key={idx}>
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="font-medium truncate">{item.menuItem?.name || item.name || 'Item'}</span>
                  </div>
                  <span className="font-extrabold text-slate-700">x{item.quantity}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="text-[10px] text-slate-400 italic pl-3.5 mt-1">
                  +{order.items.length - 3} more items...
                </div>
              )}
            </div>
            
            {/* Card Footer */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-4">
              <span className="text-xs font-semibold text-slate-500">{totalDishes} Dishes</span>
              <span className="text-base font-black text-slate-800">₹{totalAmt.toLocaleString()}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="hover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-white to-orange-50/35 text-center"
          >
            <h3 className="text-2xl font-black text-slate-800 mb-1">₹{totalAmt.toLocaleString()}</h3>
            <p className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-6">Quick Actions</p>
            
            {/* Icon Actions */}
            <div className="flex gap-2.5 mb-6">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 flex items-center justify-center text-slate-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={() => onOpen(order, true)} 
                title="Add Items" 
                disabled={order.status === 'paid'}
              >
                <Plus size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 flex items-center justify-center text-slate-600 transition-colors shadow-sm" 
                onClick={() => onPrint?.(order._id, 'bill')} 
                title="Print Bill"
              >
                <Printer size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 flex items-center justify-center text-slate-600 transition-colors shadow-sm" 
                onClick={() => onOpen(order)} 
                title="View Details"
              >
                <FileText size={18} />
              </motion.button>
            </div>
            
            {/* Primary Action Button */}
            {order.status === 'paid' ? (
              <div className="w-full py-2.5 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-600 font-extrabold text-xs uppercase tracking-wider shadow-sm">
                Paid
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-orange-500/10 transition-all" 
                onClick={() => onOpen(order)}
              >
                Confirm & Checkout
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderCard;
