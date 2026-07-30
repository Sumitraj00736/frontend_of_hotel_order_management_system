import React from 'react';

const OrdersFilterTabs = ({ filter, onChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
      <button 
        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 snap-start flex-shrink-0 ${
          filter === 'active' 
            ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/10' 
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
        }`} 
        onClick={() => onChange('active')}
      >
        Recent Orders
      </button>
      <button 
        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 snap-start flex-shrink-0 ${
          filter === 'kot' 
            ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/10' 
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
        }`} 
        onClick={() => onChange('kot')}
      >
        KOT Tab
      </button>
      <button 
        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 snap-start flex-shrink-0 ${
          ['paid', 'cancelled', 'all'].includes(filter) 
            ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/10' 
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
        }`} 
        onClick={() => onChange('all')}
      >
        Order History
      </button>
      <button 
        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 snap-start flex-shrink-0 ${
          filter === 'analytics' 
            ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/10' 
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
        }`} 
        onClick={() => onChange('analytics')}
      >
        Order Analytics
      </button>
    </div>
  );
};

export default OrdersFilterTabs;
