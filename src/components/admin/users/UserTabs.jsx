import React from 'react';

const tabConfig = [
  { key: 'active',   label: 'Active',   dot: 'bg-emerald-500' },
  { key: 'pending',  label: 'Pending',  dot: 'bg-amber-500' },
  { key: 'inactive', label: 'Inactive', dot: 'bg-rose-500' },
];

const UserTabs = ({ tab, counts, onChange }) => (
  <div className="flex items-center gap-1 px-6 bg-white border-b border-slate-100">
    {tabConfig.map((t) => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={`relative flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all
          ${tab === t.key
            ? 'text-orange-500 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-orange-500 after:rounded-full'
            : 'text-slate-500 hover:text-slate-800'
          }`}
      >
        <span className={`w-2 h-2 rounded-full ${t.dot}`} />
        {t.label}
        <span
          className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black
            ${tab === t.key
              ? 'bg-orange-100 text-orange-600'
              : 'bg-slate-100 text-slate-500'
            }`}
        >
          {counts[t.key] ?? 0}
        </span>
      </button>
    ))}
  </div>
);

export default UserTabs;
