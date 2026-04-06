import React from 'react';

const OrderHeader = ({ title, onClose, onPrint }) => {
  return (
    <div className="checkout-header">
      <div className="checkout-title">{title}</div>
      <div className="checkout-actions">
        <button className="ghost-btn">Switch to Quick Mode</button>
        <button className="ghost-btn">Download</button>
        <button className="ghost-btn" onClick={onPrint}>Print Estimate</button>
      </div>
      <button className="checkout-close" onClick={onClose}>×</button>
    </div>
  );
};

export default OrderHeader;
