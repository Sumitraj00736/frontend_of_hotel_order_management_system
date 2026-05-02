import React from 'react';
import { Tag, MapPin, User, Printer, Clock, UtensilsCrossed } from 'lucide-react';
import '../../../common/css/waiter/orders/kotCards.css';

const WaiterOrders = ({ orders, onEdit, onBill, onCheckout }) => (
  <div className="orders-container">
    <div className="orders-header">
      <UtensilsCrossed size={24} color="#fc8019" />
      <h2>Order History & KOTs</h2>
    </div>
    
    <div className="kot-grid">
      {orders.map((order) => (
        <div key={order._id} className="kot-card">
          <div className="kot-card-header">
            <span className="kot-id">KOT #{order._id?.slice(-4)}</span>
            <span className={`status-badge ${order.status === 'paid' ? 'paid' : 'pending'}`}>
              {order.status || 'Active'}
            </span>
          </div>

          <div className="kot-body">
            <div className="kot-info-row">
              <div className="info-item">
                <Tag size={14} />
                <span>{order.source === 'guest' ? 'Online' : order.orderType?.replace('_', ' ') || 'Dine In'}</span>
              </div>
              <div className="info-item">
                <MapPin size={14} />
                <span>Table {order.table?.tableNumber || '-'}</span>
              </div>
            </div>

            <div className="kot-info-row">
              <div className="info-item">
                <User size={14} />
                <span>{order.createdBy?.name || 'N/A'}</span>
              </div>
              <div className="info-item">
                <Clock size={14} />
                <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className="items-section">
              <div className="items-header">
                <span>Dish</span>
                <span>Qty</span>
              </div>
              <div className="items-list">
                {order.items.map((item, idx) => (
                  <div key={item._id || idx} className="item-row">
                    <span className="item-name">{item.menuItem?.name || 'Item'}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kot-summary">
              <span>Total Quantity</span>
              <span className="total-count">{order.items.reduce((acc, i) => acc + (i.quantity || 0), 0)}</span>
            </div>
          </div>

          <div className="kot-actions">
            {order.status !== 'paid' && (
              <button className="btn-edit" onClick={() => onEdit(order)}>Edit</button>
            )}
            {order.status !== 'paid' && (
              <button className="btn-checkout" onClick={() => onCheckout?.(order)}>Checkout</button>
            )}
            <button className="btn-print" onClick={() => onBill(order._id)}>
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WaiterOrders;