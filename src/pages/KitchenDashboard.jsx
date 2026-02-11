import React, { useEffect, useState } from 'react';
import api from '../api/client.js';
import HeaderBar from '../components/HeaderBar.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import NotificationToasts from '../components/NotificationToasts.jsx';
import { createSocket } from '../api/socket.js';
import KitchenSidebar from '../components/kitchen/KitchenSidebar.jsx';
import KitchenOrdersGrid from '../components/kitchen/KitchenOrdersGrid.jsx';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadOrders = async () => {
    const params = statusFilter ? { status: statusFilter } : undefined;
    const res = await api.get('/api/orders', { params });
    setOrders(res.data);
  };

  const loadNotifications = async () => {
    const res = await api.get('/api/notifications');
    setNotifications(res.data);
  };

  useEffect(() => {
    loadOrders();
    loadNotifications();
  }, [statusFilter]);

  useEffect(() => {
    const socket = createSocket();
    socket.on('orders:new', (order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socket.on('orders:update', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });
    socket.on('notify', (payload) => {
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
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
      <HeaderBar
        title="Kitchen Live Board"
        unreadCount={unreadCount}
        onToggleNotifications={() => setShowNotifications((prev) => !prev)}
      />
      {showNotifications && (
        <div className="notification-drawer">
          <NotificationPanel notifications={notifications} onMarkAll={markAllRead} />
        </div>
      )}
      <NotificationToasts notifications={notifications} />

      <div className="admin-body">
        <KitchenSidebar statusFilter={statusFilter} onChange={setStatusFilter} />
        <div className="content">
          <KitchenOrdersGrid orders={orders} onUpdateStatus={updateStatus} />
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
