import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Save, RotateCcw } from 'lucide-react';

const CustomerModal = ({ form, setForm, onClose, onSave }) => {
  const [showExtra, setShowExtra] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="customer-modal-overlay" onClick={onClose}>
      <div className="modal-content glass-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{form._id ? 'Edit Customer' : 'Add New Customer'}</h3>
          <button className="close-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-section-title">General Information</div>
          <div className="modal-form-grid">
            <div className="form-group">
              <label>Customer Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+977"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Loyalty Discount (%)</label>
              <input
                type="number"
                value={form.loyaltyDiscount}
                onChange={(e) => updateField('loyaltyDiscount', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-section-title">Opening Balance</div>
          <div className="modal-form-grid">
            <div className="form-group full-width">
              <div className="balance-toggle-container">
                <button
                  className={`toggle-btn dr ${form.openingBalanceType === 'dr' ? 'active' : ''}`}
                  onClick={() => updateField('openingBalanceType', 'dr')}
                >
                  To Collect (Dr)
                </button>
                <button
                  className={`toggle-btn cr ${form.openingBalanceType === 'cr' ? 'active' : ''}`}
                  onClick={() => updateField('openingBalanceType', 'cr')}
                >
                  To Pay (Cr)
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Opening Amount</label>
              <div className="input-with-prefix">
                <span>Rs</span>
                <input
                  type="number"
                  value={form.openingAmount}
                  onChange={(e) => updateField('openingAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <button
            className="additional-details-toggle"
            onClick={() => setShowExtra((v) => !v)}
          >
            {showExtra ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {showExtra ? 'Hide Additional Details' : 'View Additional Details'}
          </button>

          {showExtra && (
            <div className="modal-form-grid extra-padding">
              <div className="form-group">
                <label>Legal Name</label>
                <input
                  value={form.legalName}
                  onChange={(e) => updateField('legalName', e.target.value)}
                  placeholder="Official Business Name"
                />
              </div>
              <div className="form-group">
                <label>Tax/PAN Number</label>
                <input
                  value={form.taxNumber}
                  onChange={(e) => updateField('taxNumber', e.target.value)}
                  placeholder="Tax ID"
                />
              </div>
              <div className="form-group">
                <label>Credit Limit</label>
                <input
                  value={form.creditLimit}
                  onChange={(e) => updateField('creditLimit', e.target.value)}
                  placeholder="Rs 0"
                />
              </div>
              <div className="form-group">
                <label>Credit Term (Days)</label>
                <input
                  value={form.creditTermDays}
                  onChange={(e) => updateField('creditTermDays', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Full Address"
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="footer-btn secondary" onClick={onClose}>
            <RotateCcw size={16} /> Reset
          </button>
          <button className="footer-btn primary" onClick={onSave}>
            <Save size={16} /> Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;