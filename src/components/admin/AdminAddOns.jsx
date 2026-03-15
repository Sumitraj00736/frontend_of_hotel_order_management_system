import React, { useState } from 'react';

const AdminAddOns = ({ addOns, onCreate, onUpdate, onDelete, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', price: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);

  const startAdd = () => { setForm({ name: '', type: '', price: '', imageUrl: '' }); setEditId(null); setOpen(true); };
  const startEdit = (row) => { setForm({ name: row.name, type: row.type || '', price: row.price, imageUrl: row.imageUrl || '' }); setEditId(row._id); setOpen(true); };

  const submit = async () => {
    if (!form.name.trim()) return alert('Name required');
    const payload = { ...form, price: Number(form.price) || 0 };
    if (editId) await onUpdate(editId, payload); else await onCreate(payload);
    setOpen(false);
  };

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Add-Ons & Extras</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light btn-sm" onClick={onRefresh}>Refresh</button>
          <button className="btn btn-primary btn-sm" onClick={startAdd}>+ Add Add-On</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>#</th><th>Name</th><th>Price</th><th>Type</th><th>Available</th><th /></tr></thead>
          <tbody>
            {addOns.map((a, idx) => (
              <tr key={a._id}>
                <td>{idx + 1}</td>
                <td>{a.name}</td>
                <td className="text-success">Rs {a.price}</td>
                <td>{a.type || '-'}</td>
                <td>{a.active ? 'Yes' : 'No'}</td>
                <td className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-light" onClick={() => startEdit(a)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(a._id)}>Delete</button>
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
              <h5 className="mb-0">{editId ? 'Edit Add-On' : 'Add Add-On'}</h5>
              <button className="btn btn-outline-light" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="mb-2">
              <label className="form-label">Name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Type</label>
              <input className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Price</label>
              <input className="form-control" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
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

export default AdminAddOns;
