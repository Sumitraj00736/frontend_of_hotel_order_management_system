import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AdminProfileMenu from '../../admin/header/AdminProfileMenu.jsx';
import { getBranches, getBranchId, setBranchId } from '../../../api/session.js';

const WaiterHeader = ({ user, onLogout }) => {
  const branches = getBranches();
  const activeBranchId = getBranchId();
  const [branchOpen, setBranchOpen] = useState(false);
  const activeBranch =
    branches.find((branch) => (branch.branchId || branch._id) === activeBranchId) || branches[0];
  const displayName =
    activeBranch?.branchName || activeBranch?.name || activeBranch?.code || user?.orgName || 'Restaurant';
  const displayUser = user?.name || user?.fullName || 'Waiter';

  return (
    <header className="mobile-admin-topbar">
      <div className="mobile-admin-header-row">
        <div
          className="mobile-branch-branding"
          onClick={() => setBranchOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setBranchOpen((prev) => !prev);
            }
          }}
        >
          <div className="mobile-branch-logo">{displayName.charAt(0).toUpperCase()}</div>
          <div className="mobile-branch-info">
            <div className="mobile-branch-name">
              {displayName}
              <ChevronDown size={12} className={`mobile-branch-chevron ${branchOpen ? 'open' : ''}`} />
            </div>
            <div className="mobile-branch-meta-row">
              <div className="mobile-branch-badge">Waiter</div>
              <div className="mobile-branch-live">
                <span className="mobile-live-dot" />
                Live
              </div>
            </div>
          </div>
          {branchOpen && (
            <div className="mobile-branch-dropdown">
              {branches.map((branch) => {
                const branchId = branch.branchId || branch._id;
                return (
                  <button
                    key={branchId}
                    className={`mobile-branch-option ${activeBranchId === branchId ? 'active' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setBranchId(branchId);
                      setBranchOpen(false);
                    }}
                  >
                    {branch.branchName || branch.name || branch.code || 'Branch'}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="mobile-admin-branding">
          <span className="mobile-admin-brand-text">merorestro</span>
          <span className="mobile-admin-brand-mark">V</span>
          <AdminProfileMenu user={{ ...user, name: displayUser }} organizationName={displayName} showSettingsMenu={false} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default WaiterHeader;
