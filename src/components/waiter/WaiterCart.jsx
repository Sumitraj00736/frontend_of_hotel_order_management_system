import React from 'react';

const WaiterCart = ({ cart, cartTotal, onUpdateQty, onPlaceOrder, editing }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Cart</h5>
    {cart.length === 0 && <div className="text-muted">No items yet.</div>}
    {cart.map((item) => (
      <div key={item.menuItem} className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <div>{item.name}</div>
          <small className="text-muted">${item.price}</small>
        </div>
        <input
          type="number"
          min="1"
          className="form-control w-25"
          value={item.quantity}
          onChange={(e) => onUpdateQty(item.menuItem, Number(e.target.value))}
        />
      </div>
    ))}
    <div className="d-flex justify-content-between mt-3">
      <strong>Total</strong>
      <strong>${cartTotal.toFixed(2)}</strong>
    </div>
    <button className="btn btn-success w-100 mt-3" onClick={onPlaceOrder}>
      {editing ? 'Update Order' : 'Place Order'}
    </button>
  </div>
);

export default WaiterCart;
