import React, { useMemo, useState } from 'react';
import { Bike, Clock3, MapPinned, Search, ChevronRight, User, Package, Minus, Plus, Trash2 } from 'lucide-react';
import CustomizeDishModal from './CustomizeDishModal.jsx';
// Import the new consolidated CSS
import '../../../../common/css/admin/orders/AdminDeliveryOrderModal.css'; 

// Utility to generate thumbnail placeholder (e.g., 'B' for 'Burger')
const getPlaceholder = (name) => (name ? name.charAt(0).toUpperCase() : '?');

const AdminDeliveryOrderModal = ({
  open,
  onClose,
  deliveryPlatform, // Selected in Step 1
  menus = [],
  categories = [],
  staff = [],
  items = [], // Cart items
  onAddItem,
  onUpdateItemQuantity,
  onClearCart,
  onConfirmDeliveryOrder,
  confirmDisabled = false
}) => {
  // --- Workspace States ---
  const [addSearch, setAddSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items'); // Default tab from image
  const [activeSubMenu, setActiveSubMenu] = useState('all');
  const [customizeItem, setCustomizeItem] = useState(null);

  // Delivery Specific States (Customer/Logistics)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [assignedRiderId, setAssignedRiderId] = useState('');

  // --- Memoized Logic ---

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
    result.unshift('All Items'); // Match image default
    result.unshift('Recommended'); // Match image default
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
      if (activeCategory !== 'All Items' && activeCategory !== 'Recommended' && cat !== activeCategory) return false;
      if (activeSubMenu !== 'all' && sub !== activeSubMenu) return false;
      if (addSearch && !name.includes(addSearch.toLowerCase())) return false;
      return true;
    });
  }, [menus, activeCategory, activeSubMenu, addSearch, categories]);

  // --- Cart Calculations ---
  const cartQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartTotal = items.reduce(
    (sum, i) => sum + (i.isComplimentary ? 0 : (i.priceAtOrderTime || 0) * (i.quantity || 1)),
    0
  );
  const riderCount = staffOptions.filter((member) => String(member.role || '').toLowerCase().includes('rider')).length;

  const handleConfirm = () => {
    onConfirmDeliveryOrder({
       deliveryPlatform, customerName, customerPhone, deliveryAddress, notes, assignedStaffId, assignedRiderId
    });
  };

  if (!open) return null;

  return (
    <div className="delivery-workspace-overlay" onClick={onClose}>
      <div className="delivery-workspace-panel" onClick={e => e.stopPropagation()}>
        
        {/* --- 1. Header (Matched to Image) --- */}
        <header className="delivery-workspace-header">
          <div className="dw-header-left">
            <div className="dw-header-icon-square">
              <Bike size={24} strokeWidth={2.5}/>
            </div>
            <div className="dw-header-titles">
              <div className="kicker">DELIVERY WORKSPACE</div>
              <h4>Create Delivery Order</h4>
            </div>
          </div>
          <div className="dw-header-right">
            <div className="delivery-platform-pill">
              <span className="dot" />
              {deliveryPlatform || 'Direct Order'}
            </div>
            <button className="dw-header-close" onClick={onClose}>×</button>
          </div>
        </header>

        {/* --- 2. Summary Bar (Grey Pills from Image) --- */}
        <div className="delivery-summary-bar">
          <div className="delivery-summary-pill">
            <Package size={16} />
            <span>{cartQty} Items in cart</span>
          </div>
          <div className="delivery-summary-pill">
            <MapPinned size={16} />
            <span>{customerName?.trim() ? `To: ${customerName}` : 'Customer details pending'}</span>
          </div>
          <div className="delivery-summary-pill">
            <Clock3 size={16} />
            <span>{riderCount} Riders available</span>
          </div>
        </div>

        {/* --- 3. Body (Responsive Grid) --- */}
        <div className="delivery-workspace-body">
          
          {/* --- LEFT SECTION (Menu Selection) --- */}
          <section className="delivery-menu-section">
            <h6 className="select-dishes-title">Select Dishes</h6>

            {/* Menu Controls (Search + Submenu) */}
            <div className="menu-controls-row">
              <div className="menu-search-wrapper">
                <Search size={18} className="search-icon-inside" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search menu..."
                  value={addSearch}
                  onChange={e => setAddSearch(e.target.value)}
                />
              </div>
              <select 
                className="submenu-select" 
                value={activeSubMenu} 
                onChange={e => setActiveSubMenu(e.target.value)}
              >
                <option value="all">Sub Menu</option>
                {menuSubMenus.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Category Filter Tabs (Horizontal Scrollable) */}
            <div className="category-filter-tabs">
              {menuCategories.map(cat => (
                <button 
                  key={cat} 
                  className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="dishes-grid-scrollable">
              {filteredMenus.map((item) => (
                <div key={item._id} className="dish-card">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="dish-thumb" />
                  ) : (
                    <div className="dish-thumb-placeholder">{getPlaceholder(item.name)}</div>
                  )}
                  <div className="dish-details">
                    <div className="dish-name">{item.name}</div>
                    <div className="dish-price">Rs {item.variants?.[0]?.price || item.price} +</div>
                  </div>
                  <div className="dish-action">
                    <button 
                      className="add-btn" 
                      onClick={() => item.variants?.length > 1 ? setCustomizeItem(item) : onAddItem(item)}
                    >
                      Add +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- RIGHT SECTION (Checkout Panel) --- */}
          <aside className="delivery-cart-aside">
            <div className="cart-top-bar">
              <div className="cart-title-group">
                <div className="kicker">Checkout Panel</div>
                <h6>Cart Items</h6>
              </div>
              <button className="clear-cart-btn" onClick={onClearCart} disabled={items.length === 0}>
                Clear Cart
              </button>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-scrollable">
              {items.map((item, idx) => (
                <div key={idx} className="cart-item-row">
                  <div className="cart-item-thumb-minimal">
                    {getPlaceholder(item.menuItem?.name)}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.menuItem?.name || 'Item'}</div>
                    <div className="cart-item-price">Rs {item.priceAtOrderTime || 0}</div>
                  </div>
                  <div className="cart-item-qty-row">
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button className="cart-qty-btn-minimal" onClick={() => onUpdateItemQuantity(idx, item.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <button className="cart-qty-btn-minimal" onClick={() => onUpdateItemQuantity(idx, item.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                    <button className="cart-item-remove-btn" onClick={() => onUpdateItemQuantity(idx, 0)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Details & Logistics (Greyscale from image) */}
            <div className="cart-customer-section">
              <button className="customer-picker-btn">
                <div className="row-items">
                  <User size={18} className="text-muted mr-2" />
                  <span>Select Existing Customer</span>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </button>

              <div className="dw-inline-form-group">
                <input type="text" className="dw-input-style" placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <input type="text" className="dw-input-style" placeholder="Phone Number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>

              <input type="text" className="dw-input-style" placeholder="Delivery Address" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
              <input type="text" className="dw-input-style" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />

              <div className="logistics-assign-row">
                <div className="assignment-block">
                  <label className="dw-label-tiny">Staff</label>
                  <select className="dw-input-style" value={assignedStaffId} onChange={e => setAssignedStaffId(e.target.value)}>
                    <option value="">Bike</option> {/* Matched placeholder from image */}
                    {staffOptions.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role})</option>)}
                  </select>
                </div>
                <div className="assignment-block">
                  <label className="dw-label-tiny">Rider</label>
                  <select className="dw-input-style" value={assignedRiderId} onChange={e => setAssignedRiderId(e.target.value)}>
                    <option value="">Bike</option>
                    {staffOptions.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role})</option>)}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="dw-action-bar">
                <button className="dw-btn dw-btn-secondary">Confirm & Print</button>
                <button className="dw-btn dw-btn-primary" onClick={handleConfirm} disabled={confirmDisabled || items.length === 0}>
                  Confirm Order
                </button>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Kept as is, will inherit visual styles from the new CSS */}
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