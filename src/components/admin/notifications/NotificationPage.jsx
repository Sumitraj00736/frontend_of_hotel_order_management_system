import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getPushStatus, isPushSupported, subscribePush, unsubscribePush, sendTestPush, getCurrentBrowserToken } from '../../../utils/pushClient.js';
import '../../../common/css/admin/notifications/notification.css';

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
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushError, setPushError] = useState('');
  const prevCountRef = useRef(notifications.length);
  const initAttemptedRef = useRef(false);

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

  useEffect(() => {
    const prevCount = prevCountRef.current;
    if (notifications.length > prevCount) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = 880;
        gain.gain.value = 0.15;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.18);
      } catch (err) {
        // ignore audio errors
      }
    }
    prevCountRef.current = notifications.length;
  }, [notifications.length]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (initAttemptedRef.current) return;
      initAttemptedRef.current = true;
      console.log('[FCM] NotificationPage init attempted');
      const supported = await isPushSupported();
      if (!mounted) return;
      setPushSupported(Boolean(supported));
      if (!supported) return;
      try {
        const [status, browserToken] = await Promise.all([
          getPushStatus(),
          getCurrentBrowserToken()
        ]);
        
        if (!mounted) return;

        // If it exists and token matches, just set status
        if (status?.exists && (!browserToken || status.fcmToken === browserToken)) {
          setPushEnabled(Boolean(status?.enabled));
          return;
        }

        // If missing or token stale, and we have permission, auto-resync
        if (Notification.permission === 'granted') {
          await subscribePush();
          if (mounted) {
            setPushEnabled(true);
            setPushError('');
          }
        } else if (status?.exists) {
          // It exists on server but we don't have permission/token here
          setPushEnabled(false);
        }
      } catch (err) {
        if (mounted) {
          console.warn('Push status check failed:', err);
          setPushError(err?.response?.data?.message || err?.message || 'Push status check failed');
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const formatDayLabel = (date) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((startOfToday - startOfDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleTab = (nextTab) => {
    setTab(nextTab);
    onFilterChange?.({ category: nextTab });
  };

  return (
    <div className="notification-page">
      <div className="notify-top">
        <h3 className="page-title mb-0">Notification</h3>
        <div className="notify-actions">
          {pushSupported && (
            <div className={`notify-push-toggle ${pushEnabled ? 'on' : 'off'} ${pushLoading ? 'busy' : ''}`}>
              <span>Push</span>
              <label className="notify-switch">
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  disabled={pushLoading}
                  onChange={async () => {
                    if (pushLoading) return;
                    setPushLoading(true);
                    try {
                      if (pushEnabled) {
                        await unsubscribePush();
                        setPushEnabled(false);
                        setPushError('');
                      } else {
                        await subscribePush();
                        setPushEnabled(true);
                        setPushError('');
                      }
                    } catch (err) {
                      setPushError(err?.message || 'Push setup failed');
                    } finally {
                      setPushLoading(false);
                    }
                  }}
                />
                <span />
              </label>
            </div>
          )}
          {pushSupported && pushEnabled && (
            <button 
              className="chip test-push-btn"
              onClick={async () => {
                try {
                  await sendTestPush();
                  setPushError('');
                } catch (err) {
                  const message = err?.response?.data?.message || err?.message || 'Test push failed';
                  setPushError(message);
                }
              }}
            >
              Test Push
            </button>
          )}
          {tab === 'activity' && (
            <button
              className={`notify-filter-toggle ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen((v) => !v)}
            >
              <span className="filter-icon">⎚</span>
              Filter
            </button>
          )}
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
      {pushError && <div className="notify-error">{pushError}</div>}

      {tab === 'activity' && filterOpen && (
        <div className="notify-filters">
          {filterChips.map((chip) => {
            const val = filters?.[chip.id];
            const label = typeof chip.label === 'function' ? chip.label(val) : chip.label;
            return (
              <button
                key={chip.id}
                className={`filter-chip ${activeFilter === chip.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(chip.id)}
              >
                {label}
              </button>
            );
          })}
          <div className="filter-popover">
            {activeFilter === 'dateRange' && (
              <div className="filter-list">
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`filter-option ${filters?.dateRange === opt ? 'selected' : ''}`}
                    onClick={() => { onFilterChange?.({ dateRange: opt === 'Lifetime' ? undefined : opt }); }}
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
                    onClick={() => { onFilterChange?.({ type: opt === 'All' ? undefined : opt }); }}
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
                    onFilterChange?.({ [activeFilter]: value });
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 && <div className="text-muted mt-3">No notifications.</div>}

      {Object.entries(grouped).map(([day, items]) => (
        <div key={day} className="notify-day">
          <div className="notify-day-title">{formatDayLabel(items[0]?.date || new Date(day))}</div>
          <div className={`notify-list ${tab === 'activity' ? 'activity' : 'order'}`}>
            {items.map((n, idx) => (
              <div key={idx} className="notify-item">
                <div className="notify-icon">🔔</div>
                <div className="notify-body">
                  <div className="notify-title">{n.title || n.type || 'Notification'}</div>
                  <div className="notify-text">{n.message || n.msg || ''}</div>
                  {tab === 'order' && (
                    <button className="notify-link">View KOT</button>
                  )}
                </div>
                <div className="notify-time">
                  {n.date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}/{' '}
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
