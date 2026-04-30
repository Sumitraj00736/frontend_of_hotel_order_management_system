// WaiterCart.jsx
import React from 'react';
import { Minus, Plus, Trash2, Users, ReceiptText, Flame, MessageSquare, ClipboardList, UtensilsCrossed, ShoppingBag, X } from 'lucide-react';
import '../../../common/css/waiter/waiterCart.css';

const WaiterCart = ({
  cart,
  cartTotal,
  onUpdateQty,
  onPlaceOrder,
  editing,
  spiceLevel,
  onSpiceChange,
  instructions,
  onInstructionsChange,
  tables = [],
  selectedTable,
  onSelectTable,
  onFreeTable,
  customers = [],
  selectedCustomer,
  onSelectCustomer,
  showCustomer = false,
  orderType = 'dine_in',
  onOrderTypeChange,
  onClose
}) => {
  const spiceOptions = [
    { value: 'mild', label: 'Mild' },
    { value: 'medium', label: 'Med' },
    { value: 'spicy', label: 'Hot' },
    { value: 'extra_spicy', label: 'Extra' }
  ];

  return (
    <div className="pos-cart-container">
      {/* Header */}
      <div className="pos-cart-header">
        <div className="d-flex align-items-center gap-2">
          <div className="icon-box-primary">
            <ReceiptText size={20} />
          </div>
          <div>
            <h5 className="m-0 fw-bold">Current Order</h5>
            <span className="text-muted tiny-text">Manage items & preferences</span>
          </div>
        </div>
        <button className="mobile-close-btn d-md-none" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Order Type Toggle */}
      <div className="pos-order-type-wrapper">
        <div className="type-toggle-pills">
          <button 
            className={`type-pill ${orderType === 'dine_in' ? 'active' : ''}`}
            onClick={() => onOrderTypeChange?.('dine_in')}
          >
            <UtensilsCrossed size={16} /> Dine-in
          </button>
          <button 
            className={`type-pill ${orderType === 'takeaway' ? 'active' : ''}`}
            onClick={() => onOrderTypeChange?.('takeaway')}
          >
            <ShoppingBag size={16} /> Takeaway
          </button>
        </div>
      </div>

      <div className="pos-cart-body">
        {/* Selection Area (Tables/Customers) */}
        <div className="selection-grid mb-3">
          {orderType === 'dine_in' && (
            <div className="selection-item">
              <label className="pos-label"><Users size={12} /> Table</label>
              <div className="select-wrapper">
                <select
                  className="pos-modern-select"
                  value={selectedTable || ''}
                  onChange={(e) => onSelectTable?.(e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  {tables.map((table) => (
                    <option key={table._id} value={table._id} disabled={table.status === 'occupied' && table._id !== selectedTable}>
                      Table {table.tableNumber}
                    </option>
                  ))}
                </select>
                {selectedTable && (
                   <button className="clear-table-btn" onClick={onFreeTable}>Reset</button>
                )}
              </div>
            </div>
          )}

          {showCustomer && (
            <div className="selection-item">
              <label className="pos-label"><Users size={12} /> Customer</label>
              <select
                className="pos-modern-select"
                value={selectedCustomer || ''}
                onChange={(e) => onSelectCustomer?.(e.target.value)}
              >
                <option value="">Walk-in</option>
                {customers.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="cart-items-section">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <ClipboardList size={48} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.menuItem}-${item.variantId || 'base'}`} className="modern-cart-item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  {item.variantName && <span className="item-variant">{item.variantName}</span>}
                  <span className="item-price">NPR {item.price}</span>
                </div>
                <div className="item-controls">
                  <button className="qty-btn minus" onClick={() => onUpdateQty(item.menuItem, item.quantity - 1, item.variantId)}>
                    {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                  </button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn plus" onClick={() => onUpdateQty(item.menuItem, item.quantity + 1, item.variantId)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preferences */}
        <div className="preferences-section">
          <label className="pos-label"><Flame size={14} /> Spice Level</label>
          <div className="spice-selector">
            {spiceOptions.map((opt) => (
              <button
                key={opt.value}
                className={`spice-btn ${spiceLevel === opt.value ? 'active' : ''} ${opt.value}`}
                onClick={() => onSpiceChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="pos-label mt-3"><MessageSquare size={14} /> Special Instructions</label>
          <textarea
            className="pos-modern-textarea"
            placeholder="No onions, extra napkins, etc..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="pos-cart-footer">
        <div className="total-container">
          <span className="total-label">Grand Total</span>
          <span className="total-value">NPR {cartTotal.toLocaleString()}</span>
        </div>
        <button 
          className={`place-order-btn ${cart.length === 0 ? 'disabled' : ''}`} 
          onClick={onPlaceOrder}
          disabled={cart.length === 0}
        >
          {editing ? 'Update Existing Order' : 'Complete & Send to KOT'}
        </button>
      </div>
    </div>
  );
};

export default WaiterCart;