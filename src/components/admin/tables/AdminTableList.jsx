import React, { useMemo, useState, useEffect } from 'react';
import '../../../common/css/admin/tables/tables.css';

const AdminTableList = ({ tables = [], spaces = [], tableForm, setTableForm, onCreateTable, onFreeTable, onUpdateTable, onDeleteTable, autoOpenAddModal, onAddModalClosed }) => {
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (autoOpenAddModal) setAddOpen(true);
  }, [autoOpenAddModal]);

  const handleModalClose = () => {
    setAddOpen(false);
    if (onAddModalClosed) onAddModalClosed();
  };

  const spaceMap = useMemo(() => new Map(spaces.map((s) => [s._id, s])), [spaces]);
  const stats = useMemo(() => {
    const total = tables.length;
    const active = tables.filter((t) => t.active !== false).length;
    const occupied = tables.filter((t) => t.status === 'occupied').length;
    const mostUsed = tables[0];
    return { total, active, occupied, mostUsed };
  }, [tables]);

  const handleCreate = async () => {
    await onCreateTable?.();
    handleModalClose();
  };

  return (
    <div className="card glass-card full-width-card tables-panel">
      <div className="tables-header">
        <div>
          <h4 className="mb-1">Tables</h4>
          <div className="text-muted small">Manage tables, cabins, and assignments</div>
        </div>
        <div className="tables-actions">
          <button className="btn btn-primary tables-add-btn" onClick={() => setAddOpen(true)}>
            <span className="btn-icon">+</span> Add New
          </button>
        </div>
      </div>

      <div className="tables-stats">
        <div className="stat-card">Total Tables <span>{stats.total}</span></div>
        <div className="stat-card">Active Tables <span>{stats.active}</span></div>
        <div className="stat-card">Occupied Tables <span>{stats.occupied}</span></div>
        <div className="stat-card">Most Used <span>{stats.mostUsed?.name || '-'}</span></div>
      </div>

      <div className="tables-list">
        <div className="tables-head">
          <span>SN</span>
          <span>Table Name</span>
          <span>Type</span>
          <span>Space</span>
          <span>Capacity</span>
          <span>Charge</span>
          <span>Status</span>
          <span>Available</span>
          <span />
        </div>
        {tables.map((t, idx) => (
          <div key={t._id} className="tables-row">
            <span className="tables-cell" data-label="SN">{idx + 1}</span>
            <span className="tables-cell" data-label="Table Name">{t.name || `Table ${t.tableNumber}`}</span>
            <span className="tables-cell" data-label="Type">{t.type || 'table'}</span>
            <span className="tables-cell" data-label="Space">{spaceMap.get(t.spaceId)?.name || '-'}</span>
            <span className="tables-cell" data-label="Capacity">{t.capacity ?? '-'}</span>
            <span className="tables-cell" data-label="Charge">{t.charge ?? '-'}</span>
            <span className="tables-cell" data-label="Status">{t.status}</span>
            <span className="tables-cell" data-label="Available">{t.active === false ? 'No' : 'Yes'}</span>
            <div className="tables-row-actions" data-label="Actions">
              <button className="btn btn-sm btn-outline-light" onClick={() => onUpdateTable?.(t._id, { status: t.status === 'occupied' ? 'available' : 'occupied' })}>
                Toggle
              </button>
              <button className="btn btn-sm btn-outline-light" onClick={() => onFreeTable?.(t._id)}>
                Free
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDeleteTable?.(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {tables.length === 0 && <div className="tables-empty">No tables found</div>}
      </div>

      {addOpen && (
        <div className="tables-modal-backdrop" onClick={() => setAddOpen(false)}>
          <div className="tables-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tables-modal-header">
              <div>
                <h5>Add Table</h5>
                <p className="text-muted small">Create a new table or cabin for this branch.</p>
              </div>
              <button className="btn btn-outline-light" onClick={() => setAddOpen(false)}>Close</button>
            </div>
            <div className="tables-modal-grid">
              <div>
                <label className="form-label">Table Number</label>
                <input
                  className="form-control"
                  placeholder="1"
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  placeholder="Cabin 1"
                  value={tableForm.name || ''}
                  onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-control"
                  value={tableForm.type || 'table'}
                  onChange={(e) => setTableForm({ ...tableForm, type: e.target.value })}
                >
                  <option value="table">Table</option>
                  <option value="cabin">Cabin</option>
                  <option value="vip">VIP</option>
                  <option value="rooftop">Rooftop</option>
                </select>
              </div>
              <div>
                <label className="form-label">Space</label>
                <select
                  className="form-control"
                  value={tableForm.spaceId || ''}
                  onChange={(e) => setTableForm({ ...tableForm, spaceId: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {spaces.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Capacity</label>
                <input
                  className="form-control"
                  placeholder="4"
                  value={tableForm.capacity || ''}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Charge</label>
                <input
                  className="form-control"
                  placeholder="0"
                  value={tableForm.charge || ''}
                  onChange={(e) => setTableForm({ ...tableForm, charge: e.target.value })}
                />
              </div>
            </div>
            <div className="tables-modal-actions">
              <button className="btn btn-outline-light" onClick={handleModalClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Save Table</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTableList;
