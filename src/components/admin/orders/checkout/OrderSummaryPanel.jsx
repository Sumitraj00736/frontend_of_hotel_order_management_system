import React from 'react';

const Row = ({ label, value, className = '', labelClass = '', valueClass = '' }) => (
  <div className={`flex items-center justify-between py-1 ${className}`}>
    <span className={`text-sm text-gray-500 ${labelClass}`}>{label}</span>
    <span className={`text-sm font-medium text-gray-800 ${valueClass}`}>{value}</span>
  </div>
);

const InlineInput = ({ label, children, value }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {label}
      {children}
    </div>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

const inputCls =
  'w-16 text-xs border border-gray-200 rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-right';

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
  total,
}) => {
  const discountValue =
    discountType === 'percent'
      ? (subtotal * Number(discount || 0)) / 100
      : Number(discount || 0);
  const taxableAmount = Math.max(0, subtotal - discountValue);
  const taxAmount = (taxableAmount * Number(taxRate || 0)) / 100;
  const changeDue = Math.max(0, Number(tenderAmount || 0) - total);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4 space-y-0.5">
      <Row label="Item Total" value={`Rs ${subtotal.toFixed(2)}`} />

      {/* Discount */}
      <InlineInput
        label={
          <>
            Discount (–)
            <select
              className="text-xs border border-gray-200 rounded-md px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              value={discountType}
              onChange={(e) => onDiscountTypeChange(e.target.value)}
            >
              <option value="amount">Rs</option>
              <option value="percent">%</option>
            </select>
            <input
              type="number"
              min="0"
              className={inputCls}
              value={discount}
              onChange={(e) => onDiscountChange(e.target.value)}
            />
          </>
        }
        value={
          <span className="text-red-500">– Rs {discountValue.toFixed(2)}</span>
        }
      />

      <Row label="Taxable Amount" value={`Rs ${taxableAmount.toFixed(2)}`} labelClass="text-gray-400 text-xs" />

      {/* Tax */}
      <InlineInput
        label={
          <>
            Tax (%)
            <input
              type="number"
              min="0"
              max="100"
              className={inputCls}
              value={taxRate}
              onChange={(e) => onTaxRateChange?.(e.target.value)}
            />
          </>
        }
        value={
          taxAmount > 0
            ? <span className="text-amber-500">+ Rs {taxAmount.toFixed(2)}</span>
            : 'Rs 0.00'
        }
      />

      {/* Tips */}
      <InlineInput
        label={
          <>
            Tips
            <input
              type="number"
              min="0"
              className={inputCls}
              value={tipsAmount}
              onChange={(e) => onTipsChange?.(e.target.value)}
            />
          </>
        }
        value={tipsAmount > 0 ? `+ Rs ${Number(tipsAmount).toFixed(2)}` : 'Rs 0.00'}
      />

      <div className="my-2 border-t border-dashed border-gray-200" />

      {/* Tendered */}
      <InlineInput
        label={
          <>
            <span className="font-semibold text-gray-700">Tendered</span>
            <input
              type="number"
              min="0"
              className="w-20 text-xs border border-gray-200 rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-right font-bold"
              placeholder="0.00"
              value={tenderAmount}
              onChange={(e) => onTenderAmountChange?.(e.target.value)}
            />
          </>
        }
        value={`Rs ${Number(tenderAmount || 0).toFixed(2)}`}
      />

      <Row
        label="Change Due"
        value={`Rs ${changeDue.toFixed(2)}`}
        valueClass="text-green-600 font-semibold"
      />

      <div className="my-2 border-t border-gray-200" />

      {/* Total */}
      <div className="flex items-center justify-between py-1">
        <span className="text-base font-bold text-gray-800">Total Payable</span>
        <span className="text-base font-bold text-primary">Rs {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;
