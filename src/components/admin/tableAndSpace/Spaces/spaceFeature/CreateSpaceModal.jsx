import React, { useState } from 'react';
import { createSpace } from './spacesApi.js';

export default function CreateSpaceModal({ open, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [charge, setCharge] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const save = async () => {
    setSaving(true);
    setErr('');
    try {
      await createSpace({
        name,
        type,
        capacity: capacity !== '' ? Number(capacity) : undefined,
        charge: charge !== '' ? Number(charge) : undefined
      });
      onSaved?.();
      onClose?.();
      setName('');
      setType('');
      setCapacity('');
      setCharge('');
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
            <h5>Add Space</h5>
            <p className="text-muted small">Create a new space like Cabin, VIP, Roof, etc.</p>
          </div>
          <button className="btn btn-outline-light" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="tables-modal-grid">
          <div>
            <label className="form-label">Space Name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Type</label>
            <input className="form-control" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Capacity</label>
            <input className="form-control" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Charge</label>
            <input className="form-control" value={charge} onChange={(e) => setCharge(e.target.value)} />
          </div>
        </div>
        {err && <div style={{ color: '#b91c1c', fontSize: 13 }}>{err}</div>}
        <div className="tables-modal-actions">
          <button className="btn btn-outline-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save} disabled={saving || !name.trim()}>
            {saving ? 'Saving…' : 'Save Space'}
          </button>
        </div>
      </div>
    </div>
  );
}

