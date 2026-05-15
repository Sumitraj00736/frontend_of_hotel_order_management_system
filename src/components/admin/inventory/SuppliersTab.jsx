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

  const MAIN_COLOR = '#fc8019';

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
    try {
      if (editingSupplier) {
        await api.put(`/api/suppliers/${editingSupplier._id}`, data);
      } else {
        await api.post('/api/suppliers', data);
      }
      setShowModal(false);
      loadSuppliers();
    } catch (err) {
      alert(err?.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
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
    <div className="animate-in" style={{ '--primary-theme': MAIN_COLOR }}>
      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'To Receive', amount: summary.toReceive, color: '#16a34a', bg: '#f0fdf4', icon: '↓' },
          { label: 'To Pay', amount: summary.toPay, color: '#dc2626', bg: '#fef2f2', icon: '↑' },
          { label: 'Net To Receive', amount: summary.netToReceive, color: MAIN_COLOR, bg: `${MAIN_COLOR}10`, icon: '⇄' }
        ].map(card => (
          <div key={card.label} className="col-md-4">
            <div className="p-3 rounded-3 d-flex flex-column gap-1 border shadow-sm" style={{ background: card.bg, borderColor: `${card.color}33` }}>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white rounded px-2 py-1" style={{ background: card.color, fontSize: '12px' }}>{card.icon}</span>
                <span className="fw-semibold text-dark">{card.label}</span>
              </div>
              <div className="fw-bold fs-5">Rs {(card.amount || 0).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
        <div className="position-relative" style={{ maxWidth: 280, flex: 1 }}>
          <Search size={14} className="position-absolute text-muted" style={{ left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-control form-control-sm ps-4 rounded-pill border-2"
            placeholder="Search suppliers..."
            style={{ borderColor: '#eee' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={loadSuppliers}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            className="btn btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 text-white border-0" 
            style={{ backgroundColor: MAIN_COLOR }}
            onClick={openAdd}
          >
            <Plus size={14} /> Add New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-glass shadow-sm rounded-3 overflow-hidden border">
        <table className="mb-0">
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th className="py-3 px-4">SN</th>
              <th>Supplier</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Due Amount</th>
              <th>Email</th>
              <th className="text-end px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="text-center py-5"><RefreshCw size={24} className="animate-spin" style={{ color: MAIN_COLOR }} /></td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <div className="d-flex flex-column align-items-center gap-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 64, height: 64, background: `${MAIN_COLOR}15` }}>
                      <Users size={28} style={{ color: MAIN_COLOR }} />
                    </div>
                    <div className="fw-bold text-dark">No suppliers found</div>
                    <button className="btn btn-sm px-4 rounded-pill fw-bold text-white mt-2 border-0" style={{ backgroundColor: MAIN_COLOR }} onClick={openAdd}>
                      <Plus size={14} className="me-1" /> Add Your First Supplier
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {!loading && filtered.map((s, idx) => (
              <tr key={s._id} className="align-middle">
                <td className="text-muted px-4">{idx + 1}</td>
                <td className="fw-bold text-dark">{s.name}</td>
                <td>{s.phone || '—'}</td>
                <td>{s.dob ? new Date(s.dob).toLocaleDateString() : '—'}</td>
                <td>
                  <span className={`fw-bold ${(s.dueAmount || 0) >= 0 ? 'text-danger' : 'text-success'}`}>
                    Rs {Math.abs(s.dueAmount || 0).toLocaleString()}
                    <span className="text-muted fw-normal ms-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                      {(s.dueAmount || 0) >= 0 ? 'payable' : 'receivable'}
                    </span>
                  </span>
                </td>
                <td className="text-muted">{s.email || '—'}</td>
                <td className="text-end px-4">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn-icon shadow-sm" onClick={() => openEdit(s)} style={{ color: MAIN_COLOR }}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn-icon delete shadow-sm" onClick={() => handleDelete(s._id)}>
                      <Trash2 size={14} />
                    </button>
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
        themeColor={MAIN_COLOR}
      />

      <style jsx>{`
        .table-glass { background: white; }
        table { width: 100%; border-collapse: collapse; }
        th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 1px solid #eee; }
        td { padding: 12px 10px; border-bottom: 1px solid #f8f9fa; font-size: 14px; }
        tr:hover { background-color: #fff9f5; }
        .btn-icon { 
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid #eee; 
          background: white; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .btn-icon:hover { border-color: var(--primary-theme); background: var(--primary-theme); color: white !important; }
        .btn-icon.delete:hover { border-color: #dc2626; background: #dc2626; color: white !important; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SuppliersTab;