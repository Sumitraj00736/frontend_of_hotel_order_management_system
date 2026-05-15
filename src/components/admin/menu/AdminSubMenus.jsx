import React, { useMemo, useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';
import { 
  MoreHorizontal, 
  SlidersHorizontal, 
  ListOrdered, 
  Info, 
  BookOpen, 
  Pencil, 
  Trash2, 
  Plus, 
  X, 
  Upload, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import SearchInput from '../../ui/SearchInput.jsx';
import IconButton from '../../ui/IconButton.jsx';
import '../../../common/css/admin/menu/submenus.css';

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
      if (!m.subMenu || !m.isAvailable) return;
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
    const avg = total ? Math.round(submenus.reduce((acc, s) => acc + (activeDishCount.get(s._id) || 0), 0) / total) : 0;
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
      {/*header*/}
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
      {/* Stats Section */}
      <div className="submenus-stats-grid">
        <StatCard 
          icon={<BookOpen size={20} />} 
          label="Total Categories" 
          value={`${stats.total}/20`} 
          pill={`${stats.active} Active`} 
          pillClass="green"
        />
        <StatCard 
          icon={<Info size={20} />} 
          label="Top Performing" 
          value={stats.top} 
          pill="1 Order" 
          pillClass="blue"
        />
        <StatCard 
          label="Avg Dishes" 
          value={stats.avg} 
          sub="Items per category"
        />
        <StatCard 
          label="Offline" 
          value={stats.unused} 
          sub="Unused submenus"
          isWarning={stats.unused > 0}
        />
      </div>

      {/* Table Section */}
      <div className="submenus-table-container">
        <table className="submenus-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>SN</th>
              <th>Sub Menu Name</th>
              <th>Active Dishes</th>
              <th>Used In</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={s._id}>
                <td className="text-muted">{String(idx + 1).padStart(2, '0')}</td>
                <td>
                  <div className="submenu-info-cell">
                    <div className="submenu-avatar">
                      {s.imageUrl ? <img src={s.imageUrl} alt="" /> : s.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="submenu-name-wrapper">
                      <span className="submenu-name">{s.name}</span>
                      <span className="submenu-tag">Category</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="dish-count-badge">
                    {activeDishCount.get(s._id) || 0} Items
                  </div>
                </td>
                <td className="text-muted">{usedInCount.get(s._id) || 0} Menu Sets</td>
                <td>
                  <label className="ios-switch">
                    <input
                      type="checkbox"
                      checked={!!s.active}
                      onChange={() => onUpdate(s._id, { active: !s.active })}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td className="text-right">
                  <div className="action-wrapper">
                    <IconButton 
                      className={openMenuId === s._id ? 'active-dots' : ''} 
                      onClick={() => setOpenMenuId(openMenuId === s._id ? null : s._id)}
                    >
                      <MoreHorizontal size={18} />
                    </IconButton>

                    {openMenuId === s._id && (
                      <>
                        <div className="menu-backdrop" onClick={() => setOpenMenuId(null)} />
                        <div className="action-dropdown animate-pop-in">
                          <button onClick={() => { setOpenMenuId(null); startEdit(s); }}>
                            <Pencil size={14} /> Edit Category
                          </button>
                          <div className="dropdown-divider" />
                          <button className="danger" onClick={() => { 
                            if(window.confirm("Delete category?")) {
                              setOpenMenuId(null); 
                              onDelete(s._id); 
                            }
                          }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No sub-menus found matching your search.</p>
          </div>
        )}

        <div className="table-footer">
          Showing <strong>{filtered.length}</strong> categories
        </div>
      </div>

      {/* Modern Modal */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{editId ? 'Update Category' : 'New Sub-Menu'}</h3>
                <p>Organize your dishes into reachable categories.</p>
              </div>
              <button className="close-btn" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  placeholder="e.g. Italian Starters" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label>Display Image</label>
                <div className={`upload-zone ${form.imageUrl ? 'has-image' : ''}`}>
                  {uploading ? (
                    <div className="upload-loading"><Loader2 className="spinner" /></div>
                  ) : form.imageUrl ? (
                    <div className="image-preview">
                      <img src={form.imageUrl} alt="" />
                      <label className="change-overlay">
                        <Upload size={16} /> 
                        <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <Upload size={24} />
                      <span>Click to upload icon</span>
                      <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={submit} disabled={uploading}>
                {editId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, pill, pillClass, sub, isWarning }) => (
  <div className={`modern-stat-card ${isWarning ? 'warning' : ''}`}>
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      {pill && <span className={`stat-pill ${pillClass}`}>{pill}</span>}
    </div>
    <div className="stat-value-row">
      <span className="stat-main-val">{value}</span>
      {icon && <span className="stat-icon-bg">{icon}</span>}
    </div>
    {sub && <div className="stat-subtext">{sub}</div>}
  </div>
);

export default AdminSubMenus;