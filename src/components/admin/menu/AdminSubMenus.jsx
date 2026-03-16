import React, { useMemo, useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';
import '../../../common/css/admin/menu/submenus.css';
import { MoreHorizontal, SlidersHorizontal, ListOrdered, Info, BookOpen } from 'lucide-react';
import SearchInput from '../../ui/SearchInput.jsx';
import IconButton from '../../ui/IconButton.jsx';

const AdminSubMenus = ({ submenus, menus, combos, onCreate, onUpdate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = useMemo(
    () => submenus.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [submenus, search]
  );

  const activeDishCount = useMemo(() => {
    const map = new Map();
    (menus || []).forEach((m) => {
      if (!m.subMenu) return;
      if (!m.isAvailable) return;
      map.set(m.subMenu, (map.get(m.subMenu) || 0) + 1);
    });
    return map;
  }, [menus]);

  const usedInCount = useMemo(() => {
    const map = new Map();
    (combos || []).forEach((c) => {
      if (!c.subMenu) return;
      map.set(c.subMenu, (map.get(c.subMenu) || 0) + 1);
    });
    return map;
  }, [combos]);

  const stats = useMemo(() => {
    const total = submenus.length;
    const active = submenus.filter((s) => s.active).length;
    const top = submenus[0]?.name || '-';
    const avg = total
      ? Math.round(
          submenus.reduce((acc, s) => acc + (activeDishCount.get(s._id) || 0), 0) / total
        )
      : 0;
    const unused = submenus.filter((s) => !s.active).length;
    return { total, active, top, avg, unused };
  }, [submenus, activeDishCount]);

  const startAdd = () => { setForm({ name: '', imageUrl: '' }); setEditId(null); setOpen(true); };
  const startEdit = (row) => { setForm({ name: row.name, imageUrl: row.imageUrl || '' }); setEditId(row._id); setOpen(true); };

  const submit = async () => {
    if (!form.name.trim()) return alert('Name required');
    if (editId) await onUpdate(editId, form); else await onCreate(form);
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
    <div className="submenus-page">
      <div className="submenus-header">
        <h2>Sub Menu</h2>
        <div className="submenus-actions">
          <SearchInput value={search} onChange={setSearch} className="submenus-search" />
          <button className="btn-filter"><SlidersHorizontal size={16} /> Filter</button>
          <button className="btn-arrange"><ListOrdered size={16} /> Arrange</button>
          <button className="btn-add" onClick={startAdd}>+ Add New <span className="btn-badge">N</span></button>
          <IconButton><MoreHorizontal size={18} /></IconButton>
        </div>
      </div>

      <div className="submenus-stats">
        <div className="stat-card">
          <div className="stat-title"><span className="stat-icon">📄</span> Total <span className="stat-pill green">{stats.active} Active</span> <span className="stat-info"><Info size={14} /></span></div>
          <div className="stat-value">{stats.total}/20</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><span className="stat-icon orange">★</span> Top Sold <span className="stat-pill blue">1 orders</span></div>
          <div className="stat-value">{stats.top}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><span className="stat-icon purple">♨</span> Avg. Dishes Per Sub Menu</div>
          <div className="stat-value">{stats.avg}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><span className="stat-icon red">⛔</span> Unused Sub Menu</div>
          <div className="stat-value">{stats.unused}</div>
        </div>
      </div>

      <div className="submenus-table">
        <div className="table-head">
          <div>SN</div>
          <div>Sub Menu name</div>
          <div>Active Dishes</div>
          <div>Used In</div>
          <div>Status</div>
          <div />
        </div>
        {filtered.map((s, idx) => (
          <div key={s._id} className="table-row">
            <div>{idx + 1}</div>
            <div className="table-name">
              <div className="submenu-avatar">{s.name.slice(0, 2).toUpperCase()}</div>
              <div className="submenu-name">
                <span className="submenu-icon"><BookOpen size={16} /></span>
                {s.name}
              </div>
            </div>
            <div>{activeDishCount.get(s._id) || 0} Dishes</div>
            <div>{usedInCount.get(s._id) || 0} Menu Sets</div>
            <div>
              <label className="switch-lite">
                <input
                  type="checkbox"
                  checked={!!s.active}
                  onChange={() => onUpdate(s._id, { active: !s.active })}
                />
                <span />
              </label>
            </div>
            <div className="table-actions">
              <IconButton className="dots-btn" onClick={() => setOpenMenuId(openMenuId === s._id ? null : s._id)}>
                <MoreHorizontal size={18} />
              </IconButton>
              {openMenuId === s._id && (
                <div className="action-dropdown">
                  <button onClick={() => { setOpenMenuId(null); startEdit(s); }}>Edit</button>
                  <button className="danger" onClick={() => { setOpenMenuId(null); onDelete(s._id); }}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-note">No sub menus found.</div>}
      </div>

      <div className="table-footer">0 of {filtered.length} row(s) selected.</div>

      {open && (
        <div className="modal-overlay submenus-modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel submenus-modal animate-in" onClick={(e) => e.stopPropagation()}>
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

export default AdminSubMenus;
