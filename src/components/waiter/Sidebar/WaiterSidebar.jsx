import React, { useState, useMemo } from 'react';
import { Home, ListChecks, BookOpen, Bell, UserRound, ChevronDown, ChevronRight, LogOut, ShoppingBag, MapPin,TrendingUp } from 'lucide-react';
import { clearSession, getBranchId, getBranches, getCurrentUser, setBranchId } from '../../../api/session.js';
import '../../../common/css/waiter/waiterSidebar.css';

const iconMap = {
  dashboard: Home,
  orders: ListChecks,
  myOrders: ListChecks,
  allOrders: ListChecks,
  menu: BookOpen,
  notifications: Bell,
  profile: UserRound,
  takeaway: ShoppingBag,
  analytics: TrendingUp,
};

const WaiterSidebar = ({ activeSection = 'dashboard', onSelect, isOpen = true, onToggleSidebar, unreadCount = 0, sections }) => {
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

  const navList = sections?.length ? sections : ['dashboard', 'orders', 'menu', 'notifications'];

  return (
    <aside className={`waiter-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-logo">M</div>
          <h2 className="brand-name">mero<span>restro</span></h2>
        </div>
        <button className="toggle-trigger" onClick={onToggleSidebar}>
          {isOpen ? <ChevronDown style={{ transform: 'rotate(90deg)' }} /> : <ChevronRight />}
        </button>
      </div>

      <div className="sidebar-content">
        {/* Branch Selector */}
        <div className="branch-selector">
          <div className="branch-current" onClick={() => isOpen && setBranchOpen(!branchOpen)}>
            <MapPin size={18} className="branch-icon" />
            <div className="branch-info">
              <span className="branch-name-text">{restaurantName}</span>
              <span className="branch-status">Premium Trial</span>
            </div>
            {isOpen && <ChevronDown size={14} className={`chevron ${branchOpen ? 'rotated' : ''}`} />}
          </div>
          
          {branchOpen && isOpen && (
            <div className="branch-dropdown">
              {branches.map((b) => (
                <button
                  key={b.branchId || b._id}
                  className={`branch-option ${activeBranch?.branchId === (b.branchId || b._id) ? 'active' : ''}`}
                  onClick={() => {
                    setBranchId(b.branchId || b._id);
                    window.location.reload();
                  }}
                >
                  {b.branchName || b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          {navList.map((id) => {
            const Icon = iconMap[id] || Home;
            return (
              <button
                key={id}
                className={`nav-item ${activeSection === id ? 'active' : ''}`}
                onClick={() => onSelect?.(id)}
              >
                <div className="icon-wrapper">
                  <Icon size={20} strokeWidth={2} />
                  {id === 'notifications' && unreadCount > 0 && (
                    <span className="unread-dot">{unreadCount}</span>
                  )}
                </div>
                <span className="nav-label">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <button className="profile-toggle" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Waiter'}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </button>
          
          <div className="profile-menu">
            <button onClick={() => onSelect?.('profile')}>
              <UserRound size={16} /> Profile Settings
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default WaiterSidebar;