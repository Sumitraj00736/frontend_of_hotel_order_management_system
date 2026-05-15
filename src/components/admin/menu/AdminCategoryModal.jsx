import React, { useState, useRef } from 'react';
import { uploadToCloudinary } from '../../../api/upload.js';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

const AdminCategoryModal = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImage = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    if (!name.trim()) return alert('Category name required');
    onSave({ name: name.trim(), imageUrl });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>{category ? 'Update Category' : 'Create New Category'}</h3>
            <p>Setup your menu structure by defining categories.</p>
          </div>
          <button className="close-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Category Name <span>*</span></label>
            <input 
              className="form-input"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Italian Pasta, Cold Beverages" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category Image</label>
            <div 
              className={`upload-zone ${uploading ? 'is-uploading' : ''} ${imageUrl ? 'has-image' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                hidden 
                accept="image/*" 
                onChange={(e) => handleImage(e.target.files?.[0])} 
              />
              
              {uploading ? (
                <div className="upload-content">
                  <Loader2 className="spinner" size={32} />
                  <p>Uploading to cloud...</p>
                </div>
              ) : imageUrl ? (
                <div className="image-preview-wrapper">
                  <img src={imageUrl} alt="preview" />
                  <div className="image-overlay">
                    <Upload size={20} />
                    <span>Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="upload-content">
                  <div className="icon-circle">
                    <Upload size={24} />
                  </div>
                  <p className="main-text">Click to upload or drag and drop</p>
                  <p className="sub-text">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={submit} disabled={uploading}>
            {category ? 'Update Changes' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryModal;