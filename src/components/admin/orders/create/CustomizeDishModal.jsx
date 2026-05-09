import React, { useState } from 'react';
import '../../../../common/css/admin/orders/CustomizeDishModal.css';

const CustomizeDishModal = ({ open, item, onClose, onAdd }) => {
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState('');
  const [note, setNote] = useState('');

  React.useEffect(() => {
    if (item) {
      const firstVariant = item.variants?.[0];
      setVariantId(firstVariant?._id || '');
      setQty(1);
      setNote('');
    }
  }, [item]);

  if (!open || !item) return null;

  const selectedVariant = item.variants?.find((v) => v._id === variantId);
  const price = selectedVariant?.price ?? item.price;

  return (
    <div className="customize-overlay" onClick={onClose}>
      <div className="customize-card" onClick={(e) => e.stopPropagation()}>
        <div className="customize-head">
          <div className="customize-title">Customize Dish</div>
          <button className="customize-close" onClick={onClose}>×</button>
        </div>
        <div className="customize-item">
          {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="customize-thumb" />}
          <div className="customize-info">
            <div className="customize-name">{item.name}</div>
            <div className="customize-sub">{item.subMenu?.name || item.subMenuName || item.subMenu || ''}</div>
          </div>
          <div className="qty-control compact">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
            <span className="qty-value">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
        </div>

        <div className="customize-section">
          <div className="customize-label">Select Variant</div>
          <div className="variant-grid">
            {(item.variants || []).map((v) => (
              <button
                key={v._id}
                className={`variant-card ${variantId === v._id ? 'active' : ''}`}
                onClick={() => setVariantId(v._id)}
              >
                <div className="variant-name">{v.name}</div>
                <div className="variant-price">Rs {v.price}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="customize-section">
          <div className="customize-label">Add a cooking request (optional)</div>
          <textarea
            className="customize-note"
            placeholder="e.g., Extra spicy, No onions, Well done..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="customize-actions">
          <button className="ghost-btn" onClick={onClose}>Cancel</button>
          <button
            className="confirm-btn"
            onClick={() => {
              onAdd?.({
                menuItem: item,
                quantity: qty,
                variantId: selectedVariant?._id,
                variantName: selectedVariant?.name,
                variantPrice: selectedVariant?.price,
                itemNote: note || undefined,
                priceAtOrderTime: price
              });
              onClose();
            }}
          >
            Add to Cart Rs {price}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeDishModal;
