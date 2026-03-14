import React from 'react';

const IngredientModal = ({ open, onClose, form, setForm, onSave }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-panel fullscreen small animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Add Ingredient</h5>
          <button className="btn btn-outline-light" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-body-scroll">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Unit (e.g., kg, g, ml, pcs)</label>
            <input className="form-control" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div className="row g-2 mb-3">
            <div className="col">
              <label className="form-label">Stock</label>
              <input
                className="form-control"
                type="number"
                value={form.currentStock}
                onChange={(e) => setForm({ ...form, currentStock: e.target.value })}
              />
            </div>
            <div className="col">
              <label className="form-label">Reorder Level</label>
              <input
                className="form-control"
                type="number"
                value={form.reorderLevel}
                onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-2">
          <button className="btn btn-outline-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientModal;
