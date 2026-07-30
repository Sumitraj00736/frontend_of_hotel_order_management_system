import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  getPushStatus,
  isPushSupported,
  subscribePush,
  unsubscribePush,
  sendTestPush,
  getCurrentBrowserToken,
} from '../../../utils/pushClient.js';

import NotificationHeader  from './header/NotificationHeader.jsx';
import NotificationTabs    from './NotificationTabs.jsx';
import NotificationFilters from './filters/NotificationFilters.jsx';
import NotificationGroup   from './reusable/NotificationGroup.jsx';
import { Bell } from 'lucide-react';

/* ── Empty state ────────────────────────────────────────────── */
const NotificationEmpty = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
    <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200">
      <Bell size={32} className="text-slate-300" />
    </div>
    <p className="text-sm font-bold text-slate-500">No notifications yet</p>
    <p className="text-xs font-semibold text-slate-400">New activity will appear here.</p>
  </div>
);

/* ── Root ───────────────────────────────────────────────────── */
const NotificationPage = ({ notifications = [], onMarkAll, filters, onFilterChange }) => {
  const [tab,           setTab]          = useState(filters?.category || 'activity');
  const [filterOpen,    setFilterOpen]   = useState(false);
  const [activeFilter,  setActiveFilter] = useState('dateRange');
  const [pushEnabled,   setPushEnabled]  = useState(false);
  const [pushLoading,   setPushLoading]  = useState(false);
  const [pushSupported, setPushSupported]= useState(false);
  const [pushError,     setPushError]    = useState('');
  const prevCountRef     = useRef(notifications.length);
  const initAttemptedRef = useRef(false);

  /* ── Audio ping on new notification ──────────────────────── */
  useEffect(() => {
    const prevCount = prevCountRef.current;
    if (notifications.length > prevCount) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx        = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const gain       = ctx.createGain();
        oscillator.type            = 'sine';
        oscillator.frequency.value = 880;
        gain.gain.value            = 0.15;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.18);
      } catch { /* ignore audio errors */ }
    }
    prevCountRef.current = notifications.length;
  }, [notifications.length]);

  /* ── Push init ──────────────────────────────────────────── */
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (initAttemptedRef.current) return;
      initAttemptedRef.current = true;
      const supported = await isPushSupported();
      if (!mounted) return;
      setPushSupported(Boolean(supported));
      if (!supported) return;
      try {
        const [status, browserToken] = await Promise.all([getPushStatus(), getCurrentBrowserToken()]);
        if (!mounted) return;
        if (status?.exists && (!browserToken || status.fcmToken === browserToken)) {
          setPushEnabled(Boolean(status?.enabled));
          return;
        }
        if (Notification.permission === 'granted') {
          await subscribePush();
          if (mounted) { setPushEnabled(true); setPushError(''); }
        } else if (status?.exists) {
          setPushEnabled(false);
        }
      } catch (err) {
        if (mounted) setPushError(err?.response?.data?.message || err?.message || 'Push status check failed');
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  /* ── Group notifications by day ─────────────────────────── */
  const grouped = useMemo(() => {
    const byDay = {};
    notifications.forEach((n) => {
      const date = n.createdAt ? new Date(n.createdAt) : new Date();
      const day  = date.toDateString();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push({ ...n, date });
    });
    return byDay;
  }, [notifications]);

  const handleTab = (nextTab) => {
    setTab(nextTab);
    onFilterChange?.({ category: nextTab });
  };

  const handlePushToggle = async () => {
    if (pushLoading) return;
    setPushLoading(true);
    try {
      if (pushEnabled) {
        await unsubscribePush(); setPushEnabled(false); setPushError('');
      } else {
        await subscribePush();   setPushEnabled(true);  setPushError('');
      }
    } catch (err) {
      setPushError(err?.message || 'Push setup failed');
    } finally {
      setPushLoading(false);
    }
  };

  const handleTestPush = async () => {
    try {
      await sendTestPush(); setPushError('');
    } catch (err) {
      setPushError(err?.response?.data?.message || err?.message || 'Test push failed');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50/60 overflow-hidden">
      {/* Sticky Header */}
      <NotificationHeader
        tab={tab}
        filterOpen={filterOpen}
        onFilterToggle={() => setFilterOpen((v) => !v)}
        onMarkAll={onMarkAll}
        pushSupported={pushSupported}
        pushEnabled={pushEnabled}
        pushLoading={pushLoading}
        onPushToggle={handlePushToggle}
        onTestPush={handleTestPush}
      />

      {/* Error banner */}
      {pushError && (
        <div className="mx-5 mt-3 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
          ⚠ {pushError}
        </div>
      )}

      {/* Tab Bar */}
      <NotificationTabs tab={tab} onChange={handleTab} />

      {/* Filters panel */}
      {tab === 'activity' && filterOpen && (
        <NotificationFilters
          filters={filters}
          activeFilter={activeFilter}
          onFilterChipClick={setActiveFilter}
          onFilterChange={onFilterChange}
        />
      )}

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 py-5">
          {Object.keys(grouped).length === 0 ? (
            <NotificationEmpty />
          ) : (
            Object.entries(grouped).map(([day, items]) => (
              <NotificationGroup key={day} day={day} items={items} tab={tab} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
