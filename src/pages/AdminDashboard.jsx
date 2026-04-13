import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/client.js';
import { BarChart3, Bell, BookOpen, Boxes, ChevronDown, Globe, Grid2x2, History, Home, ListChecks, LogOut, Settings, Table2, Users, X } from 'lucide-react';
import NotificationToasts from '../components/NotificationToasts.jsx';
import NotificationPage from '../components/admin/notifications/NotificationPage.jsx';
import { createSocket } from '../api/socket.js';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar.jsx';
import { clearSession, getBranchId, getBranches, getCurrentUser, hasPermission, setBranchId } from '../api/session.js';
import AdminOverview from '../components/admin/dashboard/AdminOverview.jsx';
import AdminOrders from '../components/admin/orders/adminOrders/AdminOrders.jsx';
import AdminUsers from '../components/admin/users/AdminUsers.jsx';
import AdminTableList from '../components/admin/tables/AdminTableList.jsx';
import AdminSpaces from '../components/admin/tables/AdminSpaces.jsx';
import AdminQrCodes from '../components/admin/tables/AdminQrCodes.jsx';
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
import AdminSettings from '../components/admin/settings/AdminSettings.jsx';
import SettingsSidebar from '../components/admin/settings/SettingsSidebar.jsx';
import AdminCustomers from '../components/admin/customers/AdminCustomers.jsx';
import '../common/css/admin/common/adminLayout.css';
import '../common/css/admin/common/adminResponsive.css';

