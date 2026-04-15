import React, { useMemo, useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';

const createVariantRow = (variant = {}) => ({
  type: variant.type || 'Other',
  name: variant.name || '',
  actualPrice: variant.actualPrice ?? variant.price ?? '',
  discount: variant.discount ?? ''
});

const getDefaultForm = () => ({
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
  variants: [createVariantRow()],
  addOns: [],
  description: ''
});

const getInitialForm = (dish) => {
  if (!dish) return getDefaultForm();
  const variants = dish.variants?.length ? dish.variants.map((variant) => createVariantRow(variant)) : [createVariantRow()];
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
    variants,
    addOns: dish.addOns || [],
    description: dish.description || ''
  };
};

const AdminDishForm = ({ mode, dish, categories, submenus, addOns, onCancel, onSave }) => {
  const [form, setForm] = useState(() => getInitialForm(dish));
  const [uploading, setUploading] = useState(false);
  const [addOnPanelOpen, setAddOnPanelOpen] = useState(false);
  const [addOnSearch, setAddOnSearch] = useState('');

  const computedPrice = useMemo(() => {
    const fallbackPrice = Number(form.price) || 0;
    const fallbackDiscount = Number(form.discount) || 0;
    const activeVariants = (form.variants || [])
      .map((variant) => {
        const actual = Number(variant.actualPrice) || 0;
        const discount = Number(variant.discount) || 0;
        const listed = Math.max(actual - discount, 0);
        return { ...variant, listed };
      })
      .filter((variant) => variant.name || variant.actualPrice || variant.discount);

    if (!activeVariants.length) {
      const listed = Math.max(fallbackPrice - fallbackDiscount, 0);
      return { listed, cogs: 0, profit: listed, minPrice: listed, maxPrice: listed };
    }

    const prices = activeVariants.map((variant) => variant.listed);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return {
      listed: minPrice,
      cogs: 0,
      profit: minPrice,
      minPrice,
      maxPrice
    };
  }, [form.price, form.discount, form.variants]);

  const filteredAddOns = useMemo(() => {
    const query = addOnSearch.trim().toLowerCase();
    if (!query) return addOns;
    return addOns.filter((addOn) => (addOn.name || '').toLowerCase().includes(query));
  }, [addOns, addOnSearch]);

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
      return { ...prev, addOns: exists ? prev.addOns.filter((value) => value !== id) : [...prev.addOns, id] };
    });
  };

  const updateVariant = (index, patch) => {
    setForm((prev) => {
      const next = [...prev.variants];
      next[index] = { ...next[index], ...patch };
      return { ...prev, variants: next };
    });
  };

  const addVariant = () => {
    setForm((prev) => ({ ...prev, variants: [...prev.variants, createVariantRow({ type: prev.type || 'Other' })] }));
  };

  const removeVariant = (index) => {
    setForm((prev) => {
      const next = prev.variants.filter((_, idx) => idx !== index);
      return { ...prev, variants: next.length ? next : [createVariantRow({ type: prev.type || 'Other' })] };
    });
  };

  const buildPayload = () => {
    if (!form.name.trim()) throw new Error('Dish name required');
    if (!form.category) throw new Error('Category required');
    if (!form.subMenu) throw new Error('Sub menu required');

    const prepMinutes = (Number(form.preparationHours) || 0) * 60 + (Number(form.preparationMinutes) || 0);
    const variants = (form.variants || [])
      .filter((variant) => variant.name && variant.actualPrice !== '')
      .map((variant) => {
        const actualPrice = Number(variant.actualPrice) || 0;
        const discount = Number(variant.discount) || 0;
        return {
          type: variant.type || 'Other',
          name: variant.name.trim(),
          actualPrice,
          discount,
          price: Math.max(actualPrice - discount, 0)
        };
      });

    const hasVariants = variants.length > 0;
    const fallbackActual = Number(form.price) || 0;
    const fallbackDiscount = Number(form.discount) || 0;
    const fallbackListed = Math.max(fallbackActual - fallbackDiscount, 0);
    const variantPrices = variants.map((variant) => variant.price);
    const price = hasVariants ? Math.min(...variantPrices) : fallbackListed;
    const maxPrice = hasVariants ? Math.max(...variantPrices) : undefined;

    return {
      name: form.name.trim(),
      type: form.type || 'Other',
      hsCode: form.hsCode || undefined,
      imageUrl: form.imageUrl || undefined,
      preparationTimeMinutes: prepMinutes || 0,
      category: form.category,
      subMenu: form.subMenu,
      price,
      maxPrice: maxPrice && maxPrice > price ? maxPrice : undefined,
      variants,
      addOns: form.addOns,
      description: form.description || undefined
    };
  };

  const handleSubmit = async (shouldReset = false) => {
    try {
      const payload = buildPayload();
      await onSave(payload);
      if (shouldReset) {
        setForm(getDefaultForm());
      }
    } catch (error) {
      alert(error.message || 'Unable to save dish');
    }
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
                {submenus.map((subMenu) => (
                  <option key={subMenu._id} value={subMenu._id}>{subMenu.name}</option>
                ))}
              </select>
            </div>
            <div className="form-field grow">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">Default Price</div>
            <div className="variant-stack">
              {form.variants.map((variant, index) => {
                const actualPrice = Number(variant.actualPrice) || 0;
                const discount = Number(variant.discount) || 0;
                const listed = Math.max(actualPrice - discount, 0);
                return (
                  <div key={`${index}-${variant.name}`} className="variant-card">
                    <div className="variant-card-grid">
                      <div className="variant-drag">⋮⋮</div>
                      <button className="variant-delete" onClick={() => removeVariant(index)} type="button">🗑</button>
                      <div className="form-field">
                        <label>Type</label>
                        <select value={variant.type} onChange={(e) => updateVariant(index, { type: e.target.value })}>
                          <option value="Other">Other</option>
                          <option value="Veg">Veg</option>
                          <option value="Non-Veg">Non-Veg</option>
                          <option value="Vegan">Vegan</option>
                        </select>
                      </div>
                      <div className="form-field grow">
                        <label>Variant Name *</label>
                        <input
                          type="text"
                          placeholder="Enter Variant Name"
                          value={variant.name}
                          onChange={(e) => updateVariant(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Actual Price *</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Rs 0"
                          value={variant.actualPrice}
                          onChange={(e) => updateVariant(index, { actualPrice: e.target.value })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Discount</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Rs 0"
                          value={variant.discount}
                          onChange={(e) => updateVariant(index, { discount: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="price-meta">
                      <span>Listed Price: Rs {listed.toFixed(2)}</span>
                      <span>COGS: Rs 0.00</span>
                      <span className="profit">Gross Profit: Rs {listed.toFixed(2)}</span>
                      <span className="stock-link">Setup stock consumption</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="dish-price-summary">
              <span>
                Range: Rs {computedPrice.minPrice.toFixed(2)}
                {computedPrice.maxPrice > computedPrice.minPrice ? ` - Rs ${computedPrice.maxPrice.toFixed(2)}` : ''}
              </span>
            </div>
            <button className="btn-outline" onClick={addVariant} type="button">
              + Add Variant
            </button>
          </div>

          <div className="form-card">
            <div className="form-card-title">Add-Ons / Extras</div>
            <button className="addon-banner clickable" type="button" onClick={() => setAddOnPanelOpen(true)}>
              <div className="badge">New</div>
              <div>
                <div className="banner-title">Add-Ons!! Click Here</div>
                <div className="banner-sub">Provide your customers with the option to add-ons and make their next meal super delicious!</div>
              </div>
            </button>
            <div className="addon-grid">
              {form.addOns.length > 0
                ? form.addOns.map((selectedId) => {
                    const selectedAddOn = addOns.find((addOn) => addOn._id === selectedId);
                    if (!selectedAddOn) return null;
                    return (
                      <span key={selectedId} className="addon-chip active">
                        {selectedAddOn.name}
                      </span>
                    );
                  })
                : <div className="empty-note">No add-ons selected yet.</div>}
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-title">Description</div>
            <textarea className="desc-area" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" />
          </div>

          <div className="form-actions">
            <button className="btn-light" onClick={onCancel}>Reset</button>
            <button className="btn-primary" onClick={() => handleSubmit(false)}>Save Dish</button>
            <button className="btn-primary ghost" onClick={() => handleSubmit(true)}>Save and Create Another</button>
          </div>
        </div>
      </div>

      {addOnPanelOpen && (
        <div className="addon-side-overlay" onClick={() => setAddOnPanelOpen(false)}>
          <aside className="addon-side-panel" onClick={(event) => event.stopPropagation()}>
            <div className="addon-side-header">
              <h3>Selected Add-Ons</h3>
              <button className="side-close" onClick={() => setAddOnPanelOpen(false)}>✕</button>
            </div>
            <div className="addon-side-search">
              <input
                type="text"
                placeholder="Search"
                value={addOnSearch}
                onChange={(event) => setAddOnSearch(event.target.value)}
              />
            </div>
            <div className="addon-side-list">
              {filteredAddOns.map((addOn) => {
                const checked = form.addOns.includes(addOn._id);
                return (
                  <label key={addOn._id} className={`addon-side-item ${checked ? 'selected' : ''}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleAddOn(addOn._id)} />
                    <div className="addon-side-image">
                      {addOn.imageUrl ? <img src={addOn.imageUrl} alt={addOn.name} /> : addOn.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="addon-side-body">
                      <div className="addon-side-name">{addOn.name}</div>
                      <div className="addon-side-used">Used in: {addOn.usedIn || 0} dishes</div>
                    </div>
                    <div className="addon-side-price">Rs {Number(addOn.price || 0)}</div>
                  </label>
                );
              })}
              {filteredAddOns.length === 0 && <div className="empty-note">No add-ons found.</div>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminDishForm;
