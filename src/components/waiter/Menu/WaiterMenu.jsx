import React from 'react';
import { Plus } from 'lucide-react';
import '../../../common/css/waiter/dashboard/waiterMenu.css';

const WaiterMenu = ({ menuItems = [], onAdd = () => {} }) => {
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    return <div className="waiter-menu-empty">No items available</div>;
  }

  return (
    <div className="waiter-menu-grid" role="list">
      {menuItems.map((item) => {
        const categoryName = typeof item.category === 'object'
          ? item.category?.name || 'General'
          : item.category || 'General';

        const minPrice = item.variants?.length > 0
          ? `${Math.min(...item.variants.map(v => v.price))}+`
          : `${typeof item.price === 'object' ? (item.price.base || 0) : (item.price ?? 0)}`;

        return (
          <article
            key={item._id || item.id || item.name}
            className="menu-pos-card"
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onAdd(item);
              }
            }}
            onClick={() => onAdd(item)}
            aria-label={`Add ${item.name}`}
          >
            <div className="menu-img-wrapper">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
              ) : (
                <div className="menu-img-placeholder" aria-hidden>
                  <span>{item.name?.charAt(0) || 'X'}</span>
                </div>
              )}
            </div>

            <div className="menu-info">
              <div className="menu-meta">
                <span className="menu-category-badge">{categoryName}</span>
              </div>

              <h3 className="menu-name">{item.name}</h3>

              <div className="menu-price-row">
                <div className="price-container">
                  <span className="price-label">NPR</span>
                  <span className="price-amount">{minPrice}</span>
                </div>

                <button
                  type="button"
                  className="menu-add-btn"
                  aria-label={`Add ${item.name} to order`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(item);
                  }}
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default WaiterMenu;