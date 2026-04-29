import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

const SalesPurchaseFilters = ({ dateFrom, setDateFrom, dateTo, setDateTo, loading, onRefresh }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f960', padding: '4px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <div className="fd-form-row" style={{ flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
          <Calendar size={12} color="#64748b" />
          <input 
            type="date" 
            className="fd-date-input" 
            style={{ border: 'none', background: 'transparent', padding: '2px 0', fontSize: '12px' }}
            value={dateFrom || ''} 
            onChange={(e) => setDateFrom(e.target.value)} 
          />
        </div>
        <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>
        <div className="fd-form-row" style={{ flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
          <Calendar size={12} color="#64748b" />
          <input 
            type="date" 
            className="fd-date-input" 
            style={{ border: 'none', background: 'transparent', padding: '2px 0', fontSize: '12px' }}
            value={dateTo || ''} 
            onChange={(e) => setDateTo(e.target.value)} 
          />
        </div>
      </div>

      <button 
        className={`fd-refresh-btn ${loading ? 'spin' : ''}`} 
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
};

export default SalesPurchaseFilters;
