import React, { useState } from 'react';
import { 
  User, Users, ReceiptText, Trash2, ChevronRight, 
  Minus, Plus, ChevronDown, ShoppingBag 
} from 'lucide-react';
import '../../../../common/css/admin/orders/addItemsModal.css';

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

  return (
    <>
      /* ASIDE CONTAINER: Added mobile-specific conditional classes */
      <aside className={`cart-container ${isMobileCartOpen ? 'mobile-visible' : ''}`}>
        <div className="cart-card">
          
          {/*MOBILE HEADER: To allow users to go back to the menu */}
          <div className="mobile-cart-header" onClick={() => setIsMobileCartOpen(false)}>
            <ChevronDown size={20} /> 
            <span>Back to Menu</span>
          </div>

          {/* Header */}
          <header className="cart-header">
            <div className="header-title">
              <div className="icon-badge">
                <ReceiptText size={18} />
              </div>
              <h3>Order Details</h3>
            </div>
            <button className="btn-clear" onClick={onClearCart} aria-label="Clear Cart">
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
          </header>

          {/* Quick Actions Row */}
          <div className="meta-actions-grid">
            <div className="meta-dropdown-wrapper">
              <button className={`meta-btn ${selectedStaff ? 'active' : ''}`} onClick={onToggleStaffList}>
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

            <div className="meta-input-wrapper">
              <Users size={16} />
              <input type="number" placeholder="Guests" min="1" className="guest-input" />
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
              <button className="btn-secondary" onClick={() => onConfirm?.({ print: true })}>
                Print
              </button>
              <button className="btn-primary" onClick={() => onConfirm?.({ print: false })}>
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