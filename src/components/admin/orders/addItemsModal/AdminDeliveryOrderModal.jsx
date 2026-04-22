import React, { useMemo, useState } from 'react';
import MenuSection from './MenuSection.jsx';
import AdminDeliveryCartPanel from './AdminDeliveryCartPanel.jsx';
import CustomizeDishModal from './CustomizeDishModal.jsx';
import { Bike, Search, X } from 'lucide-react';
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
    <div className="additem-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      {/* Full screen modal container */}
      <div className="bg-white mx-auto d-flex flex-column rounded-0" style={{ width: '100%', height: '100%', maxWidth: '1440px' }} onClick={e => e.stopPropagation()}>
        
        {/* Custom Header for Delivery Order */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom shadow-sm z-3 bg-white">
           <div className="d-flex align-items-center gap-3">
              <h4 className="m-0 fw-bold d-flex align-items-center gap-2">
                 <Bike size={20} className="text-secondary" /> Delivery Order
              </h4>
              <div className="badge bg-dark rounded-pill fw-medium px-3 py-2 d-flex align-items-center gap-1">
                 <span className="bg-white rounded-circle d-inline-block" style={{ width: 14, height: 14 }}>
                    <span className="bg-dark rounded-circle d-inline-block m-1" style={{ width: 6, height: 6 }}></span>
                 </span>
                 {deliveryPlatform}
              </div>
           </div>
           <button className="btn-close shadow-none" onClick={onClose}></button>
        </div>

        {/* Layout */}
        <div className="d-flex flex-grow-1 overflow-hidden additem-layout">
          {/* Menu Section */}
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
            // For delivery, no table selection header is needed, so we pass explicit flag logic or omit it.
          />

          {/* Delivery Cart Panel */}
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
