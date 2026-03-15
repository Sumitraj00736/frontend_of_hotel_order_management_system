import React, { useState } from 'react';

const AdminSubMenus = ({ submenus, onCreate, onUpdate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);

  const startAdd = () => { setForm({ name: '', imageUrl: '' }); setEditId(null); setOpen(true); };
  const startEdit = (row) => { setForm({ name: row.name, imageUrl: row.imageUrl || '' }); setEditId(row._id); setOpen(true); };

  const submit = async () => {
    if (!form.name.trim()) return alert('Name required');
    if (editId) await onUpdate(editId, form); else await onCreate(form);
    setOpen(false);
  };

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Sub Menus</h5>
        <button className="btn btn-primary btn-sm" onClick={startAdd}>+ Add Sub Menu</button>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>#</th><th>Name</th><th>Active</th><th /></tr></thead>
          <tbody>
            {submenus.map((s, idx) => (
              <tr key={s._id}>
                <td>{idx + 1}</td>
                <td className="fw-semibold">{s.name}</td>
                <td>{s.active ? 'Yes' : 'No'}</td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-light" onClick={() => startEdit(s)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal-overlay fullscreen" onClick={() => setOpen(false)}>
          <div className="modal-panel fullscreen small animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 modal-header-line">
              <h5 className="mb-0">{editId ? 'Edit Sub Menu' : 'Add Sub Menu'}</h5>
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

export default AdminSubMenus;
