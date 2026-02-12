import React from 'react';

const AdminHistory = ({ history }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Customer History (Paid)</h5>
    <ul className="list-group">
      {history.map((item) => (
        <li key={item._id} className="list-group-item">
          <div className="d-flex justify-content-between">
            <span>Table {item.tableNumber}</span>
            <span className="badge bg-success">{item.paymentMethod}</span>
          </div>
          <div className="small text-muted">Waiter: {item.waiter?.name || 'N/A'} | Kitchen: {item.kitchen?.name || 'N/A'}</div>
          <div className="small text-muted">Order Taken: {new Date(item.orderTakenAt).toLocaleString()}</div>
          <div className="small text-muted">Paid At: {new Date(item.paidAt).toLocaleString()}</div>
          <ul className="small mt-2">
            {item.items.map((menu, index) => (
              <li key={index}>{menu.name} x {menu.quantity} (NPR {menu.priceAtOrderTime})</li>
            ))}
          </ul>
          <strong>Total: NPR {item.totalAmount.toFixed(2)}</strong>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminHistory;
