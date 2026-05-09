import React, { useMemo, useState } from 'react';
import { 
  Bike, Search, ChevronRight, Minus, Plus, 
  Trash2, Star, ChevronDown, UserPlus, FileText,
  UserCheck, X, ShoppingBag, MapPin, Phone
} from 'lucide-react';
import CustomizeDishModal from './CustomizeDishModal.jsx';
import './adminDeliveryOrderModal.css';

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
  
  // Mobile UI State
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [assignedRiderId, setAssignedRiderId] = useState('');

  // Memoized Data
  const menuCategories = useMemo(() => {
    const names = new Set();
    const catMap = new Map(categories.map(c => [c._id, c.name]));
    menus.forEach((m) => {
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const label = m.category?.name || catMap.get(catId) || m.categoryName || 'Uncategorized';
      if (label) names.add(label);
    });
    const result = Array.from(names).filter(n => n !== 'Uncategorized');
    result.unshift('All Categories', 'Recommended');
    return result;
  }, [menus, categories]);

  const filteredMenus = useMemo(() => {
    return menus.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const catName = m.category?.name || 'Uncategorized';
      
      if (m.isAvailable === false) return false;
      if (activeCategory === 'Recommended' && !m.isRecommended) return false;
      if (activeCategory !== 'All Categories' && activeCategory !== 'Recommended' && catName !== activeCategory) return false;
      if (addSearch && !name.includes(addSearch.toLowerCase())) return false;
      return true;
    });
  }, [menus, activeCategory, addSearch]);

  const cartQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartTotal = items.reduce((sum, i) => sum + (i.priceAtOrderTime * i.quantity), 0);

  const isFormValid = customerName && customerPhone.length >= 7 && deliveryAddress && items.length > 0;

  if (!open) return null;

  return (
    <div className="dw-overlay" onClick={onClose}>
      <div className="dw-panel" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <header className="dw-header">
          <div className="dw-header-left">
            <div className="platform-icon">
              <Bike size={20} color="white" />
            </div>
            <div>
              <h3>Delivery Order</h3>
              <span className="platform-tag">{deliveryPlatform || 'Direct'}</span>
            </div>
          </div>
          <button className="dw-close-icon" onClick={onClose}><X size={24} /></button>
        </header>

        <div className="dw-main-layout">
          {/* MENU SECTION */}
          <section className={`dw-menu-container ${isMobileCartOpen ? 'mobile-hidden' : ''}`}>
            <div className="dw-search-bar">
              <Search size={18} />
              <input 
                placeholder="Search for dishes..." 
                value={addSearch}
                onChange={e => setAddSearch(e.target.value)}
              />
            </div>

            <div className="dw-categories">
              {menuCategories.map(cat => (
                <button 
                  key={cat}
                  className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'Recommended' && <Star size={14} style={{marginRight: 4}} />}
                  {cat}
                </button>
              ))}
            </div>

            <div className="dw-grid">
              {filteredMenus.map(item => {
                const inCart = items.find(i => (i.menuItem?._id || i.menuItem) === item._id);
                return (
                  <div key={item._id} className="dw-card">
                    <div className="dw-card-img">
                      {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div className="dw-img-placeholder">{getPlaceholder(item.name)}</div>}
                      {inCart && <div className="dw-card-qty">{inCart.quantity}</div>}
                    </div>
                    <div className="dw-card-body">
                      <div className="dw-card-title">{item.name}</div>
                      <div className="dw-card-price">Rs {item.price}</div>
                      <button 
                        className={`dw-add-btn ${inCart ? 'active' : ''}`}
                        onClick={() => item.variants?.length > 1 ? setCustomizeItem(item) : onAddItem(item)}
                      >
                        {inCart ? 'Add More' : 'Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CART SIDEBAR */}
          <aside className={`dw-cart-sidebar ${isMobileCartOpen ? 'mobile-visible' : ''}`}>
            <div className="mobile-cart-header" onClick={() => setIsMobileCartOpen(false)}>
              <ChevronDown /> <span>Back to Menu</span>
            </div>

            <div className="dw-cart-scroll">
              <div className="dw-cart-section">
                <div className="section-header">
                  <h5>Order Summary</h5>
                  <button className="clear-btn" onClick={onClearCart}><Trash2 size={14} /> Clear</button>
                </div>
                
                {items.length === 0 ? (
                  <div className="empty-cart">Your cart is empty</div>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="dw-cart-item">
                      <div className="item-info">
                        <span className="item-name">{item.menuItem?.name}</span>
                        <span className="item-price">Rs {item.priceAtOrderTime}</span>
                      </div>
                      <div className="item-actions">
                        <div className="qty-picker">
                          <button onClick={() => onUpdateItemQuantity(idx, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onUpdateItemQuantity(idx, item.quantity + 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="dw-cart-section">
                <h5>Customer Details</h5>
                <div className="dw-form">
                  <div className="input-with-icon">
                    <Search size={16} />
                    <input 
                      placeholder="Search existing customer..." 
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                    />
                  </div>
                  <input 
                    className="dw-input" 
                    placeholder="Customer Name *" 
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                  <input 
                    className="dw-input" 
                    placeholder="Phone Number *" 
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                  />
                  <textarea 
                    className="dw-input" 
                    placeholder="Delivery Address *" 
                    rows="2"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="dw-cart-footer">
              <div className="dw-total-row">
                <span>Total Amount</span>
                <span>Rs {cartTotal}</span>
              </div>
              <button 
                className="dw-confirm-btn" 
                disabled={!isFormValid || confirmDisabled}
                onClick={() => onConfirmDeliveryOrder({ customerName, customerPhone, deliveryAddress })}
              >
                Place Delivery Order
              </button>
            </div>
          </aside>
        </div>

        {/* MOBILE FLOATING BUTTON */}
        {!isMobileCartOpen && cartQty > 0 && (
          <div className="mobile-fab" onClick={() => setIsMobileCartOpen(true)}>
            <div className="fab-left">
              <ShoppingBag size={20} />
              <span>{cartQty} Items • Rs {cartTotal}</span>
            </div>
            <div className="fab-right">
              View Cart <ChevronRight size={18} />
            </div>
          </div>
        )}
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