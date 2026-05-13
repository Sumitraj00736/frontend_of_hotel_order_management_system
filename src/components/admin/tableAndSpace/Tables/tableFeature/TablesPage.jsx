import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { fetchTables, freeTable, moveToTrash } from './tablesApi.js';
import CreateTableModal from './CreateTableModal.jsx';
import EditTableModal from './EditTableModal.jsx';
import ViewTableModal from './ViewTableModal.jsx';
import TableRowMenu from './TableRowMenu.jsx';
import api from '../../../../../api/client.js';

const buildStats = (rows) => {
  const total = rows.length;
  const active = rows.filter((t) => t.active !== false).length;
  const occupied = rows.filter((t) => t.status === 'occupied').length;
  const byType = new Map();
  rows.forEach((t) => {
    const k = t.tableTypeId?.name || t.type || 'Table';
    byType.set(k, (byType.get(k) || 0) + 1);
  });
  const mostUsed = [...byType.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  return { total, active, occupied, mostUsed };
};

export default function TablesPage({ tables: initialTables = [], spaces = [], reload }) {
  const [rows, setRows] = useState(initialTables);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [qrMeta, setQrMeta] = useState(null);

  useEffect(() => {
    setRows(initialTables);
  }, [initialTables]);

  const load = async () => {
    setLoading(true);
    try {
      const [t, qr] = await Promise.all([fetchTables(), api.get('/api/qr-codes')]);
      setRows(Array.isArray(t) ? t : []);
      setQrMeta(qr.data || null);
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
    return rows.filter((t) => {
      const name = (t.name || `Table ${t.tableNumber}`).toLowerCase();
      const type = (t.tableTypeId?.name || t.type || '').toLowerCase();
      const space = (t.spaceId?.name || '').toLowerCase();
      return name.includes(q) || type.includes(q) || space.includes(q);
    });
  }, [rows, search]);

  const stats = useMemo(() => buildStats(filtered), [filtered]);

  const handleTrash = async (t) => {
    if (!window.confirm('Move this table to trash?')) return;
    await moveToTrash(t._id);
    await load();
  };

  const handleFree = async (t) => {
    await freeTable(t._id);
    await load();
  };

  return (
    <div className="tables-panel">
      <div className="tables-header">
        <div>
          <h4 className="mb-1">Tables</h4>
          <div className="text-muted small">Manage tables, cabins, and assignments</div>
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
          Total Tables <span>{stats.total}</span>
        </div>
        <div className="stat-card">
          Active Tables <span>{stats.active}</span>
        </div>
        <div className="stat-card">
          Occupied Tables <span>{stats.occupied}</span>
        </div>
        <div className="stat-card">
          Most Used <span>{stats.mostUsed}</span>
        </div>
      </div>

      <div className="tables-list">
        <div className="tables-head">
          <span>SN</span>
          <span>Table Name</span>
          <span>Types</span>
          <span>Space</span>
          <span>Capacity</span>
          <span>Charge</span>
          <span>Status</span>
          <span>Available</span>
          <span />
        </div>
        {filtered.map((t, idx) => (
          <div key={t._id} className="tables-row">
            <span className="tables-cell" data-label="SN">
              {idx + 1}
            </span>
            <span className="tables-cell" data-label="Table Name">
              {t.name || `Table ${t.tableNumber}`}
            </span>
            <span className="tables-cell" data-label="Types">
              {t.tableTypeId?.name || t.type || '-'}
            </span>
            <span className="tables-cell" data-label="Space">
              {t.spaceId?.name || '-'}
            </span>
            <span className="tables-cell" data-label="Capacity">
              {t.capacity ?? '-'}
            </span>
            <span className="tables-cell" data-label="Charge">
              {t.charge ?? '-'}
            </span>
            <span className="tables-cell" data-label="Status" style={{ color: t.status === 'occupied' ? '#f59e0b' : '#16a34a' }}>
              {t.status === 'occupied' ? 'Occupied' : 'Open'}
            </span>
            <span className="tables-cell" data-label="Available">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: t.active === false ? '#94a3b8' : '#22c55e',
                    display: 'inline-block'
                  }}
                />
              </span>
            </span>
            <div className="tables-row-actions" data-label="Actions" style={{ justifyContent: 'flex-end' }}>
              <TableRowMenu
                onView={() => setViewing(t)}
                onEdit={() => setEditing(t)}
                onTrash={() => handleTrash(t)}
              />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="tables-empty">{loading ? 'Loading…' : 'No tables found'}</div>
        )}
      </div>

      <CreateTableModal open={showAdd} onClose={() => setShowAdd(false)} spaces={spaces} onSaved={load} />
      <EditTableModal open={Boolean(editing)} onClose={() => setEditing(null)} table={editing} spaces={spaces} onSaved={load} />
      <ViewTableModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        table={viewing}
        qrMeta={qrMeta}
        onEdit={() => {
          setEditing(viewing);
          setViewing(null);
        }}
      />
    </div>
  );
}

