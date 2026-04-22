import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, RefreshCw, Users } from 'lucide-react';
import api from '../../../api/client.js';
import SupplierFormModal from './SupplierFormModal.jsx';

const SuppliersTab = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [summary, setSummary] = useState({ toReceive: 0, toPay: 0, netToReceive: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/suppliers');
      setSuppliers(res.data.suppliers || []);
      setSummary(res.data.summary || { toReceive: 0, toPay: 0, netToReceive: 0 });
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSuppliers(); }, []);

  const filtered = useMemo(() => {
    if (!search) return suppliers;
    const q = search.toLowerCase();
    return suppliers.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q) ||
      (s.email || '').toLowerCase().includes(q)
    );
  }, [suppliers, search]);

  const handleSave = async (data) => {
    if (editingSupplier) {
      await api.put(`/api/suppliers/${editingSupplier._id}`, data);
    } else {
      await api.post('/api/suppliers', data);
    }
    loadSuppliers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await api.delete(`/api/suppliers/${id}`);
      loadSuppliers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  const openAdd = () => { setEditingSupplier(null); setShowModal(true); };
  const openEdit = (s) => { setEditingSupplier(s); setShowModal(true); };

  return (
    <div className="animate-in">
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'To Receive', amount: summary.toReceive, color: '#16a34a', bg: '#f0fdf4', icon: '↓' },
          { label: 'To Pay', amount: summary.toPay, color: '#dc2626', bg: '#fef2f2', icon: '↑' },
          { label: 'Net To Receive', amount: summary.netToReceive, color: '#16a34a', bg: '#f0fdf4', icon: '↓' }
        ].map(card => (
          <div key={card.label} className="col-md-4">
            <div className="p-3 rounded-3 d-flex flex-column gap-1" style={{ background: card.bg, border: `1px solid ${card.color}22` }}>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white rounded px-2 py-1" style={{ background: card.color, fontSize: '12px' }}>{card.icon}</span>
                <span className="fw-semibold">{card.label}</span>
              </div>
              <div className="fw-bold fs-5">Rs {(card.amount || 0).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <div className="position-relative" style={{ maxWidth: 280 }}>
          <Search size={14} className="position-absolute text-muted" style={{ left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-control form-control-sm ps-4 rounded-pill"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={loadSuppliers}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="btn btn-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1" onClick={openAdd}>
            <Plus size={14} /> Add New <span className="badge bg-light text-dark rounded ms-1" style={{ fontSize: '10px' }}>N</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-glass">
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Supplier</th>
              <th>Phone Number</th>
              <th>DOB</th>
              <th>Due Amount</th>
              <th>Email</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="text-center py-5"><RefreshCw size={20} className="animate-spin text-muted" /></td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <div className="d-flex flex-column align-items-center gap-3">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                      <Users size={28} className="text-muted" />
                    </div>
                    <div>
                      <div className="fw-bold text-dark">No supplier found</div>
                      <div className="text-muted small">Create a new supplier or import a new data.</div>
                    </div>
                    <button className="btn btn-danger btn-sm px-4 rounded-pill fw-bold" onClick={openAdd}>
                      <Plus size={14} className="me-1" /> Add New Supplier
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {!loading && filtered.map((s, idx) => (
              <tr key={s._id}>
                <td className="text-muted">{idx + 1}</td>
                <td className="fw-bold">{s.name}</td>
                <td>{s.phone || '—'}</td>
                <td>{s.dob ? new Date(s.dob).toLocaleDateString() : '—'}</td>
                <td>
                  <span className={`fw-bold ${(s.dueAmount || 0) >= 0 ? 'text-danger' : 'text-success'}`}>
                    Rs {Math.abs(s.dueAmount || 0).toLocaleString()}
                    <span className="text-muted fw-normal ms-1" style={{ fontSize: '10px' }}>
                      {(s.dueAmount || 0) >= 0 ? 'payable' : 'receivable'}
                    </span>
                  </span>
                </td>
                <td className="text-muted">{s.email || '—'}</td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn-icon" onClick={() => openEdit(s)}><Edit2 size={14} /></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(s._id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SupplierFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingSupplier}
      />
    </div>
  );
};

export default SuppliersTab;
