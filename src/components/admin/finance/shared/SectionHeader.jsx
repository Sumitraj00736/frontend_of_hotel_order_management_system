import React from 'react';
import { RefreshCcw, Calendar } from 'lucide-react';

export default function SectionHeader({ 
  title, 
  dateFrom, 
  onDateFromChange, 
  dateTo, 
  onDateToChange, 
  onRefresh, 
  loading,
  children
}) {
  return (
    <div className="fd-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', marginBottom: '24px' }}>
      <div className="fd-header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h1 className="fd-title" style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{title}</h1>
        </div>
        
        <div className="fd-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {children}
          
          <div className="fd-date-filter-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '4px 8px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '8px', background: '#f8fafc' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>From</span>
              <input 
                type="date" 
                className="fd-date-input" 
                value={dateFrom} 
                onChange={(e) => onDateFromChange(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#1e293b', outline: 'none' }}
              />
            </div>
            
            <span style={{ color: '#cbd5e1', fontWeight: 300 }}>|</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '8px', background: '#f8fafc' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>To</span>
              <input 
                type="date" 
                className="fd-date-input" 
                value={dateTo} 
                onChange={(e) => onDateToChange(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#1e293b', outline: 'none' }}
              />
            </div>
            
            <button 
              className="fd-action-btn ghost" 
              onClick={onRefresh} 
              disabled={loading}
              style={{ padding: '6px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} color={loading ? '#94a3b8' : '#64748b'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
