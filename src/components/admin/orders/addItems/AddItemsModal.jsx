import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import './OrderItemsPremium.css';
import MenuSection from '../create/MenuSection.jsx';
import CartPanel from '../create/CartPanel.jsx';
import CustomizeDishModal from '../create/CustomizeDishModal.jsx';

const AddItemsModal = ({
  open,
  onClose,
  items = [],
  onAddItem,
  onUpdateItemQuantity,
  onUpdateItemNote,
  onClearCart,
  menus = [],
  tableOptions = [],
  selectedTableId,
  onTableChange,
  orderTableNumber,
  orderTargetName,
  staffOptions = [],
  assignedStaffId,
  onAssignStaff,
  confirmDisabled = false,
  onConfirm,
  confirmLabel = 'Confirm Order',
  clearLabel = 'Clear',
  showAssignStaff = true
}) => {
  const [addSearch, setAddSearch] = useState('');
  const [addCategory, setAddCategory] = useState('All');
  const [addSubMenu, setAddSubMenu] = useState('');
  const [customizeItem, setCustomizeItem] = useState(null);
  const [showStaffList, setShowStaffList] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const menuCategories = useMemo(() => {
    const cats = new Set(['All']);
    menus.forEach((m) => {
      if (m.category?.name) cats.add(m.category.name);
    });
    return Array.from(cats);
  }, [menus]);

  const menuSubMenus = useMemo(() => {
    if (addCategory === 'All') return [];
    const subs = new Set();
    menus.forEach((m) => {
      if (m.category?.name === addCategory && m.subMenu?.name) {
        subs.add(m.subMenu.name);
      }
    });
    return Array.from(subs);
  }, [menus, addCategory]);

  const filteredMenus = useMemo(() => {
    return menus.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(addSearch.toLowerCase());
      const matchesCategory = addCategory === 'All' || m.category?.name === addCategory;
      const matchesSubMenu = !addSubMenu || m.subMenu?.name === addSubMenu;
      return matchesSearch && matchesCategory && matchesSubMenu;
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
        <div className="additem-overlay" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
          <motion.div
            className="additem-card"
            style={{ display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="additem-close" onClick={onClose}>
              <X size={20} />
            </button>

            <div className="additem-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', height: '100%', overflow: 'hidden' }}>
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

            {/* Mobile Floating Cart Button */}
            {cartQty > 0 && !mobileCartOpen && (
              <motion.button
                className="mobile-cart-fab"
                initial={{ scale: 0, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 40 }}
                onClick={() => setMobileCartOpen(true)}
              >
                <ShoppingCart size={18} />
                <span className="fab-label">View Cart ({cartQty})</span>
              </motion.button>
            )}

            {/* Mobile Cart Overlay */}
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

            {/* Customize Modal */}
            <CustomizeDishModal
              open={Boolean(customizeItem)}
              item={customizeItem}
              onClose={() => setCustomizeItem(null)}
              onAdd={onAddItem}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddItemsModal;
