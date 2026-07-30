import React from 'react';
import { ShoppingBag, Activity } from 'lucide-react';

const tabConfig = [
  { id: 'order',    label: 'Order',    icon: <ShoppingBag size={14} /> },
  { id: 'activity', label: 'Activity', icon: <Activity size={14} /> },
];

const NotificationTabs = ({ tab, onChange }) => (
  <div className="flex items-center gap-1 px-5 bg-white border-b border-slate-100">
    {tabConfig.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition-all
          ${tab === t.id
            ? 'text-orange-500 after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-orange-500 after:rounded-full'
            : 'text-slate-500 hover:text-slate-800'
          }`}
      >
        {t.icon}
        {t.label}
      </button>
    ))}
  </div>
);

export default NotificationTabs;
