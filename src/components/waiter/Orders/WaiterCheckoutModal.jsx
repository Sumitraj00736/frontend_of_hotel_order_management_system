import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import OrderPaymentPanel from '../../admin/orders/checkout/OrderPaymentPanel.jsx';
import OrderSummaryPanel from '../../admin/orders/checkout/OrderSummaryPanel.jsx';

const WaiterCheckoutModal = ({ order, onClose, onConfirm, onPrint }) => {
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'paid');
  const [paymentMode, setPaymentMode] = useState(order?.paymentMethod || 'cash');
  const [discountType, setDiscountType] = useState(order?.discountType || 'amount');
  const [discount, setDiscount] = useState(order?.discountValue || 0);
  const [tenderAmount, setTenderAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = order?.items || [];
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.isComplimentary ? 0 : (item.priceAtOrderTime || 0) * (item.quantity || 1)), 0),
    [items]
  );
  const discountValue =
    discountType === 'percent'
      ? (subtotal * Number(discount || 0)) / 100
      : Number(discount || 0);
  const total = Math.max(0, subtotal - discountValue);

  if (!order) return null;

  return createPortal(
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-panel" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div className="checkout-title">Checkout - Table {order.table?.tableNumber || '-'}</div>
          <div className="checkout-actions">
            <button className="ghost-btn" onClick={() => onPrint?.(order._id)}>Print</button>
          </div>
          <button className="checkout-close" onClick={onClose}>x</button>
        </div>

        <div className="checkout-body">
          <div className="checkout-left">
            <div className="items-card">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item._id || idx}>
                      <td>{item.menuItem?.name || item.name || 'Item'}</td>
                      <td>{item.quantity || 0}</td>
                      <td>Rs {(item.priceAtOrderTime || 0).toFixed(2)}</td>
                      <td>Rs {((item.quantity || 0) * (item.priceAtOrderTime || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <OrderPaymentPanel
              paymentStatus={paymentStatus}
              paymentMode={paymentMode}
              onStatusChange={setPaymentStatus}
              onModeChange={setPaymentMode}
            />
          </div>

          <OrderSummaryPanel
            subtotal={subtotal}
            discountType={discountType}
            discount={discount}
            onDiscountTypeChange={setDiscountType}
            onDiscountChange={setDiscount}
            tenderAmount={tenderAmount}
            onTenderAmountChange={setTenderAmount}
            total={total}
          />

          <div className="checkout-right">
            <div className="invoice-card">
              <div className="invoice-title">Order Info</div>
              <div className="invoice-grid">
                <div>
                  <span>KOT</span>
                  <strong>{order.kotNo || `KOT-${order._id?.slice(-4)}`}</strong>
                </div>
                <div>
                  <span>Waiter</span>
                  <strong>{order.createdBy?.name || 'N/A'}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{order.status}</strong>
                </div>
                <div>
                  <span>Created</span>
                  <strong>{new Date(order.createdAt).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="net-card">
              <div>
                <div className="text-muted small">Net sales amount</div>
                <div className="fw-semibold">Rs {total.toFixed(2)}</div>
              </div>
              {order.paymentStatus === 'paid' || order.status === 'paid' ? (
                <button className="btn btn-outline-light" disabled>Paid</button>
              ) : (
                <button
                  className="btn btn-danger"
                  disabled={isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      await onConfirm?.({
                        orderId: order._id,
                        paymentMethod: paymentMode,
                        paymentStatus,
                        discountType,
                        discountValue: Number(discount || 0),
                        tenderAmount: Number(tenderAmount || 0)
                      });
                      onClose?.();
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Checkout'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WaiterCheckoutModal;
