import React from 'react';
import { Plus, Search } from 'lucide-react';
import './WaiterMenu.css';

const WaiterMenu = ({ menuItems, onAdd }) => (
  <div className="waiter-menu-container">
    <div className="waiter-menu-grid">
      {menuItems.map((item) => (
        <div 
          key={item._id} 
          className="menu-pos-card" 
          onClick={() => onAdd(item)}
        >
          <div className="menu-img-wrapper">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} loading="lazy" />
            ) : (
              <div className="menu-img-placeholder">
                <span>{item.name.charAt(0)}</span>
              </div>
            )}
            {/* Added a subtle badge for category/type if available */}
            {item.isVeg !== undefined && (
              <div className={`diet-indicator ${item.isVeg ? 'veg' : 'non-veg'}`} />
            )}
          </div>

          <div className="menu-info">
            <div className="menu-meta">
              <span className="menu-category">
                {typeof item.category === 'object'
                  ? item.category?.name || 'General'
                  : item.category || 'General'}
              </span>
            </div>
            
            <h3 className="menu-name">{item.name}</h3>
            
            <div className="menu-price-row">
              <span className="menu-price">
                {item.variants?.length > 0 
                  ? <span className="price-range">NPR {Math.min(...item.variants.map(v => v.price))}+</span>
                  : `NPR ${typeof item.price === 'object' ? (item.price.base || 0) : item.price}`
                }
              </span>
              <button className="menu-add-btn" aria-label="Add item">
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WaiterMenu;