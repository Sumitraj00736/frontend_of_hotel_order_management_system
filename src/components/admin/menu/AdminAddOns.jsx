import React, { useMemo, useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';
import '../../../common/css/admin/menu/addons.css';
import { MoreHorizontal, SlidersHorizontal, Info } from 'lucide-react';
import SearchInput from '../../ui/SearchInput.jsx';
import IconButton from '../../ui/IconButton.jsx';

const AdminAddOns = ({ addOns, menus, onCreate, onUpdate, onDelete, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', price: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const blurOnWheel = (e) => {
    // Prevent accidental number changes while scrolling.
    e.currentTarget.blur();
  };

  const filtered = useMemo(
    () => addOns.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())),
    [addOns, search]
  );

  const usedMap = useMemo(() => {
    const map = new Map();
    (menus || []).forEach((menu) => {
      (menu.addOns || []).forEach((id) => {
        map.set(id, (map.get(id) || 0) + 1);
      });
    });
    return map;
  }, [menus]);

  const stats = useMemo(() => {
    const total = addOns.length;
    const active = addOns.filter((a) => a.active).length;
    const topEntry = [...usedMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const top = topEntry ? addOns.find((a) => a._id === topEntry[0])?.name || '-' : '-';
    const typeCounts = addOns.reduce((acc, a) => {
      const key = a.type || 'Uncategorized';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Uncategorized';
    return { total, active, top, topType };
  }, [addOns]);

  const startAdd = () => { setForm({ name: '', type: '', price: '', imageUrl: '' }); setEditId(null); setOpen(true); };
  const startEdit = (row) => { setForm({ name: row.name, type: row.type || '', price: row.price, imageUrl: row.imageUrl || '' }); setEditId(row._id); setOpen(true); };

  const submit = async () => {
    if (!form.name.trim()) return alert('Name required');
    const payload = { ...form, price: Number(form.price) || 0 };
    if (editId) await onUpdate(editId, payload); else await onCreate(payload);
    setOpen(false);
  };

  const handleImage = async (file) => {
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="addons-page">
      <div className="addons-header">
        <h2>Add-Ons & Extras</h2>
        <div className="addons-actions">
          <SearchInput value={search} onChange={setSearch} className="addons-search" />
          <button className="btn-filter"><SlidersHorizontal size={16} /> Filter</button>
          <button className="btn-add" onClick={startAdd}>+ Add New <span className="btn-badge">N</span></button>
          <IconButton onClick={onRefresh}><MoreHorizontal size={18} /></IconButton>
        </div>
      </div>

      <div className="addons-stats">
        <div className="stat-card">
          <div className="stat-title"> Total <span className="stat-pill green">{stats.active} Active</span> <span className="stat-info"><Info size={14} /></span></div>
          <div className="stat-value">{stats.total}/250</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"> Most Used <span className="stat-pill blue">1 dishes</span></div>
          <div className="stat-value">{stats.top}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"> Top Add-Ons Type <span className="stat-pill blue">5</span> <span className="stat-info"><Info size={14} /></span></div>
          <div className="stat-value">{stats.topType}</div>
        </div>
      </div>

      <div className="addons-table">
        <div className="table-head">
          <div>SN</div>
          <div>Add-On Name</div>
          <div>Price</div>
          <div>Type</div>
          <div>Used In</div>
          <div>Available</div>
          <div />
        </div>
        {filtered.map((a, idx) => (
          <div key={a._id} className="table-row">
            <div>{idx + 1}</div>
            <div className="table-name">
              <div className="addon-avatar">{a.name.slice(0, 2).toUpperCase()}</div>
              <div>{a.name}</div>
            </div>
            <div className="price">Rs {a.price}</div>
            <div>{a.type || '-'}</div>
            <div>{usedMap.get(a._id) || 0} Dishes</div>
            <div>
              <label className="switch-lite">
                <input
                  type="checkbox"
                  checked={!!a.active}
                  onChange={() => onUpdate(a._id, { active: !a.active })}
                />
                <span />
              </label>
            </div>
            <div className="table-actions">
              <IconButton className="dots-btn" onClick={() => setOpenMenuId(openMenuId === a._id ? null : a._id)}>
                <MoreHorizontal size={18} />
              </IconButton>
              {openMenuId === a._id && (
                <div className="action-dropdown">
                  <button onClick={() => { setOpenMenuId(null); startEdit(a); }}>Edit</button>
                  <button className="danger" onClick={() => { setOpenMenuId(null); onDelete(a._id); }}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-note">No add-ons found.</div>}
      </div>

      <div className="table-footer">0 of {filtered.length} row(s) selected.</div>

      {open && (
        <div className="modal-overlay addons-modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel addons-modal animate-in" onClick={(e) => e.stopPropagation()}>
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
              <input
                className="form-control"
                type="number"
                value={form.price}
                onWheel={blurOnWheel}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Image URL</label>
              <div className="d-flex gap-2 align-items-center">
                <label className="btn btn-outline-light mb-0">
                  {uploading ? 'Uploading...' : form.imageUrl ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
                  />
                </label>
                {form.imageUrl && <img src={form.imageUrl} alt="preview" style={{ height: 46, borderRadius: 8 }} />}
              </div>
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
