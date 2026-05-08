import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { deleteSpace, fetchSpaces } from './spacesApi.js';
import CreateSpaceModal from './CreateSpaceModal.jsx';
import EditSpaceModal from './EditSpaceModal.jsx';

export default function SpacesPage({ spaces: initialSpaces = [], reload }) {
  const [rows, setRows] = useState(initialSpaces);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => setRows(initialSpaces), [initialSpaces]);

  const load = async () => {
    setLoading(true);
    try {
      const s = await fetchSpaces();
      setRows(Array.isArray(s) ? s : []);
      reload?.();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((s) => String(s.name || '').toLowerCase().includes(q) || String(s.type || '').toLowerCase().includes(q));
  }, [rows, search]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const active = filtered.filter((s) => s.active !== false).length;
    return { total, active };
  }, [filtered]);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this space?')) return;
    await deleteSpace(id);
    await load();
  };

  return (
    <div className="card glass-card full-width-card tables-panel">
      <div className="tables-header">
        <div>
          <h4 className="mb-1">Spaces</h4>
          <div className="text-muted small">Create areas like Cabin, VIP, Roof, etc.</div>
        </div>
        <div className="tables-actions">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
            <input
              className="form-control"
              style={{ paddingLeft: 32, minWidth: 220 }}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary tables-add-btn" onClick={() => setShowAdd(true)}>
            Add New
          </button>
        </div>
      </div>

      <div className="tables-stats">
        <div className="stat-card">
          Total Spaces <span>{stats.total}</span>
        </div>
        <div className="stat-card">
          Active Spaces <span>{stats.active}</span>
        </div>
      </div>

      <div className="tables-list">
        <div className="tables-head" style={{ gridTemplateColumns: '50px 1.4fr 1fr 0.8fr 0.8fr 0.8fr 140px' }}>
          <span>SN</span>
          <span>Space Name</span>
          <span>Type</span>
          <span>Capacity</span>
          <span>Charge</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.map((s, idx) => (
          <div
            key={s._id}
            className="tables-row"
            style={{ gridTemplateColumns: '50px 1.4fr 1fr 0.8fr 0.8fr 0.8fr 140px' }}
          >
            <span>{idx + 1}</span>
            <span>{s.name}</span>
            <span>{s.type || '-'}</span>
            <span>{s.capacity ?? '-'}</span>
            <span>{s.charge ?? '-'}</span>
            <span>{s.active === false ? 'inactive' : 'active'}</span>
            <div className="tables-row-actions" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-sm btn-outline-light" onClick={() => setEditing(s)}>
                Edit
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(s._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="tables-empty">{loading ? 'Loading…' : 'No spaces found'}</div>}
      </div>

      <CreateSpaceModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
      <EditSpaceModal open={Boolean(editing)} onClose={() => setEditing(null)} space={editing} onSaved={load} />
    </div>
  );
}

