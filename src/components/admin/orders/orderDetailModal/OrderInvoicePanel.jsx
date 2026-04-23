import React from 'react';

const OrderInvoicePanel = ({ order, total }) => {
  const items = order?.items || [];
  return (
    <div className="invoice-card">
      <div className="invoice-title">ESTIMATE INVOICE</div>
      <div className="invoice-meta">
        <div>Invoice No: {order?.invoiceNo || order?.kotNo || '##'}</div>
        <div>Date: {new Date(order?.createdAt || Date.now()).toLocaleDateString()}</div>
        {order?.orderType === 'delivery' || order?.orderType === 'takeaway' ? (
          <>
            <div>Type: <span className="text-uppercase fw-bold">{order?.orderType}</span></div>
            <div>Customer: {order?.customerName || order?.customer?.name || 'Cash Customer'} {order?.customerPhone && `(${order?.customerPhone})`}</div>
            {order?.deliveryAddress && <div>Address: {order?.deliveryAddress}</div>}
            {order?.deliveryPlatform && <div>Platform: {order?.deliveryPlatform}</div>}
          </>
        ) : (
          <>
            <div>Dine In: Table {order?.table?.tableNumber || '-'}</div>
            <div>Customer: {order?.customerName || order?.customer?.name || 'Cash Customer'}</div>
          </>
        )}
        <div>
          Waiter: {order?.source === 'guest' ? 'Order by QR code' : order?.createdBy?.name || 'N/A'}
        </div>
        <div>Kitchen: {order?.kitchenAssigned?.name || 'N/A'}</div>
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
        <span>Total Amount</span>
        <span>Rs {total.toFixed(2)}</span>
      </div>
      <div className="invoice-note">This is not a Tax Invoice!</div>
      <div className="invoice-foot">
        <div>Thank You</div>
        <div>Thank you for your visit! Visit again</div>
      </div>
    </div>
  );
};

export default OrderInvoicePanel;
