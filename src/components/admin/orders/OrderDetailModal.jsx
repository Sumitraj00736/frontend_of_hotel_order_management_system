import React, { useMemo, useState } from 'react';
import '../../../common/css/admin/orders/orderDetail.css';

const OrderDetailModal = ({
  order,
  paymentMethods,
  onChangePaymentMethod,
  onPay,
  onPrint,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('customer');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'paid');
  const [paymentMode, setPaymentMode] = useState(order.paymentMethod || paymentMethods?.[order._id] || 'cash');
  const [showSuccess, setShowSuccess] = useState(false);
  const items = order?.items || [];
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.priceAtOrderTime || 0) * (item.quantity || 1), 0),
    [items]
  );
  const [discountType, setDiscountType] = useState(order.discountType || 'amount');
  const [discount, setDiscount] = useState(order.discountValue || 0);
  const discountValue =
    discountType === 'percent'
      ? (subtotal * Number(discount || 0)) / 100
      : Number(discount || 0);
  const total = Math.max(0, subtotal - discountValue);
  const finalAmount = order.finalAmount ?? total;

  if (!order) return null;

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-panel" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close" onClick={onClose}>×</button>
        <div className="checkout-header">
          <div className="checkout-title">Checkout - Cabin {order.table?.tableNumber || '-'}</div>
          <div className="checkout-actions">
            <button className="ghost-btn">Switch to Quick Mode</button>
            <button className="ghost-btn">Download</button>
            <button className="ghost-btn" onClick={() => onPrint(order._id)}>Print Estimate</button>
          </div>
        </div>

        <div className="checkout-body">
          <div className="checkout-left">
            <div className="section-title-row">
              <div className="section-title">Items</div>
              <div className="section-actions">
                <button className="ghost-btn small">Complimentary</button>
                <button className="ghost-btn small">+ Add Item</button>
              </div>
            </div>
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
                  {items.map((item, idx) => (
                    <tr key={item._id}>
                      <td>{idx + 1}</td>
                      <td>{item.menuItem?.name || 'Item'}</td>
                      <td>{item.quantity}</td>
                      <td>Rs {item.priceAtOrderTime}</td>
                      <td>Rs 0.00</td>
                      <td>Rs {(item.priceAtOrderTime || 0) * (item.quantity || 1)}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-row">No items.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="customer-card">
              <div className="tab-row">
                <button className={activeTab === 'customer' ? 'active' : ''} onClick={() => setActiveTab('customer')}>Customer</button>
                <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>Staff</button>
              </div>
              <div className="tab-content">
                <input placeholder="Select customer to assign" />
              </div>
            </div>

            <div className="remarks-card">
              <input placeholder="Add remarks to invoice" />
            </div>

            <div className="tender-card">
              <div className="label">Tender Amount</div>
              <input placeholder="Rs 0.00" />
            </div>

            <div className="payment-card">
              <div className="label">Payment Mode</div>
              <div className="pay-tabs">
                <button className={paymentStatus === 'paid' ? 'active' : ''} onClick={() => setPaymentStatus('paid')}>Paid</button>
                <button className={paymentStatus === 'credit' ? 'active' : ''} onClick={() => setPaymentStatus('credit')}>Unpaid / Credit</button>
                <button className={paymentStatus === 'partial' ? 'active' : ''} onClick={() => setPaymentStatus('partial')}>Partial</button>
              </div>
              <div className="pay-options">
                <button className={paymentMode === 'cash' ? 'active' : ''} onClick={() => { setPaymentMode('cash'); onChangePaymentMethod(order._id, 'cash'); }}>Cash</button>
                <button className={paymentMode === 'card' ? 'active' : ''} onClick={() => { setPaymentMode('card'); onChangePaymentMethod(order._id, 'card'); }}>Card</button>
                <button className={paymentMode === 'bank' ? 'active' : ''} onClick={() => { setPaymentMode('bank'); onChangePaymentMethod(order._id, 'bank'); }}>Bank Transfer</button>
              </div>
            </div>
          </div>

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
              <div>Discount (-)</div>
              <div className="inline-input">
                <select
                  className="discount-type"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="amount">Rs</option>
                  <option value="percent">%</option>
                </select>
                <input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0.00" />
                <span>Rs {discountValue.toFixed(2)}</span>
              </div>
            </div>
            <div className="summary-row">
              <div>Taxable Amount</div>
              <div>Rs {total.toFixed(2)}</div>
            </div>
            <div className="summary-row">
              <div>Total Amount</div>
              <div>Rs {total.toFixed(2)}</div>
            </div>
          </div>

          <div className="checkout-right">
            <div className="invoice-card">
              <div className="invoice-title">ESTIMATE INVOICE</div>
              <div className="invoice-meta">
                <div>Invoice No: {order.invoiceNo || '##'}</div>
                <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                <div>Dine In: Cabin {order.table?.tableNumber || '-'} (Table {order.table?.tableNumber || '-'})</div>
                <div>Waiter: {order.createdBy?.name || 'N/A'}</div>
                <div>Kitchen: {order.kitchenAssigned?.name || 'N/A'}</div>
              </div>
              <div className="invoice-row">
                <div>Customer: Cash Customer</div>
              </div>
              <div className="invoice-items">
                <div className="invoice-head">
                  <span>Particular</span>
                  <span>Rate</span>
                  <span>QTY</span>
                  <span>Amount</span>
                </div>
                {items.map((item) => (
                  <div key={item._id} className="invoice-item">
                    <span>{item.menuItem?.name || 'Item'}</span>
                    <span>{item.priceAtOrderTime}</span>
                    <span>{item.quantity}</span>
                    <span>{(item.priceAtOrderTime || 0) * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>
              <div className="invoice-total">
                <div>Total Amount</div>
                <div>Rs {finalAmount.toFixed(2)}</div>
              </div>
              <div className="invoice-row">
                <div>Payment Mode: {paymentStatus === 'paid' ? paymentMode : 'Unpaid'} (Rs {finalAmount.toFixed(2)})</div>
                <div>KOT No: {order.kotNo || order._id?.slice(-4)} (by {order.createdBy?.name || 'N/A'})</div>
                <div>Billed By: {order.createdBy?.name || 'N/A'}</div>
                <div>Service Duration: 58 secs</div>
              </div>
              <div className="invoice-note">This is not a Tax Invoice!</div>
              <div className="invoice-foot">
                Kindly accept the original bill from the counter, as this bill is for estimate purposes only.
              </div>
              <div className="invoice-thanks">Thank You<br />Thank you for your visit! Visit again</div>
            </div>

            <div className="confirm-card">
              <div className="net-total">
                <div>Net sales amount</div>
                <div>Rs {finalAmount.toFixed(2)}</div>
              </div>
              {order.paymentStatus === 'paid' || order.status === 'paid' ? (
                <button className="confirm-btn paid" disabled>Paid</button>
              ) : (
                <button
                  className="confirm-btn"
                  onClick={async () => {
                    await onPay({
                      orderId: order._id,
                      paymentMethod: paymentMode,
                      paymentStatus,
                      discountType,
                      discountValue: Number(discount || 0),
                      tenderAmount: 0,
                      taxRate: 0,
                      tipsAmount: 0,
                      roundOff: 0
                    });
                    setShowSuccess(true);
                  }}
                >
                  Confirm Checkout
                </button>
              )}
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="success-overlay" onClick={() => setShowSuccess(false)}>
            <div className="success-card" onClick={(e) => e.stopPropagation()}>
              <button className="success-close" onClick={() => setShowSuccess(false)}>×</button>
              <div className="success-icon">✓</div>
              <div className="success-title">Successful Checkout</div>
              <div className="success-actions">
                <button className="ghost-btn">Download</button>
                <button className="ghost-btn" onClick={() => onPrint(order._id)}>Print Bill</button>
              </div>
              <div className="success-summary">
                <div>Total Amount</div>
                <div>Rs {finalAmount.toFixed(2)}</div>
                <div>Payment Mode: {paymentMode || 'N/A'}</div>
              </div>
              <div className="success-note">This is not a Tax Invoice!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;
