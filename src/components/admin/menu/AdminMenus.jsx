import React, { useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';

const AdminMenus = ({ menus, categories = [], menuForm, setMenuForm, onCreateMenu, onEditMenu }) => {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImage = async (file) => {
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setMenuForm({ ...menuForm, imageUrl: url });
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card glass-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Menus</h5>
        <span className="text-muted small">Add image to highlight items</span>
      </div>
      <div className="row g-2 mb-3">
        <div className="col-4">
          <input className="form-control" placeholder="Name" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} />
        </div>
        <div className="col-3">
          <select 
            className="form-select" 
            value={menuForm.category} 
            onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-2">
          <input className="form-control" type="number" placeholder="Price" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
        </div>
        <div className="col-3 d-flex gap-2">
          <label className="btn btn-outline-light w-100 mb-0">
            {uploading ? 'Uploading...' : menuForm.imageUrl ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              className="d-none"
              onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
            />
          </label>
        </div>
        <div className="col-12 d-flex justify-content-between align-items-center">
          {menuForm.imageUrl && <img src={menuForm.imageUrl} alt="preview" style={{ height: 60, borderRadius: 8 }} />}
          <button
            className="btn btn-primary"
            disabled={uploading || saving}
            onClick={async () => {
              if (saving || uploading) return;
              if (!menuForm.name || !menuForm.category || !menuForm.price) {
                alert('Please fill name, category and price');
                return;
              }
              setSaving(true);
              try {
                await onCreateMenu();
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? 'Saving...' : 'Add Menu'}
          </button>
        </div>
      </div>

      <div className="content grid-3">
        {menus.map((menu) => {
          const catName = menu.category?.name || menu.category || 'Uncategorized';
          return (
            <div key={menu._id} className="card glass-card">
              {menu.imageUrl && (
                <img
                  src={menu.imageUrl}
                  alt={menu.name}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }}
                />
              )}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{menu.name}</div>
                  <div className="text-muted small">{catName}</div>
                </div>
                <div className="fw-bold">NPR {menu.price}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className={`badge ${menu.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                  {menu.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                <button className="btn btn-sm btn-outline-light" onClick={() => onEditMenu(menu)}>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminMenus;
