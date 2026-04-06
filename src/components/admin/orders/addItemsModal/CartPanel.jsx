import React from 'react';

const CartPanel = ({
  items,
  cartQty,
  cartTotal,
  assignedStaffId,
  staffOptions,
  showStaffList,
  onToggleStaffList,
  onAssignStaff,
  onUpdateItemQuantity,
  onUpdateItemNote,
  onConfirm
}) => {
  return (
    <div className="additem-right">
      <div className="cart-panel">
        <div className="cart-head">
          <div className="cart-title">Cart Items</div>
          <button className="cart-clear" disabled>Clear Cart</button>
        </div>
        <div className="cart-list">
          {items.length === 0 && (
            <div className="cart-empty">
              <div className="cart-empty-icon">🧾</div>
              <div>No items added yet</div>
            </div>
          )}
          {items.map((item) => {
            const name = item.menuItem?.name || 'Item';
            const variant = item.variantName ? ` (${item.variantName})` : '';
            const menuId = item.menuItem?._id || item.menuItem;
            const variantId = item.variantId || item.variant?._id || null;
            return (
              <div key={item._id || `${menuId}-${variantId || 'base'}`} className="cart-row">
                <div className="cart-info">
                  <div className="cart-name">{name}{variant}</div>
                  <div className="cart-price">Rs {item.priceAtOrderTime || 0}</div>
                  <input
                    className="cart-note"
                    placeholder="Add remarks to dish"
                    defaultValue={item.itemNote || ''}
                    onBlur={(e) => onUpdateItemNote?.(menuId, variantId, e.target.value)}
                  />
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) - 1)}>-</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) + 1)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="assign-staff-row" onClick={onToggleStaffList}>
          <span className="assign-staff-icon">👤</span>
          <span>Assign Staff</span>
          <span className="assign-arrow">›</span>
        </div>
        <div className="assign-staff-select">
          <select value={assignedStaffId || ''} onChange={(e) => onAssignStaff?.(e.target.value || null)}>
            <option value="">Select staff</option>
            {staffOptions.map((s) => (
              <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
            ))}
          </select>
        </div>
        {showStaffList && (
          <div className="assign-staff-panel">
            {staffOptions.map((s) => (
              <button
                key={s._id}
                className={`assign-staff-item ${assignedStaffId === s._id ? 'active' : ''}`}
                onClick={() => {
                  onAssignStaff?.(s._id);
                  onToggleStaffList?.();
                }}
              >
                <span className="assign-staff-name">{s.name}</span>
                <span className="assign-staff-role">{s.role}</span>
              </button>
            ))}
            {staffOptions.length === 0 && <div className="assign-staff-empty">No staff found.</div>}
          </div>
        )}
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span>Qty: {cartQty}</span>
            <strong>Rs {cartTotal.toFixed(2)}</strong>
          </div>
          <div className="cart-actions">
            <button className="ghost-btn">Confirm & Print</button>
            <button className="confirm-btn" onClick={onConfirm}>Confirm Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
