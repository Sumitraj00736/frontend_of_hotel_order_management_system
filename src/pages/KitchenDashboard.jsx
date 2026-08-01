import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../api/client.js';
import NotificationToasts from '../components/NotificationToasts.jsx';
import { createSocket } from '../api/socket.js';
import { clearSession } from '../api/session.js';

import KitchenSidebar    from '../components/kitchen/KitchenSidebar.jsx';
import KitchenHeader     from '../components/kitchen/header/KitchenHeader.jsx';
import KitchenOrdersGrid from '../components/kitchen/orders/KitchenOrdersGrid.jsx';

import NotificationPage  from '../components/admin/notifications/NotificationPage.jsx';
import UserSelfProfile   from '../components/profile/UserSelfProfile.jsx';

const MOBILE_BREAKPOINT = 992;

const KitchenDashboard = () => {
  const [orders,              setOrders]              = useState([]);
  const [statusFilter,        setStatusFilter]        = useState('');
  const [notifications,       setNotifications]       = useState([]);
  const [profile,             setProfile]             = useState(null);
  const [profileSaving,       setProfileSaving]       = useState(false);
  const [activeSection,       setActiveSection]       = useState('orders');
  const [sidebarOpen,         setSidebarOpen]         = useState(true);
  const [isMobile,            setIsMobile]            = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [notificationFilters, setNotificationFilters] = useState({});
  const [toasts,              setToasts]              = useState([]);
  const [soundEnabled,        setSoundEnabled]        = useState(false);

  const lastAlertIdRef = useRef(null);
  const audioRef       = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  /* ─── Audio ─── */
  const playBell = useCallback((eventId = null) => {
    if (eventId && lastAlertIdRef.current === eventId) return;
    if (eventId) {
      lastAlertIdRef.current = eventId;
      setTimeout(() => { if (lastAlertIdRef.current === eventId) lastAlertIdRef.current = null; }, 5000);
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setSoundEnabled(false));
    }
  }, []);

  const pushToast = useCallback((payload) => {
    if (payload.sound !== false) playBell(payload.id);
    const id    = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = { id, toast: true, ...payload };
    setToasts((prev) => [toast, ...prev].slice(0, 5));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), payload.duration || 3500);
  }, [playBell]);

  /* ─── Data fetching ─── */
  const loadOrders = async () => {
    const params = statusFilter ? { status: statusFilter } : undefined;
    const res    = await api.get('/api/orders', { params });
    const payload = res.data;
    setOrders(Array.isArray(payload?.data) ? payload.data : payload);
  };

  const loadNotifications = async (filters = {}) => {
    const res = await api.get('/api/notifications', { params: filters });
    setNotifications(res.data);
  };

  const loadProfile = async () => {
    const res = await api.get('/api/profile/me');
    setProfile(res.data || null);
  };

  const saveProfile = async (payload) => {
    setProfileSaving(true);
    try {
      const res = await api.put('/api/profile/me', payload);
      setProfile(res.data || null);
      pushToast({ title: 'Profile updated', message: 'Your details were saved.', type: 'success', sound: false });
    } catch (error) {
      pushToast({ title: 'Profile update failed', message: error.response?.data?.message || 'Unable to save.', type: 'error', sound: false });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  /* ─── Responsive ─── */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ─── Sidebar default: closed on mobile ─── */
  useEffect(() => { setSidebarOpen(!isMobile); }, [isMobile]);

  /* ─── Audio unlock on first interaction ─── */
  useEffect(() => {
    if (soundEnabled) return undefined;
    const unlock = () => {
      audioRef.current?.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setSoundEnabled(true);
      }).catch(() => {});
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown',     unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown',     unlock);
    };
  }, [soundEnabled]);

  /* ─── Data loads ─── */
  useEffect(() => { loadOrders(); loadNotifications(); }, [statusFilter]);
  useEffect(() => { loadNotifications(notificationFilters); }, [notificationFilters]);
  useEffect(() => { if (activeSection === 'profile') loadProfile(); }, [activeSection]);

  /* ─── Socket ─── */
  useEffect(() => {
    const socket = createSocket();

    socket.on('socket:error', (payload) =>
      pushToast({ id: `socket-error-${payload?.message}`, title: 'Realtime issue', message: payload?.message, type: 'error', sound: false, duration: 4500 })
    );
    socket.on('connect_error', (error) =>
      pushToast({ id: `socket-connect-${error?.message}`, title: 'Realtime disconnected', message: error?.message, type: 'error', sound: false, duration: 4500 })
    );
    socket.on('orders:new', (order) => {
      setOrders((prev) => [order, ...prev]);
      const label = order?.table?.tableNumber ? `Table ${order.table.tableNumber}` : 'Takeaway';
      pushToast({ id: order._id, title: 'New Order Received', message: `${label} has a new order.`, type: 'success' });
    });
    socket.on('orders:update', (order) =>
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)))
    );
    socket.on('notify', (payload) => {
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
      pushToast({ title: payload.title || 'Notification', message: payload.message || 'Notification received', type: 'info' });
    });

    return () => socket.disconnect();
  }, []);

  /* ─── Order actions ─── */
  const updateStatus = async (orderId, status) => {
    await api.patch(`/api/orders/${orderId}/status`, { status });
  };

  const markAllRead = async () => {
    await api.patch('/api/notifications/read/all');
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ─── Layout ─── */
  // Sidebar width in pixels (for content margin)
  const sidebarPx = isMobile ? 0 : sidebarOpen ? 256 : 72;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <NotificationToasts notifications={toasts} />

      {/* Sidebar */}
      <KitchenSidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        isOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        unreadCount={unreadCount}
      />

      {/* Main content area — offset by sidebar width on desktop */}
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarPx }}
      >
        {/* Sticky header */}
        <KitchenHeader
          isMobile={isMobile}
          activeSection={activeSection}
          orders={orders}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={loadOrders}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">

          {/* ── Orders ── */}
          {activeSection === 'orders' && (
            <KitchenOrdersGrid
              orders={orders}
              onUpdateStatus={updateStatus}
            />
          )}

          {/* ── Notifications ── */}
          {activeSection === 'notifications' && (
            <div className="p-5">
              <NotificationPage
                notifications={notifications}
                filters={notificationFilters}
                onFilterChange={(next) => {
                  const merged = { ...notificationFilters, ...next };
                  setNotificationFilters(merged);
                  loadNotifications(merged);
                }}
                onMarkAll={markAllRead}
              />
            </div>
          )}

          {/* ── Profile ── */}
          {activeSection === 'profile' && (
            <div className="p-5">
              <UserSelfProfile
                profile={profile}
                onSave={saveProfile}
                onLogout={handleLogout}
                saving={profileSaving}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default KitchenDashboard;
