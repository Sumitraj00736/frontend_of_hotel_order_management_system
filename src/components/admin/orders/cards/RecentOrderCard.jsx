import React, { useState } from 'react';
import { Plus, Printer, FileText, Zap, Utensils, Bike, ShoppingBag, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../../../common/css/admin/orders/recentOrderCard.css';

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec} secs ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mins ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hrs ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks} weeks ago`;
};

const RecentOrderCard = ({ order, onOpen, onPrint }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Derive display values
  let identifierStr = `Table ${order.table?.tableNumber || '?'}`;
  let TypeIcon = Utensils;

  if (order.orderType === 'delivery') {
    identifierStr = `Delivery #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
    TypeIcon = Truck;
  }
  if (order.orderType === 'takeaway') {
    identifierStr = `Takeaway #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
    TypeIcon = ShoppingBag;
  }
  if (order.orderType === 'pickup') {
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
    <div className="recent-order-container">
      <div 
        className="recent-order-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div 
              key="normal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="roc-normal-state"
            >
              <div className="roc-header">
                <div className="d-flex flex-column gap-1" style={{ minHeight: '44px', justifyContent: 'center' }}>
                  <h5 className="recent-order-title m-0 text-truncate" style={{ maxWidth: '160px' }}>{identifierStr}</h5>
                  <span className="roc-type">
                    <TypeIcon size={13} strokeWidth={2.5} color="#FC8019" />
                    {typeStr}
                  </span>
                </div>
                <div className="d-flex flex-column align-items-end gap-1">
                  <span className="roc-time">{timeStr}</span>
                </div>
              </div>
              
              <div className="roc-items-wrapper">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div className="roc-item" key={idx}>
                    <div className="roc-item-left">
                       <div className="roc-item-dot" />
                       <span className="roc-item-name">{item.menuItem?.name || item.name || 'Item'}</span>
                    </div>
                    <span className="roc-item-qty">x{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="roc-item-more">+{order.items.length - 3} more items...</div>
                )}
              </div>
              
              <div className="roc-footer">
                <span className="roc-dishes">{totalDishes} Dishes</span>
                <span className="roc-price">₹{totalAmt.toLocaleString()}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="hover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="roc-hover-state"
            >
              <h3 className="roc-hover-price">₹{totalAmt.toLocaleString()}</h3>
              <p className="roc-hover-hint">Quick Actions</p>
              
              <div className="roc-icon-actions">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="roc-icon-btn" onClick={() => onOpen(order, true)} title="Add Items" disabled={order.status === 'paid'}><Plus size={20} /></motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="roc-icon-btn" onClick={() => onPrint?.(order._id, 'bill')} title="Print Bill"><Printer size={20} /></motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="roc-icon-btn" onClick={() => onOpen(order)} title="View Details"><FileText size={20} /></motion.button>
              </div>
              
              {order.status === 'paid' ? (
                <div className="roc-paid-badge">Paid</div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="roc-checkout-btn" 
                  onClick={() => onOpen(order)}
                >
                  Confirm & Checkout
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentOrderCard;
