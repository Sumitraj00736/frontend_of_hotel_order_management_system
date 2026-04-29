import React from 'react';
import { RefreshCw } from 'lucide-react';

const FinanceDashboardHeader = ({ range, setRange, loading, onRefresh }) => {
  return (
    <div className="fd-header sticky-header">
      <div className="fd-header-content">
        <div>
          <h1 className="fd-title">Finance Dashboard</h1>
          <p className="fd-card-sub">Real-time financial performance and analytics</p>
        </div>
        
        <div className="fd-header-actions">
          <div className="fd-range-tabs glass-tabs">
            {['today', 'week', 'month'].map((r) => (
              <button
                key={r}
                className={`fd-range-btn ${range === r ? 'active' : ''}`}
                onClick={() => setRange(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          
          <button 
            className={`fd-refresh-btn ${loading ? 'spin' : ''}`} 
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboardHeader;
