/**
 * sidebar/components/SidebarLocation.jsx
 * Restaurant name, branch switcher, and Premium badge.
 */
import React from 'react';
import { ChevronDown, Building2, Plus, Sparkles } from 'lucide-react';

const SidebarLocation = ({
  isOpen,
  branchOpen,
  setBranchOpen,
  activeBranch,
  activeBranchId,
  restaurantName,
  branches,
  isSuperAdmin,
  onManageBranches,
  setBranchId,
}) => {
  const compact = !isOpen;

  return (
    <div className="shrink-0 px-3 pb-3">
      {/* Branch / Restaurant trigger button */}
      <button
        onClick={() => isOpen && setBranchOpen((v) => !v)}
        className={`
          w-full flex items-center gap-2.5
          px-3 py-2.5 rounded-xl
          bg-gradient-to-br from-orange-50 to-amber-50
          border border-orange-100
          transition-colors hover:border-orange-200
          ${compact ? 'justify-center' : ''}
        `}
      >
        {/* Icon */}
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
          <Building2 size={14} className="text-orange-500" />
        </div>

        {/* Text */}
        {!compact && (
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[12px] font-bold text-slate-800 truncate leading-tight">
              {restaurantName}
            </div>
            {activeBranch?.branchName && (
              <div className="text-[10px] text-slate-400 font-medium truncate">
                {activeBranch.branchName}
              </div>
            )}
          </div>
        )}

        {/* Pro badge + chevron */}
        {!compact && (
          <div className="shrink-0 flex items-center gap-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-bold">
              <Sparkles size={8} /> PRO
            </span>
            <ChevronDown
              size={12}
              className={`text-slate-400 transition-transform ${branchOpen ? 'rotate-180' : ''}`}
            />
          </div>
        )}
      </button>

      {/* Branch dropdown */}
      {branchOpen && !compact && (
        <div className="mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 p-2 flex flex-col gap-1 z-50 relative">
          {branches.map((b) => (
            <button
              key={b.branchId || b._id}
              onClick={() => { setBranchId(b.branchId || b._id); window.location.reload(); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-left transition-colors
                ${activeBranchId === (b.branchId || b._id)
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
            >
              {b.branchName || b.name || b.code || 'Branch'}
            </button>
          ))}
          {isSuperAdmin && (
            <button
              className="flex items-center justify-center gap-1.5 px-3 py-2 mt-1 rounded-lg text-[12px] font-semibold text-slate-500 border border-dashed border-slate-200 hover:border-slate-300 hover:text-slate-700 transition-colors"
              onClick={onManageBranches}
            >
              <Plus size={12} /> Manage Branches
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarLocation;
