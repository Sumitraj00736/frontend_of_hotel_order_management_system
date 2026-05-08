import React from 'react';
import { User, Users, ReceiptText } from 'lucide-react';
import '../../../../common/css/admin/orders/addItemsModal.css';

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
  onClearCart,
  onConfirm
}) => {
  return (
    <div className="additem-right">
      <div className="cart-panel">
        <div className="cart-head">
          <div className="d-flex align-items-center gap-2">
            <div className="header-icon-box">
              <ReceiptText size={20} />
            </div>
            <h5 className="m-0 fw-bold">Order Details</h5>
          </div>
          <button className="cart-clear" onClick={onClearCart}>Clear Cart</button>
        </div>
  {/* Staff + Guest row */}
          <div className="cart-meta-row">
            <div className="cart-meta-btn" onClick={onToggleStaffList}>
              <User size={14} />
              <span style={{ flex: 1, fontSize: '0.75rem', fontWeight: 600 }}>
                {staffOptions?.find(s => s._id === assignedStaffId)?.name || 'Assign Staff'}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>›</span>
              {showStaffList && (
                <div style={{
                  position: 'absolute',
                  bottom: '110%',
                  left: 0,
                  width: '200px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  zIndex: 200,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>Select Staff</div>
                  <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                    {staffOptions?.map(s => (
                      <div
                        key={s._id}
                        onClick={(e) => { e.stopPropagation(); onAssignStaff?.(s._id); onToggleStaffList?.(); }}
                        style={{
                          padding: '8px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: assignedStaffId === s._id ? '#fc8019' : '#1e293b',
                          background: assignedStaffId === s._id ? '#fff4eb' : 'transparent',
                          transition: 'background 0.15s'
                        }}
                      >
                        {s.name}
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>{s.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="cart-meta-btn">
              <Users size={14} />
              <input type="number" className="cart-meta-input" placeholder="No. of guests" />
            </div>
          </div>
        <div className="cart-footer">

          <div className="cart-items-scroll">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <ReceiptText size={48} />
            </div>
            <h6>Your cart is empty</h6>
            <p>Add items from the menu</p>
          </div>
        ) : (
          <div className="items-list">
            {items.map((item) => {
              const menuId = item.menuItem?._id || item.menuItem;
              const variantId = item.variantId || item.variant?._id || null;
              return (
                <div key={item._id || `${menuId}-${variantId}`} className="cart-item-card">
                  <div className="item-top">
                    <span className="item-name">
                        {item.menuItem?.name || 'Item'}
                        {item.variantName ? <small> ({item.variantName})</small> : ''}
                    </span>
                    <div className="qty-stepper">
                      <button onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) + 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-bottom">
                    <input 
                      className="remark-input"
                      placeholder="Add remarks to dish"
                      defaultValue={item.itemNote || ''}
                      onBlur={(e) => onUpdateItemNote?.(menuId, variantId, e.target.value)}
                    />
                    <span className="item-price">Rs {(item.priceAtOrderTime * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="cart-totals-row">
              <span>Total Qty</span>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>{cartQty}</span>
            </div>
            <div className="cart-totals-row">
              <span className="total-amount-label">Total Amount</span>
              <span className="total-amount-value">Rs {cartTotal?.toFixed(2)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="cart-action-row">
            <button className="btn-print" onClick={() => onConfirm?.({ print: true })}>
              Confirm & Print
            </button>
            <button className="btn-confirm" onClick={() => onConfirm?.({ print: false })}>
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
