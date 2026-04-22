import React from 'react';
import { UtensilsCrossed, Bike, ShoppingBag, ShoppingCart } from 'lucide-react';
import MenuSection from '../../../components/admin/orders/addItemsModal/MenuSection.jsx';
import WaiterCart from '../../../components/waiter/Cart/WaiterCart.jsx';

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
  return (
    <div className="content waiter-pos-layout position-relative">
      <div className="pos-menu-section h-100 p-3 overflow-hidden d-flex flex-column">
        <div className="pos-order-type-toggle p-2 bg-white rounded-pill shadow-sm mb-3 d-flex gap-2 mx-auto flex-wrap justify-content-center" style={{ border: '1px solid #e2e8f0', width: 'auto' }}>
          <button 
            className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 py-2 px-3 border-0 shadow-none rounded-pill fw-bold ${orderType === 'dine_in' ? 'bg-primary text-white' : 'text-muted hover-bg-light'}`}
            onClick={() => setOrderType('dine_in')}
          >
            <UtensilsCrossed size={14} /> Dine-in
          </button>
          <button 
            className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 py-2 px-3 border-0 shadow-none rounded-pill fw-bold ${orderType === 'delivery' ? 'bg-primary text-white' : 'text-muted hover-bg-light'}`}
            onClick={() => setOrderType('delivery')}
          >
            <Bike size={14} /> Delivery
          </button>
          <button 
            className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 py-2 px-3 border-0 shadow-none rounded-pill fw-bold ${orderType === 'takeaway' ? 'bg-primary text-white' : 'text-muted hover-bg-light'}`}
            onClick={() => setOrderType('takeaway')}
          >
            <ShoppingBag size={14} /> Takeaway
          </button>
          <button 
            className={`btn btn-sm d-flex align-items-center justify-content-center gap-2 py-2 px-3 border-0 shadow-none rounded-pill fw-bold ${orderType === 'pickup' ? 'bg-primary text-white' : 'text-muted hover-bg-light'}`}
            onClick={() => setOrderType('pickup')}
          >
            <ShoppingCart size={14} /> Pick up
          </button>
        </div>

        {canViewMenu ? (
          <div className="flex-grow-1 overflow-auto rounded-3 bg-white p-3 shadow-sm" style={{ border: '1px solid #eef1f6' }}>
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
          </div>
        ) : <div />}
      </div>
      
      <div className="pos-cart-section h-100 overflow-hidden d-none d-md-block">
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
        ) : <div />}
      </div>
    </div>
  );
};

export default WaiterPOSDashboard;
