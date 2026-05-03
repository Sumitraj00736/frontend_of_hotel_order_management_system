import React from 'react';
import { User, Users } from 'lucide-react';
import '../../../../common/css/admin/orders/Additemsmodal.css'

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
        <div className="cart-footer p-3 border-top bg-white">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex gap-2">
              <div className="flex-grow-1">
                <div 
                  className="assign-staff-trigger border rounded-3 p-2 d-flex align-items-center justify-content-between cursor-pointer bg-light"
                  onClick={onToggleStaffList}
                  style={{ fontSize: '13px' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <User size={16} className="text-muted" />
                    <span className="fw-semibold">{staffOptions.find(s => s._id === assignedStaffId)?.name || 'Assign Staff'}</span>
                  </div>
                  <span className="text-muted">›</span>
                </div>
                {showStaffList && (
                  <div className="staff-dropdown-overlay shadow-lg border rounded-3 mt-1 bg-white" style={{ position: 'absolute', bottom: '100px', width: '250px', zIndex: 100 }}>
                    <div className="p-2 border-bottom fw-bold small text-muted">Select Staff</div>
                    <div className="p-1 overflow-auto" style={{ maxHeight: '200px' }}>
                      {staffOptions.map((s) => (
                        <div 
                          key={s._id} 
                          className={`p-2 rounded-2 cursor-pointer staff-item-hover ${assignedStaffId === s._id ? 'bg-primary-soft text-primary' : ''}`}
                          onClick={() => { onAssignStaff?.(s._id); onToggleStaffList?.(); }}
                        >
                          <div className="fw-bold small">{s.name}</div>
                          <div className="tiny text-muted">{s.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-grow-1">
                <div className="input-group input-group-sm border rounded-3 overflow-hidden bg-light h-100">
                  <span className="input-group-text bg-transparent border-0"><Users size={14} /></span>
                  <input 
                    type="number" 
                    className="form-control border-0 bg-transparent flex-grow-1" 
                    placeholder="Enter No. of guests" 
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>

            <div className="cart-totals border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small">Total Qty</span>
                <span className="fw-bold">{cartQty}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total Amount</span>
                <span className="h5 mb-0 fw-800" style={{ color: '#FC8019' }}>Rs {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button 
                className="btn btn-light border py-2 fw-bold text-muted w-100" 
                style={{ fontSize: '14px' }}
                onClick={() => onConfirm?.({ print: true })}
              >
                Confirm & Print
              </button>
              <button 
                className="btn py-2 fw-800 w-100 shadow-sm text-white"
                style={{ 
                  fontSize: '14px', 
                  background: 'linear-gradient(135deg, #FFB87A 0%, #FC8019 100%)', 
                  border: 'none' 
                }}
                onClick={() => onConfirm?.({ print: false })}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
