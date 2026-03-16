import React, { useState } from 'react';
import OrderDetailModal from './OrderDetailModal.jsx';

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

  const openDetails = (order) => {
    if (!paymentMethods[order._id]) {
      onChangePaymentMethod(order._id, order.paymentMethod || 'cash');
    }
    setSelected(order);
  };
  const closeDetails = () => setSelected(null);

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2 align-items-center">
          <h5 className="mb-0">Orders</h5>
          <span className="badge bg-secondary px-3 py-2 rounded-pill">{orders.length} Active</span>
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

      {orders.length === 0 ? (
        <div className="text-center text-muted py-5">
          <div className="fs-1">🧾</div>
          <div>No active orders</div>
        </div>
      ) : (
        <div className="orders-list-full">
          {orders.map((order) => (
            <div key={order._id} className="order-row">
              <div>
                <div className="fw-semibold fs-5">Table {order.table?.tableNumber}</div>
                <div className="text-muted small">
                  Waiter: {order.createdBy?.name || 'N/A'} | Kitchen: {order.kitchenAssigned?.name || 'Unassigned'}
                </div>
                <div className="text-muted small">
                  Order Time: {new Date(order.createdAt).toLocaleString()} | Spice: {order.spiceLevel || 'medium'}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                <div className="fw-bold">Total: NPR {order.totalAmount?.toFixed(2) ?? '0.00'}</div>
                <button className="btn btn-sm btn-outline-light" onClick={() => openDetails(order)}>
                  View Details
                </button>
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
