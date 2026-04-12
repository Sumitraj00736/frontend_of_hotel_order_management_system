import React, { useState } from 'react';
import { ChevronDown, UtensilsCrossed } from 'lucide-react';
import { getBranchId, getBranches, setBranchId } from '../../../api/session.js';
import '../../../common/css/waiter/waiterHeader.css';

const WaiterHeader = ({ user, onClose }) => {
  const [branchOpen, setBranchOpen] = useState(false);
  const branches = getBranches();
  const activeBranchId = getBranchId() || branches[0]?.branchId;
  const activeBranch = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const restaurantName = activeBranch?.branchName || user?.restaurantName || 'Restaurant';

  return (
    <header className="waiter-mobile-header">
      <div className="header-top-row">
        {/* Branch Branding (Left) */}
        <div className="branch-branding-group" onClick={() => setBranchOpen(!branchOpen)}>
          <div className="branch-logo-box">
            <span className="branch-initial">{restaurantName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="branch-info-mini">
            <div className="branch-name-mini">
              {restaurantName} <ChevronDown size={12} className={`chevron-icon ${branchOpen ? 'rotated' : ''}`} />
            </div>
            <div className="premium-badge-mini">Premium</div>
          </div>

          {branchOpen && (
            <div className="branch-dropdown-overlay">
              {branches.map((b) => (
                <button
                  key={b.branchId || b._id}
                  className={`branch-option ${activeBranchId === (b.branchId || b._id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBranchId(b.branchId || b._id);
                    window.location.reload();
                  }}
                >
                  {b.branchName || b.name || 'Branch'}
                </button>
              ))}
            </div>
          )}
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
