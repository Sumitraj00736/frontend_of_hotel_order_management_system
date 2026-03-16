import React, { useMemo, useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';

const defaultForm = {
  type: '',
  name: '',
  hsCode: '',
  imageUrl: '',
  preparationHours: '',
  preparationMinutes: '',
  subMenu: '',
  category: '',
  price: '',
  discount: '',
  addOns: [],
  description: ''
};

const AdminDishForm = ({ mode, dish, categories, submenus, addOns, onCancel, onSave }) => {
  const [form, setForm] = useState(() => {
    if (!dish) return defaultForm;
    return {
      type: dish.type || '',
      name: dish.name || '',
      hsCode: dish.hsCode || '',
      imageUrl: dish.imageUrl || '',
      preparationHours: dish.preparationTimeMinutes ? Math.floor(dish.preparationTimeMinutes / 60) : '',
      preparationMinutes: dish.preparationTimeMinutes ? dish.preparationTimeMinutes % 60 : '',
      subMenu: dish.subMenu || '',
      category: dish.category || '',
      price: dish.price ?? '',
      discount: '',
      addOns: dish.addOns || [],
      description: dish.description || ''
    };
  });
  const [uploading, setUploading] = useState(false);

  const computedPrice = useMemo(() => {
    const price = Number(form.price) || 0;
    const discount = Number(form.discount) || 0;
    const listed = Math.max(price - discount, 0);
    return { listed, cogs: 0, profit: listed };
  }, [form.price, form.discount]);

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

  const toggleAddOn = (id) => {
    setForm((prev) => {
      const exists = prev.addOns.includes(id);
      return { ...prev, addOns: exists ? prev.addOns.filter((a) => a !== id) : [...prev.addOns, id] };
    });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return alert('Dish name required');
    if (!form.category) return alert('Category required');
    if (!form.subMenu) return alert('Sub menu required');
    const prepMinutes =
      (Number(form.preparationHours) || 0) * 60 + (Number(form.preparationMinutes) || 0);
    const payload = {
      name: form.name.trim(),
      type: form.type || 'Other',
      hsCode: form.hsCode || undefined,
      imageUrl: form.imageUrl || undefined,
      preparationTimeMinutes: prepMinutes || 0,
      category: form.category,
      subMenu: form.subMenu,
      price: Number(form.price) || 0,
      addOns: form.addOns,
      description: form.description || undefined
    };
    onSave(payload);
  };

  return (
    <div className="dish-form">
      <div className="dish-form-header">
        <button className="back-btn" onClick={onCancel}>←</button>
        <div>
          <div className="title">{mode === 'edit' ? 'Edit Dish' : 'Create Dish'}</div>
        </div>
      </div>

      <div className="dish-form-grid">
        <div className="dish-form-main">
          <div className="form-row">
            <div className="form-field">
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="">Select dish type</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Vegan">Vegan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field grow">
              <label>Dish Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter Dish Name" />
            </div>
            <div className="form-field">
              <label>HS Code</label>
              <input value={form.hsCode} onChange={(e) => setForm({ ...form, hsCode: e.target.value })} placeholder="Enter HS Code eg. 121.1" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field grow">
              <label>Dish Photo</label>
              <div className="upload-line">
                <label className="upload-btn">
                  {uploading ? 'Uploading...' : 'Click here to upload your platform image'}
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
                </label>
                {form.imageUrl && <img className="photo-preview" src={form.imageUrl} alt="preview" />}
              </div>
            </div>
            <div className="form-field">
              <label>Preparation Time</label>
              <div className="prep-time">
                <input type="number" value={form.preparationHours} onChange={(e) => setForm({ ...form, preparationHours: e.target.value })} placeholder="0 hrs" />
                <span>:</span>
                <input type="number" value={form.preparationMinutes} onChange={(e) => setForm({ ...form, preparationMinutes: e.target.value })} placeholder="0 min" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field grow">
              <label>Sub-Menu *</label>
              <select value={form.subMenu} onChange={(e) => setForm({ ...form, subMenu: e.target.value })}>
                <option value="">Select Sub-Menu</option>
                {submenus.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-field grow">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">Default Price</div>
            <div className="form-row">
              <div className="form-field grow">
                <label>Actual Price *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Rs 0" />
              </div>
              <div className="form-field grow">
                <label>Discount</label>
                <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="Rs 0" />
              </div>
              <button className="btn-outline">+ Add Variant</button>
            </div>
            <div className="price-meta">
              <span>Listed Price: Rs {computedPrice.listed.toFixed(2)}</span>
              <span>COGS: Rs {computedPrice.cogs.toFixed(2)}</span>
              <span className="profit">Gross Profit: Rs {computedPrice.profit.toFixed(2)}</span>
              <span className="stock-link">Setup stock consumption</span>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">Add-Ons / Extras</div>
            <div className="addon-banner">
              <div className="badge">New</div>
              <div>
                <div className="banner-title">Add-Ons!! Click Here</div>
                <div className="banner-sub">Provide your customers with the option to add-ons and make their next meal super delicious!</div>
              </div>
            </div>
            <div className="addon-grid">
              {addOns.map((a) => (
                <label key={a._id} className={`addon-chip ${form.addOns.includes(a._id) ? 'active' : ''}`}>
                  <input type="checkbox" checked={form.addOns.includes(a._id)} onChange={() => toggleAddOn(a._id)} />
                  {a.name}
                </label>
              ))}
              {addOns.length === 0 && <div className="empty-note">No add-ons yet.</div>}
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">Description</div>
            <textarea className="desc-area" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" />
          </div>

          <div className="form-actions">
            <button className="btn-light" onClick={onCancel}>Reset</button>
            <button className="btn-primary" onClick={handleSubmit}>Save Dish</button>
            <button className="btn-primary ghost" onClick={handleSubmit}>Save and Create Another</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDishForm;
