/**
 * kitchen/sidebar/KitchenSidebarHeader.jsx
 * Brand logo + collapse/expand toggle — mirrors admin SidebarHeader.
 */
import React from 'react';
import { X, ChevronRight, ChevronsUpDown, ChefHat } from 'lucide-react';

const KitchenSidebarHeader = ({ isOpen, isMobile, onToggleSidebar }) => {
  const compact = !isOpen && !isMobile;

  return (
    <div
      className={`shrink-0 px-4 pt-4 pb-3 ${
        compact ? 'flex flex-col items-center gap-3' : 'flex items-center justify-between'
      }`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-2.5 ${compact ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200 shrink-0">
          <ChefHat size={18} className="text-white" strokeWidth={2.5} />
        </div>
        {!compact && (
          <div className="leading-tight">
            <div className="font-extrabold text-slate-900 text-[15px] tracking-tight leading-none">
              Kitchen
            </div>
            <div className="text-[10px] font-semibold text-orange-500 tracking-widest uppercase leading-none mt-0.5">
              Display
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleSidebar}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        {isMobile
          ? <X size={15} />
          : compact
          ? <ChevronRight size={15} />
          : <ChevronsUpDown size={15} className="rotate-90" />}
      </button>
    </div>
  );
};

export default KitchenSidebarHeader;
