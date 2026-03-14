import React from 'react';

const AdminHistory = ({ history }) => (
  <div className="card glass-card">
    <h5 className="mb-3">History (Paid Orders)</h5>
    <div className="content grid-3">
      {history.map((item) => (
        <div key={item._id} className="card glass-card">
          <div className="d-flex justify-content-between">
            <div className="fw-semibold">Table {item.tableNumber}</div>
            <span className="badge bg-success">{item.paymentMethod}</span>
          </div>
          <div className="text-muted small">Waiter: {item.waiter?.name || 'N/A'}</div>
          <div className="text-muted small">Kitchen: {item.kitchen?.name || 'N/A'}</div>
          <div className="text-muted small">Order: {new Date(item.orderTakenAt).toLocaleString()}</div>
          <div className="text-muted small">Paid: {new Date(item.paidAt).toLocaleString()}</div>
          <div className="mt-2">
            {item.items.map((menu, index) => (
              <div key={index} className="d-flex justify-content-between small border-bottom py-1">
                <span>
                  {menu.name} x {menu.quantity}
                </span>
                <span>NPR {menu.priceAtOrderTime}</span>
              </div>
            ))}
          </div>
          <div className="fw-bold mt-2">Total: NPR {item.totalAmount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  </div>
);

export default AdminHistory;
