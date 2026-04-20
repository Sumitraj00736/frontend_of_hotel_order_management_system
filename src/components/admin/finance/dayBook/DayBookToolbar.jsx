import React from 'react';

export default function DayBookToolbar({
  dayValue,
  onDayChange,
  onSalesSummary,
  onCloseDay,
  onHistory,
  loading
}) {
  return (
    <div className="finance-toolbar">
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
        <span>Day</span>
        <input type="date" value={dayValue} onChange={(e) => onDayChange(e.target.value)} disabled={loading} />
      </label>
      <button type="button" className="finance-btn ghost" onClick={onSalesSummary} disabled={loading}>
        Sales Summary
      </button>
      <button type="button" className="finance-btn primary" onClick={onCloseDay} disabled={loading}>
        Close the day
      </button>
      <button type="button" className="finance-btn" onClick={onHistory} disabled={loading}>
        Daybook History
      </button>
    </div>
  );
}
