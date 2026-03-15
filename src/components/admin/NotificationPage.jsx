import React, { useMemo, useState } from 'react';
import '../../common/css/admin/notification.css';

const tabs = [
  { id: 'order', label: 'Order' },
  { id: 'activity', label: 'Activity' }
];

const filterChips = [
  { id: 'dateRange', label: (v) => v || 'Lifetime' },
  { id: 'type', label: (v) => `Type: ${v || 'All'}` },
  { id: 'staffId', label: (v) => `Staff: ${v || 'All'}` },
  { id: 'tableNumber', label: (v) => `Table: ${v || 'All'}` },
  { id: 'dishId', label: (v) => `Dish: ${v || 'All'}` },
  { id: 'supplierId', label: (v) => `Supplier: ${v || 'All'}` },
  { id: 'customerId', label: (v) => `Customer: ${v || 'All'}` },
  { id: 'stockItemId', label: (v) => `Stock Item: ${v || 'All'}` }
];

const dateOptions = ['Lifetime', 'Today', 'Yesterday', 'This Month', 'Last Month', 'This Year', 'By Month', 'By Year', 'Custom'];
const typeOptions = ['All', 'Staff invited', 'Restaurant created', 'Order paid', 'Order cancelled'];

const NotificationPage = ({ notifications = [], onMarkAll, filters, onFilterChange }) => {
  const [tab, setTab] = useState(filters?.category || 'activity');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('dateRange');

  const grouped = useMemo(() => {
    const byDay = {};
    notifications.forEach((n) => {
      const date = n.createdAt ? new Date(n.createdAt) : new Date();
      const day = date.toDateString();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push({ ...n, date });
    });
    return byDay;
  }, [notifications]);

  const handleTab = (nextTab) => {
    setTab(nextTab);
    onFilterChange?.({ category: nextTab });
  };

  return (
    <div className="notification-page">
      <div className="notify-top">
        <h3 className="page-title mb-0">Notification</h3>
        <div className="notify-actions">
          <button className="chip" onClick={onMarkAll}>Mark all read</button>
        </div>
      </div>

      <div className="notify-tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`notify-tab ${tab === t.id ? 'active' : ''}`} onClick={() => handleTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'activity' && (
        <div className="notify-filters">
          <button
            className={`filter-chip ${filterOpen ? 'active' : ''}`}
            onClick={() => setFilterOpen((v) => !v)}
          >
            Filters
          </button>
          {filterChips.map((chip) => {
            const val = filters?.[chip.id];
            const label = typeof chip.label === 'function' ? chip.label(val) : chip.label;
            return (
              <button
                key={chip.id}
                className={`filter-chip ${activeFilter === chip.id ? 'active' : ''}`}
                onClick={() => { setActiveFilter(chip.id); setFilterOpen(true); }}
              >
                {label}
              </button>
            );
          })}
          {filterOpen && (
            <div className="filter-popover">
              {activeFilter === 'dateRange' && (
                <div className="filter-list">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt}
                      className={`filter-option ${filters?.dateRange === opt ? 'selected' : ''}`}
                      onClick={() => { setFilterOpen(false); onFilterChange?.({ dateRange: opt === 'Lifetime' ? undefined : opt }); }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {activeFilter === 'type' && (
                <div className="filter-list">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt}
                      className={`filter-option ${filters?.type === opt ? 'selected' : ''}`}
                      onClick={() => { setFilterOpen(false); onFilterChange?.({ type: opt === 'All' ? undefined : opt }); }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {activeFilter !== 'dateRange' && activeFilter !== 'type' && (
                <div className="filter-list">
                  <input
                    className="filter-input"
                    placeholder="Enter value"
                    defaultValue={filters?.[activeFilter] || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setFilterOpen(false);
                        const value = e.target.value || undefined;
                        onFilterChange?.({ [activeFilter]: value });
                      }
                    }}
                  />
                  <button
                    className="chip apply"
                    onClick={() => {
                      const input = document.querySelector('.filter-input');
                      const value = input?.value || undefined;
                      setFilterOpen(false);
                      onFilterChange?.({ [activeFilter]: value });
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {Object.keys(grouped).length === 0 && <div className="text-muted mt-3">No notifications.</div>}

      {Object.entries(grouped).map(([day, items]) => (
        <div key={day} className="notify-day">
          <div className="notify-day-title">{day}</div>
          <div className="notify-list">
            {items.map((n, idx) => (
              <div key={idx} className="notify-item">
                <div className="notify-icon">🔔</div>
                <div className="notify-body">
                  <div className="notify-title">{n.title || n.type || 'Notification'}</div>
                  <div className="notify-text">{n.message || n.msg || ''}</div>
                </div>
                <div className="notify-time">
                  {n.date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                  {n.date?.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