const AdminDashboard = () => {
  const mobileSettingsViews = [
    { id: 'restaurant-details', label: 'Restaurant' },
    { id: 'tax-rates', label: 'Tax' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'activity-log', label: 'Activity' },
    { id: 'department', label: 'Department' },
    { id: 'billing', label: 'Billing' },
    { id: 'users-role', label: 'Roles' },
    { id: 'trash', label: 'Trash' },
    { id: 'invoice-setting', label: 'Invoice' },
    { id: 'kot-setting', label: 'KOT' },
    { id: 'printer', label: 'Printer' },
    { id: 'support', label: 'Support' },
    { id: 'release', label: 'Release' }
  ];
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tables, setTables] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [qrData, setQrData] = useState(null);
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
  const [customers, setCustomers] = useState([]);
  const [customerRewards, setCustomerRewards] = useState({ salesAmount: 0, rewardPoints: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [branchOpen, setBranchOpen] = useState(false);
  const [mobileMenuSheetOpen, setMobileMenuSheetOpen] = useState(false);
  const mobileNavTouchStartY = useRef(0);
  const [financeFilters, setFinanceFilters] = useState({ dateFrom: '', dateTo: '' });
  const [dashboardOptions, setDashboardOptions] = useState({
    includeAnalytics: false,
    includeStock: false,
    includeHistory: false,
    includeNotifications: false
  });
  const currentUser = getCurrentUser();
  const branches = getBranches() || [];
  const activeBranchId = getBranchId() || branches[0]?.branchId || branches[0]?._id;
  const activeBranch = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const restaurantName = activeBranch?.branchName || currentUser?.restaurantName || currentUser?.name || 'Restaurant';
  const isSuperAdmin = currentUser?.role?.toLowerCase() === 'superadmin';
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersLimit, setOrdersLimit] = useState(12);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [orderDashboardData, setOrderDashboardData] = useState(null);
  const [overviewDashboardData, setOverviewDashboardData] = useState(null);
  const [financeDashboardData, setFinanceDashboardData] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [transactionMeta, setTransactionMeta] = useState({ page: 1, limit: 20, total: 0 });
  const [transactionFilters, setTransactionFilters] = useState({ dateFrom: '', dateTo: '' });
  const [toasts, setToasts] = useState([]);
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
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    loyaltyDiscount: '',
    openingBalanceType: 'dr',
    openingAmount: '',
    legalName: '',
    taxNumber: '',
    creditLimit: '',
    creditTermDays: '',
    dob: '',
    address: ''
  });
  const [tableForm, setTableForm] = useState({ tableNumber: '', name: '', type: '', capacity: '', charge: '' });
  const [spaceForm, setSpaceForm] = useState({ name: '', type: '', capacity: '', charge: '' });
  const [qrSearch, setQrSearch] = useState('');
  const [menuForm, setMenuForm] = useState({ name: '', category: '', price: '', imageUrl: '' });
  const menuCreateRef = React.useRef(false);

  const pushToast = useCallback((payload) => {
    const id = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = { id, toast: true, ...payload };
    setToasts((prev) => [toast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, payload.duration || 3500);
  }, []);

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

  const loadSpaces = async () => {
    const res = await api.get('/api/spaces');
    setSpaces(Array.isArray(res.data) ? res.data : []);
  };

  const loadQrCodes = async () => {
    const res = await api.get('/api/qr-codes');
    setQrData(res.data || null);
  };

  const loadRoles = async () => {
    try {
      const res = await api.get('/api/roles');
      const payload = res.data || {};
      const custom = Array.isArray(payload.roles) ? payload.roles : [];
      const allowed = new Set(['superadmin', 'admin', 'waiter', 'kitchen']);
      const normalized = custom
        .map((r) => ({ ...r, name: (r.name || '').toLowerCase() }))
        .filter((r) => allowed.has(r.name));
      const byValue = new Map();
      normalized.forEach((r) => {
        if (!byValue.has(r.name)) {
          byValue.set(r.name, { ...r, label: r.name, value: r.name });
        }
      });
      setRoles(Array.from(byValue.values()));
    } catch (e) {
      setRoles([
        { value: 'superadmin', label: 'superadmin' },
        { value: 'admin', label: 'admin' },
        { value: 'waiter', label: 'waiter' },
        { value: 'kitchen', label: 'kitchen' }
      ]);
    }
  };

  const loadInventory = useCallback(async () => {
    const [ingRes, txnRes] = await Promise.all([
      api.get('/api/inventory/ingredients'),
      api.get('/api/inventory/transactions')
    ]);
    setIngredients(ingRes.data);
    setTransactions(txnRes.data);
  }, []);

  const loadCustomers = async () => {
    const res = await api.get('/api/customers');
    setCustomers(Array.isArray(res.data) ? res.data : []);
  };

  const loadCustomerRewards = async () => {
    const res = await api.get('/api/customers/rewards');
    setCustomerRewards(res.data || { salesAmount: 0, rewardPoints: 0 });
  };

  const loadHistoryData = useCallback(async () => {
    try {
      const res = await api.get('/api/reports/history');
      setHistory(res.data || []);
    } catch (e) {
      console.error('Failed to load history', e);
    }
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
    loadRoles();
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

  useEffect(() => {
    if (activeSection === 'customers') {
      loadCustomers();
      loadCustomerRewards();
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
    if (activeSection.startsWith('tables')) {
      loadAll();
      loadSpaces();
      if (activeSection === 'tables:qr') {
        loadQrCodes();
      }
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'history') {
      loadHistoryData();
    }
  }, [activeSection, loadHistoryData]);

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
      pushToast({
        title: 'User already exists',
        message: error.response?.data?.message || 'Email or phone already exists. Please invite instead.',
        type: 'error'
      });
    }
  };

  const setUserStatus = async (userId, status) => {
    await api.patch(`/api/users/${userId}/status`, { status });
    loadUsers();
  };

  const assignUserRole = async (userId, role) => {
    if (!role) return;
    const payload = role._id
      ? { roleId: role._id }
      : { roleName: role.value || role.name || role.label };
    await api.patch(`/api/users/${userId}/role`, payload);
    loadUsers();
  };

  const editUser = async (user, payload) => {
    try {
      const { status, ...updatePayload } = payload;
      await api.put(`/api/users/${user._id}`, updatePayload);
      if (status && status !== user.status) {
        await api.patch(`/api/users/${user._id}/status`, { status });
      }
      loadAll();
    } catch (error) {
      pushToast({
        title: 'Update failed',
        message: error.response?.data?.message || 'Failed to update user',
        type: 'error'
      });
    }
  };

  const deleteUser = async (user) => {
    try {
      await api.delete(`/api/users/${user._id}`);
      loadUsers();
    } catch (error) {
      pushToast({
        title: 'Delete failed',
        message: error.response?.data?.message || 'Unable to delete user',
        type: 'error'
      });
    }
  };

  const createCustomer = async () => {
    try {
      const payload = {
        ...customerForm,
        loyaltyDiscount: customerForm.loyaltyDiscount ? Number(customerForm.loyaltyDiscount) : 0,
        openingAmount: customerForm.openingAmount ? Number(customerForm.openingAmount) : 0,
        creditLimit: customerForm.creditLimit ? Number(customerForm.creditLimit) : 0,
        creditTermDays: customerForm.creditTermDays ? Number(customerForm.creditTermDays) : 0
      };
      await api.post('/api/customers', payload);
      setCustomerForm({
        name: '',
        email: '',
        phone: '',
        loyaltyDiscount: '',
        openingBalanceType: 'dr',
        openingAmount: '',
        legalName: '',
        taxNumber: '',
        creditLimit: '',
        creditTermDays: '',
        dob: '',
        address: ''
      });
      loadCustomers();
    } catch (error) {
      pushToast({
        title: 'Customer error',
        message: error.response?.data?.message || 'Failed to add customer',
        type: 'error'
      });
    }
  };

  const updateCustomer = async (id, payload) => {
    try {
      await api.put(`/api/customers/${id}`, payload);
      loadCustomers();
    } catch (error) {
      pushToast({
        title: 'Update failed',
        message: error.response?.data?.message || 'Failed to update customer',
        type: 'error'
      });
    }
  };

  const saveCustomerRewards = async () => {
    try {
      await api.put('/api/customers/rewards', {
        salesAmount: Number(customerRewards.salesAmount || 0),
        rewardPoints: Number(customerRewards.rewardPoints || 0)
      });
    } catch (error) {
      pushToast({
        title: 'Rewards update failed',
        message: error.response?.data?.message || 'Failed to update rewards',
        type: 'error'
      });
    }
  };

  const createTable = async () => {
    try {
      const tableNumber = Number.parseInt(tableForm.tableNumber, 10);
      if (!tableNumber) return alert('Enter a valid table number');
      await api.post('/api/tables', {
        tableNumber,
        name: tableForm.name || undefined,
        type: tableForm.type || undefined,
        capacity: tableForm.capacity ? Number(tableForm.capacity) : undefined,
        charge: tableForm.charge ? Number(tableForm.charge) : undefined
      });
      setTableForm({ tableNumber: '', name: '', type: '', capacity: '', charge: '' });
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

  const createSpace = async () => {
    await api.post('/api/spaces', {
      name: spaceForm.name,
      type: spaceForm.type || undefined,
      capacity: spaceForm.capacity ? Number(spaceForm.capacity) : undefined,
      charge: spaceForm.charge ? Number(spaceForm.charge) : undefined
    });
    setSpaceForm({ name: '', type: '', capacity: '', charge: '' });
    loadSpaces();
  };

  const updateSpace = async (id, payload) => {
    await api.put(`/api/spaces/${id}`, payload);
    loadSpaces();
  };

  const deleteSpace = async (id) => {
    await api.delete(`/api/spaces/${id}`);
    loadSpaces();
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
  const sectionTitle = useMemo(() => {
    if (activeSection.startsWith('menu')) return 'Menu';
    if (activeSection.startsWith('tables')) return 'Table & Space';
    if (activeSection.startsWith('inventory')) return 'Inventory';
    if (activeSection.startsWith('reports')) return 'Reports';
    if (activeSection.startsWith('settings')) return 'Settings';
    const map = {
      dashboard: 'Dashboard',
      orders: 'Orders',
      users: 'Users',
      customers: 'Customers',
      website: 'Website',
      notifications: 'Notifications',
      history: 'History',
      menus: 'Menus'
    };
    return map[activeSection] || 'Admin';
  }, [activeSection]);
  const mobileMenuItems = useMemo(() => {
    const tabs = [
      { key: 'dashboard', label: 'Home', icon: Home, match: (section) => section === 'dashboard', permission: 'dashboard:view' },
      { key: 'orders', label: 'Orders', icon: ListChecks, match: (section) => section === 'orders', permission: 'orders:view' },
      { key: 'users', label: 'Users', icon: Users, match: (section) => section === 'users', permission: 'staff:view' },
      { key: 'customers', label: 'Customers', icon: Users, match: (section) => section === 'customers', permission: 'customers:view' },
      { key: 'tables:table', label: 'Tables', icon: Table2, match: (section) => section.startsWith('tables'), permission: 'tables:view' },
      { key: 'menu:dishes', label: 'Menu', icon: BookOpen, match: (section) => section.startsWith('menu'), permission: 'menu:view' },
      { key: 'inventory:ingredients', label: 'Stock', icon: Boxes, match: (section) => section.startsWith('inventory'), permission: 'inventory:view' },
      { key: 'reports:company', label: 'Reports', icon: BarChart3, match: (section) => section.startsWith('reports'), permission: 'reports:view' },
      { key: 'history', label: 'History', icon: History, match: (section) => section === 'history', permission: 'reports:view' },
      { key: 'website', label: 'Website', icon: Globe, match: (section) => section === 'website', permission: 'website:view' },
      { key: 'notifications', label: 'Alerts', icon: Bell, match: (section) => section === 'notifications', permission: 'notifications:view' },
      { key: 'settings:restaurant-details', label: 'Settings', icon: Settings, match: (section) => section.startsWith('settings'), permission: 'settings:view' }
    ];
    return tabs.filter((tab) => hasPermission(tab.permission));
  }, []);
  const mobileSectionSubTabs = useMemo(() => {
    if (activeSection.startsWith('tables')) {
      return [
        { id: 'tables:table', label: 'Table' },
        { id: 'tables:space', label: 'Space' },
        { id: 'tables:qr', label: 'QR Codes' }
      ];
    }
    if (activeSection.startsWith('menu')) {
      return [
        { id: 'menu:dishes', label: 'Dishes' },
        { id: 'menu:categories', label: 'Categories' },
        { id: 'menu:addons', label: 'Add-Ons' },
        { id: 'menu:submenus', label: 'Sub Menu' },
        { id: 'menu:combos', label: 'Combos' }
      ];
    }
    if (activeSection.startsWith('inventory')) {
      return [
        { id: 'inventory:ingredients', label: 'Ingredients' },
        { id: 'inventory:recipes', label: 'Recipes' },
        { id: 'inventory:transactions', label: 'Transactions' }
      ];
    }
    if (activeSection.startsWith('reports')) {
      return [
        { id: 'reports:company', label: 'Company' },
        { id: 'reports:waiter', label: 'Waiter' },
        { id: 'reports:kitchen', label: 'Kitchen' },
        { id: 'reports:stock', label: 'Stock' }
      ];
    }
    return [];
  }, [activeSection]);

  const frequentItems = useMemo(() => {
    const itemCounts = {};
    history.forEach((entry) => {
      entry.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [history]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuSheetOpen(false);
      return;
    }
    document.body.style.overflow = mobileMenuSheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, mobileMenuSheetOpen]);

  const handleMobileLogout = () => {
    clearSession();
    window.location.href = '/login';
  };
  const isMoreSectionActive = useMemo(() => {
    return !(
      activeSection === 'dashboard' ||
      activeSection === 'orders' ||
      activeSection.startsWith('tables') ||
      activeSection.startsWith('menu')
    );
  }, [activeSection]);
  const mobilePrimaryTabs = useMemo(() => {
    const tabs = [
      { key: 'dashboard', label: 'Home', icon: Home, match: (section) => section === 'dashboard', permission: 'dashboard:view' },
      { key: 'orders', label: 'Orders', icon: ListChecks, match: (section) => section === 'orders', permission: 'orders:view' },
      { key: 'tables:table', label: 'Tables', icon: Table2, match: (section) => section.startsWith('tables'), permission: 'tables:view' },
      { key: 'menu:dishes', label: 'Menu', icon: BookOpen, match: (section) => section.startsWith('menu'), permission: 'menu:view' }
    ];
    return tabs.filter((tab) => hasPermission(tab.permission));
  }, []);

  return (
    <div className={`admin-shell ${isMobile ? 'mobile-app-shell' : ''}`}>
      <NotificationToasts notifications={toasts} />
      {isMobile && (
        <header className="mobile-admin-topbar">
          <div className="mobile-admin-header-row">
            <div className="mobile-branch-branding" onClick={() => setBranchOpen((prev) => !prev)}>
              <div className="mobile-branch-logo">{restaurantName.charAt(0).toUpperCase()}</div>
              <div className="mobile-branch-info">
                <div className="mobile-branch-name">
                  {restaurantName}
                  <ChevronDown size={12} className={`mobile-branch-chevron ${branchOpen ? 'open' : ''}`} />
                </div>
                <div className="mobile-branch-badge">Premium</div>
              </div>
              {branchOpen && (
                <div className="mobile-branch-dropdown">
                  {branches.map((b) => (
                    <button
                      key={b.branchId || b._id}
                      className={`mobile-branch-option ${activeBranchId === (b.branchId || b._id) ? 'active' : ''}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setBranchId(b.branchId || b._id);
                        window.location.reload();
                      }}
                    >
                      {b.branchName || b.name || b.code || 'Branch'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mobile-admin-branding">
              <span className="mobile-admin-brand-text">merorestro</span>
              <span className="mobile-admin-brand-mark">V</span>
              <button type="button" className="mobile-admin-logout-btn" onClick={handleMobileLogout} aria-label="Log out">
                <LogOut size={14} />
              </button>
            </div>
          </div>
          <div className="mobile-topbar-title">{sectionTitle}</div>
        </header>
      )}
      <div className={`admin-body ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className={`sidebar-placeholder ${sidebarOpen ? '' : 'closed'}`}>
          {activeSection.startsWith('settings') && !isMobile ? (
            <SettingsSidebar
              active={activeSection.split(':')[1] || 'restaurant-details'}
              onSelect={(view) => setActiveSection(`settings:${view}`)}
              onBack={() => setActiveSection('dashboard')}
            />
          ) : (
            <AdminSidebar
              activeSection={activeSection}
              onSelect={setActiveSection}
              isOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              unreadCount={unreadCount}
            />
          )}
        </div>

        <div className="content">
          {activeSection === 'dashboard' && hasPermission('dashboard:view') && (
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
          {activeSection === 'notifications' && hasPermission('notifications:view') && (
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
          {activeSection === 'orders' && hasPermission('orders:view') && (
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
          {activeSection === 'users' && hasPermission('staff:view') && (
            <>
              <AdminUsers
                users={users}
                roles={roles}
                userForm={userForm}
                setUserForm={setUserForm}
                onCreateUser={createUser}
                onEditUser={editUser}
                onLoadPromotions={(u) => loadPromotions(u._id)}
                onSetStatus={setUserStatus}
                onAssignRole={assignUserRole}
                onDeleteUser={deleteUser}
                canEdit={isSuperAdmin}
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
          {activeSection === 'customers' && hasPermission('customers:view') && (
            <AdminCustomers
              customers={customers}
              rewards={customerRewards}
              setRewards={setCustomerRewards}
              onSaveRewards={saveCustomerRewards}
              form={customerForm}
              setForm={setCustomerForm}
              onCreateCustomer={createCustomer}
              onUpdateCustomer={updateCustomer}
            />
          )}
          {activeSection === 'tables:table' && hasPermission('tables:view') && (
            <AdminTableList
              tables={tables}
              spaces={spaces}
              tableForm={tableForm}
              setTableForm={setTableForm}
              onCreateTable={createTable}
              onFreeTable={freeTable}
              onUpdateTable={updateTable}
              onDeleteTable={deleteTable}
            />
          )}
          {activeSection === 'tables:space' && hasPermission('tables:view') && (
            <AdminSpaces
              spaces={spaces}
              spaceForm={spaceForm}
              setSpaceForm={setSpaceForm}
              onCreateSpace={createSpace}
              onUpdateSpace={updateSpace}
              onDeleteSpace={deleteSpace}
            />
          )}
          {activeSection === 'tables:qr' && hasPermission('tables:view') && (
            <AdminQrCodes qrData={qrData} search={qrSearch} setSearch={setQrSearch} />
          )}
          {activeSection === 'menus' && hasPermission('menu:view') && (
            <AdminMenus
              menus={menus}
              menuForm={menuForm}
              setMenuForm={setMenuForm}
              onCreateMenu={createMenu}
              onEditMenu={editMenu}
            />
          )}
          {activeSection === 'website' && hasPermission('website:view') && <AdminWebsite />}
          {activeSection.startsWith('settings') && hasPermission('settings:view') && (
            <>
              {isMobile && (
                <div className="mobile-settings-tabs">
                  {mobileSettingsViews.map((view) => (
                    <button
                      key={view.id}
                      type="button"
                      className={`mobile-settings-tab ${
                        (activeSection.split(':')[1] || 'restaurant-details') === view.id ? 'active' : ''
                      }`}
                      onClick={() => setActiveSection(`settings:${view.id}`)}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              )}
              <AdminSettings
                activeView={activeSection.split(':')[1] || 'restaurant-details'}
              />
            </>
          )}
          {activeSection.startsWith('inventory') && hasPermission('inventory:view') && (
            <AdminInventory
              menus={menus}
              ingredients={ingredients}
              transactions={transactions}
              reload={loadInventory}
              externalView={activeSection.split(':')[1] || 'ingredients'}
            />
          )}
          {activeSection.startsWith('reports') && hasPermission('reports:view') && (
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
          {activeSection.startsWith('menu') && hasPermission('menu:view') && (() => {
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
          {activeSection === 'history' && hasPermission('reports:view') && <AdminHistory history={history} />}
        </div>
      </div>
      {isMobile && (
        <>
          <nav
            className="mobile-admin-bottom-nav mobile-five-nav"
            aria-label="Admin quick navigation"
            onTouchStart={(event) => {
              mobileNavTouchStartY.current = event.changedTouches[0]?.clientY || 0;
            }}
            onTouchEnd={(event) => {
              const endY = event.changedTouches[0]?.clientY || 0;
              if (mobileNavTouchStartY.current - endY > 36) {
                setMobileMenuSheetOpen(true);
              }
            }}
          >
            {mobilePrimaryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`mobile-nav-item ${tab.match(activeSection) ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection(tab.key);
                    setMobileMenuSheetOpen(false);
                  }}
                >
                  <Icon size={17} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              className={`mobile-nav-item ${mobileMenuSheetOpen || isMoreSectionActive ? 'active' : ''}`}
              onClick={() => setMobileMenuSheetOpen((prev) => !prev)}
            >
              <Grid2x2 size={17} />
              <span>More</span>
            </button>
          </nav>

          {mobileMenuSheetOpen && <div className="mobile-menu-sheet-backdrop" onClick={() => setMobileMenuSheetOpen(false)} />}
          <div className={`mobile-menu-sheet ${mobileMenuSheetOpen ? 'open' : ''}`} aria-hidden={!mobileMenuSheetOpen}>
            <div className="mobile-menu-sheet-handle" />
            <div className="mobile-menu-sheet-head">
              <strong>All Menu</strong>
              <button type="button" className="mobile-menu-sheet-close" onClick={() => setMobileMenuSheetOpen(false)}>
                <X size={16} />
              </button>
            </div>
            {mobileSectionSubTabs.length > 0 && (
              <div className="mobile-menu-subtabs">
                {mobileSectionSubTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`mobile-menu-subtab ${activeSection === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(tab.id);
                      setMobileMenuSheetOpen(false);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            <div className="mobile-menu-sheet-grid">
              {mobileMenuItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`mobile-menu-sheet-item ${tab.match(activeSection) ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(tab.key);
                      setMobileMenuSheetOpen(false);
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
