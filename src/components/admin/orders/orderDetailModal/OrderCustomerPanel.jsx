import React from 'react';

const OrderCustomerPanel = ({ activeTab, onTabChange, customerName, onCustomerChange }) => {
  return (
    <div className="customer-card">
      <div className="tab-row">
        <button className={activeTab === 'customer' ? 'active' : ''} onClick={() => onTabChange('customer')}>Customer</button>
        <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => onTabChange('staff')}>Staff</button>
      </div>
      <div className="tab-content">
        <input
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => onCustomerChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default OrderCustomerPanel;
