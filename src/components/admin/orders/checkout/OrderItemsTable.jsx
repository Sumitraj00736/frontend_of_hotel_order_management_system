import React from 'react';
import { Minus, Plus, X } from 'lucide-react';

const OrderItemsTable = ({
  items,
  onQtyChange,
  onToggleComplimentary,
  onRemove,
  isPaid
}) => {
  return (
    <div className="overflow-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
          <tr>
            <th className="px-3 py-2 text-left w-8">#</th>
            <th className="px-3 py-2 text-left">Item</th>
            <th className="px-3 py-2 text-center w-28">QTY</th>
            <th className="px-3 py-2 text-right">Rate</th>
            <th className="px-3 py-2 text-center w-32">Discount</th>
            <th className="px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((item, idx) => {
            const menuId = item.menuItem?._id || item.menuItem;
            const variantId = item.variantId || item.variant?._id || null;
            const currentQty = item.quantity;
            const isComplimentary = Boolean(item.isComplimentary);
            return (
              <tr
                key={item._id || `${menuId}-${variantId || 'base'}-${idx}`}
                className={`hover:bg-gray-50 transition ${isComplimentary ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      {item.menuItem?.name || 'Item'}
                      {item.variantName ? (
                        <span className="text-xs text-gray-400 ml-1">({item.variantName})</span>
                      ) : null}
                    </span>
                    {!isPaid && (
                      <button
                        onClick={() => onRemove(menuId, variantId)}
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-600 transition"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {isPaid ? (
                    <div className="flex justify-center">
                      <span className="font-semibold text-gray-700">{currentQty}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onQtyChange(menuId, variantId, currentQty - 1)}
                        className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-6 text-center font-semibold text-gray-700">{currentQty}</span>
                      <button
                        onClick={() => onQtyChange(menuId, variantId, currentQty + 1)}
                        className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-right text-gray-600">
                  Rs {item.priceAtOrderTime}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    className={`px-2 py-0.5 rounded-full text-xs font-medium transition ${
                      isComplimentary
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                    }`}
                    onClick={() => !isPaid && onToggleComplimentary(menuId, variantId)}
                    disabled={isPaid}
                  >
                    {isComplimentary ? '✓ Comp' : 'Mark Comp'}
                  </button>
                </td>
                <td className="px-3 py-2 text-right font-medium text-gray-700">
                  {isComplimentary
                    ? <span className="text-green-600 text-xs">Rs 0.00</span>
                    : `Rs ${((item.priceAtOrderTime || 0) * (currentQty || 1)).toFixed(2)}`}
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                No items added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
