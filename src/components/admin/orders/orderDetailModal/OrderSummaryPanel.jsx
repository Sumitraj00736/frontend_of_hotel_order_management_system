import React from 'react';

const OrderSummaryPanel = ({
  subtotal,
  discountType,
  discount,
  onDiscountTypeChange,
  onDiscountChange,
  total
}) => {
  return (
    <div className="checkout-middle">
      <div className="summary-row">
        <div>Item total</div>
        <div>Rs {subtotal.toFixed(2)}</div>
      </div>
      <div className="summary-row">
        <div>Loyalty Discount (0%)</div>
        <div>Rs 0</div>
      </div>
      <div className="summary-row">
        <div>Sub Total</div>
        <div>Rs {subtotal.toFixed(2)}</div>
      </div>
      <div className="summary-row">
        <div className="inline-input">
          Discount (-)
          <select
            className="discount-type"
            value={discountType}
            onChange={(e) => onDiscountTypeChange(e.target.value)}
          >
            <option value="amount">Rs</option>
            <option value="percent">%</option>
          </select>
          <input
            value={discount}
            onChange={(e) => onDiscountChange(e.target.value)}
          />
        </div>
        <div>Rs 0.00</div>
      </div>
      <div className="summary-row">
        <div>Taxable Amount</div>
        <div>Rs {subtotal.toFixed(2)}</div>
      </div>
      <div className="summary-row">
        <div>Total Amount</div>
        <div>Rs {total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;
