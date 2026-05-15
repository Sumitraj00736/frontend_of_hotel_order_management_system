import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const defaultForm = {
  name: '',
  phone: '',
  openingBalanceType: 'dr',
  openingAmount: '0',
  legalName: '',
  taxNumber: '',
  email: '',
  address: '',
  dob: ''
};

const SupplierFormModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialData || defaultForm);
  const [showAdditional, setShowAdditional] = useState(false);
  const [saving, setSaving] = useState(false);

  const MAIN_COLOR = '#fc8019';

  // Sync form state with initialData when modal opens
  useEffect(() => {
    if (open) {
      setForm(initialData || defaultForm);
    }
  }, [initialData, open]);

  if (!open) return null;

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Supplier name is required');
    setSaving(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        openingAmount: Number(form.openingAmount || 0)
      });
      // onClose is usually handled by the parent handleSave, 
      // but included here if your parent doesn't call it.
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save supplier');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent dark overlay
        backdropFilter: 'blur(6px)',           // Blurs everything behind the modal
        WebkitBackdropFilter: 'blur(6px)',     // Support for Safari
        zIndex: 2000 
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg" style={{ background: '#fff', overflow: 'hidden' }}>
          
          {/* Header */}
          <div className="modal-header border-0 pb-0 pt-4 px-4 position-relative">
            <div className="w-100 text-center">
              <h4 className="fw-bold mb-0">
                {initialData ? 'Edit Supplier' : 'Add Supplier'}
              </h4>
              <div style={{ width: '40px', height: '3px', background: MAIN_COLOR, margin: '8px auto' }}></div>
            </div>
            <button 
              className="btn-close shadow-none position-absolute top-0 end-0 m-3" 
              onClick={onClose} 
            />
          </div>

          <div className="modal-body px-4 pt-3 pb-2">
            {/* Primary Details Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Supplier Full Name <span className="text-danger">*</span></label>
                <input
                  className="form-control rounded-3 border-2 shadow-sm"
                  placeholder="Enter Supplier Name"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Phone Number</label>
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-white border-2 border-end-0 rounded-start-3">
                    🇳🇵 <ChevronDown size={12} className="ms-1 text-muted" />
                  </span>
                  <input
                    className="form-control border-2 border-start-0 rounded-end-3"
                    placeholder="98XXXXXXXX"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Opening Balance Section */}
            <div className="p-3 rounded-4 mb-3" style={{ background: '#fefefe', border: '1px dashed #ddd' }}>
              <div className="row g-3">
                <div className="col-md-7">
                  <label className="form-label fw-semibold small text-muted">Balance Type</label>
                  <div className="d-flex gap-2">
                    <div
                      className={`flex-fill d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 border-2 cursor-pointer transition-all ${form.openingBalanceType === 'dr' ? 'border-success bg-success-subtle' : 'bg-white'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => set('openingBalanceType', 'dr')}
                    >
                      <div className="rounded-circle border-2 d-flex align-items-center justify-content-center" style={{ width: 16, height: 16, borderColor: '#198754' }}>
                        {form.openingBalanceType === 'dr' && <div className="bg-success rounded-circle" style={{ width: 8, height: 8 }} />}
                      </div>
                      <span className="text-success fw-bold small">To Collect (Dr)</span>
                    </div>
                    
                    <div
                      className={`flex-fill d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 border-2 cursor-pointer transition-all ${form.openingBalanceType === 'cr' ? 'border-danger bg-danger-subtle' : 'bg-white'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => set('openingBalanceType', 'cr')}
                    >
                      <div className="rounded-circle border-2 d-flex align-items-center justify-content-center" style={{ width: 16, height: 16, borderColor: '#dc3545' }}>
                        {form.openingBalanceType === 'cr' && <div className="bg-danger rounded-circle" style={{ width: 8, height: 8 }} />}
                      </div>
                      <span className="text-danger fw-bold small">To Pay (Cr)</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-semibold small text-muted">Opening Amount</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-2 border-end-0 rounded-start-3 text-muted fw-bold">Rs</span>
                    <input
                      className="form-control border-2 rounded-end-3"
                      type="number"
                      value={form.openingAmount}
                      onChange={e => set('openingAmount', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle Additional Details */}
            <div 
              className="d-flex align-items-center gap-2 mb-3" 
              style={{ cursor: 'pointer', color: MAIN_COLOR }}
              onClick={() => setShowAdditional(!showAdditional)}
            >
              <span className="fw-bold small text-uppercase">Additional Details</span>
              <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
              {showAdditional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {showAdditional && (
              <div className="row g-3 animate-in fade-in">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Legal Name</label>
                  <input className="form-control rounded-3 border-2" value={form.legalName} onChange={e => set('legalName', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Tax Number</label>
                  <input className="form-control rounded-3 border-2" value={form.taxNumber} onChange={e => set('taxNumber', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Email</label>
                  <input className="form-control rounded-3 border-2" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Address</label>
                  <input className="form-control rounded-3 border-2" value={form.address} onChange={e => set('address', e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4 pt-3 d-flex justify-content-end gap-2">
            <button 
              className="btn btn-light px-4 fw-bold rounded-pill shadow-sm" 
              onClick={() => setForm(defaultForm)}
            >
              Reset
            </button>
            <button
              className="btn px-4 fw-bold rounded-pill text-white shadow"
              style={{ backgroundColor: MAIN_COLOR, border: 'none' }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierFormModal;