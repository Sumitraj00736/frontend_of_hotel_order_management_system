import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, LayoutGrid } from 'lucide-react';
import MenuSection from './MenuSection.jsx';
import CartPanel from './CartPanel.jsx';
import CustomizeDishModal from './CustomizeDishModal.jsx';

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
  showAssignStaff = true,
  categories = []
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

  // Compute quantity map for visual cart indicators
  const cartItemQuantities = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      const menuId = item.menuItem?._id || item.menuItem;
      map[menuId] = (map[menuId] || 0) + (item.quantity || 0);
    });
    return map;
  }, [items]);

  const handleConfirmAction = (options) => {
    onConfirm?.(options);
    setMobileCartOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1300] flex bg-gray-100 overflow-hidden">
          <motion.div
            className="w-full h-full bg-gray-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Unified Top Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-gray-800 tracking-tight">Add Items to Order</h2>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <LayoutGrid size={11} />
                  <span>{orderTargetName || orderTableNumber || 'Walk-in'}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main content grid */}
            <div className="flex-1 flex overflow-hidden p-4 gap-4">
              {/* Menu Area */}
              <div className="flex-1 min-w-0 h-full">
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
                  onClose={onClose}
                  cartItemQuantities={cartItemQuantities}
                />
              </div>

              {/* Cart Area - Hidden on mobile, visible on medium+ screens */}
              <div className="hidden md:block w-96 shrink-0 h-full">
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
                  onConfirm={handleConfirmAction}
                  confirmLabel={confirmLabel}
                  confirmDisabled={confirmDisabled}
                />
              </div>
            </div>

            {/* Mobile Cart Overlay */}
            <AnimatePresence>
              {mobileCartOpen && (
                <motion.div
                  className="fixed inset-0 z-50 bg-black/40 md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileCartOpen(false)}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl overflow-hidden flex flex-col"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Pull-to-dismiss handle bar */}
                    <div 
                      className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 cursor-pointer" 
                      onClick={() => setMobileCartOpen(false)}
                    >
                      <span className="text-sm font-bold text-gray-700">Order Cart</span>
                      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2" />
                      <span className="text-xs text-gray-400">Close</span>
                    </div>

                    <div className="flex-1 overflow-hidden">
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
                        onConfirm={handleConfirmAction}
                        confirmLabel={confirmLabel}
                        confirmDisabled={confirmDisabled}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile FAB */}
            {cartQty > 0 && !mobileCartOpen && (
              <div 
                className="fixed bottom-4 left-4 right-4 z-40 bg-primary text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between cursor-pointer hover:bg-primary-hover md:hidden"
                onClick={() => setMobileCartOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  <span className="text-sm font-bold">{cartQty} Items • Rs {cartTotal.toFixed(2)}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">View Cart</span>
              </div>
            )}

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