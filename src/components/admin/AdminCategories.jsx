import React, { useState } from 'react';
import CustomDropdown from '../ui/CustomDropdown.jsx';

const AdminCategories = ({ categories, reload, onCreate, onUpdate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);

  const startAdd = () => {
    setForm({ name: '', imageUrl: '' });
    setEditId(null);
    setOpen(true);
  };

  const startEdit = (cat) => {
    setForm({ name: cat.name, imageUrl: cat.imageUrl || '' });
    setEditId(cat._id);
    setOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim()) return alert('Name required');
    if (editId) await onUpdate(editId, form); else await onCreate(form);
    setOpen(false);
  };

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Categories</h5>
        <button className="btn btn-primary" onClick={startAdd}>+ Add Category</button>
      </div>
      <div className="content grid-3">
        {categories.map((cat) => (
          <div key={cat._id} className="card glass-card">
            {cat.imageUrl && <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} />}
            <div className="fw-semibold mt-2">{cat.name}</div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="pill-neutral">{cat.active ? 'Active' : 'Inactive'}</span>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-light" onClick={() => startEdit(cat)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(cat._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="modal-overlay fullscreen" onClick={() => setOpen(false)}>
          <div className="modal-panel fullscreen small animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 modal-header-line">
              <h5 className="mb-0">{editId ? 'Edit Category' : 'Add Category'}</h5>
              <button className="btn btn-outline-light" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="mb-2">
              <label className="form-label">Name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Image URL</label>
              <input className="form-control" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-light" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>{editId ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
