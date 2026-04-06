import React from 'react';

const FinancePaymentMethods = () => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">Payment Methods</div>
      <button className="panel-link">View All</button>
    </div>
    <div className="panel-sub">Top payment methods overview</div>
    <div className="payment-method-card">
      <div className="payment-method-icon">+</div>
      <div>
        <div className="fw-600">Add Payment Method</div>
        <div className="panel-sub">Create new payment method to collect payments</div>
      </div>
    </div>
  </div>
);

export default FinancePaymentMethods;
