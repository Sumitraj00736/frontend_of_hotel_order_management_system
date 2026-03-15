import React, { useState } from 'react';
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
  UserRound
} from 'lucide-react';
import { clearSession, getBranchId, getBranches, getCurrentUser, setBranchId } from '../../api/session.js';
import '../../common/css/admin/adminSidebar.css';

const iconMap = {
  dashboard: <Home size={18} strokeWidth={1.5} />,
  orders: <ListChecks size={18} strokeWidth={1.5} />,
  users: <Users size={18} strokeWidth={1.5} />,
  tables: <TableIcon size={18} strokeWidth={1.5} />,
  menus: <BookOpen size={18} strokeWidth={1.5} />,
  inventory: <Boxes size={18} strokeWidth={1.5} />,
  reports: <BarChart size={18} strokeWidth={1.5} />,
  history: <History size={18} strokeWidth={1.5} />
};

const menuSubIcons = {
  dishes: <UtensilsCrossed size={14} />,
  categories: <Layers size={14} />,
  addons: <PlusSquare size={14} />,
  submenus: <Grid3x3 size={14} />,
  combos: <Package2 size={14} />
};

const coreSections = ['dashboard', 'orders', 'users', 'tables'];

const AdminSidebar = ({
  activeSection = 'dashboard',
  onSelect,
  isOpen = true,
  onToggleSidebar,
  unreadCount = 0
}) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
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

  const renderCollapsedPopover = (id, title, links) => {
    if (isOpen || hoveredMenu !== id) return null;
    return (
      <div className="collapsed-popover">
        <div className="popover-card">
          <div className="popover-title">{title}</div>
          <div className="popover-list">
            {links.map(({ id: linkId, label }) => (
              <button
                key={linkId}
                className={`sidebar-button sub ${activeSection === linkId ? 'active' : ''}`}
                onClick={() => onSelect?.(linkId)}
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
    <div className={`sidebar admin-sidebar slide ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand blocky">
          <span className="brand-mark">V</span>
          {isOpen && <span className="brand-text">RestroX</span>}
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

      <div className="sidebar-buttons">
        <button
          className={`sidebar-button ${activeSection === 'notifications' ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
          onClick={() => onSelect?.('notifications')}
          title="NOTIFICATION"
        >
          <span className="sidebar-icon"><Bell size={18} /></span>
          <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>NOTIFICATION</span>
          {unreadCount > 0 && <span className="pill badge-red">{unreadCount}</span>}
        </button>

        {coreSections.map((section) => (
          <button
            key={section}
            className={`sidebar-button ${activeSection === section ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
            onClick={() => onSelect?.(section)}
            title={section.toUpperCase()}
          >
            <span className="sidebar-icon">{iconMap[section]}</span>
            <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
          </button>
        ))}

        <div className="sidebar-separator" />

        {/* Menu */}
        <div
          className="sidebar-group"
          onMouseEnter={() => !isOpen && setHoveredMenu('menu')}
          onMouseLeave={() => !isOpen && setHoveredMenu(null)}
        >
          <button
            className={`sidebar-button ${activeSection.startsWith('menu') ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
            onClick={() => (isOpen ? setMenuOpen((v) => !v) : setHoveredMenu('menu'))}
            title="MENU"
          >
            <span className="sidebar-icon">{iconMap.menus}</span>
            <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Menu</span>
            {isOpen && <span className="ms-auto">{menuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
          </button>
          {isOpen && (
            <div className={`sidebar-sub ${menuOpen ? 'open' : ''}`}>
              <button className={`sidebar-button sub ${activeSection === 'menu:dishes' ? 'active' : ''}`} onClick={() => onSelect?.('menu:dishes')}>
                <span className="sidebar-icon">{menuSubIcons.dishes}</span>
                Dishes
              </button>
              <button className={`sidebar-button sub ${activeSection === 'menu:categories' ? 'active' : ''}`} onClick={() => onSelect?.('menu:categories')}>
                <span className="sidebar-icon">{menuSubIcons.categories}</span>
                Category
              </button>
              <button className={`sidebar-button sub ${activeSection === 'menu:addons' ? 'active' : ''}`} onClick={() => onSelect?.('menu:addons')}>
                <span className="sidebar-icon">{menuSubIcons.addons}</span>
                Ad-Ons & Extras
              </button>
              <button className={`sidebar-button sub ${activeSection === 'menu:submenus' ? 'active' : ''}`} onClick={() => onSelect?.('menu:submenus')}>
                <span className="sidebar-icon">{menuSubIcons.submenus}</span>
                Sub Menu
              </button>
              <button className={`sidebar-button sub ${activeSection === 'menu:combos' ? 'active' : ''}`} onClick={() => onSelect?.('menu:combos')}>
                <span className="sidebar-icon">{menuSubIcons.combos}</span>
                Combo Offer
              </button>
            </div>
          )}
          {renderCollapsedPopover('menu', 'Menu', [
            { id: 'menu:dishes', label: 'Dishes' },
            { id: 'menu:categories', label: 'Category' },
            { id: 'menu:addons', label: 'Ad-Ons & Extras' },
            { id: 'menu:submenus', label: 'Sub Menu' },
            { id: 'menu:combos', label: 'Combo Offer' }
          ])}
        </div>

        {/* Inventory */}
        <div
          className="sidebar-group"
          onMouseEnter={() => !isOpen && setHoveredMenu('inventory')}
          onMouseLeave={() => !isOpen && setHoveredMenu(null)}
        >
          <button
            className={`sidebar-button ${activeSection.startsWith('inventory') ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
            onClick={() => (isOpen ? setInventoryOpen((v) => !v) : setHoveredMenu('inventory'))}
            title="INVENTORY"
          >
            <span className="sidebar-icon">{iconMap.inventory}</span>
            <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Inventory</span>
            {isOpen && <span className="ms-auto">{inventoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
          </button>
          {isOpen && (
            <div className={`sidebar-sub ${inventoryOpen ? 'open' : ''}`}>
              <button className={`sidebar-button sub ${activeSection === 'inventory:ingredients' ? 'active' : ''}`} onClick={() => onSelect?.('inventory:ingredients')}>
                Ingredients
              </button>
              <button className={`sidebar-button sub ${activeSection === 'inventory:recipes' ? 'active' : ''}`} onClick={() => onSelect?.('inventory:recipes')}>
                Recipes
              </button>
              <button className={`sidebar-button sub ${activeSection === 'inventory:transactions' ? 'active' : ''}`} onClick={() => onSelect?.('inventory:transactions')}>
                Stock Transactions
              </button>
            </div>
          )}
          {renderCollapsedPopover('inventory', 'Inventory', [
            { id: 'inventory:ingredients', label: 'Ingredients' },
            { id: 'inventory:recipes', label: 'Recipes' },
            { id: 'inventory:transactions', label: 'Stock Transactions' }
          ])}
        </div>

        {/* Reports */}
        <div
          className="sidebar-group"
          onMouseEnter={() => !isOpen && setHoveredMenu('reports')}
          onMouseLeave={() => !isOpen && setHoveredMenu(null)}
        >
          <button
            className={`sidebar-button ${activeSection.startsWith('reports') ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
            onClick={() => (isOpen ? setReportsOpen((v) => !v) : setHoveredMenu('reports'))}
            title="REPORTS"
          >
            <span className="sidebar-icon">{iconMap.reports}</span>
            <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>Reports</span>
            {isOpen && <span className="ms-auto">{reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
          </button>
          {isOpen && (
            <div className={`sidebar-sub ${reportsOpen ? 'open' : ''}`}>
              <button className={`sidebar-button sub ${activeSection === 'reports:company' ? 'active' : ''}`} onClick={() => onSelect?.('reports:company')}>
                Company
              </button>
              <button className={`sidebar-button sub ${activeSection === 'reports:waiter' ? 'active' : ''}`} onClick={() => onSelect?.('reports:waiter')}>
                Waiter
              </button>
              <button className={`sidebar-button sub ${activeSection === 'reports:kitchen' ? 'active' : ''}`} onClick={() => onSelect?.('reports:kitchen')}>
                Kitchen
              </button>
              <button className={`sidebar-button sub ${activeSection === 'reports:stock' ? 'active' : ''}`} onClick={() => onSelect?.('reports:stock')}>
                Stock
              </button>
            </div>
          )}
          {renderCollapsedPopover('reports', 'Reports', [
            { id: 'reports:company', label: 'Company' },
            { id: 'reports:waiter', label: 'Waiter' },
            { id: 'reports:kitchen', label: 'Kitchen' },
            { id: 'reports:stock', label: 'Stock' }
          ])}
        </div>

        {/* History */}
        <button
          className={`sidebar-button ${activeSection === 'history' ? 'active' : ''} ${isOpen ? '' : 'compact'}`}
          onClick={() => onSelect?.('history')}
          title="HISTORY"
        >
          <span className="sidebar-icon">{iconMap.history}</span>
          <span className={`sidebar-label ${isOpen ? '' : 'hidden'}`}>History</span>
        </button>
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
              <button className="sidebar-button sub" onClick={() => setProfileOpen(false)}>
                <span className="sidebar-icon"><UserRound size={14} /></span>
                Profile Setting
              </button>
              <button className="sidebar-button sub" onClick={() => setProfileOpen(false)}>
                <span className="sidebar-icon"><Settings size={14} /></span>
                Preferences
              </button>
              <button className="sidebar-button sub danger" onClick={handleLogout}>
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

export default AdminSidebar;
