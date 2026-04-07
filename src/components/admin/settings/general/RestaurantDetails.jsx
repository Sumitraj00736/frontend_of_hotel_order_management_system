import React, { useEffect, useState } from 'react';
import { uploadToCloudinary } from '../../../../api/upload.js';

const typeOptions = ['FastFood', 'Resort', 'Hotel', 'Bakery', 'Cloud Kitchen', 'Bar', 'Cafe', 'Restaurant'];

const RestaurantDetails = ({ value, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subdomain: '',
    country: 'Nepal',
    currency: 'NPR',
    address: '',
    priceField: 'NPR',
    openingDate: '',
    types: [],
    profileImageUrl: '',
    social: {
      facebook: '',
      instagram: '',
      tiktok: '',
      googleReview: ''
    }
  });

  useEffect(() => {
    if (!value) return;
    setForm((prev) => ({
      ...prev,
      ...value,
      social: { ...prev.social, ...(value.social || {}) },
      openingDate: value.openingDate ? value.openingDate.slice(0, 10) : prev.openingDate
    }));
  }, [value]);

  const toggleType = (item) => {
    setForm((prev) => {
      const exists = prev.types.includes(item);
      const nextTypes = exists ? prev.types.filter((t) => t !== item) : [...prev.types, item];
      return { ...prev, types: nextTypes };
    });
  };

  const handleSave = () => {
    onSave?.({
      ...form,
      openingDate: form.openingDate || undefined
    });
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const url = await uploadToCloudinary(file);
    setForm((prev) => ({ ...prev, profileImageUrl: url }));
  };

  return (
    <div className="settings-page">
      <div className="settings-title">Restaurant Details</div>

      <div className="settings-card">
        <div className="settings-card-title">Restaurant Basic Details</div>
        <div className="settings-grid">
          <div className="profile-card">
            <div className="profile-image">
              {form.profileImageUrl ? (
                <img src={form.profileImageUrl} alt="restaurant" />
              ) : (
                <span>{form.name ? form.name.slice(0, 2).toUpperCase() : 'RS'}</span>
              )}
            </div>
            <div>
              <div className="profile-label">Profile Image</div>
              <div className="profile-sub">Upload new image to change your restaurant profile.</div>
              <div className="profile-actions">
                <label className="btn btn-primary">
                  Upload
                  <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files?.[0])} />
                </label>
                <button className="btn btn-ghost" onClick={() => setForm((prev) => ({ ...prev, profileImageUrl: '' }))}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="field-label">Restaurant Name *</label>
            <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Restaurant Number *</label>
            <input className="field-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Sub Domain *</label>
            <div className="field-inline">
              <input className="field-input" value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value })} />
              <span className="field-suffix">.restro.link</span>
            </div>
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Country *</label>
            <input className="field-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Price Field *</label>
            <input className="field-input" value={form.priceField} onChange={(e) => setForm({ ...form, priceField: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Address *</label>
            <input className="field-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Opening Date *</label>
            <input type="date" className="field-input" value={form.openingDate} onChange={(e) => setForm({ ...form, openingDate: e.target.value })} />
          </div>
        </div>

        <div className="type-row">
          <div className="field-label">Type</div>
          <div className="type-chips">
            {typeOptions.map((item) => (
              <button
                key={item}
                className={`type-chip ${form.types.includes(item) ? 'active' : ''}`}
                onClick={() => toggleType(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Social Profile</div>
        <div className="settings-grid two">
          <div>
            <label className="field-label">Facebook Link</label>
            <input
              className="field-input"
              value={form.social.facebook}
              onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })}
            />
          </div>
          <div>
            <label className="field-label">Instagram</label>
            <input
              className="field-input"
              value={form.social.instagram}
              onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })}
            />
          </div>
          <div>
            <label className="field-label">Tiktok</label>
            <input
              className="field-input"
              value={form.social.tiktok}
              onChange={(e) => setForm({ ...form, social: { ...form.social, tiktok: e.target.value } })}
            />
          </div>
          <div>
            <label className="field-label">Google Review Link</label>
            <input
              className="field-input"
              value={form.social.googleReview}
              onChange={(e) => setForm({ ...form, social: { ...form.social, googleReview: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <div className="settings-card danger">
        <div className="settings-card-title">Dangerous Area</div>
        <div className="danger-actions">
          <button className="danger-card">Reset Restaurant</button>
          <button className="danger-card">Transfer Ownership</button>
          <button className="danger-card danger">Delete Restaurant</button>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-ghost" onClick={() => setForm(value || form)}>Reset</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default RestaurantDetails;
