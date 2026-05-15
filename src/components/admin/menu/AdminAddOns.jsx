import React, { useMemo, useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';
import '../../../common/css/admin/menu/addons.css'
import { 
  MoreHorizontal, 
  SlidersHorizontal, 
  Plus, 
  RefreshCw, 
  Pencil, 
  Trash2, 
  Upload, 
  Loader2, 
  X,
  ChevronRight
} from 'lucide-react';
import SearchInput from '../../ui/SearchInput.jsx';
import IconButton from '../../ui/IconButton.jsx';

const AdminAddOns = ({ addOns, menus, onCreate, onUpdate, onDelete, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', price: '', imageUrl: '' });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  // Search Logic
  const filtered = useMemo(
    () => addOns.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())),
    [addOns, search]
  );

  // Calculate usage frequency from menus
  const usedMap = useMemo(() => {
    const map = new Map();
    (menus || []).forEach((menu) => {
      (menu.addOns || []).forEach((id) => {
        map.set(id, (map.get(id) || 0) + 1);
      });
    });
    return map;
  }, [menus]);

  // Statistics Calculation
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
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Misc';
    return { total, active, top, topType };
  }, [addOns, usedMap]);

  // Handlers
  const startAdd = () => { 
    setForm({ name: '', type: '', price: '', imageUrl: '' }); 
    setEditId(null); 
    setOpen(true); 
  };
  
  const startEdit = (row) => { 
    setForm({ name: row.name, type: row.type || '', price: row.price, imageUrl: row.imageUrl || '' }); 
    setEditId(row._id); 
    setOpen(true); 
  };

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
      {/* Header Section */}
      <div className="addons-header">
        <div className="header-info">
          <h2>Add-Ons & Extras</h2>
          <p className="breadcrumb">Dashboard <ChevronRight size={12} /> Menu <ChevronRight size={12} /> Add-Ons</p>
        </div>
        <div className="addons-actions">
          <SearchInput value={search} onChange={setSearch} className="addons-search" />
          <button className="btn-filter"><SlidersHorizontal size={16} /> Filter</button>
          <button className="btn-add" onClick={startAdd}>
            <Plus size={18} /> Add New <span className="btn-badge">N</span>
          </button>
          <IconButton onClick={onRefresh} title="Refresh"><RefreshCw size={18} /></IconButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="addons-stats-grid">
        <StatCard 
          label="Total Add-Ons" 
          mainVal={stats.total} 
          limit="/250" 
          subText={`${stats.active} Items Active`} 
          progress={(stats.active / stats.total) * 100} 
        />
        <StatCard 
          label="Most Popular" 
          mainVal={stats.top} 
          subText="Used across most dishes" 
          highlight 
        />
        <StatCard 
          label="Dominant Category" 
          mainVal={stats.topType} 
          subText="Highest variety type" 
          highlight 
        />
      </div>

      {/* Table Section */}
      <div className="addons-table-container">
        <table className="addons-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>SN</th>
              <th>Add-On Item</th>
              <th>Price</th>
              <th>Type</th>
              <th>Usage</th>
              <th>Available</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={a._id}>
                <td className="text-muted">{String(idx + 1).padStart(2, '0')}</td>
                <td>
                  <div className="addon-info-cell">
                    <div className="addon-avatar">
                      {a.imageUrl ? <img src={a.imageUrl} alt="" /> : a.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="addon-name">{a.name}</span>
                  </div>
                </td>
                <td className="price-text">Rs {a.price}</td>
                <td><span className="type-badge">{a.type || 'Standard'}</span></td>
                <td><span className="used-count">{usedMap.get(a._id) || 0} Dishes</span></td>
                <td>
                  <label className="ios-switch">
                    <input
                      type="checkbox"
                      checked={!!a.active}
                      onChange={() => onUpdate(a._id, { active: !a.active })}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td className="text-right">
                  <div className="action-wrapper">
                    <IconButton 
                      className={openMenuId === a._id ? 'dots-btn active' : 'dots-btn'} 
                      onClick={() => setOpenMenuId(openMenuId === a._id ? null : a._id)}
                    >
                      <MoreHorizontal size={18} />
                    </IconButton>

                    {openMenuId === a._id && (
                      <>
                        <div className="menu-backdrop" onClick={() => setOpenMenuId(null)} />
                        <div className="action-dropdown">
                          <button onClick={() => { setOpenMenuId(null); startEdit(a); }}>
                            <Pencil size={14} /> Edit Item
                          </button>
                          <div className="dropdown-divider" />
                          <button className="danger" onClick={() => { 
                             if(window.confirm("Delete this add-on?")) {
                               setOpenMenuId(null); 
                               onDelete(a._id); 
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
            <p>No add-ons found matching "{search}"</p>
          </div>
        )}
        <div className="table-footer">
          Showing {filtered.length} items out of {addOns.length}
        </div>
      </div>

      {/* Form Modal */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{editId ? 'Modify Add-On' : 'New Add-On'}</h3>
                <p>Set pricing and categories for your extras.</p>
              </div>
              <button className="close-btn" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input 
                    placeholder="e.g. Extra Cheese" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Price (NPR) *</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={form.price} 
                    onChange={(e) => setForm({ ...form, price: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Add-On Type</label>
                <input 
                  placeholder="e.g. Toppings, Sides" 
                  value={form.type} 
                  onChange={(e) => setForm({ ...form, type: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label>Display Image</label>
                <div className={`upload-box ${form.imageUrl ? 'has-image' : ''}`}>
                  {uploading ? (
                    <div className="upload-loading"><Loader2 className="spinner" /></div>
                  ) : form.imageUrl ? (
                    <div className="image-preview">
                      <img src={form.imageUrl} alt="" />
                      <label className="change-image-overlay">
                        <Upload size={16} /> 
                        <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <Upload size={24} />
                      <span>Upload Image</span>
                      <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={submit} disabled={uploading}>
                {editId ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Component for Stats
const StatCard = ({ label, mainVal, limit, subText, progress, highlight }) => (
  <div className="stat-card-modern">
    <div className="stat-top">
      <span className="stat-label">{label}</span>
      <div className={`stat-val-main ${highlight ? 'orange' : ''}`}>{mainVal}{limit}</div>
    </div>
    <div className="stat-bar-bg">
      <div className={`stat-bar-fill ${highlight ? 'orange' : ''}`} style={{ width: `${progress || 100}%` }}></div>
    </div>
    <div className="stat-bottom-text">{subText}</div>
  </div>
);

export default AdminAddOns;