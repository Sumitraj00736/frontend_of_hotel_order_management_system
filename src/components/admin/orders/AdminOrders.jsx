import React, { useState } from 'react';
import OrderDetailModal from './OrderDetailModal.jsx';
import '../../../common/css/admin/orders/kotCards.css';

const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'bg-success';
    case 'pending':
      return 'bg-warning text-dark';
    case 'cancelled':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};

const AdminOrders = ({ orders = [], paymentMethods, onChangePaymentMethod, onPay, onPrint }) => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('active');

  const openDetails = (order) => {
    if (!paymentMethods[order._id]) {
      onChangePaymentMethod(order._id, order.paymentMethod || 'cash');
    }
    setSelected(order);
  };
  const closeDetails = () => setSelected(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'paid') return o.status === 'paid';
    if (filter === 'cancelled') return o.status === 'cancelled';
    // active: everything not paid/cancelled
    return !['paid', 'cancelled'].includes(o.status);
  });

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2 align-items-center">
          <h5 className="mb-0">Orders</h5>
          <span className="badge bg-secondary px-3 py-2 rounded-pill">
            {filteredOrders.length} {filter === 'paid' ? 'Paid' : filter === 'cancelled' ? 'Cancelled' : 'Active'}
          </span>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light" onClick={() => (window.location.href = '/waiter')}>
            + Book Order
          </button>
          <button className="btn btn-primary" onClick={() => (window.location.href = '/admin#tables')}>
            + Add Table
          </button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setFilter('active')}>Active Orders</button>
        <button className={`btn ${filter === 'paid' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setFilter('paid')}>Paid Orders</button>
        <button className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setFilter('cancelled')}>Cancelled Orders</button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-muted py-5">
          <div className="fs-1">🧾</div>
          <div>No orders in this category</div>
        </div>
      ) : (
        <div className="orders-grid kot-grid">
          {filteredOrders.map((order) => (
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
                <button className="ghost-btn">{order.status === 'paid' ? 'Paid' : 'Pending'}</button>
                <button className="ghost-btn" onClick={() => openDetails(order)}>Print</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <OrderDetailModal
          order={selected}
          paymentMethods={paymentMethods}
          onChangePaymentMethod={onChangePaymentMethod}
          onPay={async (id) => {
            await onPay(id);
            closeDetails();
          }}
          onPrint={onPrint}
          onClose={closeDetails}
        />
      )}
    </div>
  );
};

export default AdminOrders;
