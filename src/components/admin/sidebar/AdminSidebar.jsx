import React, { useEffect, useState } from 'react';
import {
  Home,
  ListChecks,
  Users,
  Table as TableIcon,
  BookOpen,
  Boxes,
  BarChart,
  History,
  ChevronDown,
  ChevronRight,
  UtensilsCrossed,
  Layers,
  PlusSquare,
  Grid3x3,
  Package2,
  Bell,
  LogOut,
  Settings,
  UserRound,
  Globe,
  Wheat,
  Soup,
  Layers2,
  BarChart3,
  ChefHat,
  PackageSearch,
  X,
  Maximize2,
  CalendarDays,
  MessageSquare,
  MessageCircle,
  Share2,
  Wallet
} from 'lucide-react';

import {
  clearSession,
  getBranchId,
  getBranches,
  getCurrentUser,
  setBranchId,
  hasPermission
} from '../../../api/session.js';
import ThemeToggle from '../../ThemeToggle.jsx';
import '../../../common/css/admin/sidebar/adminSidebar.css';

const iconMap = {
  dashboard: <Home size={18} strokeWidth={1.7} />,
  orders: <ListChecks size={18} strokeWidth={1.7} />,
  users: <Users size={18} strokeWidth={1.7} />,
  tables: <TableIcon size={18} strokeWidth={1.7} />,
  menus: <BookOpen size={18} strokeWidth={1.7} />,
  inventory: <Boxes size={18} strokeWidth={1.7} />,
  website: <Globe size={18} strokeWidth={1.7} />,
  reports: <BarChart size={18} strokeWidth={1.7} />,
  history: <History size={18} strokeWidth={1.7} />,
  settings: <Settings size={18} strokeWidth={1.7} />,
  notifications: <Bell size={18} strokeWidth={1.7} />,
  customers: <UserRound size={18} strokeWidth={1.7} />,
  finance: <Wallet size={18} strokeWidth={1.7} />
};

const menuSubIcons = {
  dishes: <UtensilsCrossed size={14} />,
  categories: <Layers size={14} />,
  addons: <PlusSquare size={14} />,
  submenus: <Grid3x3 size={14} />,
  combos: <Package2 size={14} />
};

const inventorySubIcons = {
  ingredients: <Wheat size={14} />,
  recipes: <Soup size={14} />,
  transactions: <PackageSearch size={14} />,
  suppliers: <Users size={14} />
};

const tableSubIcons = {
  table: <TableIcon size={14} />,
  space: <Layers size={14} />,
  qr: <Grid3x3 size={14} />
};

const reportsSubIcons = {
  company: <BarChart3 size={14} />,
  waiter: <Layers2 size={14} />,
  kitchen: <ChefHat size={14} />,
  stock: <Boxes size={14} />
};

const coreSections = ['dashboard', 'orders', 'users', 'customers', 'website', 'notifications'];

const sectionPermissions = {
  dashboard: 'dashboard:view',
  orders: 'orders:view',
  users: 'staff:view',
  tables: 'tables:view',
  website: 'website:view',
  customers: 'customers:view',
  notifications: 'notifications:view',
  settings: 'settings:view',
  history: 'reports:view'
};

