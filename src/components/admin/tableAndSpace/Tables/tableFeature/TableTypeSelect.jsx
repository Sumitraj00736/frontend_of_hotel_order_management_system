import React, { useMemo, useState } from 'react';

export default function TableTypeSelect({ value, options, onChange, onCreate }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return (options || []).filter((o) => String(o.name || '').toLowerCase().includes(s));
  }, [q, options]);

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <input
          className="form-control"
          placeholder="Search options..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div style={{ maxHeight: 220, overflow: 'auto' }}>
        {filtered.map((t) => (
          <label key={t._id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 6px' }}>
            <input type="radio" checked={value === t._id} onChange={() => onChange?.(t._id)} />
            <span style={{ fontWeight: 600 }}>{t.name}</span>
          </label>
        ))}
        {!filtered.length && <div style={{ padding: 10, color: '#64748b' }}>No matches</div>}
      </div>
      <button type="button" className="btn btn-outline-light w-100 mt-2" onClick={onCreate}>
        + Create Table Type
      </button>
    </div>
  );
}

