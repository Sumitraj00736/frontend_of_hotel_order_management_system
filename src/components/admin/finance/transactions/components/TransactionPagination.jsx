import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TransactionPagination = ({ page, limit, total, rowsCount, onPrev, onNext }) => {
  if (total <= limit && page === 1) return null;

  return (
    <div style={{ 
      marginTop: '24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 8px'
    }}>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
        Showing <span style={{ color: '#0f172a', fontWeight: 700 }}>{rowsCount}</span> of <span style={{ color: '#0f172a', fontWeight: 700 }}>{total}</span> transactions
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="fd-action-btn ghost" 
          disabled={page <= 1} 
          onClick={onPrev}
          style={{ padding: '6px 12px' }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>
        <button 
          className="fd-action-btn ghost" 
          disabled={page * limit >= total} 
          onClick={onNext}
          style={{ padding: '6px 12px' }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TransactionPagination;
