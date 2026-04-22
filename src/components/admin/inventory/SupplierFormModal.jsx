import React, { useState } from 'react';
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

  React.useEffect(() => {
    setForm(initialData || defaultForm);
  }, [initialData, open]);

  if (!open) return null;

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Supplier name is required');
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
        legalName: form.legalName || undefined,
        taxNumber: form.taxNumber || undefined,
        dob: form.dob || undefined,
        openingBalanceType: form.openingBalanceType,
        openingAmount: Number(form.openingAmount || 0)
      });
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save supplier');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-0 pb-0 pt-4 px-4">
            <div className="w-100 text-center">
              <h4 className="fw-bold mb-0">{initialData ? 'Edit Supplier' : 'Add Supplier'}</h4>
            </div>
            <button className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose} />
          </div>

          <div className="modal-body px-4 pt-3 pb-2">
            {/* Row 1 */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Supplier Full Name <span className="text-danger">*</span></label>
                <input
                  className="form-control rounded-3"
                  placeholder="Enter Supplier Name"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-white rounded-start-3 border-end-0">
                    🇳🇵 <ChevronDown size={12} className="ms-1 text-muted" />
                  </span>
                  <input
                    className="form-control rounded-end-3 border-start-0"
                    placeholder="+977"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Opening Balance */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Opening Balance</label>
                <div className="d-flex gap-3">
                  <div
                    className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 border cursor-pointer ${form.openingBalanceType === 'dr' ? 'border-success bg-success-subtle' : 'bg-white'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => set('openingBalanceType', 'dr')}
                  >
                    <div className={`rounded-circle border-2 border-success d-flex align-items-center justify-content-center`} style={{ width: 18, height: 18, border: '2px solid #198754' }}>
                      {form.openingBalanceType === 'dr' && <div className="bg-success rounded-circle" style={{ width: 10, height: 10 }} />}
                    </div>
                    <span className="text-success fw-bold small">To Collect(Dr)</span>
                    <span className="text-success">↓</span>
                  </div>
                  <div
                    className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 border cursor-pointer ${form.openingBalanceType === 'cr' ? 'border-danger bg-danger-subtle' : 'bg-white'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => set('openingBalanceType', 'cr')}
                  >
                    <div className="rounded-circle" style={{ width: 18, height: 18, border: '2px solid #dc3545' }}>
                      {form.openingBalanceType === 'cr' && <div className="bg-danger rounded-circle m-auto" style={{ width: 10, height: 10, marginTop: 2 }} />}
                    </div>
                    <span className="text-danger fw-bold small">To Pay(Cr)</span>
                    <span className="text-danger">↑</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Opening Amount</label>
                <div className="input-group">
                  <span className="input-group-text bg-white rounded-start-3 text-muted fw-semibold">Rs</span>
                  <input
                    className="form-control rounded-end-3"
                    type="number"
                    min="0"
                    value={form.openingAmount}
                    onChange={e => set('openingAmount', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Toggle Additional Details */}
            <button
              type="button"
              className="btn btn-link text-primary p-0 fw-semibold d-flex align-items-center gap-1 mb-3"
              onClick={() => setShowAdditional(!showAdditional)}
            >
              {showAdditional ? 'Hide' : 'Show'} Additional Details
              {showAdditional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdditional && (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Legal Name</label>
                  <input className="form-control rounded-3" placeholder="Enter Supplier's Legal Name" value={form.legalName} onChange={e => set('legalName', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Tax Number</label>
                  <input className="form-control rounded-3" placeholder="Enter Supplier's Tax Number" value={form.taxNumber} onChange={e => set('taxNumber', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input className="form-control rounded-3" placeholder="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Address</label>
                  <input className="form-control rounded-3" placeholder="Enter Supplier's Address" value={form.address} onChange={e => set('address', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date of Birth</label>
                  <input className="form-control rounded-3" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-3 d-flex justify-content-end gap-3">
            <button className="btn btn-light px-4 fw-semibold rounded-3" onClick={() => setForm(defaultForm)}>Reset</button>
            <button
              className="btn px-4 fw-bold rounded-3 text-white"
              style={{ backgroundColor: '#F08080', border: 'none' }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Supplier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierFormModal;
