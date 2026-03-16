import React from 'react';
import '../../common/css/admin/orders/kotCards.css';

const WaiterOrders = ({ orders, onEdit, onBill }) => (
  <div className="card glass-card">
    <h5 className="mb-3">My Orders</h5>
    <div className="orders-grid kot-grid">
      {orders.map((order) => (
        <div key={order._id} className="kot-card">
          <div className="kot-title">KOT {order._id?.slice(-4)}</div>
          <div className="kot-meta">
            <div>Type: {order.source === 'guest' ? 'Online' : 'Dine In'}</div>
            <div>Table: Table {order.table?.tableNumber || '-'}</div>
          </div>
          <div className="kot-meta">
            <div>Order By: {order.createdBy?.name || 'N/A'}</div>
            <div>Order At: {new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div className="kot-divider" />
          <div className="kot-items-head">
            <span>S.N Dishes</span>
            <span>QTY</span>
          </div>
          {order.items.map((item, idx) => (
            <div key={item._id || idx} className="kot-item">
              <span>{idx + 1}. {item.menuItem?.name || 'Item'}</span>
              <span>{item.quantity}</span>
            </div>
          ))}
          <div className="kot-divider" />
          <div className="kot-total">
            <span>Total (Dishes/QTY)</span>
            <span>{order.items.length}/{order.items.reduce((acc, i) => acc + (i.quantity || 0), 0)}</span>
          </div>
          <div className="kot-footer">
            <div>Printed By: {order.createdBy?.name || 'N/A'}</div>
            <div>Printed At: {new Date().toLocaleString()}</div>
          </div>
          <div className="kot-thanks">Thank You!</div>
          <div className="kot-actions">
            {order.status !== 'paid' && (
              <button className="ghost-btn" onClick={() => onEdit(order)}>Edit</button>
            )}
            <button className="ghost-btn" onClick={() => onBill(order._id)}>Print</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WaiterOrders;
