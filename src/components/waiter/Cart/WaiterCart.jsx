import { Minus, Plus, Trash2, Users, ReceiptText, Flame, MessageSquare, ClipboardList, UtensilsCrossed, ShoppingBag } from 'lucide-react';

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
    { value: 'medium', label: 'Medium' },
    { value: 'spicy', label: 'Spicy' },
    { value: 'extra_spicy', label: 'Extra Spicy' }
  ];

  return (
    <div className="pos-cart-sidebar">
      <div className="pos-cart-header">
        <h5 className="pos-cart-title d-flex align-items-center">
          <button 
            className="btn p-0 me-3 d-md-none border-0 shadow-none" 
            onClick={() => {
              const drawer = document.querySelector('.pos-cart-section');
              if(drawer) drawer.classList.remove('mobile-open');
              // Note: Ideally we'd trigger a prop callback to setMobileCartOpen(false) in WaiterApp
              // but we are using our handle logic. I'll pass a prop instead for cleaner react.
              onClose?.();
            }}
          >
            <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
          </button>
          <ReceiptText size={20} className="me-2 text-primary" /> Order Details
        </h5>
        {selectedTable && (
          <button className="badge-red pill" style={{ cursor: 'pointer', border: 'none' }} onClick={onFreeTable} title="Free Table">
            Clear Table
          </button>
        )}
      </div>

      <div className="pos-order-type-toggle p-2 bg-light rounded-3 mb-3 d-flex gap-2">
        <button 
          className={`flex-grow-1 btn d-flex align-items-center justify-content-center gap-2 py-2 border-0 shadow-none rounded-pill fw-bold ${orderType === 'dine_in' ? 'bg-primary text-white' : 'text-muted'}`}
          onClick={() => onOrderTypeChange?.('dine_in')}
        >
          <UtensilsCrossed size={16} /> Dine-in
        </button>
        <button 
          className={`flex-grow-1 btn d-flex align-items-center justify-content-center gap-2 py-2 border-0 shadow-none rounded-pill fw-bold ${orderType === 'takeaway' ? 'bg-primary text-white' : 'text-muted'}`}
          onClick={() => onOrderTypeChange?.('takeaway')}
        >
          <ShoppingBag size={16} /> Takeaway
        </button>
      </div>

      <div className="pos-cart-scroll">
        <div className="row g-2 mb-2">
          {orderType === 'dine_in' && (
            <div className="col-6">
              <span className="pos-form-label"><Users size={12} className="me-1 text-muted" /> Table</span>
              <select
                className="pos-select"
                value={selectedTable || ''}
                onChange={(e) => onSelectTable?.(e.target.value)}
              >
                <option value="" disabled>Select...</option>
                {tables.map((table) => (
                  <option
                    key={table._id}
                    value={table._id}
                    disabled={table.status === 'occupied' && table._id !== selectedTable}
                  >
                    T-{table.tableNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showCustomer && (
            <div className={orderType === 'dine_in' ? 'col-6' : 'col-12'}>
              <span className="pos-form-label"><Users size={12} className="me-1 text-muted" /> Customer</span>
              <select
                className="pos-select"
                value={selectedCustomer || ''}
                onChange={(e) => onSelectCustomer?.(e.target.value)}
              >
                <option value="">Walk-in</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.name}>
                    {customer.name.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="cart-list mt-2">
          {cart.length === 0 && (
            <div className="text-muted text-center py-4" style={{ fontSize: '14px' }}>
              <ClipboardList size={32} className="text-muted mb-2 opacity-50" />
              <br />
              No items added to the order yet.
            </div>
          )}
          {cart.map((item) => (
            <div key={`${item.menuItem}-${item.variantId || 'base'}`} className="cart-item-row">
              <div className="cart-item-info">
                <div className="cart-item-name">
                  {item.name}
                  {item.variantName && <span className="text-muted small ms-1">({item.variantName})</span>}
                </div>
                <div className="cart-item-price">NPR {item.price}</div>
              </div>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => {
                    if (item.quantity === 1) onUpdateQty(item.menuItem, 0, item.variantId);
                    else onUpdateQty(item.menuItem, item.quantity - 1, item.variantId);
                  }}
                >
                  {item.quantity === 1 ? <Trash2 size={14} color="#ef4444" /> : <Minus size={14} />}
                </button>
                <div className="qty-val">{item.quantity}</div>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.menuItem, item.quantity + 1, item.variantId)}
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
