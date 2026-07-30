/**
 * sidebar/components/SidebarNav.jsx
 * All navigation items: core sections + expandable groups.
 * Dynamically switches to Settings or Finance specific navigation menus
 * when the active section matches.
 */
import React from 'react';
import { Wallet, History, Settings, ArrowLeft, Landmark } from 'lucide-react';
import { canAccessSection } from '../../../../common/accessControl.js';
import { hasPermission } from '../../../../api/session.js';
import { NavBtn, GroupBtn, SubBtn, SubMenu, CollapsedPopover } from './SidebarPrimitives.jsx';
import { iconMap, coreSections, navGroups, financeNavItems, settingsNavGroups } from './sidebarConfig.jsx';

const SidebarNav = ({
  isOpen,
  isMobile,
  activeSection,
  handleSelect,
  openMenus,        // { tables, menu, inventory, reports }
  toggleMenu,
  hoveredMenu,
  setHoveredMenu,
  unreadCount,
  isSuperAdmin,
}) => {
  const compact = !isOpen && !isMobile;
  const canAccess = (section) => canAccessSection(section, hasPermission, { isSuperAdmin });

  const isFinance = activeSection.startsWith('finance');
  const isSettings = activeSection.startsWith('settings');

  // ─── 1. FINANCE SUB-MENU ───
  if (isFinance) {
    const parts = activeSection.split(':');
    const view = parts[1] || 'dashboard';

    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-3 pb-4 flex flex-col gap-0.5">
        {/* Back button */}
        <button
          onClick={() => handleSelect('dashboard')}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-[13px] font-semibold mb-2 transition-colors ${
            compact ? 'justify-center px-0' : ''
          }`}
        >
          <ArrowLeft size={16} />
          {!compact && <span>Main Menu</span>}
        </button>

        {!compact && (
          <div className="flex items-center gap-2 px-3 py-1 mb-2 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
            <Landmark size={12} />
            Finance Menu
          </div>
        )}

        {financeNavItems.map((item) => {
          const isActive = view === item.id;
          return (
            <NavBtn
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={isActive}
              compact={compact}
              title={item.label.toUpperCase()}
              onClick={() => {
                if (item.sub) {
                  handleSelect(`finance:${item.id}:${item.sub}`);
                } else {
                  handleSelect(`finance:${item.id}`);
                }
              }}
            />
          );
        })}
      </div>
    );
  }

  // ─── 2. SETTINGS SUB-MENU ───
  if (isSettings) {
    const parts = activeSection.split(':');
    const view = parts[1] || 'restaurant-details';

    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-3 pb-4 flex flex-col gap-0.5">
        {/* Back button */}
        <button
          onClick={() => handleSelect('dashboard')}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-[13px] font-semibold mb-2 transition-colors ${
            compact ? 'justify-center px-0' : ''
          }`}
        >
          <ArrowLeft size={16} />
          {!compact && <span>Main Menu</span>}
        </button>

        {!compact && (
          <div className="flex items-center gap-2 px-3 py-1 mb-2 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
            <Settings size={12} />
            Settings Menu
          </div>
        )}

        {settingsNavGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-0.5 mb-3">
            {!compact && (
              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider px-3 mb-1">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = view === item.id;
              return (
                <NavBtn
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={isActive}
                  compact={compact}
                  title={item.label.toUpperCase()}
                  onClick={() => handleSelect(`settings:${item.id}`)}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // ─── 3. DEFAULT MAIN MENU ───
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-3 pb-4 flex flex-col gap-0.5">

      {/* Core sections */}
      {coreSections
        .filter((s) => canAccess(s))
        .map((section) => (
          <NavBtn
            key={section}
            icon={iconMap[section]}
            label={section.charAt(0).toUpperCase() + section.slice(1)}
            active={activeSection === section || activeSection.startsWith(`${section}:`)}
            compact={compact}
            badge={section === 'notifications' ? unreadCount : undefined}
            title={section.toUpperCase()}
            onClick={() => handleSelect(section === 'settings' ? 'settings:restaurant-details' : section)}
          />
        ))}

      {/* Separator */}
      <div className="my-2 border-t border-dashed border-slate-100" />

      {/* Expandable nav groups (Tables, Menu, Inventory, Reports) */}
      {Object.entries(navGroups).map(([key, group]) => {
        if (!canAccess(group.access)) return null;
        const isGroupOpen = !!openMenus[key];
        const isHovered   = compact && hoveredMenu === key;
        const isActive    = activeSection.startsWith(group.prefix);

        return (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => compact && setHoveredMenu(key)}
            onMouseLeave={() => compact && setHoveredMenu(null)}
          >
            <GroupBtn
              icon={group.icon}
              label={group.label}
              active={isActive}
              compact={compact}
              open={isGroupOpen}
              title={group.label.toUpperCase()}
              onClick={() => isOpen ? toggleMenu(key) : setHoveredMenu(key)}
            />

            {/* Expanded sub-items */}
            {isOpen && (
              <SubMenu open={isGroupOpen}>
                {group.links
                  .filter((l) => canAccess(l.access))
                  .map((l) => (
                    <SubBtn
                      key={l.id}
                      icon={l.icon}
                      label={l.label}
                      active={activeSection === l.id}
                      onClick={() => handleSelect(l.id)}
                    />
                  ))}
              </SubMenu>
            )}

            {/* Collapsed hover popover */}
            <CollapsedPopover
              title={group.label}
              show={isHovered}
              activeSection={activeSection}
              handleSelect={handleSelect}
              links={group.links.filter((l) => canAccess(l.access))}
            />
          </div>
        );
      })}

      {/* Finance (standalone trigger link) */}
      {canAccess('finance:dashboard') && (
        <NavBtn
          icon={<Wallet size={16} strokeWidth={2} />}
          label="Finance"
          active={activeSection.startsWith('finance')}
          compact={compact}
          title="FINANCE"
          onClick={() => handleSelect('finance:dashboard')}
        />
      )}

      {/* History */}
      {canAccess('history') && (
        <NavBtn
          icon={<History size={16} strokeWidth={2} />}
          label="History"
          active={activeSection === 'history'}
          compact={compact}
          title="HISTORY"
          onClick={() => handleSelect('history')}
        />
      )}

      {/* Settings (standalone trigger link) */}
      {canAccess('settings:restaurant-details') && (
        <NavBtn
          icon={<Settings size={16} strokeWidth={2} />}
          label="Settings"
          active={activeSection.startsWith('settings')}
          compact={compact}
          title="SETTINGS"
          onClick={() => handleSelect('settings:restaurant-details')}
        />
      )}
    </div>
  );
};

export default SidebarNav;
