import React from 'react';
import { Bell, ShoppingBag, Activity } from 'lucide-react';

const iconMap = {
  order:           { icon: <ShoppingBag size={16} />, bg: 'bg-orange-100 text-orange-500' },
  'order paid':    { icon: <ShoppingBag size={16} />, bg: 'bg-emerald-100 text-emerald-500' },
  'order cancelled':{ icon: <ShoppingBag size={16} />, bg: 'bg-rose-100 text-rose-500' },
  activity:        { icon: <Activity size={16} />,    bg: 'bg-blue-100 text-blue-500' },
  default:         { icon: <Bell size={16} />,        bg: 'bg-slate-100 text-slate-500' },
};

const getIcon = (type = '', tab = '') => {
  const key = (type || tab || '').toLowerCase();
  return (
    Object.entries(iconMap).find(([k]) => key.includes(k)) || 
    ['default', iconMap.default]
  )[1];
};

const NotificationItem = ({ notification, tab }) => {
  const { icon, bg } = getIcon(notification.type, tab);
  const time = notification.date
    ? `${notification.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${notification.date.toLocaleDateString()}`
    : '';

  return (
    <div className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0">
      {/* Icon */}
      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${bg}`}>
        {icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">
          {notification.title || notification.type || 'Notification'}
        </p>
        {(notification.message || notification.msg) && (
          <p className="text-xs font-semibold text-slate-500 mt-0.5 line-clamp-2">
            {notification.message || notification.msg}
          </p>
        )}
        {tab === 'order' && (
          <button className="mt-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
            View KOT →
          </button>
        )}
      </div>

      {/* Time */}
      <span className="text-[10px] font-semibold text-slate-400 shrink-0 mt-1 whitespace-nowrap">
        {time}
      </span>
    </div>
  );
};

export default NotificationItem;
