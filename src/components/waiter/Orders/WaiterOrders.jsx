import React from 'react';
import { Tag, MapPin, Pickaxe, Printer, Clock } from 'lucide-react';
import '../../../common/css/admin/orders/kotCards.css';

const WaiterOrders = ({ orders, onEdit, onBill, onCheckout }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Order History & KOTs</h5>
    <div className="orders-grid kot-grid">
      {orders.map((order) => (
        <div key={order._id} className="kot-card">
          <div className="kot-title">KOT {order._id?.slice(-4)}</div>
          <div className="kot-meta">
            <div><Tag size={12} className="me-1" />{order.source === 'guest' ? 'Online' : 'Dine In'}</div>
            <div><MapPin size={12} className="me-1" />Table {order.table?.tableNumber || '-'}</div>
          </div>
          <div className="kot-meta">
            <div><Pickaxe size={12} className="me-1" />{order.createdBy?.name || 'N/A'}</div>
            <div><Clock size={12} className="me-1" />{new Date(order.createdAt).toLocaleTimeString()}</div>
          </div>
          <div className="kot-divider" />
          <div className="kot-items-head">
            <span>S.N Dishes</span>
            <span>QTY</span>
          </div>
          <div className="kot-items-list">
            {order.items.map((item, idx) => (
              <div key={item._id || idx} className="kot-item">
                <span>{idx + 1}. {item.menuItem?.name || 'Item'}</span>
                <span>{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="kot-divider" />
          <div className="kot-total">
            <span>Total (Dishes)</span>
            <span>{order.items.reduce((acc, i) => acc + (i.quantity || 0), 0)}</span>
          </div>
          <div className="kot-footer">
            <div className="d-flex align-items-center"><Printer size={12} className="me-1" /> {order.createdBy?.name || 'N/A'}</div>
            <div>{new Date().toLocaleTimeString()}</div>
          </div>
          {order.editLogs && order.editLogs.length > 0 && (
            <div className="kot-edited">
              Last Edited By: {order.editLogs[order.editLogs.length - 1]?.editedBy?.name || 'Staff'}
            </div>
          )}
          <div className="kot-thanks">Thank You!</div>
          <div className="kot-actions">
            {order.status !== 'paid' && (
              <button className="ghost-btn fw-bold text-primary" onClick={() => onEdit(order)}>Edit</button>
            )}
            {order.status !== 'paid' && (
              <button className="ghost-btn fw-bold text-success" onClick={() => onCheckout?.(order)}>
                Checkout
              </button>
            )}
            <button className="ghost-btn fw-bold" onClick={() => onBill(order._id)}>Bill / Print</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WaiterOrders;
