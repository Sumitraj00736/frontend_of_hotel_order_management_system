import React, { useState } from 'react';
import DayBookGrid from './DayBookGrid.jsx';
import { closeDaybook } from './dayBookApi.js';

export default function DayBookReportModal({ open, onClose, rowSummary, totals, rangeFrom, rangeTo, dayValue, onSaved }) {
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await closeDaybook({ day: dayValue, remarks });
      onSaved?.();
      onClose();
      setRemarks('');
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const fromStr = rangeFrom ? new Date(rangeFrom).toLocaleString() : '';
  const toStr = rangeTo ? new Date(rangeTo).toLocaleString() : '';

  return (
    <div className="finance-modal-overlay" role="dialog" aria-modal="true">
      <div className="finance-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3>Day Book Report</h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              From: {fromStr} &nbsp; To: {toStr}
            </div>
          </div>
          <button type="button" className="finance-btn ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Select One Date
            <input
              type="date"
              value={dayValue}
              readOnly
              style={{ marginLeft: 8, padding: '6px 8px', borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Remarks
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter Remarks"
              rows={2}
              style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
          </label>
        </div>

        {err && <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{err}</p>}

        <h4 style={{ margin: '16px 0 8px' }}>Preview</h4>
        <DayBookGrid summary={rowSummary} totals={totals} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button type="button" className="finance-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="finance-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Day Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
