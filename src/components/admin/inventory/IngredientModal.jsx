import React from 'react';
import { X } from 'lucide-react';

const IngredientModal = ({ open, onClose, form, setForm, onSave, isEdit = false, units = [] }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay animate-in" onClick={onClose}>
      <div className="modal-panel small animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <div className="eyebrow text-primary">{isEdit ? 'Update Details' : 'New Resource'}</div>
            <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Ingredient' : 'Add Ingredient'}</h5>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted uppercase">Ingredient Name</label>
            <input
              className="form-control"
              placeholder="e.g. Basmati Rice"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-muted uppercase">Unit (e.g., kg, g, ml, pcs)</label>
            <select
              className="form-select"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            >
              <option value="" disabled>Select unit</option>
              {units.map((unit) => (
                <option key={unit._id} value={unit.name}>
                  {unit.label || unit.name}{unit.symbol ? ` (${unit.symbol})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <label className="form-label small fw-bold text-muted uppercase">Current Stock</label>
              <input
                className="form-control"
                type="number"
                placeholder="0"
                value={form.currentStock}
                onChange={(e) => setForm({ ...form, currentStock: e.target.value })}
              />
            </div>
            <div className="col-6">
              <label className="form-label small fw-bold text-muted uppercase">Reorder Level</label>
              <input
                className="form-control"
                type="number"
                placeholder="10"
                value={form.reorderLevel}
                onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 pt-3 border-top">
          <button className="btn btn-outline-secondary px-4" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary px-4" onClick={onSave}>
            {isEdit ? 'Update Ingredient' : 'Save Ingredient'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
