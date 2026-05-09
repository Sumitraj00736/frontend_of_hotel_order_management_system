import React, { useState } from 'react';
import { 
  User, Users, ReceiptText, Trash2, ChevronRight, 
  Minus, Plus, ChevronDown, ShoppingBag 
} from 'lucide-react';
import '../addItems/OrderItemsPremium.css';

const CartPanel = ({
  items = [],
  cartQty = 0,
  cartTotal = 0,
  assignedStaffId,
  staffOptions = [],
  showStaffList,
  onToggleStaffList,
  onAssignStaff,
  onUpdateItemQuantity,
  onUpdateItemNote,
  onClearCart,
  onConfirm
}) => {
  // State to manage mobile visibility, similar to AdminDeliveryOrderModal
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  const selectedStaff = staffOptions?.find(s => s._id === assignedStaffId);
  console.log('CartPanel Rendered with items:', items, 'Assigned Staff:', selectedStaff);

  return (
    <>
      {/* ASIDE CONTAINER: Added mobile-specific conditional classes */}
      <aside className={`cart-container ${isMobileCartOpen ? 'mobile-visible' : ''}`} style={{ height: '100%' }}>
        <div className="cart-card" style={{ background: '#fff', borderRadius: '16px', height: '88%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          
          {/* MOBILE HEADER */}
          <div className="mobile-cart-header" onClick={() => setIsMobileCartOpen(false)} style={{ background: '#f8f9fa', padding: '15px', fontWeight: 700, borderBottom: '1px solid #e9e9eb' }}>
            <ChevronDown size={20} /> 
            <span>Back to Menu</span>
          </div>

          {/* Header */}
          <header className="cart-header" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
            <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="icon-badge" style={{ background: '#fff4eb', color: '#fc8019', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                <ReceiptText size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Order Details</h3>
            </div>
            <button className="prem-btn-clear" onClick={onClearCart} aria-label="Clear Cart">
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
          </header>

          {/* Quick Actions Row */}
          <div className="prem-meta-actions-grid">
            <div className="prem-meta-dropdown-wrapper">
              <button className={`prem-meta-btn ${selectedStaff ? 'active' : ''}`} onClick={onToggleStaffList}>
                <User size={16} />
                <span className="truncate">{selectedStaff?.name || 'Assign Staff'}</span>
                <ChevronRight size={14} className={`arrow ${showStaffList ? 'rotate' : ''}`} />
              </button>
              
              {showStaffList && (
                <ul className="staff-dropdown-menu">
                  <li className="dropdown-label">Select Staff</li>
                  {staffOptions.map(s => (
                    <li 
                      key={s._id} 
                      className={`staff-item ${assignedStaffId === s._id ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignStaff?.(s._id);
                        onToggleStaffList?.();
                      }}
                    >
                      <span className="staff-name">{s.name}</span>
                      <span className="staff-role">{s.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="prem-meta-input-wrapper">
              <Users size={16} />
              <input type="number" placeholder="Guests" min="1" className="prem-guest-input" />
            </div>
          </div>

          {/* Scrollable Items Area */}
          <div className="cart-body">
            {items.length === 0 ? (
              <div className="empty-cart-state">
                <div className="empty-illustration">
                  <ReceiptText size={40} />
                </div>
                <p className="empty-text">Your cart is empty</p>
                <p className="empty-subtext">Add items to start an order</p>
              </div>
            ) : (
              <div className="items-stack">
                {items.map((item) => {
                  const menuId = item.menuItem?._id || item.menuItem;
                  const variantId = item.variantId || item.variant?._id || null;
                  return (
                    <div key={item._id || `${menuId}-${variantId}`} className="cart-item">
                      <div className="item-main-info">
                        <div className="item-details">
                          <span className="item-name">
                            {item.menuItem?.name || 'Item'}
                            {item.variantName && <small className="variant-tag">{item.variantName}</small>}
                          </span>
                          <span className="item-price-unit">Rs {item.priceAtOrderTime?.toFixed(2)}</span>
                        </div>
                        
                        <div className="qty-controls">
                          <button onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) - 1)} className="qty-btn"><Minus size={14} /></button>
                          <span className="qty-val">{item.quantity}</span>
                          <button onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) + 1)} className="qty-btn"><Plus size={14} /></button>
                        </div>
                      </div>

                      <div className="item-actions">
                        <input 
                          className="note-input"
                          placeholder="Note..."
                          defaultValue={item.itemNote || ''}
                          onBlur={(e) => onUpdateItemNote?.(menuId, variantId, e.target.value)}
                        />
                        <span className="item-total-price">Rs {(item.priceAtOrderTime * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <footer className="cart-footer">
            <div className="bill-summary">
              <div className="summary-row">
                <span>Items</span>
                <span className="val-text">{cartQty}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="total-amount">Rs {cartTotal?.toFixed(2)}</span>
              </div>
            </div>

            <div className="action-buttons-group">
              <button className="prem-btn-secondary" onClick={() => onConfirm?.({ print: true })}>
                Print
              </button>
              <button className="prem-btn-primary" onClick={() => onConfirm?.({ print: false })}>
                Confirm Order
              </button>
            </div>
          </footer>
        </div>
      </aside>

      {/* MOBILE FLOATING ACTION BUTTON */}
      {!isMobileCartOpen && cartQty > 0 && (
        <div className="mobile-cart-fab" onClick={() => setIsMobileCartOpen(true)}>
          <div className="fab-content">
            <ShoppingBag size={20} />
            <span>{cartQty} Items • Rs {cartTotal?.toFixed(2)}</span>
          </div>
          <div className="fab-label">
            View Cart <ChevronRight size={18} />
          </div>
        </div>
      )}
    </>
  );
};

export default CartPanel;