import React, { useState, useMemo } from 'react';
import { ListChecks, Bell, ChevronDown, ChevronRight, LogOut, UserRound, MapPin } from 'lucide-react';
import { clearSession, getBranchId, getBranches, getCurrentUser, setBranchId } from '../../api/session.js';
import '../../common/css/kitchen/kitchenSidebar.css';

const navItems = [
  { id: 'orders', label: 'Orders', icon: ListChecks },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: UserRound }
];

const KitchenSidebar = ({ activeSection = 'orders', onSelect, isOpen = true, onToggleSidebar, unreadCount = 0 }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  const user = getCurrentUser();
  const branches = getBranches() || [];
  
  const activeBranch = useMemo(() => {
    const activeId = getBranchId() || branches[0]?.branchId;
    return branches.find((b) => (b.branchId || b._id) === activeId);
  }, [branches]);

  const restaurantName = activeBranch?.branchName || user?.restaurantName || 'Mero Restro';

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      clearSession();
      window.location.href = '/login';
    }
  };

  const handleBranchSwitch = (id) => {
    setBranchId(id);
    window.location.reload();
  };

  return (
    <aside className={`kitchen-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-logo">M</div>
          {isOpen && <h2 className="brand-name">mero<span>restro</span></h2>}
        </div>
        <button className="toggle-trigger" onClick={onToggleSidebar}>
          {isOpen ? <ChevronDown style={{ transform: 'rotate(90deg)' }} /> : <ChevronRight />}
        </button>
      </div>

      <div className="sidebar-content">
        {/* Branch Selection */}
        <div className={`branch-selector ${isOpen ? '' : 'compact'}`}>
          <div className="branch-current" onClick={() => isOpen && setBranchOpen(!branchOpen)}>
            <MapPin size={18} className="branch-icon" />
            {isOpen && (
              <>
                <div className="branch-info">
                  <span className="branch-name-text">{restaurantName}</span>
                  <span className="branch-status">Premium Trial</span>
                </div>
                <ChevronDown size={14} className={`chevron ${branchOpen ? 'rotated' : ''}`} />
              </>
            )}
          </div>
          
          {branchOpen && isOpen && (
            <div className="branch-dropdown">
              {branches.map((b) => (
                <button
                  key={b.branchId || b._id}
                  className={`branch-option ${activeBranch?.branchId === (b.branchId || b._id) ? 'active' : ''}`}
                  onClick={() => handleBranchSwitch(b.branchId || b._id)}
                >
                  {b.branchName || b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activeSection === id ? 'active' : ''}`}
              onClick={() => onSelect?.(id)}
              title={label}
            >
              <div className="icon-wrapper">
                <Icon size={20} strokeWidth={2} />
                {id === 'notifications' && unreadCount > 0 && (
                  <span className="unread-dot">{unreadCount}</span>
                )}
              </div>
              {isOpen && <span className="nav-label">{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className={`user-profile ${profileOpen ? 'active' : ''} ${!isOpen ? 'compact' : ''}`}>
          <button className="profile-toggle" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {isOpen && (
              <div className="user-details">
                <p className="user-name">{user?.name || 'Chef'}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            )}
          </button>
          
          {profileOpen && (
            <div className="profile-menu">
              <button onClick={() => onSelect?.('profile')}>
                <UserRound size={16} /> Profile Settings
              </button>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default KitchenSidebar;