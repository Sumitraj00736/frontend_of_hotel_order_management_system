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
import AdminPromotionTimeline from '../components/admin/AdminPromotionTimeline.jsx';
import AdminInventory from '../components/admin/AdminInventory.jsx';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState(null);
  const [overview, setOverview] = useState({ activeByWaiter: [] });
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPromotionUser, setSelectedPromotionUser] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'waiter',
    dateOfJoining: '',
    salary: '',
    shiftStart: '',
    shiftEnd: ''
  });
  const [tableForm, setTableForm] = useState({ tableNumber: '', row: '', column: '' });
  const [menuForm, setMenuForm] = useState({ name: '', category: '', price: '', imageUrl: '' });

  const loadAll = async () => {
    const [u, t, m, o, r, h, ov, an] = await Promise.all([
      api.get('/api/users'),
      api.get('/api/tables'),
      api.get('/api/menus'),
      api.get('/api/orders'),
      api.get('/api/reports/summary'),
      api.get('/api/reports/history'),
      api.get('/api/reports/overview'),
      api.get('/api/reports/analytics')
    ]);
    setUsers(u.data);
    setTables(t.data);
    setMenus(m.data);
    setOrders(o.data);
    setReport(r.data);
    setHistory(h.data);
    setOverview(ov.data);
    setAnalytics(an.data);
  };

  const loadNotifications = async () => {
    const res = await api.get('/api/notifications');
    setNotifications(res.data);
  };

  const loadPromotions = async (userId) => {
    const user = users.find((u) => u._id === userId) || selectedPromotionUser;
    if (user) setSelectedPromotionUser(user);
    const res = await api.get(`/api/promotions/${userId}`);
    setPromotions(res.data);
  };

  const loadInventory = async () => {
    const [ingRes, txnRes] = await Promise.all([
      api.get('/api/inventory/ingredients'),
      api.get('/api/inventory/transactions')
    ]);
    setIngredients(ingRes.data);
    setTransactions(txnRes.data);
  };

  const addPromotion = async (userId, form) => {
    const payload = {
      title: form.title,
      amount: form.amount ? Number(form.amount) : undefined,
      effectiveDate: form.effectiveDate,
      note: form.note
    };
    await api.post(`/api/promotions/${userId}`, payload);
    const res = await api.get(`/api/promotions/${userId}`);
    setPromotions(res.data);
    loadAll();
  };

  useEffect(() => {
    loadAll();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (activeSection.startsWith('inventory')) {
      loadInventory();
    }
  }, [activeSection]);

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
      setUserForm({ name: '', email: '', password: '', role: 'waiter', dateOfJoining: '', salary: '', shiftStart: '', shiftEnd: '' });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  const editUser = async (user) => {
    const nameInput = prompt('Name', user.name);
    if (nameInput === null) return;
    const name = nameInput.trim() || user.name;

    const emailInput = prompt('Email', user.email);
    if (emailInput === null) return;
    const email = emailInput.trim() || user.email;

    const roleInput = prompt('Role (admin/waiter/kitchen)', user.role);
    if (roleInput === null) return;
    const role = roleInput.trim().toLowerCase() || user.role;
    if (!['admin', 'waiter', 'kitchen'].includes(role)) {
      alert('Role must be admin, waiter, or kitchen');
      return;
    }

    const dojInput = prompt('Date of Joining (YYYY-MM-DD)', user.dateOfJoining ? user.dateOfJoining.slice(0, 10) : '');
    if (dojInput === null) return;
    const dateOfJoining = dojInput.trim() || (user.dateOfJoining ? user.dateOfJoining.slice(0, 10) : '');

    const salaryRaw = prompt('Salary', user.salary ?? '');
    if (salaryRaw === null) return;
    const salary = salaryRaw === '' ? user.salary : Number(salaryRaw);
    if (Number.isNaN(salary)) {
      alert('Salary must be a number');
      return;
    }

    const shiftStartInput = prompt('Shift Start (e.g. 09:00)', user.shiftStart || '');
    if (shiftStartInput === null) return;
    const shiftStart = shiftStartInput.trim() || user.shiftStart;

    const shiftEndInput = prompt('Shift End (e.g. 18:00)', user.shiftEnd || '');
    if (shiftEndInput === null) return;
    const shiftEnd = shiftEndInput.trim() || user.shiftEnd;

    try {
      await api.put(`/api/users/${user._id}`, {
        name,
        email,
        role,
        dateOfJoining: dateOfJoining || undefined,
        salary,
        shiftStart: shiftStart || undefined,
        shiftEnd: shiftEnd || undefined
      });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const createTable = async () => {
    try {
      const tableNumber = Number.parseInt(tableForm.tableNumber, 10);
      if (!tableNumber) return alert('Enter a valid table number');
      await api.post('/api/tables', {
        tableNumber,
        row: tableForm.row ? Number(tableForm.row) : undefined,
        column: tableForm.column ? Number(tableForm.column) : undefined
      });
      setTableForm({ tableNumber: '', row: '', column: '' });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add table');
    }
  };

  const freeTable = async (tableId) => {
    await api.patch(`/api/tables/${tableId}/free`);
    loadAll();
  };

  const updateTable = async (tableId, payload) => {
    await api.put(`/api/tables/${tableId}`, payload);
    loadAll();
  };

  const createMenu = async () => {
    try {
      const price = Number(menuForm.price);
      if (!menuForm.name || !menuForm.category || Number.isNaN(price)) {
        return alert('Fill out menu name, category, and price');
      }
      await api.post('/api/menus', { name: menuForm.name, category: menuForm.category, price, imageUrl: menuForm.imageUrl });
      setMenuForm({ name: '', category: '', price: '', imageUrl: '' });
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
    const imageUrl = prompt('Image URL (leave blank to keep current)', menu.imageUrl || '') || menu.imageUrl;
    await api.put(`/api/menus/${menu._id}`, { name, category, price, imageUrl });
    loadAll();
  };

  const payOrder = async (orderId) => {
    const method = paymentMethods[orderId] || 'cash';
    try {
      await api.post(`/api/bills/${orderId}/pay`, { paymentMethod: method });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark paid');
    }
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
              .map((item) => `<li>${item.name} x ${item.quantity} - NPR ${item.price}</li>`)
              .join('')}
          </ul>
          <h3>Total: NPR ${bill.totalAmount.toFixed(2)}</h3>
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

  const frequentItems = useMemo(() => {
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
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      {showNotifications && (
        <div className="notification-drawer">
          <NotificationPanel notifications={notifications} onMarkAll={markAllRead} />
        </div>
      )}
      <NotificationToasts notifications={notifications} />

      <div className={`admin-body ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className={`sidebar-placeholder ${sidebarOpen ? '' : 'closed'}`}>
          <AdminSidebar activeSection={activeSection} onSelect={setActiveSection} isOpen={sidebarOpen} />
        </div>

        <div className="content">
          {activeSection === 'overview' && <AdminOverview report={report} overview={overview} />}
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
            <>
              <AdminUsers
                users={users}
                userForm={userForm}
                setUserForm={setUserForm}
                onCreateUser={createUser}
                onEditUser={editUser}
                onLoadPromotions={(u) => loadPromotions(u._id)}
              />
              {selectedPromotionUser && (
                <AdminPromotionTimeline
                  user={selectedPromotionUser}
                  promotions={promotions}
                  onAdd={addPromotion}
                />
              )}
            </>
          )}
          {activeSection === 'tables' && (
            <AdminTables
              tables={tables}
              tableForm={tableForm}
              setTableForm={setTableForm}
              onCreateTable={createTable}
              onFreeTable={freeTable}
              onUpdateTable={updateTable}
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
          {activeSection.startsWith('inventory') && (
            <AdminInventory
              menus={menus}
              ingredients={ingredients}
              transactions={transactions}
              reload={loadInventory}
              externalView={activeSection.split(':')[1] || 'ingredients'}
            />
          )}
          {activeSection.startsWith('reports') && (
            <AdminReports
              view={activeSection.split(':')[1] || 'company'}
              onChangeView={(view) => setActiveSection(`reports:${view}`)}
              analytics={{ ...analytics, frequentItems }}
              salesSummary={analytics?.salesSummary}
              onLoadPromotions={loadPromotions}
              promotionUser={selectedPromotionUser}
              promotionList={promotions}
            />
          )}
          {activeSection === 'history' && <AdminHistory history={history} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
