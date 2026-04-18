import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import api from '../api/client.js';
import NotificationToasts from '../components/NotificationToasts.jsx';
import { createSocket } from '../api/socket.js';
import KitchenSidebar from '../components/kitchen/KitchenSidebar.jsx';
import KitchenOrdersGrid from '../components/kitchen/KitchenOrdersGrid.jsx';
import NotificationPage from '../components/admin/notifications/NotificationPage.jsx';
import '../common/css/admin/common/adminLayout.css';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationFilters, setNotificationFilters] = useState({});
  const [toasts, setToasts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const lastAlertIdRef = useRef(null);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  const unblockAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setSoundEnabled(true);
      }).catch(e => console.log('[Audio] Unblock failed:', e));
    }
  }, []);

  const playBell = useCallback((eventId = null) => {
    if (eventId && lastAlertIdRef.current === eventId) return;
    if (eventId) {
      lastAlertIdRef.current = eventId;
      setTimeout(() => { if (lastAlertIdRef.current === eventId) lastAlertIdRef.current = null; }, 5000);
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.log('[Audio] Play blocked:', e);
        setSoundEnabled(false);
      });
    }
  }, []);

  const pushToast = useCallback((payload) => {
    if (payload.sound !== false) {
      playBell(payload.id);
    }
    const id = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = { id, toast: true, ...payload };
    setToasts((prev) => [toast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, payload.duration || 3500);
  }, [playBell]);

  const loadOrders = async () => {
    const params = statusFilter ? { status: statusFilter } : undefined;
    const res = await api.get('/api/orders', { params });
    const payload = res.data;
    setOrders(Array.isArray(payload?.data) ? payload.data : payload);
  };

  const loadNotifications = async (filters = {}) => {
    const res = await api.get('/api/notifications', { params: filters });
    setNotifications(res.data);
  };

  useEffect(() => {
    loadOrders();
    loadNotifications();
  }, [statusFilter]);

  useEffect(() => {
    loadNotifications(notificationFilters);
  }, [notificationFilters]);

  useEffect(() => {
    const socket = createSocket();
    socket.on('orders:new', (order) => {
      setOrders((prev) => [order, ...prev]);
      const tableLabel = order?.table?.tableNumber ? `Table ${order.table.tableNumber}` : 'Takeaway';
      pushToast({
        id: order._id,
        title: 'New Order Received',
        message: `${tableLabel} has a new order.`,
        type: 'success'
      });
    });
    socket.on('orders:update', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });
    socket.on('notify', (payload) => {
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
      pushToast({
        title: payload.title || 'Notification',
        message: payload.message || 'Notification received',
        type: 'info'
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.patch(`/api/orders/${orderId}/status`, { status });
  };

  const markAllRead = async () => {
    await api.patch('/api/notifications/read/all');
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="admin-shell">
      {!soundEnabled && (
        <div className="sound-enable-banner" onClick={unblockAudio}>
          <Volume2 size={18} />
          <span>Tap to enable order alerts sound</span>
        </div>
      )}
      <NotificationToasts notifications={toasts} />

      <div className={`admin-body ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className={`sidebar-placeholder ${sidebarOpen ? '' : 'closed'}`}>
          <KitchenSidebar
            activeSection={activeSection}
            onSelect={setActiveSection}
            isOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            unreadCount={unreadCount}
          />
        </div>

        {activeSection === 'orders' && (
          <div className="content">
            <div className="card glass-card mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-semibold">Kitchen Orders</div>
                <select className="form-select w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="served">Served</option>
                </select>
              </div>
            </div>
            <KitchenOrdersGrid orders={orders} onUpdateStatus={updateStatus} />
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="content">
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
      </div>
    </div>
  );
};

export default KitchenDashboard;
