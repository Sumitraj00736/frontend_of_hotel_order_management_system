import React from 'react';
import { Minus, Plus, Trash2, Users, ReceiptText, Flame, MessageSquare, ClipboardList } from 'lucide-react';

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
  showCustomer = false
}) => {
  const spiceOptions = [
    { value: 'mild', label: 'Mild' },
    { value: 'medium', label: 'Medium' },
    { value: 'spicy', label: 'Spicy' },
    { value: 'extra_spicy', label: 'Extra Spicy' }
  ];

  return (
    <div className="pos-cart-sidebar">
      <div className="pos-cart-header">
        <h5 className="pos-cart-title d-flex align-items-center"><ReceiptText size={20} className="me-2 text-primary" /> Order Details</h5>
        {selectedTable && (
          <button className="badge-red pill" style={{ cursor: 'pointer', border: 'none' }} onClick={onFreeTable} title="Free Table">
            Clear Table
          </button>
        )}
      </div>

      <div className="pos-cart-scroll">
        <div>
          <span className="pos-form-label"><Users size={14} className="me-1 text-muted" /> Select Table</span>
          <select
            className="pos-select"
            value={selectedTable || ''}
            onChange={(e) => onSelectTable?.(e.target.value)}
          >
            <option value="" disabled>Choose a table...</option>
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

        {showCustomer && (
          <div>
            <span className="pos-form-label"><Users size={14} className="me-1 text-muted" /> Customer</span>
            <select
              className="pos-select"
              value={selectedCustomer || ''}
              onChange={(e) => onSelectCustomer?.(e.target.value)}
            >
              <option value="">Cash Customer (Walk-in)</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer.name}>
                  {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="cart-list mt-2">
          {cart.length === 0 && (
            <div className="text-muted text-center py-4" style={{ fontSize: '14px' }}>
              <ClipboardList size={32} className="text-muted mb-2 opacity-50" />
              <br />
              No items added to the order yet.
            </div>
          )}
          {cart.map((item) => (
            <div key={item.menuItem} className="cart-item-row">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">NPR {item.price}</div>
              </div>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => {
                    if (item.quantity === 1) onUpdateQty(item.menuItem, 0); // triggers removal
                    else onUpdateQty(item.menuItem, item.quantity - 1);
                  }}
                >
                  {item.quantity === 1 ? <Trash2 size={14} color="#ef4444" /> : <Minus size={14} />}
                </button>
                <div className="qty-val">{item.quantity}</div>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.menuItem, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <span className="pos-form-label"><Flame size={14} className="me-1 text-muted" /> Spice Level</span>
          <div className="spice-pill-group">
            {spiceOptions.map((opt) => (
              <button
                key={opt.value}
                className={`spice-pill ${spiceLevel === opt.value ? 'active' : ''}`}
                onClick={() => onSpiceChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <span className="pos-form-label"><MessageSquare size={14} className="me-1 text-muted" /> Instructions</span>
          <textarea
            className="pos-textarea"
            rows="2"
            placeholder="Allergies, specific prep instructions..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
          />
        </div>
      </div>

      <div className="pos-cart-footer">
        <div className="cart-total-row">
          <span className="cart-total-label">Total Amount</span>
          <span className="cart-total-amount">NPR {cartTotal.toFixed(2)}</span>
        </div>
        <button className="pos-btn-submit" onClick={onPlaceOrder}>
          {editing ? 'Update Order' : 'Check Out'}
        </button>
      </div>
    </div>
  );
};

export default WaiterCart;
