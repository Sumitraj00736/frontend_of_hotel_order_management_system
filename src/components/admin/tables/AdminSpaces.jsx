import React, { useMemo, useState } from 'react';

const AdminSpaces = ({ spaces = [], spaceForm, setSpaceForm, onCreateSpace, onUpdateSpace, onDeleteSpace }) => {
  const [editing, setEditing] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const stats = useMemo(() => {
    const total = spaces.length;
    const active = spaces.filter((s) => s.active !== false).length;
    return { total, active };
  }, [spaces]);

  const handleSaveEdit = async () => {
    if (!editing) return;
    await onUpdateSpace?.(editing._id, editing);
    setEditing(null);
  };

  const handleCreate = async () => {
    await onCreateSpace?.();
    setAddOpen(false);
  };

  return (
    <div className="card glass-card full-width-card tables-panel">
      <div className="tables-header">
        <div>
          <h4 className="mb-1">Spaces</h4>
          <div className="text-muted small">Create areas like Cabin, VIP, Roof, etc.</div>
        </div>
        <div className="tables-actions">
          <button className="btn btn-primary tables-add-btn" onClick={() => setAddOpen(true)}>
            <span className="btn-icon">+</span> Add New
          </button>
        </div>
      </div>

      <div className="tables-stats">
        <div className="stat-card">Total Spaces <span>{stats.total}</span></div>
        <div className="stat-card">Active Spaces <span>{stats.active}</span></div>
      </div>

      <div className="tables-list">
        <div className="tables-head">
          <span>SN</span>
          <span>Space Name</span>
          <span>Type</span>
          <span>Capacity</span>
          <span>Charge</span>
          <span>Status</span>
          <span />
        </div>
        {spaces.map((s, idx) => (
          <div key={s._id} className="tables-row">
            <span>{idx + 1}</span>
            <span>{s.name}</span>
            <span>{s.type || '-'}</span>
            <span>{s.capacity ?? '-'}</span>
            <span>{s.charge ?? '-'}</span>
            <span>{s.active === false ? 'inactive' : 'active'}</span>
            <div className="tables-row-actions">
              <button className="btn btn-sm btn-outline-light" onClick={() => setEditing({ ...s })}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDeleteSpace?.(s._id)}>Delete</button>
            </div>
          </div>
        ))}
        {spaces.length === 0 && <div className="tables-empty">No spaces found</div>}
      </div>

      {editing && (
        <div className="modal-overlay fullscreen" onClick={() => setEditing(null)}>
          <div className="modal-panel fullscreen small animate-in tables-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Edit Space</h5>
              <button className="btn btn-outline-light" onClick={() => setEditing(null)}>Close</button>
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label">Name</label>
                <input className="form-control" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Type</label>
                <input className="form-control" value={editing.type || ''} onChange={(e) => setEditing({ ...editing, type: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Capacity</label>
                <input className="form-control" value={editing.capacity || ''} onChange={(e) => setEditing({ ...editing, capacity: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Charge</label>
                <input className="form-control" value={editing.charge || ''} onChange={(e) => setEditing({ ...editing, charge: e.target.value })} />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-light" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {addOpen && (
        <div className="tables-modal-backdrop" onClick={() => setAddOpen(false)}>
          <div className="tables-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tables-modal-header">
              <div>
                <h5>Add Space</h5>
                <p className="text-muted small">Create a new space like Cabin, VIP, Roof, etc.</p>
              </div>
              <button className="btn btn-outline-light" onClick={() => setAddOpen(false)}>Close</button>
            </div>
            <div className="tables-modal-grid">
              <div>
                <label className="form-label">Space Name</label>
                <input
                  className="form-control"
                  placeholder="Cabin"
                  value={spaceForm.name}
                  onChange={(e) => setSpaceForm({ ...spaceForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Type</label>
                <input
                  className="form-control"
                  placeholder="Private"
                  value={spaceForm.type}
                  onChange={(e) => setSpaceForm({ ...spaceForm, type: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Capacity</label>
                <input
                  className="form-control"
                  placeholder="8"
                  value={spaceForm.capacity}
                  onChange={(e) => setSpaceForm({ ...spaceForm, capacity: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Charge</label>
                <input
                  className="form-control"
                  placeholder="0"
                  value={spaceForm.charge}
                  onChange={(e) => setSpaceForm({ ...spaceForm, charge: e.target.value })}
                />
              </div>
            </div>
            <div className="tables-modal-actions">
              <button className="btn btn-outline-light" onClick={() => setAddOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Save Space</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpaces;
