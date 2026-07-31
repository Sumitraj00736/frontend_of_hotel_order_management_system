import React, { useState } from 'react';
import { 
  User, Users, ReceiptText, Trash2, ChevronRight, 
  Minus, Plus, ChevronDown, ShoppingCart 
} from 'lucide-react';

const CartPanel = ({
  items = [],
  cartQty = 0,
  cartTotal = 0,
  assignedStaffId,
  staffOptions = [],
  showStaffList,
  onToggleStaffList,
  onAssignStaff,
  onUpdateItemQuantity,
  onUpdateItemNote,
  onClearCart,
  onConfirm,
  confirmLabel = 'Confirm Order',
  confirmDisabled = false
}) => {
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  const selectedStaff = staffOptions?.find(s => s._id === assignedStaffId);

  return (
    <>
      <aside className={`h-full flex flex-col ${isMobileCartOpen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full overflow-hidden">
          
          {/* Mobile Back Header */}
          <div 
            className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-100 font-semibold cursor-pointer md:hidden"
            onClick={() => setIsMobileCartOpen(false)}
          >
            <ChevronDown size={20} className="text-gray-600" /> 
            <span className="text-sm text-gray-700">Back to Menu</span>
          </div>

          {/* Desktop Header */}
          <header className="p-4 flex justify-between items-center border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-orange-50 text-primary p-2 rounded-lg flex items-center justify-center">
                <ReceiptText size={18} />
              </div>
              <h3 className="text-base font-bold text-gray-800">Order Details</h3>
            </div>
            <button 
              className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition"
              onClick={onClearCart}
              aria-label="Clear Cart"
            >
              <Trash2 size={15} />
              <span>Clear</span>
            </button>
          </header>

          {/* Quick Actions Row */}
          <div className="p-3 bg-gray-50 border-b border-gray-100 grid grid-cols-2 gap-2 shrink-0">
            <div className="relative">
              <button 
                className={`w-full flex items-center justify-between gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition truncate ${
                  selectedStaff ? 'border-primary text-primary' : 'text-gray-600'
                }`} 
                onClick={onToggleStaffList}
              >
                <div className="flex items-center gap-1 truncate">
                  <User size={14} className={selectedStaff ? 'text-primary' : 'text-gray-400'} />
                  <span className="truncate">{selectedStaff?.name || 'Assign Staff'}</span>
                </div>
                <ChevronRight size={13} className={`transform transition-transform shrink-0 ${showStaffList ? 'rotate-90' : ''}`} />
              </button>
              
              {showStaffList && (
                <ul className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                  <li className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">Select Staff</li>
                  {staffOptions.map(s => (
                    <li 
                      key={s._id} 
                      className={`px-3 py-2 text-xs flex flex-col cursor-pointer transition border-b border-gray-50 last:border-0 hover:bg-primary/5 ${
                        assignedStaffId === s._id ? 'bg-primary/5 font-semibold text-primary' : 'text-gray-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignStaff?.(s._id);
                        onToggleStaffList?.();
                      }}
                    >
                      <span className="truncate">{s.name}</span>
                      {s.role && <span className="text-[10px] text-gray-400 mt-0.5">{s.role}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-gray-600">
              <Users size={14} className="text-gray-400" />
              <input 
                type="number" 
                placeholder="Guests" 
                min="1" 
                className="w-full text-xs font-medium focus:outline-none bg-transparent" 
              />
            </div>
          </div>

          {/* Scrollable Items Area */}
          <div className="flex-1 overflow-y-auto p-3 min-h-0 bg-gray-50/50">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <ReceiptText size={24} />
                </div>
                <p className="text-sm font-semibold text-gray-700">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Add items to start an order</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => {
                  const menuId = item.menuItem?._id || item.menuItem;
                  const variantId = item.variantId || item.variant?._id || null;
                  return (
                    <div 
                      key={item._id || `${menuId}-${variantId}`} 
                      className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-gray-800 leading-tight">
                            {item.menuItem?.name || 'Item'}
                          </span>
                          {item.variantName && (
                            <span className="inline-block self-start mt-1 px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-md uppercase">
                              {item.variantName}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 mt-1">
                            Rs {item.priceAtOrderTime?.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg shrink-0">
                          <button 
                            onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) - 1)} 
                            className="w-5 h-5 flex items-center justify-center rounded bg-white text-gray-500 hover:bg-primary hover:text-white hover:shadow-sm transition"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateItemQuantity?.(menuId, variantId, (item.quantity || 1) + 1)} 
                            className="w-5 h-5 flex items-center justify-center rounded bg-white text-gray-500 hover:bg-primary hover:text-white hover:shadow-sm transition"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-gray-50">
                        <input 
                          className="flex-1 min-w-0 bg-transparent text-xs text-gray-500 placeholder-gray-300 focus:outline-none"
                          placeholder="Add special instructions..."
                          defaultValue={item.itemNote || ''}
                          onBlur={(e) => onUpdateItemNote?.(menuId, variantId, e.target.value)}
                        />
                        <span className="text-xs font-bold text-gray-700 shrink-0">
                          Rs {(item.priceAtOrderTime * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <footer className="p-4 border-t border-gray-100 bg-white shrink-0">
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Items</span>
                <span className="font-semibold text-gray-700">{cartQty}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                <span>Total Amount</span>
                <span className="text-base text-primary">Rs {cartTotal?.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                className="py-2 px-3 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                onClick={() => onConfirm?.({ print: true })}
                disabled={confirmDisabled || items.length === 0}
              >
                Print
              </button>
              <button 
                className="py-2 px-3 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary-hover shadow-md hover:shadow-lg transition disabled:opacity-50"
                onClick={() => onConfirm?.({ print: false })}
                disabled={confirmDisabled || items.length === 0}
              >
                {confirmLabel}
              </button>
            </div>
          </footer>
        </div>
      </aside>

      {/* Mobile Floating Action Button */}
      {!isMobileCartOpen && cartQty > 0 && (
        <div 
          className="fixed bottom-4 left-4 right-4 z-40 bg-primary text-white p-3.5 rounded-xl shadow-xl flex items-center justify-between cursor-pointer animate-bounce-short hover:bg-primary-hover md:hidden"
          onClick={() => setIsMobileCartOpen(true)}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <span className="text-sm font-bold">{cartQty} Items • Rs {cartTotal?.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold uppercase tracking-wider">
            <span>View Cart</span>
            <ChevronRight size={16} />
          </div>
        </div>
      )}
    </>
  );
};

export default CartPanel;
