import React from 'react';

const OrderSummaryPanel = ({
  subtotal,
  discountType,
  discount,
  onDiscountTypeChange,
  onDiscountChange,
  taxRate = 0,
  onTaxRateChange,
  tipsAmount = 0,
  onTipsChange,
  tenderAmount = 0,
  onTenderAmountChange,
  total
}) => {
  const discountValue =
    discountType === 'percent'
      ? (subtotal * Number(discount || 0)) / 100
      : Number(discount || 0);
  const taxableAmount = Math.max(0, subtotal - discountValue);
  const taxAmount = (taxableAmount * Number(taxRate || 0)) / 100;

  return (
    <div className="checkout-middle">
      <div className="summary-row">
        <div>Item Total</div>
        <div>Rs {subtotal.toFixed(2)}</div>
      </div>

      {/* Discount row */}
      <div className="summary-row">
        <div className="inline-input">
          Discount (–)
          <select
            className="discount-type"
            value={discountType}
            onChange={(e) => onDiscountTypeChange(e.target.value)}
          >
            <option value="amount">Rs</option>
            <option value="percent">%</option>
          </select>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => onDiscountChange(e.target.value)}
            style={{ width: '60px' }}
          />
        </div>
        <div className="text-danger">– Rs {discountValue.toFixed(2)}</div>
      </div>

      <div className="summary-row">
        <div>Taxable Amount</div>
        <div>Rs {taxableAmount.toFixed(2)}</div>
      </div>

      {/* Tax row */}
      <div className="summary-row">
        <div className="inline-input">
          Tax (%)
          <input
            type="number"
            min="0"
            max="100"
            value={taxRate}
            onChange={(e) => onTaxRateChange?.(e.target.value)}
            style={{ width: '50px' }}
          />
        </div>
        <div className={taxAmount > 0 ? 'text-warning' : ''}>
          {taxAmount > 0 ? `+ Rs ${taxAmount.toFixed(2)}` : 'Rs 0.00'}
        </div>
      </div>

      {/* Tips row — optional */}
      <div className="summary-row">
        <div className="inline-input">
          Tips
          <input
            type="number"
            min="0"
            value={tipsAmount}
            onChange={(e) => onTipsChange?.(e.target.value)}
            style={{ width: '60px' }}
          />
        </div>
        <div>{tipsAmount > 0 ? `+ Rs ${Number(tipsAmount).toFixed(2)}` : 'Rs 0.00'}</div>
      </div>

      <div className="summary-divider" />
      
      {/* Tendered Amount (for cash) */}
      <div className="summary-row">
        <div className="inline-input fw-bold">
          Tendered
          <input
            type="number"
            min="0"
            value={tenderAmount}
            onChange={(e) => onTenderAmountChange?.(e.target.value)}
            style={{ width: '80px', fontWeight: 'bold' }}
            placeholder="0.00"
          />
        </div>
        <div className="fw-bold">Rs {Number(tenderAmount || 0).toFixed(2)}</div>
      </div>

      <div className="summary-row">
        <div className="text-muted">Change Due</div>
        <div className="fw-bold text-success">
          Rs {Math.max(0, Number(tenderAmount || 0) - total).toFixed(2)}
        </div>
      </div>

      <div className="summary-divider" />

      <div className="summary-row summary-total-row">
        <div className="fw-bold">Total Payable</div>
        <div className="fw-bold text-primary">Rs {total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;
