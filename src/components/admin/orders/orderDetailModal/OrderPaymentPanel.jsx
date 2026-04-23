import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const OrderPaymentPanel = ({
  paymentStatus,
  onStatusChange,
  payments,
  onUpdatePayments,
  totalToPay
}) => {
  const handleAddPayment = () => {
    onUpdatePayments([...payments, { method: 'cash', amount: 0 }]);
  };

  const handleRemovePayment = (index) => {
    const updated = [...payments];
    updated.splice(index, 1);
    onUpdatePayments(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...payments];
    updated[index][field] = value;
    onUpdatePayments(updated);
  };

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const remaining = Math.max(0, totalToPay - totalPaid);

  return (
    <div className="payment-card">
      <div className="label">Payment Mode</div>
      <div className="pay-tabs">
        <button className={paymentStatus === 'paid' ? 'active' : ''} onClick={() => onStatusChange('paid')}>Paid (Full/Split)</button>
        <button className={paymentStatus === 'unpaid_credit' ? 'active' : ''} onClick={() => onStatusChange('unpaid_credit')}>Unpaid / Credit</button>
      </div>
      
      {paymentStatus === 'paid' && (
        <div className="multi-pay-section mt-3">
          {payments.map((p, idx) => (
            <div key={idx} className="d-flex align-items-center gap-2 mb-2">
              <select
                className="form-select form-select-sm"
                value={p.method}
                onChange={(e) => handleChange(idx, 'method', e.target.value)}
                style={{ width: '120px' }}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="fonepay">Fonepay</option>
                <option value="bank">Bank</option>
              </select>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Amount"
                value={p.amount === 0 ? '' : p.amount}
                onChange={(e) => handleChange(idx, 'amount', e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={() => handleRemovePayment(idx)}
                disabled={payments.length === 1}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          
          <button 
            className="btn btn-sm btn-outline-primary mt-2 w-100" 
            onClick={handleAddPayment}
          >
            <Plus size={14} className="me-1" /> Add Payment Method
          </button>
          
          {remaining > 0 && totalToPay > 0 && payments.length > 0 && (
            <div className="text-secondary small mt-2 d-flex justify-content-between">
              <span>Remaining to match bill:</span>
              <span className="fw-bold cursor-pointer text-primary" onClick={() => handleChange(payments.length-1, 'amount', Number(payments[payments.length-1].amount || 0) + remaining)}>Rs {remaining.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderPaymentPanel;
