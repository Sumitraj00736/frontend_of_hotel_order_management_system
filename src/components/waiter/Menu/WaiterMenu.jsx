import React from 'react';
import { Search, Plus } from 'lucide-react';

const WaiterMenu = ({ menuItems, onAdd }) => (
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
            <div className="menu-category">
              {typeof item.category === 'object'
                ? item.category?.name || 'General'
                : item.category || 'General'}
            </div>
            <div className="menu-price-row">
              <span className="menu-price">
                {item.variants?.length > 0 
                  ? `NPR ${Math.min(...item.variants.map(v => v.price))} - ${Math.max(...item.variants.map(v => v.price))}`
                  : `NPR ${typeof item.price === 'object' ? (item.price.base || 0) : item.price}`
                }
              </span>
              <div className="menu-add-icon">
                <Plus size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
);

export default WaiterMenu;
