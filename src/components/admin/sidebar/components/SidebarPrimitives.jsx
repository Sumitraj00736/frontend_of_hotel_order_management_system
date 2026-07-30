/**
 * sidebar/components/SidebarPrimitives.jsx
 * Small, reusable atomic components used across the sidebar.
 * NavBtn, GroupBtn, SubBtn, SubMenu, CollapsedPopover
 */
import React from 'react';
import { ChevronDown } from 'lucide-react';

/** A single top-level nav button */
export const NavBtn = ({ icon, label, active, compact, badge, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
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
    {active && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-orange-500" />
    )}
    <span className={`shrink-0 transition-colors ${active ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`}>
      {icon}
    </span>
    {!compact && <span className="truncate">{label}</span>}
    {!compact && badge != null && badge > 0 && (
      <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </button>
);

/** A collapsible group parent button */
export const GroupBtn = ({ icon, label, active, compact, open, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`
      group flex items-center gap-3 w-full text-left
      px-3 py-2.5 rounded-xl text-[13px] font-medium
      transition-all duration-200 outline-none select-none
      ${active
        ? 'bg-orange-50 text-orange-600'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
      ${compact ? 'justify-center px-0' : ''}
    `}
  >
    <span className={`shrink-0 transition-colors ${active ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'}`}>
      {icon}
    </span>
    {!compact && (
      <>
        <span className="truncate">{label}</span>
        <span className={`ml-auto transition-transform duration-200 text-slate-400 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown size={13} />
        </span>
      </>
    )}
  </button>
);

/** A sub-menu item */
export const SubBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2.5 w-full text-left
      pl-3 pr-3 py-2 rounded-lg text-[12px] font-medium
      transition-all duration-150 select-none
      ${active
        ? 'bg-orange-100 text-orange-600'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
    `}
  >
    <span className={`shrink-0 ${active ? 'text-orange-500' : 'text-slate-400'}`}>{icon}</span>
    {label}
  </button>
);

/** Animated sub-menu container */
export const SubMenu = ({ open, children }) => (
  <div
    className={`overflow-hidden transition-all duration-300 ease-in-out ${
      open ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
    }`}
  >
    <div className="flex flex-col gap-0.5 pl-4 border-l-2 border-slate-100 ml-4">
      {children}
    </div>
  </div>
);

/** Floating popover for collapsed (icon-only) sidebar mode */
export const CollapsedPopover = ({ title, links, activeSection, handleSelect, show }) => {
  if (!show) return null;
  return (
    <div className="absolute left-[72px] top-0 z-[1500]">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/80 p-3 min-w-[200px]">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 mb-1 border-b border-slate-100">
          {title}
        </div>
        <div className="flex flex-col gap-0.5">
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
                ${activeSection === id ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
