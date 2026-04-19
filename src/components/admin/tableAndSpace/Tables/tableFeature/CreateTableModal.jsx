import React, { useEffect, useState } from 'react';
import { createTable } from './tablesApi.js';
import { fetchTableTypes } from './tableTypesApi.js';
import TableTypeSelect from './TableTypeSelect.jsx';
import CreateTableTypeModal from './CreateTableTypeModal.jsx';

export default function CreateTableModal({ open, onClose, spaces, onSaved }) {
  const [tableNumber, setTableNumber] = useState('');
  const [name, setName] = useState('');
  const [spaceId, setSpaceId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [charge, setCharge] = useState('');
  const [status, setStatus] = useState('available');
  const [active, setActive] = useState(true);

  const [tableTypeId, setTableTypeId] = useState('');
  const [tableTypes, setTableTypes] = useState([]);
  const [showCreateType, setShowCreateType] = useState(false);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const rows = await fetchTableTypes({ active: true });
        setTableTypes(Array.isArray(rows) ? rows : []);
      } catch (e) {
        setTableTypes([]);
      }
    })();
  }, [open]);

  if (!open) return null;

  const save = async () => {
    setSaving(true);
    setErr('');
    try {
      await createTable({
        tableNumber: Number(tableNumber),
        name: name || undefined,
        spaceId: spaceId || undefined,
        capacity: capacity !== '' ? Number(capacity) : undefined,
        charge: charge !== '' ? Number(charge) : undefined,
        status,
        active,
        tableTypeId: tableTypeId || undefined
      });
      onSaved?.();
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="tables-modal-backdrop" onClick={onClose}>
        <div className="tables-modal" onClick={(e) => e.stopPropagation()}>
          <div className="tables-modal-header">
            <div>
              <h5>Add Table</h5>
              <p className="text-muted small">Create a new table and assign a table type.</p>
            </div>
            <button className="btn btn-outline-light" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="tables-modal-grid">
            <div>
              <label className="form-label">Table Number *</label>
              <input className="form-control" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cabin 1" />
            </div>
            <div>
              <label className="form-label">Space</label>
              <select className="form-control" value={spaceId} onChange={(e) => setSpaceId(e.target.value)}>
                <option value="">-</option>
                {spaces.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Capacity</label>
              <input className="form-control" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Charge</label>
              <input className="form-control" value={charge} onChange={(e) => setCharge(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Table Status</label>
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="available">Open</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
            <div>
              <label className="form-label">Available</label>
              <div className="d-flex align-items-center gap-2">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                <span className="text-muted small">{active ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div>
              <label className="form-label">Table Type</label>
              <TableTypeSelect
                value={tableTypeId}
                options={tableTypes}
                onChange={setTableTypeId}
                onCreate={() => setShowCreateType(true)}
              />
            </div>
          </div>

          {err && <div style={{ color: '#b91c1c', fontSize: 13 }}>{err}</div>}

          <div className="tables-modal-actions">
            <button className="btn btn-outline-light" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save} disabled={saving || !tableNumber}>
              {saving ? 'Saving…' : 'Save Table'}
            </button>
          </div>
        </div>
      </div>

      <CreateTableTypeModal
        open={showCreateType}
        onClose={() => setShowCreateType(false)}
        onCreated={(row) => {
          setTableTypes((prev) => [row, ...prev].sort((a, b) => String(a.name).localeCompare(String(b.name))));
          setTableTypeId(row?._id);
        }}
      />
    </>
  );
}

