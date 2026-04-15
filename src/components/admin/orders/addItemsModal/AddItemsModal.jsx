import React, { useMemo, useState } from 'react';
import MenuSection from './MenuSection.jsx';
import CartPanel from './CartPanel.jsx';
import CustomizeDishModal from './CustomizeDishModal.jsx';
import '../../../../common/css/admin/orders/orderDetail.css';

const AddItemsModal = ({
  open,
  onClose,
  menus = [],
  staff = [],
  showAssignStaff = true,
  assignedStaffId,
  onAssignStaff,
  selectedTableId,
  tableOptions = [],
  onTableChange,
  orderTableNumber,
  items = [],
  onAddItem,
  onUpdateItemQuantity,
  onUpdateItemNote,
  onClearCart,
  onConfirm,
  confirmLabel = 'Confirm Order',
  confirmDisabled = false,
  clearLabel = 'Clear Cart'
}) => {
  const [addSearch, setAddSearch] = useState('');
  const [addCategory, setAddCategory] = useState('all');
  const [addSubMenu, setAddSubMenu] = useState('all');
  const [customizeItem, setCustomizeItem] = useState(null);
  const [showStaffList, setShowStaffList] = useState(false);

  const staffOptions = useMemo(
    () => staff.filter((s) => s && s._id),
    [staff]
  );

  const menuCategories = useMemo(() => {
    const names = new Set();
    menus.forEach((m) => {
      const label = m.category?.name || m.categoryName || m.category || 'Uncategorized';
      if (label) names.add(label);
    });
    return Array.from(names);
  }, [menus]);

  const menuSubMenus = useMemo(() => {
    const names = new Set();
    menus.forEach((m) => {
      const label = m.subMenu?.name || m.subMenuName || m.subMenu || '';
      if (label) names.add(label);
    });
    return Array.from(names);
  }, [menus]);

  const filteredMenus = useMemo(() => {
    return menus.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const cat = (m.category?.name || m.categoryName || m.category || 'Uncategorized');
      const sub = (m.subMenu?.name || m.subMenuName || m.subMenu || '');
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

  return (
    <div className="additem-overlay" onClick={onClose}>
      <div className="additem-card" onClick={(e) => e.stopPropagation()}>
        <button className="additem-close" onClick={onClose}>×</button>
        <div className="additem-layout">
          <MenuSection
            orderTableNumber={orderTableNumber}
            selectedTableId={selectedTableId}
            tableOptions={tableOptions}
            onTableChange={onTableChange}
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

          <CartPanel
            items={items}
            cartQty={cartQty}
            cartTotal={cartTotal}
            showAssignStaff={showAssignStaff}
            assignedStaffId={assignedStaffId}
            staffOptions={staffOptions}
            showStaffList={showStaffList}
            onToggleStaffList={() => setShowStaffList((prev) => !prev)}
            onAssignStaff={onAssignStaff}
            onUpdateItemQuantity={onUpdateItemQuantity}
            onUpdateItemNote={onUpdateItemNote}
            onClearCart={onClearCart}
            clearLabel={clearLabel}
            onConfirm={onConfirm || onClose}
            confirmLabel={confirmLabel}
            confirmDisabled={confirmDisabled}
          />
        </div>

        <div className="additem-footer-spacer" />
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

export default AddItemsModal;
