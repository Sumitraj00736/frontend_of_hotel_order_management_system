import React, { useRef } from 'react';

const filterChips = [
  { id: 'dateRange',   label: (v) => v || 'Lifetime' },
  { id: 'type',        label: (v) => `Type: ${v || 'All'}` },
  { id: 'staffId',     label: (v) => `Staff: ${v || 'All'}` },
  { id: 'tableNumber', label: (v) => `Table: ${v || 'All'}` },
  { id: 'dishId',      label: (v) => `Dish: ${v || 'All'}` },
  { id: 'supplierId',  label: (v) => `Supplier: ${v || 'All'}` },
  { id: 'customerId',  label: (v) => `Customer: ${v || 'All'}` },
  { id: 'stockItemId', label: (v) => `Stock: ${v || 'All'}` },
];

const dateOptions = ['Lifetime', 'Today', 'Yesterday', 'This Month', 'Last Month', 'This Year', 'By Month', 'By Year', 'Custom'];
const typeOptions = ['All', 'Staff invited', 'Restaurant created', 'Order paid', 'Order cancelled'];

const NotificationFilters = ({ filters, activeFilter, onFilterChipClick, onFilterChange }) => {
  const inputRef = useRef(null);

  const applyInput = () => {
    const value = inputRef.current?.value || undefined;
    onFilterChange?.({ [activeFilter]: value });
  };

  return (
    <div className="px-5 py-3 bg-white border-b border-slate-100 flex flex-col gap-3">
      {/* Chip row */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterChips.map((chip) => {
          const val   = filters?.[chip.id];
          const label = typeof chip.label === 'function' ? chip.label(val) : chip.label;
          const active = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onFilterChipClick(chip.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                ${active
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-orange-400 hover:text-orange-500'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Popover options */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
        {activeFilter === 'dateRange' && (
          <div className="flex flex-wrap gap-2">
            {dateOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onFilterChange?.({ dateRange: opt === 'Lifetime' ? undefined : opt })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all
                  ${filters?.dateRange === opt || (!filters?.dateRange && opt === 'Lifetime')
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-500'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {activeFilter === 'type' && (
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onFilterChange?.({ type: opt === 'All' ? undefined : opt })}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all
                  ${filters?.type === opt || (!filters?.type && opt === 'All')
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-500'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {activeFilter !== 'dateRange' && activeFilter !== 'type' && (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all"
              placeholder="Enter value and press Enter or Apply"
              defaultValue={filters?.[activeFilter] || ''}
              onKeyDown={(e) => { if (e.key === 'Enter') applyInput(); }}
            />
            <button
              onClick={applyInput}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm shadow-orange-200 transition-all active:scale-95"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationFilters;
