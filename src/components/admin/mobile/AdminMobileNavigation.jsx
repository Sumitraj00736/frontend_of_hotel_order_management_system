import React, { useMemo, useRef, useState } from 'react';
import { BarChart3, Bell, BookOpen, Boxes, Grid2x2, History, Home, ListChecks, Settings, Table2, Users, X, Globe } from 'lucide-react';

const AdminMobileNavigation = ({ isMobile, activeSection, onChangeSection, canAccess }) => {
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const touchStartY = useRef(0);

  const mobileMenuItems = useMemo(() => {
    const tabs = [
      { key: 'dashboard', label: 'Home', icon: Home, match: (section) => section === 'dashboard', permission: 'dashboard:view' },
      { key: 'orders', label: 'Orders', icon: ListChecks, match: (section) => section === 'orders', permission: 'orders:view' },
      { key: 'users', label: 'Users', icon: Users, match: (section) => section === 'users', permission: 'staff:view' },
      { key: 'customers', label: 'Customers', icon: Users, match: (section) => section === 'customers', permission: 'customers:view' },
      { key: 'tables:table', label: 'Tables', icon: Table2, match: (section) => section.startsWith('tables'), permission: 'tables:view' },
      { key: 'menu:dishes', label: 'Menu', icon: BookOpen, match: (section) => section.startsWith('menu'), permission: 'menu:view' },
      { key: 'inventory:ingredients', label: 'Stock', icon: Boxes, match: (section) => section.startsWith('inventory'), permission: 'inventory:view' },
      { key: 'reports:company', label: 'Reports', icon: BarChart3, match: (section) => section.startsWith('reports'), permission: 'reports:view' },
      { key: 'history', label: 'History', icon: History, match: (section) => section === 'history', permission: 'reports:view' },
      { key: 'website', label: 'Website', icon: Globe, match: (section) => section === 'website', permission: 'website:view' },
      { key: 'notifications', label: 'Alerts', icon: Bell, match: (section) => section === 'notifications', permission: 'notifications:view' },
      { key: 'settings:restaurant-details', label: 'Settings', icon: Settings, match: (section) => section.startsWith('settings'), permission: 'settings:view' }
    ];
    return tabs.filter((tab) => canAccess(tab.permission));
  }, [canAccess]);

  const mobilePrimaryTabs = useMemo(() => {
    const tabs = [
      { key: 'dashboard', label: 'Home', icon: Home, match: (section) => section === 'dashboard', permission: 'dashboard:view' },
      { key: 'orders', label: 'Orders', icon: ListChecks, match: (section) => section === 'orders', permission: 'orders:view' },
      { key: 'tables:table', label: 'Tables', icon: Table2, match: (section) => section.startsWith('tables'), permission: 'tables:view' },
      { key: 'menu:dishes', label: 'Menu', icon: BookOpen, match: (section) => section.startsWith('menu'), permission: 'menu:view' }
    ];
    return tabs.filter((tab) => canAccess(tab.permission));
  }, [canAccess]);

  const sectionSubTabs = useMemo(() => {
    if (activeSection.startsWith('tables')) {
      return [
        { id: 'tables:table', label: 'Table' },
        { id: 'tables:space', label: 'Space' },
        { id: 'tables:qr', label: 'QR Codes' }
      ];
    }
    if (activeSection.startsWith('menu')) {
      return [
        { id: 'menu:dishes', label: 'Dishes' },
        { id: 'menu:categories', label: 'Categories' },
        { id: 'menu:addons', label: 'Add-Ons' },
        { id: 'menu:submenus', label: 'Sub Menu' },
        { id: 'menu:combos', label: 'Combos' }
      ];
    }
    if (activeSection.startsWith('inventory')) {
      return [
        { id: 'inventory:ingredients', label: 'Ingredients' },
        { id: 'inventory:recipes', label: 'Recipes' },
        { id: 'inventory:transactions', label: 'Transactions' }
      ];
    }
    if (activeSection.startsWith('reports')) {
      return [
        { id: 'reports:company', label: 'Company' },
        { id: 'reports:waiter', label: 'Waiter' },
        { id: 'reports:kitchen', label: 'Kitchen' },
        { id: 'reports:stock', label: 'Stock' }
      ];
    }
    return [];
  }, [activeSection]);

  const isMoreSectionActive = useMemo(() => {
    return !(
      activeSection === 'dashboard' ||
      activeSection === 'orders' ||
      activeSection.startsWith('tables') ||
      activeSection.startsWith('menu')
    );
  }, [activeSection]);

  if (!isMobile) return null;

  return (
    <>
      {sectionSubTabs.length > 0 && (
        <div className="mobile-section-subtabs">
          {sectionSubTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`mobile-section-subtab ${activeSection === tab.id ? 'active' : ''}`}
              onClick={() => onChangeSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <nav
        className="mobile-admin-bottom-nav mobile-five-nav"
        aria-label="Admin quick navigation"
        onTouchStart={(event) => {
          touchStartY.current = event.changedTouches[0]?.clientY || 0;
        }}
        onTouchEnd={(event) => {
          const endY = event.changedTouches[0]?.clientY || 0;
          if (touchStartY.current - endY > 36) {
            setMenuSheetOpen(true);
          }
        }}
      >
        {mobilePrimaryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              className={`mobile-nav-item ${tab.match(activeSection) ? 'active' : ''}`}
              onClick={() => {
                onChangeSection(tab.key);
                setMenuSheetOpen(false);
              }}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={`mobile-nav-item ${menuSheetOpen || isMoreSectionActive ? 'active' : ''}`}
          onClick={() => setMenuSheetOpen((prev) => !prev)}
        >
          <Grid2x2 size={17} />
          <span>More</span>
        </button>
      </nav>

      {menuSheetOpen && <div className="mobile-menu-sheet-backdrop" onClick={() => setMenuSheetOpen(false)} />}
      <div className={`mobile-menu-sheet ${menuSheetOpen ? 'open' : ''}`} aria-hidden={!menuSheetOpen}>
        <div className="mobile-menu-sheet-handle" />
        <div className="mobile-menu-sheet-head">
          <strong>All Menu</strong>
          <button type="button" className="mobile-menu-sheet-close" onClick={() => setMenuSheetOpen(false)}>
            <X size={16} />
          </button>
        </div>
        {sectionSubTabs.length > 0 && (
          <div className="mobile-menu-subtabs">
            {sectionSubTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`mobile-menu-subtab ${activeSection === tab.id ? 'active' : ''}`}
                onClick={() => {
                  onChangeSection(tab.id);
                  setMenuSheetOpen(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        <div className="mobile-menu-sheet-grid">
          {mobileMenuItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                className={`mobile-menu-sheet-item ${tab.match(activeSection) ? 'active' : ''}`}
                onClick={() => {
                  onChangeSection(tab.key);
                  setMenuSheetOpen(false);
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminMobileNavigation;
