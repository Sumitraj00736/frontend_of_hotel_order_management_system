import React from 'react';

const SalesPurchaseHeader = ({ title = 'Sales & Purchase', subtitle = 'Finance / Sales & Purchase', children }) => {
  return (
    <header className="fd-header">
      <div className="fd-header-content">
        <div>
          <h1 className="fd-title">{title}</h1>
          <p className="fd-card-sub">{subtitle}</p>
        </div>
        
        <div className="fd-header-actions">
          {children}
        </div>
      </div>
    </header>
  );
};

export default SalesPurchaseHeader;
