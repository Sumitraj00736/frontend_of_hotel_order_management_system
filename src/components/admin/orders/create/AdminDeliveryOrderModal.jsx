import React, { useMemo, useState } from 'react';
import { 
  Bike, 
  Search, 
  ChevronRight, 
  User, 
  Minus, 
  Plus, 
  Trash2, 
  Star, 
  ChevronDown, 
  UserPlus, 
  FileText,
  UserCheck,
  UserCog
} from 'lucide-react';
import CustomizeDishModal from './CustomizeDishModal.jsx';
import '../../../../common/css/admin/orders/AdminDeliveryOrderModal.css'; 

const getPlaceholder = (name) => (name ? name.charAt(0).toUpperCase() : '?');

const AdminDeliveryOrderModal = ({
  open,
  onClose,
  deliveryPlatform,
  menus = [],
  categories = [],
  staff = [],
  items = [], 
  onAddItem,
  onUpdateItemQuantity,
  onClearCart,
  onConfirmDeliveryOrder,
  confirmDisabled = false,
  customers = []
}) => {
  const [addSearch, setAddSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeSubMenu, setActiveSubMenu] = useState('all');
  const [customizeItem, setCustomizeItem] = useState(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showRiderDropdown, setShowRiderDropdown] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [assignedRiderId, setAssignedRiderId] = useState('');

  const staffOptions = useMemo(() => staff.filter((s) => s && s._id), [staff]);

  const menuCategories = useMemo(() => {
    const names = new Set();
    const catMap = new Map(categories.map(c => [c._id, c.name]));
    menus.forEach((m) => {
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const label = m.category?.name || catMap.get(catId) || m.categoryName || 'Uncategorized';
      if (label) names.add(label);
    });
    const result = Array.from(names).filter(n => n !== 'Uncategorized');
    result.unshift('All Categories');
    result.unshift('Recommended');
    return result;
  }, [menus, categories]);

  const menuSubMenus = useMemo(() => {
    const names = new Set();
    menus.forEach((m) => {
      const label = m.subMenu?.name || m.subMenuName || (typeof m.subMenu === 'string' && m.subMenu.length !== 24 ? m.subMenu : null);
      if (label) names.add(label);
    });
    return Array.from(names);
  }, [menus]);

  const filteredMenus = useMemo(() => {
    const catMap = new Map(categories.map(c => [c._id, c.name]));
    return menus.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const cat = m.category?.name || catMap.get(catId) || m.categoryName || 'Uncategorized';
      const sub = m.subMenu?.name || m.subMenuName || (typeof m.subMenu === 'string' && m.subMenu.length !== 24 ? m.subMenu : null) || '';
      
      if (m.isAvailable === false) return false;
      if (activeCategory === 'Recommended' && !m.isRecommended) return false;
      if (activeCategory !== 'All Categories' && activeCategory !== 'Recommended' && cat !== activeCategory) return false;
      if (activeSubMenu !== 'all' && sub !== activeSubMenu) return false;
      if (addSearch && !name.includes(addSearch.toLowerCase())) return false;
      return true;
    });
  }, [menus, activeCategory, activeSubMenu, addSearch, categories]);

  const cartQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartTotal = items.reduce(
    (sum, i) => sum + (i.isComplimentary ? 0 : (i.priceAtOrderTime || 0) * (i.quantity || 1)),
    0
  );

  const getItemQtyInCart = (menuId) => {
    const cartItem = items.find(i => (i.menuItem?._id || i.menuItem) === menuId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getItemIndexInCart = (menuId) => {
    return items.findIndex(i => (i.menuItem?._id || i.menuItem) === menuId);
  };

  const isFormValid = useMemo(() => {
    return (
      customerName.trim().length > 0 &&
      customerPhone.trim().length >= 7 &&
      deliveryAddress.trim().length > 0 &&
      items.length > 0
    );
  }, [customerName, customerPhone, deliveryAddress, items]);

  const handleConfirm = () => {
    onConfirmDeliveryOrder({
       deliveryPlatform, customerName, customerPhone, deliveryAddress, notes, assignedStaffId, assignedRiderId
    });
  };

  if (!open) return null;

  return (
    <div className="delivery-workspace-overlay" onClick={onClose}>
      <div className="delivery-workspace-panel" onClick={e => e.stopPropagation()}>
        
        {/* --- HEADER --- */}
        <header className="delivery-workspace-header">
          <div className="dw-header-left">
            <Bike size={28} className="text-dark" />
            <h4>Delivery Order</h4>
            <div className="platform-trigger-pill">
              <span className="dot" />
              {deliveryPlatform || 'Direct Order'}
              <ChevronRight size={14} />
            </div>
          </div>
          <div className="dw-header-controls">
            <select className="dw-select-minimal">
              <option>Default Menuset</option>
            </select>
            <select 
              className="dw-select-minimal"
              value={activeSubMenu} 
              onChange={e => setActiveSubMenu(e.target.value)}
            >
              <option value="all">Select Sub Menu</option>
              {menuSubMenus.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <div className="dw-search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search here" 
                value={addSearch}
                onChange={e => setAddSearch(e.target.value)}
              />
            </div>
            <button className="dw-header-close-btn" onClick={onClose}>×</button>
          </div>
        </header>

        <div className="delivery-workspace-body">
          {/* --- MENU SECTION --- */}
          <section className="delivery-menu-section">
            <div className="dw-categories-row">
              {menuCategories.map(cat => (
                <button 
                  key={cat} 
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'Recommended' && <Star size={14} fill="currentColor" />}
                  {cat}
                </button>
              ))}
            </div>

            <h6 className="dw-section-title">
              {activeCategory} ({filteredMenus.length})
            </h6>

            <div className="dishes-grid-scrollable">
              {filteredMenus.map((item) => {
                const qty = getItemQtyInCart(item._id);
                const idx = getItemIndexInCart(item._id);
                
                return (
                  <div key={item._id} className="dish-card">
                    <div className="dish-thumb-wrap">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} />
                      ) : (
                        <div className="dish-placeholder">{getPlaceholder(item.name)}</div>
                      )}
                    </div>
                    <div className="dish-info">
                      <div className="dish-name">{item.name}</div>
                      <div className="dish-price">
                        Rs {item.variants?.[0]?.price || item.price}
                        {item.variants?.length > 1 && ` - Rs ${Math.max(...item.variants.map(v => v.price))}`}
                      </div>
                    </div>
                    {qty > 0 ? (
                      <div className="dish-counter-overlay">
                        <button onClick={() => onUpdateItemQuantity(idx, qty - 1)}><Minus size={14} /></button>
                        <span>{qty}</span>
                        <button onClick={() => onUpdateItemQuantity(idx, qty + 1)}><Plus size={14} /></button>
                      </div>
                    ) : (
                      <button 
                        className="dish-add-btn"
                        onClick={() => item.variants?.length > 1 ? setCustomizeItem(item) : onAddItem(item)}
                      >
                        Add {item.variants?.length > 1 && <span className="small d-block fw-normal">{item.variants.length} options</span>}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* --- CART SIDEBAR --- */}
          <aside className="delivery-cart-aside">
            <div className="cart-header-row">
              <h6>Cart Items</h6>
              <span className="clear-cart-link" onClick={onClearCart}>
                <Trash2 size={12} /> Clear Cart
              </span>
            </div>

            <div className="cart-items-scrollable">
              {items.map((item, idx) => (
                <div key={idx} className="cart-item-block">
                  <div className="cart-item-main">
                    {item.menuItem?.imageUrl ? (
                      <img src={item.menuItem.imageUrl} className="cart-item-img" alt="" />
                    ) : (
                      <div className="cart-item-img d-flex align-items-center justify-content-center bg-light">
                        {getPlaceholder(item.menuItem?.name)}
                      </div>
                    )}
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.menuItem?.name || 'Item'}</div>
                      <div className="cart-item-price-meta">@ Rs {item.priceAtOrderTime || 0}</div>
                    </div>
                    <div className="cart-item-controls">
                      <div className="cart-qty-spinner">
                        <button onClick={() => onUpdateItemQuantity(idx, item.quantity - 1)}><Minus size={12} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateItemQuantity(idx, item.quantity + 1)}><Plus size={12} /></button>
                      </div>
                      <div className="cart-item-line-total">
                        Rs {(item.priceAtOrderTime || 0) * (item.quantity || 1)}
                      </div>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    className="item-remarks-input" 
                    placeholder="Add Remarks to dish" 
                  />
                </div>
              ))}
            </div>

            {/* CUSTOMER SECTION */}
            <div className="customer-section">
              <h6>Add Customer Details</h6>
              
              <div className="position-relative">
                <div className="dw-label">Select Existing Customer</div>
                <div className="dw-search-box w-100 mb-3">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search name or phone..." 
                    value={customerSearch}
                    onFocus={() => setShowCustomerDropdown(true)}
                    onChange={e => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                  />
                  {showCustomerDropdown && (
                    <div className="dw-dropdown-list shadow-lg">
                      {customers.filter(c => 
                        (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) || 
                        (c.phone || '').includes(customerSearch)
                      ).map(c => (
                        <div 
                          key={c._id} 
                          className="dw-dropdown-item"
                          onClick={() => {
                            setCustomerName(c.name);
                            setCustomerPhone(c.phone || '');
                            setDeliveryAddress(c.address || '');
                            setCustomerSearch(c.name);
                            setShowCustomerDropdown(false);
                          }}
                        >
                          <div className="fw-bold">{c.name}</div>
                          <div className="small text-muted">{c.phone}</div>
                        </div>
                      ))}
                      {customers.length === 0 && <div className="p-3 text-muted small">No customers found</div>}
                    </div>
                  )}
                </div>
              </div>

              <span className="manual-add-label">Or, add manually</span>
              <div className="customer-inputs">
                <div className="input-group-dw">
                  <label className="dw-label">Customer Name</label>
                  <input 
                    type="text" 
                    className="dw-input" 
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="input-group-dw">
                  <label className="dw-label">Phone Number</label>
                  <div className="phone-input-wrap">
                    <div className="country-select">
                      <img src="https://flagcdn.com/w20/np.png" width="16" alt="NP" />
                      <ChevronDown size={14} />
                      <span>+977</span>
                    </div>
                    <input 
                      type="text" 
                      className={`dw-input ${!customerPhone && 'border-danger'}`} 
                      placeholder="98XXXXXXXX"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="input-group-dw mt-2">
                   <label className="dw-label">Delivery Address <span className="text-danger">*</span></label>
                   <input 
                      type="text" 
                      className={`dw-input ${!deliveryAddress && 'border-danger'}`} 
                      placeholder="Enter full address"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                    />
                </div>
              </div>

              <button className="add-remarks-btn">
                <FileText size={16} />
                Add Remarks
              </button>
            </div>

            {/* CART FOOTER */}
            <div className="cart-footer">
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-qty">QTY: {cartQty}</span>
                <span className="total-amount">Rs {cartTotal}</span>
              </div>

              <div className="assignment-buttons">
                <div className="position-relative w-100">
                  <button 
                    className={`assign-btn w-100 ${assignedStaffId ? 'border-primary text-primary' : ''}`}
                    onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {assignedStaffId ? <UserCheck size={16} /> : <UserPlus size={16} />}
                      <span className="text-truncate" style={{ maxWidth: '100px' }}>
                        {assignedStaffId ? staff.find(s => s._id === assignedStaffId)?.name : 'Staff'}
                      </span>
                    </div>
                    <ChevronDown size={14} />
                  </button>
                  {showStaffDropdown && (
                    <div className="dw-dropdown-list bottom-100 mb-2 shadow-lg">
                      {staff.map(s => (
                        <div 
                          key={s._id} 
                          className="dw-dropdown-item"
                          onClick={() => {
                            setAssignedStaffId(s._id);
                            setShowStaffDropdown(false);
                          }}
                        >
                          <div className="fw-bold">{s.name}</div>
                          <div className="small text-muted">{s.role}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="position-relative w-100">
                  <button 
                    className={`assign-btn w-100 ${assignedRiderId ? 'border-primary text-primary' : ''}`}
                    onClick={() => setShowRiderDropdown(!showRiderDropdown)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Bike size={16} />
                      <span className="text-truncate" style={{ maxWidth: '100px' }}>
                        {assignedRiderId ? staff.find(s => s._id === assignedRiderId)?.name : 'Rider'}
                      </span>
                    </div>
                    <ChevronDown size={14} />
                  </button>
                  {showRiderDropdown && (
                    <div className="dw-dropdown-list bottom-100 mb-2 shadow-lg">
                      {staff.filter(s => (s.role || '').toLowerCase().includes('rider')).map(s => (
                        <div 
                          key={s._id} 
                          className="dw-dropdown-item"
                          onClick={() => {
                            setAssignedRiderId(s._id);
                            setShowRiderDropdown(false);
                          }}
                        >
                          <div className="fw-bold">{s.name}</div>
                          <div className="small text-muted">{s.role}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-confirm-print">Confirm & Print</button>
                <button 
                  className="btn-confirm-order"
                  onClick={handleConfirm}
                  disabled={confirmDisabled || !isFormValid}
                  title={!isFormValid ? "Please fill customer name, phone, and address" : ""}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CustomizeDishModal
        open={Boolean(customizeItem)}
        item={customizeItem}
        onClose={() => setCustomizeItem(null)}
        onAdd={onAddItem}
      />
    </div>
  );
};

export default AdminDeliveryOrderModal;