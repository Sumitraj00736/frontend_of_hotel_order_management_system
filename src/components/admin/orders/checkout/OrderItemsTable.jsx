import React from 'react';

const OrderItemsTable = ({
  items,
  onQtyChange,
  onToggleComplimentary,
  onRemove,
  isPaid
}) => {
  return (
    <div className="items-card">
      <table className="items-table">
        <thead>
          <tr>
            <th>S.N</th>
            <th>Item</th>
            <th>QTY</th>
            <th>Rate</th>
            <th>Discount</th>
            <th>Item Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const menuId = item.menuItem?._id || item.menuItem;
            const variantId = item.variantId || item.variant?._id || null;
            const currentQty = item.quantity;
            const isComplimentary = Boolean(item.isComplimentary);
            return (
              <tr key={item._id || `${menuId}-${variantId || 'base'}`}>
                <td>{idx + 1}</td>
                <td>
                  <div className="item-name-row">
                    <span>{item.menuItem?.name || 'Item'}{item.variantName ? ` (${item.variantName})` : ''}</span>
                    {!isPaid && <button className="remove-btn" onClick={() => onRemove(menuId, variantId)}>×</button>}
                  </div>
                </td>
                <td>
                  {isPaid ? (
                    <span className="qty-value">{currentQty}</span>
                  ) : (
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => onQtyChange(menuId, variantId, currentQty - 1)}>-</button>
                      <span className="qty-value">{currentQty}</span>
                      <button className="qty-btn" onClick={() => onQtyChange(menuId, variantId, currentQty + 1)}>+</button>
                    </div>
                  )}
                </td>
                <td>Rs {item.priceAtOrderTime}</td>
                <td>
                  <button 
                    className={`comp-btn ${isComplimentary ? 'active' : ''}`} 
                    onClick={() => !isPaid && onToggleComplimentary(menuId, variantId)}
                    disabled={isPaid}
                  >
                    {isComplimentary ? 'Complimentary' : 'Mark Comp'}
                  </button>
                </td>
                <td>Rs {isComplimentary ? '0.00' : ((item.priceAtOrderTime || 0) * (currentQty || 1)).toFixed(2)}</td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-row">No items.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
