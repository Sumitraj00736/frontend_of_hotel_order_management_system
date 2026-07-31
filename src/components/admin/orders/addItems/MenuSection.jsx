import React, { useState } from 'react';
import { Search, Star, Plus, X } from 'lucide-react';

const MenuSection = ({
  addSearch,
  onSearchChange,
  addCategory,
  menuCategories,
  menuSubMenus,
  onCategoryChange,
  filteredMenus,
  onAdd,
  onCustomize,
  onClose,
  cartItemQuantities = {}
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full">
      {/* Header Section */}
      <header className="px-5 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between gap-4">
          {!isSearchExpanded ? (
            <>
              <h3 className="text-sm font-semibold text-gray-700">Dishes</h3>
              
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
                  onClick={() => setIsSearchExpanded(true)}
                >
                  <Search size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                className="flex-1 min-w-0 text-xs focus:outline-none bg-transparent"
                placeholder="Search dish name..."
                value={addSearch}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 transition"
                onClick={() => {
                  setIsSearchExpanded(false);
                  onSearchChange('');
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Submenu selections */}
        {menuSubMenus.length > 0 && (
          <div className="mt-2.5 flex gap-2">
            <select
              className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              onChange={(e) => onCategoryChange({ subMenu: e.target.value === 'all' ? '' : e.target.value })}
            >
              <option value="all">Sub Menu</option>
              {menuSubMenus.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category Navigation Tabs */}
        <div className="flex gap-1.5 overflow-x-auto mt-3 pb-1 -mb-1 scrollbar-none">
          <button
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border transition shrink-0 ${
              addCategory === 'recommended'
                ? 'bg-primary border-primary text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:border-primary/30'
            }`}
            onClick={() => onCategoryChange({ category: 'recommended' })}
          >
            <Star size={11} fill={addCategory === 'recommended' ? "white" : "none"} />
            <span>Recommended</span>
          </button>
          <button
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition shrink-0 ${
              addCategory === 'All'
                ? 'bg-primary border-primary text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:border-primary/30'
            }`}
            onClick={() => onCategoryChange({ category: 'All' })}
          >
            All
          </button>
          {menuCategories.filter(c => c !== 'All').map((c) => (
            <button
              key={c}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition shrink-0 ${
                addCategory === c
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-primary/30'
              }`}
              onClick={() => onCategoryChange({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        <div className="flex justify-between items-center text-[11px] text-gray-400 mb-3">
          <span className="font-bold text-gray-500 uppercase tracking-wider">
            {addCategory === 'All' ? 'All Items' : addCategory}
          </span>
          <span>{filteredMenus.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMenus.map((m) => {
            const variantCount = m.variants?.length || 0;
            const minPrice = variantCount ? Math.min(...m.variants.map((v) => v.price)) : m.price;
            const itemQtyInCart = cartItemQuantities[m._id] || 0;

            return (
              <div 
                key={m._id} 
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex flex-col ${
                  itemQtyInCart > 0 ? 'border-primary/45 bg-primary/[0.01]' : 'border-gray-100'
                }`}
              >
                <div className="relative aspect-video w-full bg-gray-100 shrink-0">
                  {/* Diet indicator */}
                  <div className={`absolute top-2 left-2 w-3.5 h-3.5 rounded border-2 flex items-center justify-center bg-white ${
                    m.isVeg ? 'border-green-600' : 'border-red-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      m.isVeg ? 'bg-green-600' : 'bg-red-600'
                    }`} />
                  </div>

                  {/* Quantity In Cart Indicator */}
                  {itemQtyInCart > 0 && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {itemQtyInCart} in cart
                    </div>
                  )}

                  {m.imageUrl ? (
                    <img 
                      src={m.imageUrl} 
                      alt={m.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary font-bold text-lg">
                      {m.name.charAt(0)}
                    </div>
                  )}

                  {/* Add button */}
                  <button
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover hover:scale-105 active:scale-95 shadow-md transition"
                    onClick={() => {
                      if (variantCount > 0) onCustomize(m);
                      else onAdd({ menuItem: m, quantity: 1, priceAtOrderTime: m.price || 0 });
                    }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between gap-1.5">
                  <h4 className="font-bold text-gray-800 text-xs leading-snug line-clamp-2">
                    {m.name}
                  </h4>
                  <div className="flex justify-between items-center gap-2 mt-auto">
                    <span className="text-[11px] font-bold text-gray-700">Rs {minPrice}</span>
                    {variantCount > 0 && (
                      <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-1 py-0.5 rounded shrink-0">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MenuSection;
