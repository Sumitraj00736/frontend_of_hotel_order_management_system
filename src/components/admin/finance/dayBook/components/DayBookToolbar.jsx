import React from 'react';
import { Calendar, FileText, Lock, History, RefreshCw } from 'lucide-react';

const DayBookToolbar = ({ dayValue, onDayChange, onSalesSummary, onCloseDay, onHistory, loading }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div className="fd-form-row" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', background: '#f1f5f960', padding: '4px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <Calendar size={12} color="#64748b" />
        <input 
          type="date" 
          className="fd-date-input" 
          style={{ border: 'none', background: 'transparent', padding: '2px 0', fontSize: '12px' }}
          value={dayValue} 
          onChange={(e) => onDayChange(e.target.value)} 
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="fd-action-btn ghost" onClick={onSalesSummary} style={{ padding: '6px 12px', fontSize: '12px' }}>
          <FileText size={14} />
          <span>Sales</span>
        </button>
        
        <button className="fd-action-btn ghost" onClick={onHistory} style={{ padding: '6px 12px', fontSize: '12px' }}>
          <History size={14} />
          <span>History</span>
        </button>

        <button className="fd-action-btn primary" onClick={onCloseDay} disabled={loading} style={{ padding: '6px 16px', fontSize: '12px' }}>
          <Lock size={14} />
          <span>Close Day</span>
        </button>
      </div>
    </div>
  );
};

export default DayBookToolbar;
