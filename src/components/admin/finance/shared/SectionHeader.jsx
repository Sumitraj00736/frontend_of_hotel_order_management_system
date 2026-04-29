import React from 'react';
import { RefreshCcw, Calendar } from 'lucide-react';

export default function SectionHeader({ 
  title, 
  dateFrom, 
  onDateFromChange, 
  dateTo, 
  onDateToChange, 
  onRefresh, 
  loading 
}) {
  return (
    <div className="fd-header">
      <div>
        <h1 className="fd-title">{title}</h1>
      </div>
      <div className="fd-header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Calendar size={14} color="#64748b" />
          <input 
            type="date" 
            className="fd-date-input" 
            value={dateFrom} 
            onChange={(e) => onDateFromChange(e.target.value)} 
          />
          <span style={{ color: '#cbd5e1' }}>—</span>
          <input 
            type="date" 
            className="fd-date-input" 
            value={dateTo} 
            onChange={(e) => onDateToChange(e.target.value)} 
          />
        </div>
        <button 
          className="fd-action-btn ghost" 
          onClick={onRefresh} 
          disabled={loading}
          title="Refresh Data"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
}
