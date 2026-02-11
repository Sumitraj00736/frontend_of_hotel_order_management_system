import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import HeaderBar from '../components/HeaderBar.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import NotificationToasts from '../components/NotificationToasts.jsx';
import { createSocket } from '../api/socket.js';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import AdminOverview from '../components/admin/AdminOverview.jsx';
import AdminOrders from '../components/admin/AdminOrders.jsx';
import AdminUsers from '../components/admin/AdminUsers.jsx';
import AdminTables from '../components/admin/AdminTables.jsx';
import AdminMenus from '../components/admin/AdminMenus.jsx';
import AdminReports from '../components/admin/AdminReports.jsx';
import AdminHistory from '../components/admin/AdminHistory.jsx';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'waiter' });
  const [tableForm, setTableForm] = useState({ tableNumber: '' });
  const [menuForm, setMenuForm] = useState({ name: '', category: '', price: '' });

  const loadAll = async () => {
    const [u, t, m, o, r, h] = await Promise.all([
      api.get('/api/users'),
      api.get('/api/tables'),
      api.get('/api/menus'),
      api.get('/api/orders'),
      api.get('/api/reports/summary'),
      api.get('/api/reports/history')
    ]);
    setUsers(u.data);
    setTables(t.data);
    setMenus(m.data);
    setOrders(o.data);
    setReport(r.data);
    setHistory(h.data);
  };

  const loadNotifications = async () => {
    const res = await api.get('/api/notifications');
    setNotifications(res.data);
  };

  useEffect(() => {
    loadAll();
    loadNotifications();
  }, []);

  useEffect(() => {
    const socket = createSocket();

    socket.on('notify', (payload) => {
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
      if (payload.type === 'order:paid') {
        loadAll();
      }
    });

    socket.on('orders:new', (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on('orders:update', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });

    socket.on('tables:update', (table) => {
      setTables((prev) => prev.map((t) => (t._id === table._id ? table : t)));
    });

    return () => socket.disconnect();
  }, []);

  const createUser = async () => {
    try {
      await api.post('/api/users', userForm);
      setUserForm({ name: '', email: '', password: '', role: 'waiter' });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  const createTable = async () => {
    try {
      const tableNumber = Number.parseInt(tableForm.tableNumber, 10);
      if (!tableNumber) return alert('Enter a valid table number');
      await api.post('/api/tables', { tableNumber });
      setTableForm({ tableNumber: '' });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add table');
    }
  };

  const freeTable = async (tableId) => {
    await api.patch(`/api/tables/${tableId}/free`);
    loadAll();
  };

  const createMenu = async () => {
    try {
      const price = Number(menuForm.price);
      if (!menuForm.name || !menuForm.category || Number.isNaN(price)) {
        return alert('Fill out menu name, category, and price');
      }
      await api.post('/api/menus', { name: menuForm.name, category: menuForm.category, price });
      setMenuForm({ name: '', category: '', price: '' });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add menu');
    }
  };

  const editMenu = async (menu) => {
    const name = prompt('Menu name', menu.name);
    if (!name) return;
    const category = prompt('Category', menu.category);
    if (!category) return;
    const priceRaw = prompt('Price', String(menu.price));
    const price = Number(priceRaw);
    if (Number.isNaN(price)) return;
    await api.put(`/api/menus/${menu._id}`, { name, category, price });
    loadAll();
  };

  const payOrder = async (orderId) => {
    const method = paymentMethods[orderId] || 'cash';
    await api.post(`/api/bills/${orderId}/pay`, { paymentMethod: method });
    loadAll();
  };

  const printBill = async (orderId) => {
    const res = await api.get(`/api/bills/${orderId}`);
    const bill = res.data;
    const html = `
      <html>
        <head><title>Bill - Table ${bill.tableNumber}</title></head>
        <body>
          <h2>Bill for Table ${bill.tableNumber}</h2>
          <p>Order ID: ${bill.orderId}</p>
          <p>Waiter: ${bill.waiter || 'N/A'}</p>
          <p>Kitchen: ${bill.kitchen || 'N/A'}</p>
          <p>Order Time: ${new Date(bill.createdAt).toLocaleString()}</p>
          <hr />
          <ul>
            ${bill.items
              .map((item) => `<li>${item.name} x ${item.quantity} - $${item.price}</li>`)
              .join('')}
          </ul>
          <h3>Total: $${bill.totalAmount.toFixed(2)}</h3>
        </body>
      </html>
    `;
    const win = window.open('', 'PRINT', 'height=600,width=800');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const markAllRead = async () => {
    await api.patch('/api/notifications/read/all');
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const analytics = useMemo(() => {
    const itemCounts = {};
    history.forEach((entry) => {
      entry.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [history]);

  return (
    <div className="admin-shell">
      <HeaderBar
        title="Admin Control Center"
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
        <AdminSidebar activeSection={activeSection} onSelect={setActiveSection} />

        <div className="content">
          {activeSection === 'overview' && <AdminOverview report={report} />}
          {activeSection === 'orders' && (
            <AdminOrders
              orders={orders}
              paymentMethods={paymentMethods}
              onChangePaymentMethod={(id, value) => setPaymentMethods({ ...paymentMethods, [id]: value })}
              onPay={payOrder}
              onPrint={printBill}
            />
          )}
          {activeSection === 'users' && (
            <AdminUsers users={users} userForm={userForm} setUserForm={setUserForm} onCreateUser={createUser} />
          )}
          {activeSection === 'tables' && (
            <AdminTables
              tables={tables}
              tableForm={tableForm}
              setTableForm={setTableForm}
              onCreateTable={createTable}
              onFreeTable={freeTable}
            />
          )}
          {activeSection === 'menus' && (
            <AdminMenus
              menus={menus}
              menuForm={menuForm}
              setMenuForm={setMenuForm}
              onCreateMenu={createMenu}
              onEditMenu={editMenu}
            />
          )}
          {activeSection === 'reports' && <AdminReports analytics={analytics} />}
          {activeSection === 'history' && <AdminHistory history={history} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
