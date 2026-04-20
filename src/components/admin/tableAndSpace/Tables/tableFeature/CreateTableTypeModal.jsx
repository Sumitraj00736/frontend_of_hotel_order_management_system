import React, { useState } from 'react';
import { createTableType } from './tableTypesApi.js';

export default function CreateTableTypeModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const save = async () => {
    setSaving(true);
    setErr('');
    try {
      const row = await createTableType({ name });
      onCreated?.(row);
      setName('');
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tables-modal-backdrop" onClick={onClose}>
      <div className="tables-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tables-modal-header">
          <div>
            <h5>Create Table Type</h5>
            <p className="text-muted small">Add a new table type (Cabin/Room/Sofa/etc.)</p>
          </div>
          <button className="btn btn-outline-light" onClick={onClose}>
            Close
          </button>
        </div>
        <div>
          <label className="form-label">Table Type Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cabin" />
        </div>
        {err && <div style={{ color: '#b91c1c', fontSize: 13 }}>{err}</div>}
        <div className="tables-modal-actions">
          <button className="btn btn-outline-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save} disabled={saving || !name.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

