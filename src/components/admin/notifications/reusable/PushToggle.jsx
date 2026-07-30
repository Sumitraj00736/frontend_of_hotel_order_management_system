import React from 'react';
import { Loader2 } from 'lucide-react';

const PushToggle = ({ enabled, loading, supported, onToggle }) => {
  if (!supported) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-500">Push</span>
      <button
        onClick={onToggle}
        disabled={loading}
        aria-label="Toggle push notifications"
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400/40
          ${enabled ? 'bg-orange-500' : 'bg-slate-200'}
          ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ height: '22px', width: '40px' }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200
            ${enabled ? 'translate-x-[18px]' : 'translate-x-0'}
          `}
          style={{ width: '18px', height: '18px' }}
        />
        {loading && (
          <Loader2 size={10} className="absolute inset-0 m-auto text-white animate-spin" />
        )}
      </button>
    </div>
  );
};

export default PushToggle;
