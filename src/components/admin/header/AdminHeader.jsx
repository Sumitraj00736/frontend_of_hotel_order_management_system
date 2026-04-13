import React from 'react';
import { ChevronDown, LogOut } from 'lucide-react';

const AdminHeader = ({
  isMobile = false,
  sectionTitle = 'Admin',
  restaurantName = 'Restaurant',
  branchOpen = false,
  onToggleBranch,
  branches = [],
  activeBranchId,
  onSelectBranch,
  onLogout
}) => {
  if (!isMobile) return null;

  return (
    <header className="mobile-admin-topbar">
      <div className="mobile-admin-header-row">
        <div className="mobile-branch-branding" onClick={onToggleBranch}>
          <div className="mobile-branch-logo">{restaurantName.charAt(0).toUpperCase()}</div>
          <div className="mobile-branch-info">
            <div className="mobile-branch-name">
              {restaurantName}
              <ChevronDown size={12} className={`mobile-branch-chevron ${branchOpen ? 'open' : ''}`} />
            </div>
            <div className="mobile-branch-badge">Premium</div>
          </div>
          {branchOpen && (
            <div className="mobile-branch-dropdown">
              {branches.map((branch) => (
                <button
                  key={branch.branchId || branch._id}
                  className={`mobile-branch-option ${
                    activeBranchId === (branch.branchId || branch._id) ? 'active' : ''
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectBranch?.(branch);
                  }}
                >
                  {branch.branchName || branch.name || branch.code || 'Branch'}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mobile-admin-branding">
          <span className="mobile-admin-brand-text">merorestro</span>
          <span className="mobile-admin-brand-mark">V</span>
          <button type="button" className="mobile-admin-logout-btn" onClick={onLogout} aria-label="Log out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
      <div className="mobile-topbar-title">{sectionTitle}</div>
    </header>
  );
};

export default AdminHeader;
