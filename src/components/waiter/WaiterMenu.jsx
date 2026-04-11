import React from 'react';
import { Search, Plus } from 'lucide-react';

const WaiterMenu = ({ search, onSearch, menuItems, onAdd }) => (
  <div className="pos-menu-section">
    <div className="pos-search-wrapper">
      <Search size={18} color="#9ca3af" className="me-2" />
      <input
        placeholder="Search menu items..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
    <div className="waiter-menu-grid">
      {menuItems.map((item) => (
        <div key={item._id} className="menu-pos-card" onClick={() => onAdd(item)}>
          <div className="menu-img-wrapper">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} />
            ) : (
              <span className="menu-img-placeholder">{item.name.charAt(0)}</span>
            )}
          </div>
          <div className="menu-info">
            <div className="menu-name">{item.name}</div>
            <div className="menu-category">{item.category || 'General'}</div>
            <div className="menu-price-row">
              <span className="menu-price">NPR {item.price}</span>
              <div className="menu-add-icon">
                <Plus size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WaiterMenu;
