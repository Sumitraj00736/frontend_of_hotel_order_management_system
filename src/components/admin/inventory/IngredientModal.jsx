import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const IngredientModal = ({ open, onClose, form, setForm, onSave, isEdit = false, units = [] }) => {
  const [showAdditional, setShowAdditional] = useState(false);

  if (!open) return null;

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // Auto-calc opening value when qty or rate changes
  const handleOpeningChange = (k, v) => {
    const updated = { ...form, [k]: v };
    const qty = Number(k === 'openingQty' ? v : (form.openingQty || 0));
    const rate = Number(k === 'openingRate' ? v : (form.openingRate || 0));
    updated.openingValue = Math.round(qty * rate * 100) / 100;
    setForm(updated);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-0 pb-0 pt-4 px-5">
            <div className="w-100 text-center">
              <h4 className="fw-bold mb-0">{isEdit ? 'Edit Stock Item' : 'Create Stock Item'}</h4>
            </div>
            <button className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose} />
          </div>

          <div className="modal-body px-5 pt-3 pb-2">
            {/* Row 1: Item Name + Measuring Unit */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Item Name <span className="text-danger">*</span></label>
                <input
                  className="form-control rounded-3"
                  placeholder="Enter name of Stock"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold mb-0">Measuring Unit <span className="text-danger">*</span></label>
                  <div className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" id="multiUnit" />
                    <label className="form-check-label small text-muted" htmlFor="multiUnit">Multiple Unit</label>
                  </div>
                </div>
                <select
                  className="form-select rounded-3"
                  value={form.unit}
                  onChange={e => set('unit', e.target.value)}
                >
                  <option value="" disabled>Select Measuring Unit of the item</option>
                  {units.map(u => (
                    <option key={u._id} value={u.name}>
                      {u.label || u.name}{u.symbol ? ` (${u.symbol})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Default Price + Group */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Default Price</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted fw-semibold rounded-start-3">Rs</span>
                  <input
                    className="form-control rounded-end-3"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.defaultPrice || ''}
                    onChange={e => set('defaultPrice', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Group</label>
                <select
                  className="form-select rounded-3"
                  value={form.group || ''}
                  onChange={e => set('group', e.target.value)}
                >
                  <option value="">Select Group for Item</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Spices">Spices</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Opening Stock Section */}
            <div className="border rounded-3 p-3 mb-3 bg-light">
              <label className="form-label fw-semibold mb-3">Opening Stock</label>
              <div className="row g-3">
                <div className="col-4">
                  <label className="form-label small text-muted fw-semibold">Quantity</label>
                  <input
                    className="form-control rounded-3 bg-white"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.openingQty || ''}
                    onChange={e => handleOpeningChange('openingQty', e.target.value)}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small text-muted fw-semibold">Rate</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted rounded-start-3" style={{ fontSize: 13 }}>Rs</span>
                    <input
                      className="form-control rounded-end-3 bg-white"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.openingRate || ''}
                      onChange={e => handleOpeningChange('openingRate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-4">
                  <label className="form-label small text-muted fw-semibold">Value</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted rounded-start-3" style={{ fontSize: 13 }}>Rs</span>
                    <input
                      className="form-control rounded-end-3 bg-light"
                      type="number"
                      placeholder="0"
                      value={form.openingValue || ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details Toggle */}
            <button
              type="button"
              className="btn btn-link text-primary p-0 fw-semibold d-flex align-items-center gap-1 mb-3"
              onClick={() => setShowAdditional(!showAdditional)}
            >
              Additional Details {showAdditional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdditional && (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Current Stock</label>
                  <input
                    className="form-control rounded-3"
                    type="number"
                    placeholder="0"
                    value={form.currentStock || ''}
                    onChange={e => set('currentStock', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Reorder Level</label>
                  <input
                    className="form-control rounded-3"
                    type="number"
                    placeholder="10"
                    value={form.reorderLevel || ''}
                    onChange={e => set('reorderLevel', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">SKU / Code</label>
                  <input
                    className="form-control rounded-3"
                    placeholder="e.g. SKU-001"
                    value={form.sku || ''}
                    onChange={e => set('sku', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 px-5 pb-4 pt-3 d-flex justify-content-end gap-3">
            <button className="btn btn-light px-4 fw-semibold rounded-3" onClick={() => setForm({ name: '', unit: '', currentStock: '', reorderLevel: '', defaultPrice: '', group: '', openingQty: '', openingRate: '', openingValue: '' })}>Reset</button>
            <button
              className="btn px-4 fw-bold rounded-3 text-white"
              style={{ backgroundColor: '#F08080', border: 'none' }}
              onClick={onSave}
            >
              {isEdit ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;



