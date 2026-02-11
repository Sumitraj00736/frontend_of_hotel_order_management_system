import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import HeaderBar from '../components/HeaderBar.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import NotificationToasts from '../components/NotificationToasts.jsx';
import { createSocket } from '../api/socket.js';
import { getCurrentUser } from '../api/session.js';
import WaiterSidebar from '../components/waiter/WaiterSidebar.jsx';
import WaiterCart from '../components/waiter/WaiterCart.jsx';
import WaiterMenu from '../components/waiter/WaiterMenu.jsx';
import WaiterOrders from '../components/waiter/WaiterOrders.jsx';

const WaiterApp = () => {
  const currentUser = getCurrentUser();
  const [tables, setTables] = useState([]);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadData = async () => {
    const [t, m, o] = await Promise.all([api.get('/api/tables'), api.get('/api/menus'), api.get('/api/orders')]);
    setTables(t.data);
    setMenus(m.data);
    setOrders(o.data);
  };

  const loadNotifications = async () => {
    const res = await api.get('/api/notifications');
    setNotifications(res.data);
  };

  useEffect(() => {
    loadData();
    loadNotifications();
  }, []);

  useEffect(() => {
    const socket = createSocket();
    socket.on('orders:update', (order) => {
      if (order.createdBy?._id === currentUser?.id) {
        setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
      }
    });
    socket.on('orders:new', (order) => {
      if (order.createdBy?._id === currentUser?.id) {
        setOrders((prev) => [order, ...prev]);
      }
    });
    socket.on('tables:update', (table) => {
      setTables((prev) => prev.map((t) => (t._id === table._id ? table : t)));
    });
    socket.on('notify', (payload) => {
      if (payload.waiterId && payload.waiterId !== currentUser?.id) return;
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, [currentUser?.id]);

  const filteredMenu = useMemo(() => {
    if (!search) return menus;
    return menus.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, search]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem === item._id);
      if (existing) {
        return prev.map((c) => (c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { menuItem: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQty = (menuItem, quantity) => {
    setCart((prev) => prev.map((c) => (c.menuItem === menuItem ? { ...c, quantity } : c)));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const placeOrder = async () => {
    if (!selectedTable) return;
    const payload = {
      table: selectedTable,
      items: cart.map((c) => ({ menuItem: c.menuItem, quantity: c.quantity }))
    };

    if (editingOrderId) {
      await api.put(`/api/orders/${editingOrderId}`, payload);
    } else {
      await api.post('/api/orders', payload);
    }

    setCart([]);
    setSelectedTable(null);
    setEditingOrderId(null);
    loadData();
  };

  const loadOrderToEdit = (order) => {
    setEditingOrderId(order._id);
    setSelectedTable(order.table?._id || order.table);
    const mapped = order.items.map((item) => ({
      menuItem: item.menuItem?._id || item.menuItem,
      name: item.menuItem?.name || 'Item',
      price: item.priceAtOrderTime,
      quantity: item.quantity
    }));
    setCart(mapped);
  };

  const generateBill = async (orderId) => {
    const bill = await api.get(`/api/bills/${orderId}`);
    alert(`Bill for table ${bill.data.tableNumber}: $${bill.data.totalAmount.toFixed(2)}`);
  };

  const freeTable = async () => {
    if (!selectedTable) return;
    await api.patch(`/api/tables/${selectedTable}/free`);
    setSelectedTable(null);
    loadData();
  };

  const markAllRead = async () => {
    await api.patch('/api/notifications/read/all');
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="admin-shell">
      <HeaderBar
        title="Waiter Live Station"
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
        <WaiterSidebar
          tables={tables}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          onFreeTable={freeTable}
        />

        <div className="content grid-3">
          <WaiterCart
            cart={cart}
            cartTotal={cartTotal}
            onUpdateQty={updateQty}
            onPlaceOrder={placeOrder}
            editing={Boolean(editingOrderId)}
          />
          <WaiterMenu search={search} onSearch={setSearch} menuItems={filteredMenu} onAdd={addToCart} />
          <WaiterOrders orders={orders} onEdit={loadOrderToEdit} onBill={generateBill} />
        </div>
      </div>
    </div>
  );
};

export default WaiterApp;
