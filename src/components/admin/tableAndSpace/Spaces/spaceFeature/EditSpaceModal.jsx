import React, { useEffect, useState } from 'react';
import { updateSpace } from './spacesApi.js';

export default function EditSpaceModal({ open, onClose, space, onSaved }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [charge, setCharge] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open || !space) return;
    setName(space.name || '');
    setType(space.type || '');
    setCapacity(space.capacity ?? '');
    setCharge(space.charge ?? '');
  }, [open, space]);

  if (!open || !space) return null;

  const save = async () => {
    setSaving(true);
    setErr('');
    try {
      await updateSpace(space._id, {
        name,
        type,
        capacity: capacity !== '' ? Number(capacity) : undefined,
        charge: charge !== '' ? Number(charge) : undefined
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
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-panel fullscreen small animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Edit Space</h5>
          <button className="btn btn-outline-light" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="row g-3">
          <div className="col-6">
            <label className="form-label">Name</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-6">
            <label className="form-label">Type</label>
            <input className="form-control" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div className="col-6">
            <label className="form-label">Capacity</label>
            <input className="form-control" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>
          <div className="col-6">
            <label className="form-label">Charge</label>
            <input className="form-control" value={charge} onChange={(e) => setCharge(e.target.value)} />
          </div>
        </div>
        {err && <div style={{ color: '#b91c1c', fontSize: 13, marginTop: 10 }}>{err}</div>}
        <div className="d-flex justify-content-end gap-2 mt-3">
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

