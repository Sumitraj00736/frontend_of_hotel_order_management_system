import React, { useEffect, useState } from 'react';
import api from '../../../../api/client.js';
import { Plus } from 'lucide-react';

export default function PaymentsPage() {
  const [tab,     setTab]     = useState('in');
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: '', party: '', amount: '', mode: 'cash', note: '', type: 'in' });

  const load = async () => {
    setLoading(true);
    try {
      const res  = await api.get('/api/payments', { params: { type: tab } });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setRows(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [tab]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/payments', { ...form, type: tab });
      setShowAdd(false);
      setForm({ date: '', party: '', amount: '', mode: 'cash', note: '', type: tab });
      load();
    } catch (err) { alert(err.response?.data?.message || 'Failed to add payment'); }
  };

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div className="fd-root">
      <div className="fd-header">
        <h1 className="fd-title">Payments</h1>
        <div className="fd-header-actions">
          <button className="fd-action-btn primary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add Payment {tab === 'in' ? 'In' : 'Out'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="fd-tab-bar">
        <button className={`fd-tab-btn ${tab === 'in' ? 'active' : ''}`} onClick={() => setTab('in')}>
          Payment In
        </button>
        <button className={`fd-tab-btn ${tab === 'out' ? 'active' : ''}`} onClick={() => setTab('out')}>
          Payment Out
        </button>
      </div>

      {/* KPI */}
      <div className="fd-kpi-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginTop: 16 }}>
        <div className="fd-kpi-card">
          <div className="fd-kpi-icon" style={{ background: tab==='in' ? '#f0fdf4':'#fef2f2', color: tab==='in' ? '#16a34a':'#dc2626' }}>
            {tab === 'in' ? '⬇️' : '⬆️'}
          </div>
          <div className="fd-kpi-body">
            <div className="fd-kpi-label">Total Payment {tab === 'in' ? 'In' : 'Out'}</div>
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
      </div>

      {/* Table */}
      <div className="fd-table-card">
        {loading ? <div className="fd-empty">Loading…</div> : rows.length === 0 ? (
          <div className="fd-empty">
            <div style={{ fontSize:40, marginBottom:12 }}>{tab === 'in' ? '⬇️' : '⬆️'}</div>
            <div style={{ fontWeight:600 }}>No payment {tab} records found</div>
          </div>
        ) : (
          <table className="fd-table">
            <thead>
              <tr>
                <th>SN</th><th>Date</th><th>Party</th><th>Amount</th>
                <th>Mode</th><th>Note</th><th>Entry By</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i}>
                  <td>{i + 1}</td>
                  <td>{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                  <td>{r.party || r.partyName || '—'}</td>
                  <td style={{ color: tab==='in' ? '#16a34a':'#dc2626', fontWeight:600 }}>
                    Rs {Number(r.amount || 0).toLocaleString()}
                  </td>
                  <td>{r.mode || r.paymentMode || 'Cash'}</td>
                  <td>{r.note || r.description || '—'}</td>
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
              <h3>Add Payment {tab === 'in' ? 'In' : 'Out'}</h3>
              <button className="fd-modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="fd-modal-form">
              <div className="fd-form-row">
                <label>Date</label>
                <input type="date" required value={form.date}
                  onChange={e => setForm(f => ({...f, date: e.target.value}))} />
              </div>
              <div className="fd-form-row">
                <label>Party</label>
                <input placeholder="Party name" value={form.party}
                  onChange={e => setForm(f => ({...f, party: e.target.value}))} />
              </div>
              <div className="fd-form-row">
                <label>Amount (Rs)</label>
                <input type="number" required min="0" placeholder="0" value={form.amount}
                  onChange={e => setForm(f => ({...f, amount: e.target.value}))} />
              </div>
              <div className="fd-form-row">
                <label>Mode</label>
                <select value={form.mode} onChange={e => setForm(f => ({...f, mode: e.target.value}))}>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="fonepay">Fonepay</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="fd-form-row">
                <label>Note</label>
                <input placeholder="Optional note" value={form.note}
                  onChange={e => setForm(f => ({...f, note: e.target.value}))} />
              </div>
              <div className="fd-form-actions">
                <button type="button" className="fd-action-btn ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="fd-action-btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
