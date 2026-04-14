import React from 'react';
import { ChevronDown } from 'lucide-react';
import AdminProfileMenu from './AdminProfileMenu.jsx';

const AdminHeader = ({
  isMobile = false,
  sectionTitle = 'Admin',
  organizationName,
  restaurantName = 'Restaurant',
  branchOpen = false,
  onToggleBranch,
  branches = [],
  activeBranchId,
  onSelectBranch,
  onLogout,
  currentUser,
  onOpenSetting,
  showSettingsMenu = true
}) => {
  if (!isMobile) return null;
  const displayName = organizationName || restaurantName || 'Restaurant';

  return (
    <header className="mobile-admin-topbar">
      <div className="mobile-admin-header-row">
        <div className="mobile-branch-branding" onClick={onToggleBranch}>
          <div className="mobile-branch-logo">{displayName.charAt(0).toUpperCase()}</div>
          <div className="mobile-branch-info">
            <div className="mobile-branch-name">
              {displayName}
              <ChevronDown size={12} className={`mobile-branch-chevron ${branchOpen ? 'open' : ''}`} />
            </div>
            <div className="mobile-branch-meta-row">
              <div className="mobile-branch-badge">Premium</div>
              <div className="mobile-branch-live">
                <span className="mobile-live-dot" />
                Live
              </div>
            </div>
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
          <AdminProfileMenu
            user={currentUser}
            organizationName={displayName}
            onOpenSetting={onOpenSetting}
            showSettingsMenu={showSettingsMenu}
            onLogout={onLogout}
          />
        </div>
      </div>
      <div className="mobile-topbar-title-wrap">
        <div className="mobile-topbar-title">{sectionTitle}</div>
      </div>
    </header>
  );
};

export default AdminHeader;
