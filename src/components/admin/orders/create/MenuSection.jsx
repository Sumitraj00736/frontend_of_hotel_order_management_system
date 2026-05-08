import React from 'react';
import { LayoutGrid, Search, Star, Heart, Plus } from 'lucide-react';
import '../../../../common/css/admin/orders/MenuSection.css';
import '../../../../common/css/admin/orders/AddItemsModal.css';

const MenuSection = ({
  orderTableNumber,
  orderTargetName,
  addSearch,
  onSearchChange,
  addCategory,
  menuCategories,
  menuSubMenus,
  onCategoryChange,
  filteredMenus,
  onAdd,
  onCustomize
}) => {
  return (
    <div className="menu-section-container">
      {/* Header Section */}
      <header className="menu-header">
        <div className="header-top">
          <div className="title-area">
            <h1 className="h4 fw-bold mb-0">Select Dishes</h1>
            <div className="target-badge">
              <LayoutGrid size={14} />
              <span>{orderTargetName || orderTableNumber || 'Walking Customer'}</span>
            </div>
          </div>

          <div className="action-controls">
            <div className="select-wrapper">
              <select className="custom-select">
                <option>Default Menuset</option>
              </select>
            </div>
            
            <div className="select-wrapper">
              <select 
                className="custom-select"
                onChange={(e) => onCategoryChange({ subMenu: e.target.value })}
              >
                <option value="all">Select Sub Menu</option>
                {menuSubMenus.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search here"
                value={addSearch}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-scroll-container">
          <button 
            className={`category-tab ${addCategory === 'recommended' ? 'active' : ''}`} 
            onClick={() => onCategoryChange({ category: 'recommended' })}
          >
            <Star size={16} /> Recommended
          </button>
          <button 
            className={`category-tab ${addCategory === 'all' ? 'active' : ''}`} 
            onClick={() => onCategoryChange({ category: 'all' })}
          >
            All Items
          </button>
          {menuCategories.map((c) => (
            <button 
              key={c} 
              className={`category-tab ${addCategory === c ? 'active' : ''}`} 
              onClick={() => onCategoryChange({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <main className="menu-content">
        <div className="content-info">
          <h3>{addCategory === 'all' ? 'All Categories' : addCategory}</h3>
          <span className="item-count">{filteredMenus.length} Items found</span>
        </div>

        <div className="menu-grid">
          {filteredMenus.map((m) => {
            const variantCount = m.variants?.length || 0;
            const minPrice = variantCount ? Math.min(...m.variants.map((v) => v.price)) : m.price;

            return (
              <div key={m._id} className="menu-card">
                <div className="card-image-wrapper">
                  <div className="availability-dot" style={{ backgroundColor: m.isVeg ? '#10b981' : '#ef4444' }}></div>
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.name} className="card-img" />
                  ) : (
                    <div className="card-img-placeholder">
                      <span>{m.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                <div className="card-details">
                  <h4 className="item-name">{m.name}</h4>
                  <div className="item-price">Rs {minPrice}{variantCount > 0 && ` - Rs ${Math.max(...m.variants.map(v => v.price))}`}</div>
                  
                  <button
                    className={`add-button-sleek ${variantCount > 0 ? 'has-variants' : ''}`}
                    onClick={() => {
                      if (variantCount > 0) {
                        onCustomize(m);
                        return;
                      }
                      onAdd({ menuItem: m, quantity: 1, priceAtOrderTime: m.price || 0, isComplimentary: false });
                    }}
                  >
                    {variantCount > 0 ? (
                      <div className="btn-content-sleek">
                        <span className="btn-main-text">Add</span>
                        <span className="btn-sub-text">{variantCount} options</span>
                      </div>
                    ) : (
                      <span className="btn-main-text">Add</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMenus.length === 0 && (
          <div className="empty-state">
            <Search size={48} />
            <p>No dishes found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuSection;