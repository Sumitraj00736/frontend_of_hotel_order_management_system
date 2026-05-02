import React from 'react';
import { Minus, Plus, Trash2, Users, ReceiptText, Flame, MessageSquare, ClipboardList, UtensilsCrossed, ShoppingBag, X } from 'lucide-react';
import '../../../common/css/waiter/dashboard/waiterCart.css'; // Import the new CSS

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
      <div className="pos-cart-header">
        <div className="d-flex align-items-center gap-2">
          <div className="header-icon-box">
            <ReceiptText size={20} />
          </div>
          <h5 className="m-0 fw-bold">Order Details</h5>
        </div>
        
        <div className="header-actions">
           {selectedTable && (
            <button className="btn-clear-table" onClick={onFreeTable}>
              Clear T-{tables.find(t => t._id === selectedTable)?.tableNumber}
            </button>
          )}
          <button className="mobile-close-btn d-md-none" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="pos-order-type-tabs">
        <button 
          className={`tab-btn ${orderType === 'dine_in' ? 'active' : ''}`}
          onClick={() => onOrderTypeChange?.('dine_in')}
        >
          <UtensilsCrossed size={16} /> <span>Dine-in</span>
        </button>
        <button 
          className={`tab-btn ${orderType === 'takeaway' ? 'active' : ''}`}
          onClick={() => onOrderTypeChange?.('takeaway')}
        >
          <ShoppingBag size={16} /> <span>Takeaway</span>
        </button>
      </div>

      <div className="pos-cart-body">
        <div className="selection-grid">
          {orderType === 'dine_in' && (
            <div className="form-group">
              <label><Users size={14} /> Table</label>
              <select
                className="pos-input"
                value={selectedTable || ''}
                onChange={(e) => onSelectTable?.(e.target.value)}
              >
                <option value="" disabled>Select Table</option>
                {tables.map((table) => (
                  <option
                    key={table._id}
                    value={table._id}
                    disabled={table.status === 'occupied' && table._id !== selectedTable}
                  >
                    Table {table.tableNumber} {table.status === 'occupied' ? '(Occupied)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showCustomer && (
            <div className="form-group">
              <label><Users size={14} /> Customer</label>
              <select
                className="pos-input"
                value={selectedCustomer || ''}
                onChange={(e) => onSelectCustomer?.(e.target.value)}
              >
                <option value="">Walk-in Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="cart-items-section">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <ClipboardList size={48} />
              <p>Your cart is empty</p>
              <span>Add items from the menu</span>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.menuItem}-${item.variantId || 'base'}`} className="cart-item-card">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  {item.variantName && <span className="item-variant">{item.variantName}</span>}
                  <span className="item-price">NPR {item.price}</span>
                </div>
                
                <div className="item-controls">
                  <button
                    className="qty-btn minus"
                    onClick={() => onUpdateQty(item.menuItem, item.quantity - 1, item.variantId)}
                  >
                    {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                  </button>
                  <span className="qty-number">{item.quantity}</span>
                  <button
                    className="qty-btn plus"
                    onClick={() => onUpdateQty(item.menuItem, item.quantity + 1, item.variantId)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="customizations-section">
          <div className="form-group">
            <label><Flame size={14} /> Spice Level</label>
            <div className="spice-selector">
              {spiceOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`spice-option ${spiceLevel === opt.value ? 'active' : ''}`}
                  onClick={() => onSpiceChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label><MessageSquare size={14} /> Special Instructions</label>
            <textarea
              className="pos-input text-area"
              placeholder="e.g. No onions, extra napkins..."
              value={instructions}
              onChange={(e) => onInstructionsChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pos-cart-footer">
        <div className="total-container">
          <span className="total-label">Subtotal</span>
          <span className="total-value">NPR {cartTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <button className="place-order-btn" onClick={onPlaceOrder}>
          {editing ? 'UPDATE ORDER' : 'CONFIRM ORDER'}
        </button>
      </div>
    </div>
  );
};

export default WaiterCart;