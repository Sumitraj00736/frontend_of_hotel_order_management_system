import React from 'react';
import '../../../common/css/waiter/waiterHeader.css';

const WaiterHeader = ({ user }) => {
  const waiterName = user?.name || user?.fullName || 'Waiter';

  return (
    <header className="waiter-mobile-header">
      <div className="header-top-row">
        <div className="branch-branding-group">
          <div className="branch-logo-box">
            <span className="branch-initial">{waiterName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="branch-info-mini">
            <div className="branch-name-mini">{waiterName}</div>
            <div className="waiter-branch-meta-row">
              <div className="premium-badge-mini">Waiter</div>
              <div className="waiter-live-badge">
                <span className="waiter-live-dot" />
                Live
              </div>
            </div>
          </div>
        </div>

        {/* App Branding (Right) */}
        <div className="app-branding-group">
          <span className="brand-name-mini">merorestro</span>
          <div className="brand-logo-box-mini">
            <span className="brand-v-mini">V</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WaiterHeader;
