import React from 'react';
import { RefreshCw, Calendar } from 'lucide-react';

const TransactionFilters = ({ dateFrom, setDateFrom, dateTo, setDateTo, loading, onRefresh }) => {
  return (
    <div className="fd-header-actions" style={{ background: '#fff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '24px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="fd-form-row" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} color="#64748b" />
          <input 
            type="date" 
            className="fd-date-input" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)} 
          />
        </div>
        <span style={{ color: '#cbd5e1' }}>—</span>
        <div className="fd-form-row" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} color="#64748b" />
          <input 
            type="date" 
            className="fd-date-input" 
            value={dateTo} 
            onChange={(e) => setDateTo(e.target.value)} 
          />
        </div>
      </div>

      <button 
        className={`fd-refresh-btn ${loading ? 'spin' : ''}`} 
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw size={16} />
      </button>
    </div>
  );
};

export default TransactionFilters;
