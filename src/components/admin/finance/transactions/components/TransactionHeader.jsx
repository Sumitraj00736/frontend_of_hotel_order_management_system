import React from 'react';

const TransactionHeader = ({ title = 'Transactions', subtitle = 'Finance / Transactions' }) => {
  return (
    <div className="fd-header-content" style={{ marginBottom: '24px' }}>
      <div>
        <h1 className="fd-title">{title}</h1>
        <p className="fd-card-sub">{subtitle}</p>
      </div>
    </div>
  );
};

export default TransactionHeader;
