import React, { useState } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';

const AdminCategoryModal = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleImage = async (file) => {
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    if (!name.trim()) return alert('Category name required');
    onSave({ name: name.trim(), imageUrl });
  };

  return (
    <div className="category-modal-overlay" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>{category ? 'Edit Category' : 'Add Category'}</h3>
        <div className="form-group">
          <label>Category Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" />
        </div>
        <div className="form-group">
          <label>Category Image</label>
          <label className="upload-field">
            {uploading ? 'Uploading...' : 'Click here to upload your platform image'}
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
          </label>
          {imageUrl && <img className="preview" src={imageUrl} alt="preview" />}
        </div>
        <div className="modal-actions">
          <button className="btn-light" onClick={onClose}>Reset</button>
          <button className="btn-primary" onClick={submit}>Save Category</button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryModal;
