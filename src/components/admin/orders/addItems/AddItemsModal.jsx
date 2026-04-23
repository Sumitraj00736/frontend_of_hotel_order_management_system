import React, { useMemo, useState } from 'react';
import MenuSection from '../create/MenuSection.jsx';
import CartPanel from '../create/CartPanel.jsx';
import CustomizeDishModal from '../create/CustomizeDishModal.jsx';
import '../../../../common/css/admin/orders/orderDetail.css';

const AddItemsModal = ({
  open,
  onClose,
  menus = [],
  categories = [],
  staff = [],
  showAssignStaff = true,
  assignedStaffId,
  onAssignStaff,
  selectedTableId,
  tableOptions = [],
  onTableChange,
  orderTableNumber,
  orderTargetName, // Added this prop
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
    // SubMenus are usually strings or simple objects in this schema, resolve similarly
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

  return (
    <div className="additem-overlay" onClick={onClose}>
      <div className="additem-card" onClick={(e) => e.stopPropagation()}>
        <button className="additem-close" onClick={onClose}>×</button>
        <div className="additem-layout">
          <MenuSection
            orderTableNumber={orderTableNumber}
            orderTargetName={orderTargetName}
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
