import React, { useMemo, useState } from 'react';
import MenuSection from './MenuSection.jsx';
import AdminDeliveryCartPanel from './AdminDeliveryCartPanel.jsx';
import CustomizeDishModal from './CustomizeDishModal.jsx';
import { Bike, Clock3, MapPinned, PackageCheck } from 'lucide-react';
import '../../../../common/css/admin/orders/orderDetail.css';

const AdminDeliveryOrderModal = ({
  open,
  onClose,
  deliveryPlatform, // The platform selected in Step 1
  menus = [],
  categories = [],
  staff = [],
  items = [],
  onAddItem,
  onUpdateItemQuantity,
  onClearCart,
  onConfirmDeliveryOrder,
  confirmDisabled = false
}) => {
  const [addSearch, setAddSearch] = useState('');
  const [addCategory, setAddCategory] = useState('all');
  const [addSubMenu, setAddSubMenu] = useState('all');
  const [customizeItem, setCustomizeItem] = useState(null);

  // Delivery Specific States
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [assignedRiderId, setAssignedRiderId] = useState('');

  const staffOptions = useMemo(
    () => staff.filter((s) => s && s._id),
    [staff]
  );

  const menuCategories = useMemo(() => {
    const names = new Set();
    const catMap = new Map(categories.map(c => [c._id, c.name]));
    menus.forEach((m) => {
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const label = m.category?.name || catMap.get(catId) || m.categoryName || (catId && catId.length !== 24 ? catId : null) || 'Uncategorized';
      if (label && label !== 'Uncategorized') names.add(label);
    });
    const result = Array.from(names);
    if (result.length) result.push('Uncategorized');
    return result;
  }, [menus, categories]);

  const menuSubMenus = useMemo(() => {
    const names = new Set();
    menus.forEach((m) => {
      const label = m.subMenu?.name || m.subMenuName || (typeof m.subMenu === 'string' && m.subMenu.length !== 24 ? m.subMenu : null) || '';
      if (label) names.add(label);
    });
    return Array.from(names);
  }, [menus]);

  const filteredMenus = useMemo(() => {
    const catMap = new Map(categories.map(c => [c._id, c.name]));
    return menus.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const cat = m.category?.name || catMap.get(catId) || m.categoryName || (catId && catId.length !== 24 ? catId : null) || 'Uncategorized';
      const sub = m.subMenu?.name || m.subMenuName || (typeof m.subMenu === 'string' && m.subMenu.length !== 24 ? m.subMenu : null) || '';
      if (m.isAvailable === false) return false;
      if (addCategory === 'recommended' && !m.isRecommended) return false;
      if (addCategory !== 'all' && cat !== addCategory) return false;
      if (addSubMenu !== 'all' && sub !== addSubMenu) return false;
      if (addSearch && !name.includes(addSearch.toLowerCase())) return false;
      return true;
    });
  }, [menus, addCategory, addSubMenu, addSearch]);

  if (!open) return null;

  const cartQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartTotal = items.reduce(
    (sum, i) => sum + (i.isComplimentary ? 0 : (i.priceAtOrderTime || 0) * (i.quantity || 1)),
    0
  );
  const riderCount = staffOptions.filter((member) => String(member.role || '').toLowerCase().includes('rider')).length;

  const handleConfirm = () => {
    onConfirmDeliveryOrder({
       deliveryPlatform,
       customerName,
       customerPhone,
       deliveryAddress,
       notes,
       assignedStaffId,
       assignedRiderId
    });
  };

  return (
    <div className="checkout-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div className="checkout-panel delivery-order-modal-shell" onClick={e => e.stopPropagation()}>
        <div className="checkout-header">
          <div className="delivery-order-modal-title-group">
            <div className="delivery-order-modal-icon">
              <Bike size={20} />
            </div>
            <div>
              <div className="delivery-order-modal-kicker">Delivery Workspace</div>
              <h4 className="checkout-title">Create Delivery Order</h4>
              <p className="delivery-order-modal-subtitle">
                Manage customer details, assign a rider, and prepare the cart from one responsive workspace.
              </p>
            </div>
          </div>

          <div className="checkout-actions delivery-order-modal-head-actions">
            <div className="delivery-platform-pill">
              <span className="delivery-platform-pill-dot" />
              {deliveryPlatform || 'Delivery'}
            </div>
            <button className="btn-close shadow-none checkout-close delivery-order-close" onClick={onClose}>X</button>
          </div>
        </div>

        <div className="delivery-order-summary-bar">
          <div className="delivery-order-summary-chip">
            <PackageCheck size={14} />
            <span>{cartQty} items in cart</span>
          </div>
          <div className="delivery-order-summary-chip">
            <MapPinned size={14} />
            <span>{customerName?.trim() ? customerName : 'Customer details pending'}</span>
          </div>
          <div className="delivery-order-summary-chip">
            <Clock3 size={14} />
            <span>{riderCount} riders available</span>
          </div>
        </div>

        <div className="checkout-body delivery-order-layout additem-layout">
          <MenuSection
            addSubMenu={addSubMenu}
            menuSubMenus={menuSubMenus}
            addSearch={addSearch}
            onSearchChange={setAddSearch}
            addCategory={addCategory}
            menuCategories={menuCategories}
            onCategoryChange={({ category, subMenu }) => {
              if (category) setAddCategory(category);
              if (subMenu !== undefined) setAddSubMenu(subMenu);
            }}
            filteredMenus={filteredMenus}
            onAdd={onAddItem}
            onCustomize={setCustomizeItem}
          />

          <AdminDeliveryCartPanel
            items={items}
            cartQty={cartQty}
            cartTotal={cartTotal}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            notes={notes}
            setNotes={setNotes}
            onSelectCustomer={() => {}} // TODO hook up customer Modal picker if needed
            staffOptions={staffOptions}
            assignedStaffId={assignedStaffId}
            onAssignStaff={setAssignedStaffId}
            assignedRiderId={assignedRiderId}
            onAssignRider={setAssignedRiderId}
            onConfirm={handleConfirm}
            onUpdateItemQuantity={onUpdateItemQuantity}
            onClearCart={onClearCart}
            onConfirmDisabled={confirmDisabled}
          />
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
