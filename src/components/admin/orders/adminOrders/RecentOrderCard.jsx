import React, { useState } from 'react';
import { Plus, Printer, FileText, Zap } from 'lucide-react';
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

const RecentOrderCard = ({ order, onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Derive display values
  let identifierStr = `Table ${order.table?.tableNumber || '?'}`;
  if (order.orderType === 'delivery') identifierStr = `Delivery #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
  if (order.orderType === 'takeaway') identifierStr = `Takeaway #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
  if (order.orderType === 'pickup') identifierStr = `Pickup #${order.invoiceNo || order.kotNo || order._id.slice(-4)}`;
  
  const typeStr = order.orderType === 'dine_in' ? 'Dine In' :
                  order.orderType === 'delivery' ? 'Delivery' :
                  order.orderType === 'pickup' ? 'Pick up' : 'Takeaway';

  const timeStr = timeAgo(order.createdAt);
  const totalDishes = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmt = order.finalAmount || order.totalAmount || 0;

  return (
    <div className="recent-order-container">
      <h5 className="recent-order-title">{identifierStr}</h5>
      
      <div 
        className="recent-order-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isHovered ? (
          <div className="roc-normal-state">
            <div className="roc-header">
              <span className="roc-type">{typeStr}</span>
              <span className="roc-time">{timeStr}</span>
            </div>
            
            <div className="roc-items-wrapper">
              {order.items.slice(0, 3).map((item, idx) => (
                <div className="roc-item" key={idx}>
                  <div className="roc-item-left">
                     <div className="roc-item-dot" />
                     <span className="roc-item-name">{item.menuItem?.name || item.name || 'Item'}</span>
                  </div>
                  <span className="roc-item-qty">{item.quantity}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="roc-item-more">+{order.items.length - 3} more items...</div>
              )}
            </div>
            
            <div className="roc-footer">
              <span className="roc-dishes">Dishes: {totalDishes}</span>
              <span className="roc-price">Rs {totalAmt.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="roc-hover-state">
            <h3 className="roc-hover-price">Rs {totalAmt.toLocaleString()}</h3>
            <p className="roc-hover-hint">Click to view full order details.</p>
            
            <div className="roc-icon-actions">
              <button className="roc-icon-btn" onClick={() => onOpen(order, true)} title="Add Items"><Plus size={18} /></button>
              <button className="roc-icon-btn" onClick={() => window.print()} title="Print Bill"><Printer size={18} /></button>
              <button className="roc-icon-btn" title="View Details"><FileText size={18} /></button>
              <button className="roc-icon-btn" title="Quick Action"><Zap size={18} /></button>
            </div>
            
            <button className="roc-checkout-btn" onClick={() => onOpen(order)}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrderCard;
