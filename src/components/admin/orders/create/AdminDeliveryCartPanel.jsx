import React from 'react';
import {
  ShoppingBag,
  ChevronRight,
  User,
  Trash2,
  MapPin,
  Minus,
  Plus,
  Bike,
  ChevronDown,
  FileText,
  Phone,
  Printer
} from 'lucide-react';

const AdminDeliveryCartPanel = ({
  items,
  cartQty,
  cartTotal,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  deliveryAddress,
  setDeliveryAddress,
  notes,
  setNotes,
  onSelectCustomer,
  staffOptions,
  assignedStaffId,
  onAssignStaff,
  assignedRiderId,
  onAssignRider,
  onConfirm,
  onUpdateItemQuantity,
  onClearCart,
  onConfirmDisabled
}) => {
  const selectedStaff = staffOptions.find((s) => s._id === assignedStaffId);
  const selectedRider = staffOptions.find((s) => s._id === assignedRiderId);

  return (
    <aside className="delivery-cart-panel">
      <div className="delivery-cart-top">
        <div>
          <div className="delivery-cart-kicker">Checkout Panel</div>
          <h6 className="delivery-cart-title">Cart Items</h6>
        </div>
        <button className="delivery-cart-clear" disabled={items.length === 0} onClick={() => onClearCart?.()}>
          Clear Cart
        </button>
      </div>

      <div className="delivery-cart-items">
        {items.length === 0 ? (
          <div className="delivery-cart-empty">
            <ShoppingBag size={26} className="delivery-cart-empty-icon" />
            <div className="delivery-cart-empty-title">No items added yet</div>
            
          </div>
        ) : (
          <div className="delivery-cart-item-list">
            {items.map((item, idx) => (
              <div key={idx} className="delivery-cart-item">
                <div className="delivery-cart-item-info">
                  <span className="delivery-cart-item-name">{item.menuItem?.name || 'Item'}</span>
                  <span className="delivery-cart-item-price">
                    Rs {(item.priceAtOrderTime || 0) * (item.quantity || 0)}
                  </span>
                </div>
                <div className="delivery-cart-item-actions">
                  <div className="delivery-cart-qty-control">
                    <button
                      className="delivery-cart-qty-btn"
                      onClick={() => onUpdateItemQuantity(idx, item.quantity - 1)}
                    >
                      {item.quantity === 1 ? <Trash2 size={12} className="text-danger" /> : <Minus size={12} />}
                    </button>
                    <span className="delivery-cart-qty-value">{item.quantity}</span>
                    <button
                      className="delivery-cart-qty-btn"
                      onClick={() => onUpdateItemQuantity(idx, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="delivery-cart-total-row">
              <span>Total ({cartQty} items)</span>
              <span>Rs {cartTotal}</span>
            </div>
          </div>
        )}
      </div>

      <div className="delivery-customer-section">
        <div className="delivery-customer-section-head">
          <h6 className="delivery-customer-title">Customer Details</h6>
          <div className="delivery-customer-note">Complete the details before dispatch</div>
        </div>

        <button className="delivery-select-customer-btn" onClick={onSelectCustomer}>
          <div className="delivery-select-customer-left">
            <div className="delivery-select-customer-icon">
              <User size={14} />
            </div>
            <span>Select Existing Customer</span>
          </div>
          <ChevronRight size={14} className="text-muted" />
        </button>

        <div className="delivery-manual-note">Or add details manually</div>

        <div className="delivery-form-group">
          <label className="delivery-form-label">Customer Name</label>
          <input
            type="text"
            className="delivery-form-input"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="delivery-form-group">
          <label className="delivery-form-label">Phone Number</label>
          <div className="delivery-phone-row">
            <div className="delivery-phone-prefix">
              <Phone size={13} />
              <span>+977</span>
              <ChevronDown size={12} className="text-muted" />
            </div>
            <input
              type="text"
              className="delivery-form-input delivery-phone-input"
              placeholder="98XXXXXXXX"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="delivery-form-group">
          <label className="delivery-form-label">Delivery Address</label>
          <div className="delivery-input-icon-wrap">
            <input
              type="text"
              className="delivery-form-input"
              placeholder="Enter delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
            <div className="delivery-input-icon">
              <MapPin size={14} className="text-muted" />
            </div>
          </div>
        </div>

        <div className="delivery-form-group">
          <label className="delivery-form-label">Notes</label>
          <div className="delivery-input-icon-wrap">
            <textarea
              className="delivery-form-input delivery-form-textarea"
              placeholder="Add delivery notes or landmark details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="delivery-input-icon delivery-input-icon-top">
              <FileText size={14} className="text-muted" />
            </div>
          </div>
        </div>

        <div className="delivery-assignment-grid">
          <div className="dropdown">
            <button className="delivery-assign-btn" data-bs-toggle="dropdown">
              <div className="delivery-assign-btn-main">
                <User size={14} />
                <span>{selectedStaff?.name || 'Assign Staff'}</span>
              </div>
              <ChevronRight size={14} className="text-muted" />
            </button>
            <ul className="dropdown-menu w-100 shadow-sm border-0 rounded-3 max-h-200 overflow-auto">
              <li>
                <button className="dropdown-item small text-muted" onClick={() => onAssignStaff('')}>
                  Unassigned (Staff)
                </button>
              </li>
              {staffOptions.map((staff) => (
                <li key={staff._id}>
                  <button className="dropdown-item small fw-bold" onClick={() => onAssignStaff(staff._id)}>
                    {staff.name} ({staff.role})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown">
            <button className="delivery-assign-btn" data-bs-toggle="dropdown">
              <div className="delivery-assign-btn-main">
                <Bike size={14} />
                <span>{selectedRider?.name || 'Assign Rider'}</span>
              </div>
              <ChevronRight size={14} className="text-muted" />
            </button>
            <ul className="dropdown-menu w-100 shadow-sm border-0 rounded-3 max-h-200 overflow-auto">
              <li>
                <button className="dropdown-item small text-muted" onClick={() => onAssignRider('')}>
                  Unassigned (Rider)
                </button>
              </li>
              {staffOptions.map((staff) => (
                <li key={staff._id}>
                  <button className="dropdown-item small fw-bold" onClick={() => onAssignRider(staff._id)}>
                    {staff.name} ({staff.role})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="delivery-action-bar">
          <button className="delivery-secondary-btn" onClick={() => {}}>
            <Printer size={15} />
            <span>Confirm & Print</span>
          </button>
          <button className="delivery-primary-btn" onClick={onConfirm} disabled={onConfirmDisabled || items.length === 0}>
            Confirm Order
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminDeliveryCartPanel;
