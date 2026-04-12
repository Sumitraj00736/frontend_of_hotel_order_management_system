import React, { useState } from 'react';
import { Home, ListChecks, BookOpen, Bell, UserRound, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { clearSession, getBranchId, getBranches, getCurrentUser, setBranchId } from '../../../api/session.js';
import '../../../common/css/admin/sidebar/adminSidebar.css';

const iconMap = {
  dashboard: <Home size={18} strokeWidth={1.5} />,
  orders: <ListChecks size={18} strokeWidth={1.5} />,
  myOrders: <ListChecks size={18} strokeWidth={1.5} />,
  allOrders: <ListChecks size={18} strokeWidth={1.5} />,
  menu: <BookOpen size={18} strokeWidth={1.5} />,
  notifications: <Bell size={18} strokeWidth={1.5} />,
  profile: <UserRound size={18} strokeWidth={1.5} />
};

const WaiterSidebar = ({ activeSection = 'dashboard', onSelect, isOpen = true, onToggleSidebar, unreadCount = 0, sections }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  const user = getCurrentUser();
  const branches = getBranches();
  const activeBranchId = getBranchId() || branches[0]?.branchId;
  const activeBranch = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const restaurantName = activeBranch?.branchName || user?.restaurantName || user?.name || 'Restaurant';

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return (
    <div className={`sidebar admin-sidebar slide ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand blocky">
          <span className="brand-mark">V</span>
          {isOpen && <span className="brand-text">merorestro</span>}
        </div>
        <button className="collapse-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          {isOpen ? '«' : '»'}
        </button>
      </div>

      <div className={`location-card ${isOpen ? '' : 'compact'}`} onClick={() => setBranchOpen((v) => !v)}>
        <div className="location-main">
          <div className="location-title">{restaurantName}</div>
          {isOpen && <span className="chevron"><ChevronDown size={14} /></span>}
        </div>
        {isOpen && <div className="pill badge-premium">Premium (Trial)</div>}
        {branchOpen && isOpen && (
          <div className="branch-popover">
            {branches.map((b) => (
              <button
                key={b.branchId || b._id}
                className={`branch-item ${activeBranchId === (b.branchId || b._id) ? 'active' : ''}`}
                onClick={() => {
                  setBranchId(b.branchId || b._id);
                  window.location.reload();
                }}
              >
                {b.branchName || b.name || b.code || 'Branch'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-buttons mt-4">
        {(sections?.length ? sections : ['orders', 'menu', 'dashboard', 'notifications', 'profile']).map((section) => {
          if (section === 'orders') {
            return (
              <button
                key="orders"
                className={`sidebar-button ${activeSection === 'orders' ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
                onClick={() => onSelect?.('orders')}
                title="ORDERS"
              >
                <span className="sidebar-icon">{iconMap.orders}</span>
                <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Orders</span>
              </button>
            );
          }

          return (
            <button
              key={section}
              className={`sidebar-button ${activeSection === section ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
              onClick={() => onSelect?.(section)}
              title={section.toUpperCase()}
            >
              <span className="sidebar-icon">{iconMap[section]}</span>
              <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </span>
              {section === 'notifications' && unreadCount > 0 && (
                <span className="badge-red">{unreadCount}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-profile-wrapper" onMouseLeave={() => setProfileOpen(false)}>
        <button className={`sidebar-profile ${isOpen ? '' : 'compact'}`} onClick={() => setProfileOpen((v) => !v)}>
          <div className="avatar-circle">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          {isOpen && (
            <div className="profile-meta">
              <div className="fw-semibold small">{user?.name || 'User'}</div>
              <div className="tiny-text text-muted">{user?.email || ''}</div>
            </div>
          )}
          <span className="sidebar-icon">{profileOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
        </button>
        {profileOpen && (
          <div className="profile-popover">
            <div className="profile-popover-body">
              <button className="sidebar-button sub" onClick={handleLogout}>
                <span className="sidebar-icon"><LogOut size={14} /></span>
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterSidebar;
