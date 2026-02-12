import React from 'react';

const WaiterCart = ({ cart, cartTotal, onUpdateQty, onPlaceOrder, editing, spiceLevel, onSpiceChange, instructions, onInstructionsChange }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Cart</h5>
    {cart.length === 0 && <div className="text-muted">No items yet.</div>}
    {cart.map((item) => (
      <div key={item.menuItem} className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <div>{item.name}</div>
          <small className="text-muted">NPR {item.price}</small>
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
      <strong>NPR {cartTotal.toFixed(2)}</strong>
    </div>
    <div className="mt-3">
      <label className="form-label">Spice Level</label>
      <select className="form-select" value={spiceLevel} onChange={(e) => onSpiceChange(e.target.value)}>
        <option value="mild">Mild</option>
        <option value="medium">Medium</option>
        <option value="spicy">Spicy</option>
        <option value="extra_spicy">Extra Spicy</option>
      </select>
    </div>
    <div className="mt-3">
      <label className="form-label">Special Instructions</label>
      <textarea
        className="form-control"
        rows="3"
        placeholder="Add notes for kitchen (allergies, spice level, etc.)"
        value={instructions}
        onChange={(e) => onInstructionsChange(e.target.value)}
      />
    </div>
    <button className="btn btn-success w-100 mt-3" onClick={onPlaceOrder}>
      {editing ? 'Update Order' : 'Place Order'}
    </button>
  </div>
);

export default WaiterCart;
