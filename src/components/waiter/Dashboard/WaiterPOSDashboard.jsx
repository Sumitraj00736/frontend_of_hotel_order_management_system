import React from 'react';
import { UtensilsCrossed, Bike, ShoppingBag, ShoppingCart } from 'lucide-react';
import MenuSection from '../../../components/admin/orders/create/MenuSection.jsx';
import WaiterCart from '../../../components/waiter/Cart/WaiterCart.jsx';
import '../../../common/css/waiter/waiterDashboard.css';

const WaiterPOSDashboard = ({
  canViewMenu,
  canViewOrders,
  canViewCustomers,
  orderType,
  setOrderType,
  addSubMenu,
  menuSubMenus,
  search,
  setSearch,
  addCategory,
  menuCategories,
  setAddCategory,
  setAddSubMenu,
  filteredMenu,
  addToCart,
  setCustomizeItem,
  tables,
  selectedTable,
  setSelectedTable,
  cart,
  cartTotal,
  updateQty,
  handleInitCheckout,
  editingOrderId,
  spiceLevel,
  setSpiceLevel,
  instructions,
  setInstructions,
  freeTable,
  customers,
  selectedCustomer,
  setSelectedCustomer,
  setMobileCartOpen
}) => {
  
  const orderTypes = [
    { id: 'dine_in', label: 'Dine-in', icon: <UtensilsCrossed size={18} /> },
    { id: 'delivery', label: 'Delivery', icon: <Bike size={18} /> },
    { id: 'takeaway', label: 'Takeaway', icon: <ShoppingBag size={18} /> },
    { id: 'pickup', label: 'Pick up', icon: <ShoppingCart size={18} /> },
  ];

  return (
    <div className="pos-container">
      {/* Main Menu Section */}
      <main className="pos-main-content">
        <header className="pos-header">
          <div className="order-type-selector">
            {orderTypes.map((type) => (
              <button
                key={type.id}
                className={`type-btn ${orderType === type.id ? 'active' : ''}`}
                onClick={() => setOrderType(type.id)}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </header>

        <section className="pos-menu-grid">
          {canViewMenu ? (
            <MenuSection
              addSubMenu={addSubMenu}
              menuSubMenus={menuSubMenus}
              addSearch={search}
              onSearchChange={setSearch}
              addCategory={addCategory}
              menuCategories={menuCategories}
              onCategoryChange={({ category, subMenu }) => {
                if (category) setAddCategory(category);
                if (subMenu !== undefined) setAddSubMenu(subMenu);
              }}
              filteredMenus={filteredMenu}
              onAdd={addToCart}
              onCustomize={setCustomizeItem}
              tableOptions={tables}
              selectedTableId={selectedTable}
              onTableChange={setSelectedTable}
            />
          ) : (
            <div className="empty-state">No Menu Access</div>
          )}
        </section>
      </main>

      {/* Sidebar Cart Section */}
      <aside className="pos-sidebar">
        {canViewOrders ? (
          <WaiterCart
            cart={cart}
            cartTotal={cartTotal}
            onUpdateQty={updateQty}
            onPlaceOrder={handleInitCheckout}
            editing={Boolean(editingOrderId)}
            spiceLevel={spiceLevel}
            onSpiceChange={setSpiceLevel}
            instructions={instructions}
            onInstructionsChange={setInstructions}
            tables={tables}
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
            onFreeTable={freeTable}
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            showCustomer={canViewCustomers || orderType === 'takeaway'}
            orderType={orderType}
            onOrderTypeChange={setOrderType}
            onClose={() => setMobileCartOpen(false)}
          />
        ) : (
          <div className="empty-state">No Cart Access</div>
        )}
      </aside>
    </div>
  );
};

export default WaiterPOSDashboard;