import React, { useState } from 'react';
import { LayoutGrid, Search, Star, Plus, X, ChevronRight } from 'lucide-react';
import '../../../../common/css/admin/orders/menuSection.css';

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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="menu-section-container">
      {/* Header Section */}
      <header className="menu-header">
        <div className="header-top">
          {!isSearchExpanded ? (
            <>
              <div className="title-area">
                <h1 className="menu-title">Select Dishes</h1>
                <div className="target-badge">
                  <LayoutGrid size={12} />
                  <span>{orderTargetName || orderTableNumber || 'Walk-in'}</span>
                </div>
              </div>
              <div className="header-actions">
                <button 
                  className="mobile-search-trigger" 
                  onClick={() => setIsSearchExpanded(true)}
                >
                  <Search size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="mobile-search-overlay">
              <Search size={18} className="search-icon-inner" />
              <input
                autoFocus
                type="text"
                className="search-input-expanded"
                placeholder="Search dish name..."
                value={addSearch}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <button className="close-search" onClick={() => {
                setIsSearchExpanded(false);
                onSearchChange('');
              }}>
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Action Controls - Hidden on small mobile via CSS */}
        <div className="desktop-controls">
          <div className="select-group">
            <select className="custom-select">
              <option>Default Menu</option>
            </select>
            <select 
              className="custom-select"
              onChange={(e) => onCategoryChange({ subMenu: e.target.value })}
            >
              <option value="all">Sub Menu</option>
              {menuSubMenus.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs: Scrollable on Mobile */}
        <div className="category-nav">
          <button 
            className={`category-tab ${addCategory === 'recommended' ? 'active' : ''}`} 
            onClick={() => onCategoryChange({ category: 'recommended' })}
          >
            <Star size={14} fill={addCategory === 'recommended' ? "white" : "none"} /> 
            <span>Recommended</span>
          </button>
          <button 
            className={`category-tab ${addCategory === 'all' ? 'active' : ''}`} 
            onClick={() => onCategoryChange({ category: 'all' })}
          >
            All
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
          <span className="current-cat-label">
            {addCategory === 'all' ? 'All Items' : addCategory}
          </span>
          <span className="item-count">{filteredMenus.length} items</span>
        </div>

        <div className="menu-grid">
          {filteredMenus.map((m) => {
            const variantCount = m.variants?.length || 0;
            const minPrice = variantCount ? Math.min(...m.variants.map((v) => v.price)) : m.price;

            return (
              <div key={m._id} className="menu-card">
                <div className="card-image-box">
                  <div className={`diet-indicator ${m.isVeg ? 'veg' : 'non-veg'}`}>
                    <div className="dot"></div>
                  </div>
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.name} loading="lazy" />
                  ) : (
                    <div className="img-placeholder">{m.name.charAt(0)}</div>
                  )}
                  <button
                    className="quick-add-btn"
                    onClick={() => {
                      if (variantCount > 0) onCustomize(m);
                      else onAdd({ menuItem: m, quantity: 1, priceAtOrderTime: m.price || 0 });
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <div className="card-info">
                  <h4 className="item-title">{m.name}</h4>
                  <div className="price-row">
                    <span className="price-amt">Rs {minPrice}</span>
                    {variantCount > 0 && <span className="custom-tag">Customizable</span>}
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