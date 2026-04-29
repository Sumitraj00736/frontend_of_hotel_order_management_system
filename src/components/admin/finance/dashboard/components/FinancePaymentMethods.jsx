import React from 'react';

function fmt(n) { return `Rs ${Number(n || 0).toLocaleString()}`; }

const FinancePaymentMethods = ({ payMethods }) => {
  return (
    <div className="fd-pay-methods-card glass-card">
      <div className="fd-card-head">
        <div>
          <div className="fd-card-title">Payment Methods</div>
          <div className="fd-card-sub">Distribution of funds</div>
        </div>
      </div>
      
      {payMethods.length === 0 ? (
        <div className="fd-add-method">
          <div className="fd-add-method-icon">+</div>
          <div className="fw-bold">No Data</div>
          <div className="text-muted small">Methods will appear as transactions occur</div>
        </div>
      ) : (
        <div className="fd-method-list">
          {payMethods.map((m, i) => (
            <div key={i} className="fd-method-row">
              <div className="method-info">
                <span className="method-name">{m.method}</span>
                <div className="progress mini-progress">
                  <div className="progress-bar" style={{ width: '100%', backgroundColor: '#f5a524' }} />
                </div>
              </div>
              <strong className="method-amount">{fmt(m.amount)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancePaymentMethods;
