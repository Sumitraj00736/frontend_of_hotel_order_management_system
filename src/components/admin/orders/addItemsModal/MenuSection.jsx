import React from 'react';

const MenuSection = ({
  orderTableNumber,
  addSubMenu,
  menuSubMenus,
  addSearch,
  onSearchChange,
  addCategory,
  menuCategories,
  onCategoryChange,
  filteredMenus,
  onAdd,
  onCustomize
}) => {
  return (
    <div className="additem-left">
      <div className="additem-head">
        <div className="additem-title">Select Dishes</div>
        <div className="additem-filters">
          <div className="chip small">Table {orderTableNumber || '-'}</div>
          <select value="default" onChange={() => {}}>
            <option value="default">Default Menuset</option>
          </select>
          <select value={addSubMenu} onChange={(e) => onCategoryChange({ subMenu: e.target.value })}>
            <option value="all">Select Sub Menu</option>
            {menuSubMenus.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            className="additem-search"
            placeholder="Search here"
            value={addSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="additem-tabs">
        <button className={`tab ${addCategory === 'recommended' ? 'active' : ''}`} onClick={() => onCategoryChange({ category: 'recommended' })}>
          ⭐ Recommended
        </button>
        <button className={`tab ${addCategory === 'all' ? 'active' : ''}`} onClick={() => onCategoryChange({ category: 'all' })}>
          All Categories
        </button>
        {menuCategories.map((c) => (
          <button key={c} className={`tab ${addCategory === c ? 'active' : ''}`} onClick={() => onCategoryChange({ category: c })}>
            {c}
          </button>
        ))}
      </div>

      <div className="category-header">
        {addCategory === 'all' ? 'All Categories' : addCategory === 'recommended' ? 'Recommended' : addCategory}
        <span>({filteredMenus.length})</span>
      </div>

      <div className="additem-grid">
        {filteredMenus.map((m) => {
          const variantCount = m.variants?.length || 0;
          const minPrice = variantCount ? Math.min(...m.variants.map((v) => v.price)) : m.price;
          const maxPrice = variantCount ? Math.max(...m.variants.map((v) => v.price)) : m.price;
          return (
            <div key={m._id} className="menu-tile">
              <div className="tile-fav">♡</div>
              {m.imageUrl ? (
                <img src={m.imageUrl} alt={m.name} />
              ) : (
                <div className="menu-thumb-placeholder" />
              )}
              <div className="menu-name">{m.name}</div>
              <div className="menu-price">
                {variantCount ? `Rs ${minPrice} - Rs ${maxPrice}` : `Rs ${m.price}`}
              </div>
              <button
                className="menu-add-btn"
                onClick={() => {
                  if (variantCount > 0) {
                    onCustomize(m);
                    return;
                  }
                  onAdd({ menuItem: m._id, quantity: 1, isComplimentary: false });
                }}
              >
                <span>Add</span>
                {variantCount > 0 ? <span className="option-count">{variantCount} options</span> : null}
              </button>
            </div>
          );
        })}
        {filteredMenus.length === 0 && (
          <div className="additem-empty">No items found.</div>
        )}
      </div>
    </div>
  );
};

export default MenuSection;
