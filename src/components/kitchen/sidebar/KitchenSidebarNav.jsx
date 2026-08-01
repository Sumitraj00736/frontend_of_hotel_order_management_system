/**
 * kitchen/sidebar/KitchenSidebarNav.jsx
 * Navigation buttons for the kitchen sidebar.
 */
import React from 'react';
import { ListChecks, Bell, UserRound } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'orders',        label: 'Orders',        icon: ListChecks },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile',       label: 'Profile',       icon: UserRound },
];

const NavBtn = ({ icon: Icon, label, active, compact, badge, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    className={`
      group relative flex items-center gap-3 w-full text-left
      px-3 py-2.5 rounded-xl text-[13px] font-medium
      transition-all duration-200 outline-none select-none
      ${active
        ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-100'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
      ${compact ? 'justify-center px-0' : ''}
    `}
  >
    {/* Active left bar */}
    {active && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-orange-500" />
    )}

    {/* Icon */}
    <span className={`shrink-0 transition-colors ${active ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`}>
      <Icon size={20} strokeWidth={2} />
    </span>

    {/* Label */}
    {!compact && <span className="truncate">{label}</span>}

    {/* Badge */}
    {badge != null && badge > 0 && (
      <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold ${compact ? 'absolute -top-0.5 -right-0.5' : 'ml-auto'}`}>
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </button>
);

const KitchenSidebarNav = ({ isOpen, activeSection, onSelect, unreadCount }) => {
  const compact = !isOpen;

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
      <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-1.5 ${compact ? 'hidden' : ''}`}>
        Menu
      </div>
      {NAV_ITEMS.map(({ id, label, icon }) => (
        <NavBtn
          key={id}
          icon={icon}
          label={label}
          active={activeSection === id}
          compact={compact}
          badge={id === 'notifications' ? unreadCount : null}
          onClick={() => onSelect?.(id)}
        />
      ))}
    </nav>
  );
};

export default KitchenSidebarNav;
