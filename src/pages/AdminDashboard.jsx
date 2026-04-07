import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import NotificationToasts from '../components/NotificationToasts.jsx';
import NotificationPage from '../components/admin/notifications/NotificationPage.jsx';
import { createSocket } from '../api/socket.js';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar.jsx';
import AdminOverview from '../components/admin/dashboard/AdminOverview.jsx';
import AdminOrders from '../components/admin/orders/adminOrders/AdminOrders.jsx';
import AdminUsers from '../components/admin/users/AdminUsers.jsx';
import AdminTables from '../components/admin/tables/AdminTables.jsx';
import AdminMenus from '../components/admin/menu/AdminMenus.jsx';
import AdminCategories from '../components/admin/menu/AdminCategories.jsx';
import AdminDishes from '../components/admin/menu/AdminDishes.jsx';
import AdminAddOns from '../components/admin/menu/AdminAddOns.jsx';
import AdminSubMenus from '../components/admin/menu/AdminSubMenus.jsx';
import AdminCombos from '../components/admin/menu/AdminCombos.jsx';
import AdminReports from '../components/admin/reports/AdminReports.jsx';
import AdminHistory from '../components/admin/history/AdminHistory.jsx';
import AdminPromotionTimeline from '../components/admin/promotions/AdminPromotionTimeline.jsx';
import AdminInventory from '../components/admin/inventory/AdminInventory.jsx';
import AdminWebsite from '../components/admin/website/AdminWebsite.jsx';
import '../common/css/admin/common/adminLayout.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submenus, setSubmenus] = useState([]);
  const [addons, setAddons] = useState([]);
  const [combos, setCombos] = useState([]);
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState(null);
  const [overview, setOverview] = useState({ activeByWaiter: [] });
  const [analytics, setAnalytics] = useState(null);
  const [stockReport, setStockReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [selectedPromotionUser, setSelectedPromotionUser] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [financeFilters, setFinanceFilters] = useState({ dateFrom: '', dateTo: '' });
  const [dashboardOptions, setDashboardOptions] = useState({
    includeAnalytics: true,
    includeStock: true,
    includeHistory: true,
    includeNotifications: true
  });
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersLimit, setOrdersLimit] = useState(12);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [orderDashboardData, setOrderDashboardData] = useState(null);
  const [overviewDashboardData, setOverviewDashboardData] = useState(null);
  const [financeDashboardData, setFinanceDashboardData] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [transactionMeta, setTransactionMeta] = useState({ page: 1, limit: 20, total: 0 });
  const [transactionFilters, setTransactionFilters] = useState({ dateFrom: '', dateTo: '' });
  const dashboardLoadedRef = React.useRef(false);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'waiter',
    status: 'active',
    dateOfJoining: '',
    salary: '',
    shiftStart: '',
    shiftEnd: ''
  });
  const [tableForm, setTableForm] = useState({ tableNumber: '', row: '', column: '' });
  const [menuForm, setMenuForm] = useState({ name: '', category: '', price: '', imageUrl: '' });
  const menuCreateRef = React.useRef(false);

  const loadAll = async (options = dashboardOptions) => {
    const res = await api.get('/api/dashboard', {
      params: {
        ordersLimit: 100,
        includeAnalytics: options.includeAnalytics,
        includeStock: options.includeStock,
        includeHistory: options.includeHistory,
        includeNotifications: options.includeNotifications
      }
    });
    const data = res.data || {};
    const normalizedUsers = (data.users || []).map((u) => ({ ...u, _id: u._id || u.id }));
    setUsers(normalizedUsers);
    setTables(data.tables || []);
    setMenus(data.menus || []);
    setOrders(data.orders || []);
    setReport(data.report || null);
    setHistory(data.history || []);
    setOverview(data.overview || { activeByWaiter: [] });
    setAnalytics(data.analytics || null);
    setStockReport(data.stockReport || null);
    setCategories(data.categories || []);
    setSubmenus(data.submenus || []);
    setAddons(data.addons || []);
    setCombos(data.combos || []);
    setPurchases(data.purchases || []);
    setExpenses(data.expenses || []);
    if (Array.isArray(data.notifications)) {
      setNotifications(data.notifications);
    }
  };

  const loadOverviewOnly = async () => {
    try {
      const [ov, r] = await Promise.all([api.get('/api/reports/overview'), api.get('/api/reports/summary')]);
      setOverview(ov.data);
      setReport(r.data);
    } catch (e) {
      // ignore transient errors
    }
  };

  const loadFinance = async (filters = financeFilters) => {
    const params = {};
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    const [summaryRes, purchaseRes, expenseRes] = await Promise.all([
      api.get('/api/reports/summary', { params }),
      api.get('/api/purchases', { params }),
      api.get('/api/expenses', { params })
    ]);
    setReport(summaryRes.data);
    setPurchases(purchaseRes.data);
    setExpenses(expenseRes.data);
  };

  const [notificationFilters, setNotificationFilters] = useState({ category: 'activity' });

  const loadNotifications = async (filters = notificationFilters) => {
    const res = await api.get('/api/notifications', { params: filters });
    setNotifications(res.data);
  };

  const loadPromotions = async (userId) => {
    const user = users.find((u) => u._id === userId) || selectedPromotionUser;
    if (user) setSelectedPromotionUser(user);
    const res = await api.get(`/api/promotions/${userId}`);
    setPromotions(res.data);
  };

  const loadUsers = async () => {
    const res = await api.get('/api/users');
    const payload = Array.isArray(res.data) ? res.data : [];
    setUsers(payload.map((u) => ({ ...u, _id: u._id || u.id })));
  };

  const loadInventory = useCallback(async () => {
    const [ingRes, txnRes] = await Promise.all([
      api.get('/api/inventory/ingredients'),
      api.get('/api/inventory/transactions')
    ]);
    setIngredients(ingRes.data);
    setTransactions(txnRes.data);
  }, []);

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
    loadAll(dashboardOptions);
  }, [dashboardOptions]);

  useEffect(() => {
    loadFinance(financeFilters);
  }, [financeFilters]);

  useEffect(() => {
    if (activeSection.startsWith('inventory')) {
      loadInventory();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'users') {
      loadUsers();
    }
  }, [activeSection]);

  const loadTransactionHistory = useCallback(
    async (nextFilters = transactionFilters, page = transactionMeta.page, limit = transactionMeta.limit) => {
      const res = await api.get('/api/reports/transactions', {
        params: { ...nextFilters, page, limit }
      });
      const payload = res.data;
      if (Array.isArray(payload?.data)) {
        setTransactionHistory(payload.data);
        setTransactionMeta({ page: payload.page || page, limit: payload.limit || limit, total: payload.total || 0 });
        return;
      }
      setTransactionHistory(Array.isArray(payload) ? payload : []);
    },
    [transactionFilters, transactionMeta.page, transactionMeta.limit]
  );

  const loadDashboardExtras = useCallback(async () => {
    const [orderRes, overviewRes, financeRes] = await Promise.all([
      api.get('/api/reports/order-dashboard'),
      api.get('/api/reports/overview-dashboard'),
      api.get('/api/reports/finance-dashboard')
    ]);
    setOrderDashboardData(orderRes.data);
    setOverviewDashboardData(overviewRes.data);
    setFinanceDashboardData(financeRes.data);
    await loadTransactionHistory(transactionFilters, transactionMeta.page, transactionMeta.limit);
  }, [loadTransactionHistory, transactionFilters, transactionMeta.page, transactionMeta.limit]);

  useEffect(() => {
    if (activeSection === 'dashboard' && !dashboardLoadedRef.current) {
      dashboardLoadedRef.current = true;
      loadDashboardExtras();
    }
  }, [activeSection, loadDashboardExtras]);

  const loadOrdersPage = async (page = ordersPage, limit = ordersLimit) => {
    const res = await api.get('/api/orders', { params: { paginate: 1, page, limit } });
    const payload = res.data;
    if (Array.isArray(payload?.data)) {
      setOrders(payload.data);
      setOrdersTotal(payload.total || 0);
      setOrdersPage(payload.page || page);
      setOrdersLimit(payload.limit || limit);
      return;
    }
    setOrders(Array.isArray(payload) ? payload : []);
  };

  useEffect(() => {
    if (activeSection === 'orders') {
      loadOrdersPage(ordersPage, ordersLimit);
    }
  }, [activeSection, ordersPage, ordersLimit]);

  useEffect(() => {
    const socket = createSocket();

    socket.on('notify', (payload) => {
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
      if (payload.type === 'order:paid') {
        loadOverviewOnly();
      }
    });

    socket.on('orders:new', (order) => {
      setOrders((prev) => [order, ...prev]);
      loadOverviewOnly();
    });

    socket.on('orders:update', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
      loadOverviewOnly();
    });

    socket.on('tables:update', (table) => {
      setTables((prev) => prev.map((t) => (t._id === table._id ? table : t)));
      loadOverviewOnly();
    });

    return () => socket.disconnect();
  }, []);

  const createUser = async () => {
    try {
      await api.post('/api/users', userForm);
      setUserForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'waiter',
        status: 'active',
        dateOfJoining: '',
        salary: '',
        shiftStart: '',
        shiftEnd: ''
      });
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  const setUserStatus = async (userId, status) => {
    await api.patch(`/api/users/${userId}/status`, { status });
    loadUsers();
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

  const deleteTable = async (tableId) => {
    await api.delete(`/api/tables/${tableId}`);
    loadAll();
  };

  const createMenu = async () => {
    if (menuCreateRef.current) return;
    try {
      menuCreateRef.current = true;
      const price = Number(menuForm.price);
      if (!menuForm.name || !menuForm.category || Number.isNaN(price)) {
        return alert('Fill out menu name, category, and price');
      }
      const res = await api.post('/api/menus', { name: menuForm.name, category: menuForm.category, price, imageUrl: menuForm.imageUrl });
      setMenus((prev) => [res.data, ...prev]);
      setMenuForm({ name: '', category: '', price: '', imageUrl: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add menu');
    } finally {
      menuCreateRef.current = false;
    }
  };

  const createDish = async (payload) => {
    try {
      await api.post('/api/menus', payload);
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add dish');
    }
  };

  const updateDish = async (id, payload) => {
    try {
      await api.put(`/api/menus/${id}`, payload);
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update dish');
    }
  };

  const deleteDish = async (id) => {
    try {
      await api.delete(`/api/menus/${id}`);
      loadAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete dish');
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

  const payOrder = async (payload) => {
    const orderId = typeof payload === 'string' ? payload : payload?.orderId;
    const method =
      typeof payload === 'object' && payload.paymentMethod
        ? payload.paymentMethod
        : paymentMethods[orderId] || 'cash';
    try {
      await api.post(`/api/bills/${orderId}/pay`, {
        paymentMethod: method,
        paymentStatus: payload?.paymentStatus || 'paid',
        discountType: payload?.discountType,
        discountValue: payload?.discountValue,
        tenderAmount: payload?.tenderAmount,
        taxRate: payload?.taxRate,
        tipsAmount: payload?.tipsAmount,
        roundOff: payload?.roundOff
      });
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
      <NotificationToasts notifications={notifications} />

      <div className={`admin-body ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className={`sidebar-placeholder ${sidebarOpen ? '' : 'closed'}`}>
          <AdminSidebar
            activeSection={activeSection}
            onSelect={setActiveSection}
            isOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            unreadCount={unreadCount}
          />
        </div>

        <div className="content">
          {activeSection === 'dashboard' && (
            <AdminOverview
              report={report}
              overview={overview}
              orderDashboardData={orderDashboardData}
              overviewDashboardData={overviewDashboardData}
              financeDashboardData={financeDashboardData}
              transactionHistory={transactionHistory}
              transactionMeta={transactionMeta}
              transactionFilters={transactionFilters}
              onTransactionFilterChange={(next) => {
                const merged = { ...transactionFilters, ...next };
                setTransactionFilters(merged);
                loadTransactionHistory(merged, 1, transactionMeta.limit);
              }}
              onTransactionPageChange={(nextPage) => loadTransactionHistory(transactionFilters, nextPage, transactionMeta.limit)}
              onTransactionLimitChange={(nextLimit) => loadTransactionHistory(transactionFilters, 1, nextLimit)}
              onTransactionExport={() => {
                const params = new URLSearchParams({ ...transactionFilters, format: 'csv' }).toString();
                window.open(`/api/reports/transactions?${params}`, '_blank');
              }}
              dashboardOptions={dashboardOptions}
              onChangeDashboardOptions={setDashboardOptions}
            />
          )}
          {activeSection === 'notifications' && (
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
          )}
          {activeSection === 'orders' && (
            <AdminOrders
              orders={orders}
              menus={menus}
              staff={users}
              paymentMethods={paymentMethods}
              onChangePaymentMethod={(id, value) => setPaymentMethods({ ...paymentMethods, [id]: value })}
              onPay={payOrder}
              onPrint={printBill}
              onUpdateOrder={async (payload) => {
                const res = await api.put(`/api/orders/${payload.orderId}`, payload);
                await loadAll();
                return res.data;
              }}
              page={ordersPage}
              limit={ordersLimit}
              total={ordersTotal}
              onPageChange={(next) => setOrdersPage(next)}
              onLimitChange={(next) => {
                setOrdersLimit(next);
                setOrdersPage(1);
              }}
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
                onSetStatus={setUserStatus}
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
              onDeleteTable={deleteTable}
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
          {activeSection === 'website' && <AdminWebsite />}
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
              salesSummary={report}
              onLoadPromotions={loadPromotions}
              promotionUser={selectedPromotionUser}
              promotionList={promotions}
              stock={stockReport}
              purchases={purchases}
              expenses={expenses}
              financeFilters={financeFilters}
              onChangeFinanceFilters={setFinanceFilters}
              onCreatePurchase={async (payload) => { await api.post('/api/purchases', payload); loadFinance(financeFilters); }}
              onCreateExpense={async (payload) => { await api.post('/api/expenses', payload); loadFinance(financeFilters); }}
            />
          )}
          {activeSection.startsWith('menu') && (() => {
            const view = activeSection.split(':')[1] || 'dishes';
            if (view === 'categories') {
              return (
                <AdminCategories
                  categories={categories}
                  menus={menus}
                  reload={loadAll}
                  onCreate={async (payload) => { await api.post('/api/categories', payload); loadAll(); }}
                  onUpdate={async (id, payload) => { await api.put(`/api/categories/${id}`, payload); loadAll(); }}
                  onDelete={async (id) => { await api.delete(`/api/categories/${id}`); loadAll(); }}
                />
              );
            }
            if (view === 'addons') {
              return (
                <AdminAddOns
                  addOns={addons}
                  menus={menus}
                  onRefresh={loadAll}
                  onCreate={async (payload) => { await api.post('/api/addons', payload); loadAll(); }}
                  onUpdate={async (id, payload) => { await api.put(`/api/addons/${id}`, payload); loadAll(); }}
                  onDelete={async (id) => { await api.delete(`/api/addons/${id}`); loadAll(); }}
                />
              );
            }
            if (view === 'submenus') {
              return (
                <AdminSubMenus
                  submenus={submenus}
                  menus={menus}
                  combos={combos}
                  onCreate={async (payload) => { await api.post('/api/submenus', payload); loadAll(); }}
                  onUpdate={async (id, payload) => { await api.put(`/api/submenus/${id}`, payload); loadAll(); }}
                  onDelete={async (id) => { await api.delete(`/api/submenus/${id}`); loadAll(); }}
                />
              );
            }
            if (view === 'combos') {
              return (
                <AdminCombos combos={combos} onRefresh={loadAll} />
              );
            }
              return (
                <AdminDishes
                  dishes={menus}
                  categories={categories}
                  submenus={submenus}
                  addOns={addons}
                  onToggle={async (dish) => { await api.put(`/api/menus/${dish._id}`, { isAvailable: !dish.isAvailable }); loadAll(); }}
                  onRefresh={loadAll}
                  onCreate={createDish}
                  onUpdate={updateDish}
                  onDelete={deleteDish}
              />
            );
          })()}
          {activeSection === 'history' && <AdminHistory history={history} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
