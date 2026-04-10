import React, { useState } from 'react';

const CustomerModal = ({ form, setForm, onClose, onSave }) => {
  const [showExtra, setShowExtra] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="customers-modal-overlay" onClick={onClose}>
      <div className="customers-modal" onClick={(e) => e.stopPropagation()}>
        <button className="customers-modal-close" onClick={onClose}>✕</button>
        <h3>Add Customer</h3>
        <div className="customers-form-grid">
          <div>
            <label>Customer Full Name *</label>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter Customer Name"
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+977"
            />
          </div>
          <div>
            <label>Loyalty Discount (in %)</label>
            <input
              value={form.loyaltyDiscount}
              onChange={(e) => updateField('loyaltyDiscount', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="customers-balance-row">
            <div className="customers-toggle">
              <button
                className={form.openingBalanceType === 'dr' ? 'active' : ''}
                onClick={() => updateField('openingBalanceType', 'dr')}
              >
                To Collect (Dr)
              </button>
              <button
                className={form.openingBalanceType === 'cr' ? 'active' : ''}
                onClick={() => updateField('openingBalanceType', 'cr')}
              >
                To Pay (Cr)
              </button>
            </div>
          </div>
          <div>
            <label>Opening Amount</label>
            <input
              value={form.openingAmount}
              onChange={(e) => updateField('openingAmount', e.target.value)}
              placeholder="Rs 0"
            />
          </div>
        </div>

        <button
          style={{ marginTop: 12, border: 'none', background: 'transparent', color: '#2563eb' }}
          onClick={() => setShowExtra((v) => !v)}
        >
          {showExtra ? 'Hide Additional Details' : 'Additional Details'}
        </button>

        {showExtra && (
          <div className="customers-form-grid" style={{ marginTop: 12 }}>
            <div>
              <label>Legal Name</label>
              <input
                value={form.legalName}
                onChange={(e) => updateField('legalName', e.target.value)}
                placeholder="Enter Customer's Legal Name"
              />
            </div>
            <div>
              <label>Tax Number</label>
              <input
                value={form.taxNumber}
                onChange={(e) => updateField('taxNumber', e.target.value)}
                placeholder="Enter Customer's Tax Number"
              />
            </div>
            <div>
              <label>Credit Limit</label>
              <input
                value={form.creditLimit}
                onChange={(e) => updateField('creditLimit', e.target.value)}
                placeholder="Rs 0"
              />
            </div>
            <div>
              <label>Credit Term</label>
              <input
                value={form.creditTermDays}
                onChange={(e) => updateField('creditTermDays', e.target.value)}
                placeholder="0 Days"
              />
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => updateField('dob', e.target.value)}
              />
            </div>
            <div>
              <label>Address</label>
              <input
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Enter Customer's Address"
              />
            </div>
          </div>
        )}

        <div className="customers-footer">
          <button className="btn-secondary" onClick={onClose}>Reset</button>
          <button className="btn-primary" onClick={onSave}>Save Customer</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
