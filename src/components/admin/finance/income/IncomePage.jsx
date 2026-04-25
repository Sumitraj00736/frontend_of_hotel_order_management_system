import React, { useEffect, useState } from 'react';
import api from '../../../../api/client.js';
import { Plus, Search, Filter, Download } from 'lucide-react';

export default function IncomePage() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [total,   setTotal]   = useState(0);
  const [form, setForm] = useState({ date: '', category: '', description: '', amount: '', paymentMode: 'cash' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/income');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setRows(data);
      setTotal(data.reduce((s, r) => s + Number(r.amount || 0), 0));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/income', form);
      setShowAdd(false);
      setForm({ date: '', category: '', description: '', amount: '', paymentMode: 'cash' });
      load();
    } catch (err) { alert(err.response?.data?.message || 'Failed to add income'); }
  };

  return (
    <div className="fd-root">
      <div className="fd-header">
        <div>
          <h1 className="fd-title">Income</h1>
        </div>
        <div className="fd-header-actions">
          <button className="fd-action-btn primary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add Income
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="fd-kpi-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="fd-kpi-card">
          <div className="fd-kpi-icon" style={{ background:'#f0fdf4', color:'#16a34a' }}>💰</div>
          <div className="fd-kpi-body">
            <div className="fd-kpi-label">Total Income</div>
            <div className="fd-kpi-value">Rs {total.toLocaleString()}</div>
          </div>
        </div>
        <div className="fd-kpi-card">
          <div className="fd-kpi-icon" style={{ background:'#eff6ff', color:'#2563eb' }}>📋</div>
          <div className="fd-kpi-body">
            <div className="fd-kpi-label">Total Entries</div>
            <div className="fd-kpi-value">{rows.length}</div>
          </div>
        </div>
        <div className="fd-kpi-card">
          <div className="fd-kpi-icon" style={{ background:'#fff7ed', color:'#ea580c' }}>📅</div>
          <div className="fd-kpi-body">
            <div className="fd-kpi-label">This Month</div>
            <div className="fd-kpi-value">Rs {rows
              .filter(r => new Date(r.date || r.createdAt).getMonth() === new Date().getMonth())
              .reduce((s,r) => s + Number(r.amount || 0), 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="fd-table-card" style={{ marginTop: 0 }}>
        {loading ? <div className="fd-empty">Loading…</div> : rows.length === 0 ? (
          <div className="fd-empty">
            <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
            <div style={{ fontWeight: 600 }}>No income entries found</div>
            <div style={{ color:'#94a3b8', fontSize:13 }}>Add a new income entry to get started</div>
          </div>
        ) : (
          <table className="fd-table">
            <thead>
              <tr>
                <th>SN</th><th>Date</th><th>Category</th><th>Description</th>
                <th>Payment Mode</th><th>Amount</th><th>Entry By</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i}>
                  <td>{i + 1}</td>
                  <td>{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                  <td><span className="fd-type-badge">{r.category || '—'}</span></td>
                  <td>{r.description || r.note || '—'}</td>
                  <td>{r.paymentMode || r.paymentMethod || 'Cash'}</td>
                  <td style={{ color:'#16a34a', fontWeight:600 }}>Rs {Number(r.amount || 0).toLocaleString()}</td>
                  <td>{r.entryBy || r.createdBy?.name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fd-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="fd-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-modal-head">
              <h3>Add Income</h3>
              <button className="fd-modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="fd-modal-form">
              <div className="fd-form-row">
                <label>Date</label>
                <input type="date" required value={form.date}
                  onChange={e => setForm(f => ({...f, date: e.target.value}))} />
              </div>
              <div className="fd-form-row">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                  <option value="">Select category</option>
                  {['Service Charge','Tips','Catering','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fd-form-row">
                <label>Description</label>
                <input placeholder="Description" value={form.description}
                  onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              </div>
              <div className="fd-form-row">
                <label>Amount (Rs)</label>
                <input type="number" required min="0" placeholder="0" value={form.amount}
                  onChange={e => setForm(f => ({...f, amount: e.target.value}))} />
              </div>
              <div className="fd-form-row">
                <label>Payment Mode</label>
                <select value={form.paymentMode} onChange={e => setForm(f => ({...f, paymentMode: e.target.value}))}>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="fonepay">Fonepay</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="fd-form-actions">
                <button type="button" className="fd-action-btn ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="fd-action-btn primary">Add Income</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
