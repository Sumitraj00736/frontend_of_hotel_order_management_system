import React from 'react';
import { X } from 'lucide-react';

const DayBookSalesModal = ({ open, onClose, netSales }) => {
  if (!open) return null;

  return (
    <div className="fd-modal-overlay">
      <div className="fd-modal" style={{ maxWidth: '500px' }}>
        <div className="fd-modal-head">
          <h3>Sales Summary</h3>
          <button className="fd-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="fd-modal-form">
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
            Net sales breakdown for the selected day from the day book summary.
          </p>
          
          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#334155',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {netSales ? (
              <pre style={{ margin: 0 }}>{JSON.stringify(netSales, null, 2)}</pre>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8' }}>No net sales data found.</div>
            )}
          </div>

          <div className="fd-form-actions">
            <button className="fd-action-btn primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayBookSalesModal;
