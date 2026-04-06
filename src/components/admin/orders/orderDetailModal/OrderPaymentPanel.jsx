import React from 'react';

const OrderPaymentPanel = ({
  paymentStatus,
  paymentMode,
  onStatusChange,
  onModeChange
}) => {
  return (
    <div className="payment-card">
      <div className="label">Payment Mode</div>
      <div className="pay-tabs">
        <button className={paymentStatus === 'paid' ? 'active' : ''} onClick={() => onStatusChange('paid')}>Paid</button>
        <button className={paymentStatus === 'credit' ? 'active' : ''} onClick={() => onStatusChange('credit')}>Unpaid / Credit</button>
        <button className={paymentStatus === 'partial' ? 'active' : ''} onClick={() => onStatusChange('partial')}>Partial</button>
      </div>
      <div className="pay-options">
        <button className={paymentMode === 'cash' ? 'active' : ''} onClick={() => onModeChange('cash')}>Cash</button>
        <button className={paymentMode === 'card' ? 'active' : ''} onClick={() => onModeChange('card')}>Card</button>
        <button className={paymentMode === 'bank' ? 'active' : ''} onClick={() => onModeChange('bank')}>Bank Transfer</button>
      </div>
    </div>
  );
};

export default OrderPaymentPanel;
