import React from 'react';

const KitchenOrdersGrid = ({ orders, onUpdateStatus }) => (
  <div className="row g-3">
    {orders.map((order) => (
      <div key={order._id} className="col-12 col-md-6 col-lg-4">
        <div className="card glass-card h-100">
          <div className="d-flex justify-content-between mb-2">
            <strong>Table {order.table?.tableNumber}</strong>
            <span className="badge bg-warning text-dark">{order.status}</span>
          </div>
          <ul className="list-unstyled small">
            {order.items.map((item) => (
              <li key={item._id}>
                {item.menuItem?.name} x {item.quantity}
              </li>
            ))}
          </ul>
          <div className="d-flex flex-wrap gap-2 mt-auto">
            <button className="btn btn-sm btn-outline-light" onClick={() => onUpdateStatus(order._id, 'preparing')}>
              Preparing
            </button>
            <button className="btn btn-sm btn-outline-light" onClick={() => onUpdateStatus(order._id, 'ready')}>
              Ready
            </button>
            <button className="btn btn-sm btn-outline-light" onClick={() => onUpdateStatus(order._id, 'served')}>
              Served
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default KitchenOrdersGrid;
