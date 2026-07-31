import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

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
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">Customize Dish</h3>
          <button 
            className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Item Info row */}
          <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-16 h-16 rounded-lg object-cover" 
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {item.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-sm leading-tight truncate">{item.name}</h4>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {item.subMenu?.name || item.subMenuName || item.subMenu || ''}
              </p>
            </div>
            
            {/* Qty Control */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-100 shrink-0">
              <button 
                onClick={() => setQty((q) => Math.max(1, q - 1))} 
                className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:bg-primary hover:text-white transition"
              >
                <Minus size={12} />
              </button>
              <span className="w-6 text-center text-xs font-bold text-gray-700">{qty}</span>
              <button 
                onClick={() => setQty((q) => q + 1)} 
                className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 text-gray-500 hover:bg-primary hover:text-white transition"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Variants section */}
          {item.variants && item.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Select Variant
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.variants.map((v) => {
                  const isActive = variantId === v._id;
                  return (
                    <button
                      key={v._id}
                      className={`p-3 rounded-xl border text-left flex flex-col transition-all ${
                        isActive
                          ? 'bg-primary/10 border-primary shadow-sm'
                          : 'bg-white border-gray-200 hover:border-primary/30 hover:bg-primary/5'
                      }`}
                      onClick={() => setVariantId(v._id)}
                    >
                      <span className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-gray-700'}`}>
                        {v.name}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-1 font-semibold">
                        Rs {v.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking Request */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Add a cooking request (optional)
            </label>
            <textarea
              className="w-full text-xs border border-gray-200 rounded-xl p-3 h-20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
              placeholder="e.g., Extra spicy, No onions, Well done..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-2 bg-gray-50 justify-end">
          <button 
            className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-hover shadow-md hover:shadow-lg transition"
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
            Add to Cart Rs {(price * qty).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeDishModal;