const AdminSidebar = ({
  activeSection = 'dashboard',
  onSelect,
  isOpen = true,
  onToggleSidebar,
  unreadCount = 0
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dateMode, setDateMode] = useState('AD');
  const [branchOpen, setBranchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  const user = getCurrentUser();
  const branches = getBranches() || [];
  const activeBranchId = getBranchId() || branches[0]?.branchId || branches[0]?._id;
  const activeBranch = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const restaurantName =
    activeBranch?.orgName || branches[0]?.orgName || user?.orgName || user?.organizationName || user?.restaurantName || user?.name || 'Restaurant';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  const handleSelect = (section) => {
    onSelect?.(section);

    if (isMobile && isOpen) {
      onToggleSidebar?.();
    }
  };

  const handleProfileSetting = () => {
    setProfileOpen(false);
    handleSelect('settings:restaurant-details');
  };

  const handleFullScreenToggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen toggle failed', error);
    }
  };

  const handleToggleDateMode = () => {
    setDateMode((value) => (value === 'AD' ? 'BS' : 'AD'));
  };

  const handleInvite = async () => {
    const inviteLink = `${window.location.origin}/invite`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard');
    } else {
      window.prompt('Copy invite link', inviteLink);
    }
    setProfileOpen(false);
  };

  const handleFeedback = () => {
    window.location.href = 'mailto:developersana7@gmail.com?subject=App%20Feedback';
    setProfileOpen(false);
  };

  const handleShareProfile = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: 'My Profile',
      text: 'Check out my profile',
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.warn('Share failed', error);
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      alert('Profile link copied to clipboard');
    } else {
      window.prompt('Copy this link', shareUrl);
    }
    setProfileOpen(false);
  };

  const handleNotificationPreferences = () => {
    alert('Notification preferences are currently unavailable.');
    setProfileOpen(false);
  };

  const handleToggleMenu = (menu) => {
    setMenuOpen((value) => (menu === 'menu' ? !value : false));
    setInventoryOpen((value) => (menu === 'inventory' ? !value : false));
    setFinanceOpen((value) => (menu === 'finance' ? !value : false));
    setReportsOpen((value) => (menu === 'reports' ? !value : false));
    setTablesOpen((value) => (menu === 'tables' ? !value : false));
  };

  const getProfilePopoverStyle = () => {
    if (isMobile) return undefined;
    return {
      position: 'fixed',
      left: `${isOpen ? 260 : 78}px`,
      bottom: '18px',
      width: '260px'
    };
  };

  const renderCollapsedPopover = (id, title, links) => {
    if (isOpen || hoveredMenu !== id || isMobile) return null;

    return (
      <div className="collapsed-popover">
        <div className="popover-card">
          <div className="popover-title">{title}</div>
          <div className="popover-list">
            {links
              .filter((link) => !link.permission || hasPermission(link.permission))
              .map(({ id: linkId, label }) => (
                <button
                  key={linkId}
                  className={`sidebar-button sub ${activeSection === linkId ? 'active' : ''}`}
                  onClick={() => handleSelect(linkId)}
                >
                  {label}
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobile && isOpen && <div className="sidebar-overlay" onClick={onToggleSidebar} />}

      <div
        className={`sidebar admin-sidebar slide ${isOpen ? 'open' : 'closed'} ${
          isMobile ? 'mobile-sidebar' : ''
        }`}
      >
        <div className="sidebar-header-fixed">
          <div className="sidebar-top">
            <div className="sidebar-brand blocky">
              <span className="brand-mark">V</span>
              {isOpen && <span className="brand-text">merorestro</span>}
            </div>

            <button className="collapse-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
              {isMobile ? <X size={18} /> : isOpen ? '«' : '»'}
            </button>
          </div>
        </div>

        <div className="sidebar-scroll-content">
          <div
            className={`location-card ${isOpen ? '' : 'compact'}`}
            onClick={() => isOpen && setBranchOpen((v) => !v)}
          >
            <div className="location-main">
              <div className="location-title">{restaurantName}</div>
              {isOpen && <span className="chevron"><ChevronDown size={14} /></span>}
            </div>

            {isOpen && <div className="pill badge-premium">Premium (Trial)</div>}
          </div>

          {branchOpen && isOpen && (
            <div className="branch-popover">
              {branches.map((b) => (
                <button
                  key={b.branchId || b._id}
                  className={`branch-item ${
                    activeBranchId === (b.branchId || b._id) ? 'active' : ''
                  }`}
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

        <div className="sidebar-buttons">
          {coreSections
            .filter((section) => hasPermission(sectionPermissions[section]))
            .map((section) => (
              <button
                key={section}
                className={`sidebar-button ${
                  activeSection === section || activeSection.startsWith(`${section}:`) ? 'active' : ''
                } ${isOpen ? '' : 'compact'}`}
                onClick={() =>
                  handleSelect(section === 'settings' ? 'settings:restaurant-details' : section)
                }
                title={section.toUpperCase()}
              >
                <span className="sidebar-icon">{iconMap[section]}</span>
                <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
                {section === 'notifications' && unreadCount > 0 && isOpen && (
                  <span className="pill badge-red">{unreadCount}</span>
                )}
              </button>
            ))}

        <div className="sidebar-separator" />

        {/* Table & Space */}
        <div
          className="sidebar-group"
          onMouseEnter={() => !isOpen && setHoveredMenu('tables')}
          onMouseLeave={() => !isOpen && setHoveredMenu(null)}
        >
          {hasPermission('tables:view') && (
            <button
              className={`sidebar-button ${activeSection.startsWith('tables') ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
                onClick={() => (isOpen ? handleToggleMenu('tables') : setHoveredMenu('tables'))}
              title="TABLE & SPACE"
            >
              <span className="sidebar-icon">{iconMap.tables}</span>
              <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Table & Space</span>
              {isOpen && <span className="ms-auto">{tablesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
            </button>
          )}
          {isOpen && (
            <div className={`sidebar-sub ${tablesOpen ? 'open' : ''}`}>
              {[
                { id: 'tables:table', label: 'Table', icon: tableSubIcons.table, permission: 'tables:view' },
                { id: 'tables:space', label: 'Space', icon: tableSubIcons.space, permission: 'tables:view' },
                { id: 'tables:qr', label: 'QR Codes', icon: tableSubIcons.qr, permission: 'tables:view' }
              ]
                .filter((link) => !link.permission || hasPermission(link.permission))
                .map((link) => (
                  <button
                    key={link.id}
                    className={`sidebar-button sub ${activeSection === link.id ? 'active' : ''}`}
                    onClick={() => handleSelect(link.id)}
                  >
                    <span className="sidebar-sub-icon">{link.icon}</span>
                    <span className="sidebar-label">{link.label}</span>
                  </button>
                ))}
            </div>
          )}
          {renderCollapsedPopover('tables', 'Table & Space', [
            { id: 'tables:table', label: 'Table' },
            { id: 'tables:space', label: 'Space' },
            { id: 'tables:qr', label: 'QR Codes' }
          ])}
        </div>

          {/* MENU */}
          {hasPermission('menu:view') && (
            <div
              className="sidebar-group"
              onMouseEnter={() => !isOpen && !isMobile && setHoveredMenu('menu')}
              onMouseLeave={() => !isOpen && !isMobile && setHoveredMenu(null)}
            >
              <button
                className={`sidebar-button ${
                  activeSection.startsWith('menu') ? 'active' : ''
                } ${isOpen ? '' : 'compact'}`}
                onClick={() => (isOpen ? handleToggleMenu('menu') : setHoveredMenu('menu'))}
                title="MENU"
              >
                <span className="sidebar-icon">{iconMap.menus}</span>
                <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Menu</span>
                {isOpen && (
                  <span className="ms-auto">
                    {menuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className={`sidebar-sub ${menuOpen ? 'open' : ''}`}>
                  <button
                    className={`sidebar-button sub ${activeSection === 'menu:dishes' ? 'active' : ''}`}
                    onClick={() => handleSelect('menu:dishes')}
                  >
                    <span className="sidebar-icon">{menuSubIcons.dishes}</span>
                    Dishes
                  </button>

                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'menu:categories' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('menu:categories')}
                  >
                    <span className="sidebar-icon">{menuSubIcons.categories}</span>
                    Category
                  </button>

                  <button
                    className={`sidebar-button sub ${activeSection === 'menu:addons' ? 'active' : ''}`}
                    onClick={() => handleSelect('menu:addons')}
                  >
                    <span className="sidebar-icon">{menuSubIcons.addons}</span>
                    Ad-Ons & Extras
                  </button>

                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'menu:submenus' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('menu:submenus')}
                  >
                    <span className="sidebar-icon">{menuSubIcons.submenus}</span>
                    Sub Menu
                  </button>

                  <button
                    className={`sidebar-button sub ${activeSection === 'menu:combos' ? 'active' : ''}`}
                    onClick={() => handleSelect('menu:combos')}
                  >
                    <span className="sidebar-icon">{menuSubIcons.combos}</span>
                    Combo Offer
                  </button>
                </div>
              )}

              {renderCollapsedPopover('menu', 'Menu', [
                { id: 'menu:dishes', label: 'Dishes', permission: 'menu:view' },
                { id: 'menu:categories', label: 'Category', permission: 'menu:view' },
                { id: 'menu:addons', label: 'Ad-Ons & Extras', permission: 'menu:view' },
                { id: 'menu:submenus', label: 'Sub Menu', permission: 'menu:view' },
                { id: 'menu:combos', label: 'Combo Offer', permission: 'menu:view' }
              ])}
            </div>
          )}

          {/* INVENTORY */}
          {hasPermission('inventory:view') && (
            <div
              className="sidebar-group"
              onMouseEnter={() => !isOpen && !isMobile && setHoveredMenu('inventory')}
              onMouseLeave={() => !isOpen && !isMobile && setHoveredMenu(null)}
            >
              <button
                className={`sidebar-button ${
                  activeSection.startsWith('inventory') ? 'active' : ''
                } ${isOpen ? '' : 'compact'}`}
                onClick={() => (isOpen ? handleToggleMenu('inventory') : setHoveredMenu('inventory'))}
                title="INVENTORY"
              >
                <span className="sidebar-icon">{iconMap.inventory}</span>
                <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Inventory</span>
                {isOpen && (
                  <span className="ms-auto">
                    {inventoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className={`sidebar-sub ${inventoryOpen ? 'open' : ''}`}>
                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'inventory:ingredients' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('inventory:ingredients')}
                  >
                    <span className="sidebar-icon">{inventorySubIcons.ingredients}</span>
                    Ingredients
                  </button>

                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'inventory:recipes' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('inventory:recipes')}
                  >
                    <span className="sidebar-icon">{inventorySubIcons.recipes}</span>
                    Recipes
                  </button>

                   <button
                    className={`sidebar-button sub ${
                      activeSection === 'inventory:transactions' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('inventory:transactions')}
                  >
                    <span className="sidebar-icon">{inventorySubIcons.transactions}</span>
                    Stock Transactions
                  </button>

                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'inventory:suppliers' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('inventory:suppliers')}
                  >
                    <span className="sidebar-icon">{inventorySubIcons.suppliers}</span>
                    Suppliers
                  </button>
                </div>
              )}

              {renderCollapsedPopover('inventory', 'Inventory', [
                { id: 'inventory:ingredients', label: 'Ingredients', permission: 'inventory:view' },
                { id: 'inventory:recipes', label: 'Recipes', permission: 'inventory:view' },
                { id: 'inventory:transactions', label: 'Stock Transactions', permission: 'inventory:view' },
                { id: 'inventory:suppliers', label: 'Suppliers', permission: 'inventory:view' }
              ])}
            </div>
          )}

          {/* FINANCE */}
          {hasPermission('billing:view') && (
            <div
              className="sidebar-group"
              onMouseEnter={() => !isOpen && !isMobile && setHoveredMenu('finance')}
              onMouseLeave={() => !isOpen && !isMobile && setHoveredMenu(null)}
            >
              <button
                className={`sidebar-button ${activeSection.startsWith('finance') ? 'active' : ''} ${
                  isOpen ? '' : 'compact'
                }`}
                onClick={() => (isOpen ? handleToggleMenu('finance') : setHoveredMenu('finance'))}
                title="FINANCE"
              >
                <span className="sidebar-icon">{iconMap.finance}</span>
                <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Finance</span>
                {isOpen && (
                  <span className="ms-auto">
                    {financeOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className={`sidebar-sub ${financeOpen ? 'open' : ''}`}>
                  <button
                    className={`sidebar-button sub ${activeSection === 'finance:daybook' ? 'active' : ''}`}
                    onClick={() => handleSelect('finance:daybook')}
                  >
                    Day Book
                  </button>
                  <button
                    className={`sidebar-button sub ${activeSection === 'finance:daybook-history' ? 'active' : ''}`}
                    onClick={() => handleSelect('finance:daybook-history')}
                  >
                    Daybook History
                  </button>
                  <button
                    className={`sidebar-button sub ${activeSection === 'finance:transactions' ? 'active' : ''}`}
                    onClick={() => handleSelect('finance:transactions')}
                  >
                    Transactions
                  </button>
                  <button
                    className={`sidebar-button sub ${activeSection.startsWith('finance:sales-purchase') ? 'active' : ''}`}
                    onClick={() => handleSelect('finance:sales-purchase:sales-invoices')}
                  >
                    Sales & Purchase
                  </button>
                </div>
              )}

              {renderCollapsedPopover('finance', 'Finance', [
                { id: 'finance:daybook', label: 'Day Book', permission: 'billing:view' },
                { id: 'finance:daybook-history', label: 'Daybook History', permission: 'billing:view' },
                { id: 'finance:transactions', label: 'Transactions', permission: 'billing:view' },
                { id: 'finance:sales-purchase:sales-invoices', label: 'Sales & Purchase', permission: 'billing:view' }
              ])}
            </div>
          )}

          {/* REPORTS */}
          {hasPermission('reports:view') && (
            <div
              className="sidebar-group"
              onMouseEnter={() => !isOpen && !isMobile && setHoveredMenu('reports')}
              onMouseLeave={() => !isOpen && !isMobile && setHoveredMenu(null)}
            >
              <button
                className={`sidebar-button ${
                  activeSection.startsWith('reports') ? 'active' : ''
                } ${isOpen ? '' : 'compact'}`}
                onClick={() => (isOpen ? handleToggleMenu('reports') : setHoveredMenu('reports'))}
                title="REPORTS"
              >
                <span className="sidebar-icon">{iconMap.reports}</span>
                <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Reports</span>
                {isOpen && (
                  <span className="ms-auto">
                    {reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className={`sidebar-sub ${reportsOpen ? 'open' : ''}`}>
                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'reports:company' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('reports:company')}
                  >
                    <span className="sidebar-icon">{reportsSubIcons.company}</span>
                    Company
                  </button>

                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'reports:waiter' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('reports:waiter')}
                  >
                    <span className="sidebar-icon">{reportsSubIcons.waiter}</span>
                    Waiter
                  </button>

                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'reports:kitchen' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('reports:kitchen')}
                  >
                    <span className="sidebar-icon">{reportsSubIcons.kitchen}</span>
                    Kitchen
                  </button>

                  <button
                    className={`sidebar-button sub ${
                      activeSection === 'reports:stock' ? 'active' : ''
                    }`}
                    onClick={() => handleSelect('reports:stock')}
                  >
                    <span className="sidebar-icon">{reportsSubIcons.stock}</span>
                    Stock
                  </button>
                </div>
              )}

              {renderCollapsedPopover('reports', 'Reports', [
                { id: 'reports:company', label: 'Company', permission: 'reports:view' },
                { id: 'reports:waiter', label: 'Waiter', permission: 'reports:view' },
                { id: 'reports:kitchen', label: 'Kitchen', permission: 'reports:view' },
                { id: 'reports:stock', label: 'Stock', permission: 'reports:view' }
              ])}
            </div>
          )}

          {/* HISTORY */}
          {hasPermission('reports:view') && (
            <button
              className={`sidebar-button ${activeSection === 'history' ? 'active' : ''} ${
                isOpen ? '' : 'compact'
              }`}
              onClick={() => handleSelect('history')}
              title="HISTORY"
            >
              <span className="sidebar-icon">{iconMap.history}</span>
              <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>History</span>
            </button>
          )}

          {/* SETTINGS */}
          {hasPermission('settings:view') && user?.role?.toLowerCase() === 'superadmin' && (
            <button
              className={`sidebar-button ${activeSection.startsWith('settings') ? 'active' : ''} ${
                isOpen ? '' : 'compact'
              }`}
              onClick={() => handleSelect('settings:restaurant-details')}
              title="SETTINGS"
            >
              <span className="sidebar-icon">{iconMap.settings}</span>
              <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Settings</span>
            </button>
          )}
        </div>

        <div className="sidebar-profile-wrapper">
          <button
            className={`sidebar-profile ${isOpen ? '' : 'compact'}`}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            {isOpen && (
              <div className="profile-meta">
                <div className="fw-semibold small">{user?.name || 'User'}</div>
                <div className="tiny-text text-muted">{user?.email || ''}</div>
              </div>
            )}

            {isOpen && (
              <span className="sidebar-icon">
                {profileOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
          </button>

          {profileOpen && (
            <div
              className="profile-popover"
              style={getProfilePopoverStyle()}
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <div className="profile-popover-body">
                <div className="profile-panel-header">
                  <div className="avatar-circle large">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="profile-meta-panel">
                    <div className="fw-semibold large">{user?.name || 'User'}</div>
                    <div className="tiny-text text-muted">{user?.email || ''}</div>
                  </div>
                </div>

                <div className="profile-panel-section">
                  <button className="profile-panel-item" onClick={handleProfileSetting}>
                    <span className="sidebar-icon"><UserRound size={16} /></span>
                    <span>Profile Setting</span>
                  </button>

                  <ThemeToggle />

                  <button className="profile-panel-item" onClick={handleFullScreenToggle}>
                    <span className="sidebar-icon"><Maximize2 size={16} /></span>
                    <span>Enter Full Screen</span>
                  </button>

                  <div className="profile-panel-item profile-panel-date-mode" onClick={handleToggleDateMode}>
                    <span className="sidebar-icon"><CalendarDays size={16} /></span>
                    <span>Date Mode</span>
                    <div className="date-mode-switch">
                      <span className={`date-mode-pill ${dateMode === 'AD' ? 'active' : ''}`}>AD</span>
                      <span className={`date-mode-pill ${dateMode === 'BS' ? 'active' : ''}`}>BS</span>
                    </div>
                  </div>
                </div>

                <div className="profile-panel-section profile-panel-links">
                  <button className="profile-panel-item" onClick={handleInvite}>
                    <span className="sidebar-icon"><MessageSquare size={16} /></span>
                    <span>Invitation</span>
                  </button>
                  <button className="profile-panel-item" onClick={handleFeedback}>
                    <span className="sidebar-icon"><MessageCircle size={16} /></span>
                    <span>Give Feedback</span>
                  </button>
                  <button className="profile-panel-item" onClick={handleShareProfile}>
                    <span className="sidebar-icon"><Share2 size={16} /></span>
                    <span>Share Profile</span>
                  </button>
                  <button className="profile-panel-item" onClick={handleNotificationPreferences}>
                    <span className="sidebar-icon"><Bell size={16} /></span>
                    <span>User Notification Preferences</span>
                  </button>
                </div>

                <button className="sidebar-button sub danger profile-panel-logout" onClick={handleLogout}>
                  <span className="sidebar-icon"><LogOut size={14} /></span>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminSidebar;
