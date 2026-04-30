import React, { useState, useEffect } from 'react';
import { Plus, Building2, MapPin, Globe, CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import api from '../../../../api/client.js';
import { getBranches, setBranches } from '../../../../api/session.js';

const BranchManagement = () => {
  const [branches, setBranchesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    timezone: 'Asia/Kathmandu'
  });

  const loadBranches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/branches');
      setBranchesList(res.data);
      // Update session branches as well
      setBranches(res.data);
    } catch (err) {
      console.error('Failed to load branches:', err);
      setError('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/api/branches', formData);
      setSuccess('Branch created successfully!');
      setShowAddModal(false);
      setFormData({ name: '', address: '', timezone: 'Asia/Kathmandu' });
      loadBranches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create branch');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="branch-management-container">
      <div className="settings-header">
        <div className="header-content">
          <h2 className="settings-title">Branch Management</h2>
          <p className="settings-subtitle">Manage multiple locations of your restaurant</p>
        </div>
        <button 
          className="btn-primary-sleek" 
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} />
          <span>Add New Branch</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex-center p-5">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="branches-grid">
          {branches.map((branch) => (
            <div key={branch._id} className="branch-card-sleek">
              <div className="branch-card-header">
                <div className="branch-icon-wrapper">
                  <Building2 size={20} />
                </div>
                <div className="branch-info">
                  <h3 className="branch-name">{branch.name}</h3>
                  <span className="branch-code">{branch.code}</span>
                </div>
                {branch.active && <span className="status-badge-active">Active</span>}
              </div>
              <div className="branch-card-body">
                <div className="info-item">
                  <MapPin size={16} className="text-muted" />
                  <span>{branch.address || 'No address provided'}</span>
                </div>
                <div className="info-item">
                  <Globe size={16} className="text-muted" />
                  <span>{branch.timezone}</span>
                </div>
              </div>
              <div className="branch-card-footer">
                 {/* Future: Edit/Delete buttons */}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay-sleek">
          <div className="modal-card-sleek">
            <div className="modal-header">
              <h3>Create New Branch</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateBranch} className="modal-form">
              <div className="form-group">
                <label>Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downtown Branch"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Street Name, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                >
                  <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary-sleek" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary-sleek"
                  disabled={creating}
                >
                  {creating ? <Loader2 className="animate-spin" size={18} /> : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .branch-card-sleek {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .branch-card-sleek:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }
        .branch-card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        .branch-icon-wrapper {
          width: 44px;
          height: 44px;
          background: var(--primary-light, #f0f7ff);
          color: var(--primary, #3b82f6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .branch-info {
          flex: 1;
        }
        .branch-name {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .branch-code {
          font-size: 0.8rem;
          color: #64748b;
        }
        .status-badge-active {
          padding: 4px 10px;
          background: #dcfce7;
          color: #166534;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .branch-card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #475569;
        }
        .modal-overlay-sleek {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card-sleek {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 450px;
          padding: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #94a3b8;
        }
        .modal-form .form-group {
          margin-bottom: 16px;
        }
        .modal-form label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .modal-form input, .modal-form select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .btn-primary-sleek {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .btn-secondary-sleek {
          flex: 1;
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
        }
      `}} />
    </div>
  );
};

export default BranchManagement;
