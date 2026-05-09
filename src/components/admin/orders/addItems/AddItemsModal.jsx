import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import '../../../../common/css/admin/orders/AddItemsModal.css';
import MenuSection from '../create/MenuSection.jsx';
import CartPanel from '../create/CartPanel.jsx';
import CustomizeDishModal from '../create/CustomizeDishModal.jsx';

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
  orderTargetName,
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
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

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

  const cartQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartTotal = items.reduce(
    (sum, i) => sum + (i.isComplimentary ? 0 : (i.priceAtOrderTime || 0) * (i.quantity || 1)),
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="additem-overlay" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="additem-card" 
            initial={{ y: -60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
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

              {/* Desktop cart — hidden on mobile */}
              <div className="additem-cart-desktop">
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
            </div>

            {/* ── Mobile Floating Cart Button ── */}
            {cartQty > 0 && !mobileCartOpen && (
              <motion.button
                className="mobile-cart-fab"
                initial={{ scale: 0, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 40 }}
                onClick={() => setMobileCartOpen(true)}
              >
                <ShoppingCart size={18} />
                <span className="fab-label">View Cart</span>
                <span className="fab-badge">{cartQty}</span>
                <span className="fab-total">Rs {cartTotal.toFixed(0)}</span>
              </motion.button>
            )}

            {/* ── Mobile Cart Slide-Up Panel ── */}
            <AnimatePresence>
              {mobileCartOpen && (
                <motion.div
                  className="mobile-cart-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileCartOpen(false)}
                >
                  <motion.div
                    className="mobile-cart-panel"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mobile-cart-handle">
                      <div className="handle-bar" />
                      <button className="mobile-cart-close" onClick={() => setMobileCartOpen(false)}>
                        <X size={18} />
                      </button>
                    </div>
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
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <CustomizeDishModal
            open={Boolean(customizeItem)}
            item={customizeItem}
            onClose={() => setCustomizeItem(null)}
            onAdd={onAddItem}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddItemsModal;
