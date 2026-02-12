import React from 'react';

const WaiterOrders = ({ orders, onEdit, onBill }) => (
  <div className="card glass-card">
    <h5 className="mb-3">My Orders</h5>
    <div className="list-group">
      {orders.map((order) => (
        <div key={order._id} className="list-group-item">
          <div className="d-flex justify-content-between">
            <div>Table {order.table?.tableNumber}</div>
            <span className="badge bg-info text-dark">{order.status}</span>
          </div>
          <div className="small text-muted">Items: {order.items.length}</div>
          <div className="d-flex gap-2 mt-2">
            {order.status !== 'paid' && (
              <button className="btn btn-sm btn-outline-light" onClick={() => onEdit(order)}>
                Edit
              </button>
            )}
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onBill(order._id)}>
              Bill (NPR)
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WaiterOrders;
