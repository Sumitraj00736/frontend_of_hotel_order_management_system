import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { CheckCircle, Volume2 } from 'lucide-react';
import api from '../api/client.js';
import NotificationToasts from '../components/NotificationToasts.jsx';
import NotificationPage from '../components/admin/notifications/NotificationPage.jsx';
import { createSocket } from '../api/socket.js';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar.jsx';
import { clearSession, getBranchId, getBranches, getCurrentUser, hasPermission, setBranchId } from '../api/session.js';
import { ensureNotificationPermission, pushSystemNotification } from '../utils/systemNotifications.js';
import AdminHeader from '../components/admin/header/AdminHeader.jsx';
import AdminMobileNavigation from '../components/admin/mobile/AdminMobileNavigation.jsx';
import AdminMobileSettingsTabs from '../components/admin/mobile/AdminMobileSettingsTabs.jsx';
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
import AdminFinance from '../components/admin/finance/AdminFinance.jsx';
import AdminWebsite from '../components/admin/website/AdminWebsite.jsx';
import AdminSettings from '../components/admin/settings/AdminSettings.jsx';
import SettingsSidebar from '../components/admin/settings/SettingsSidebar.jsx';
import AdminCustomers from '../components/admin/customers/AdminCustomers.jsx';
import AdminOrderConfirmModal from '../components/admin/orders/addItemsModal/AdminOrderConfirmModal.jsx';
import AdminAddOrderModal from '../components/admin/orders/addItemsModal/AdminAddOrderModal.jsx';
import AddItemsModal from '../components/admin/orders/addItemsModal/AddItemsModal.jsx';
import { playSound } from '../utils/sound.js';
import '../common/css/admin/common/adminLayout.css';
import '../common/css/admin/common/adminResponsive.css';

const AdminDashboard = () => {
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
  const [financeFilters, setFinanceFilters] = useState({ dateFrom: '', dateTo: '' });
  const [dashboardOptions, setDashboardOptions] = useState({
    includeAnalytics: true,
    includeStock: true,
    includeHistory: true,
    includeNotifications: true
  });
  const currentUser = getCurrentUser();
  const branches = getBranches() || [];
  const activeBranchId = getBranchId() || branches[0]?.branchId || branches[0]?._id;
  const activeBranch = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const orgName = activeBranch?.orgName || branches[0]?.orgName || currentUser?.orgName || currentUser?.organizationName;
  const restaurantName =
    orgName || currentUser?.restaurantName || currentUser?.name || 'Restaurant';
  const isSuperAdmin = currentUser?.role?.toLowerCase() === 'superadmin';
  const canAccessAdminSection = useCallback(
    (permission) => {
      if (!permission) return true;
      if (permission === 'settings:view' || permission === 'settings:edit') {
        return isSuperAdmin && hasPermission(permission);
      }
      return hasPermission(permission);
    },
    [isSuperAdmin]
  );
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersLimit, setOrdersLimit] = useState(12);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersFilter, setOrdersFilter] = useState('active');
  const [orderDashboardData, setOrderDashboardData] = useState(null);
  const [overviewDashboardData, setOverviewDashboardData] = useState(null);
  const [financeDashboardData, setFinanceDashboardData] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [transactionMeta, setTransactionMeta] = useState({ page: 1, limit: 20, total: 0 });
  const [transactionFilters, setTransactionFilters] = useState({ dateFrom: '', dateTo: '' });
  const [toasts, setToasts] = useState([]);
  const dashboardLoadedRef = React.useRef(false);

  // Admin Order Creation Flow
  const [showAdminAddOrderModal, setShowAdminAddOrderModal] = useState(false); // Step 1 modal
  const [addOrderStep, setAddOrderStep] = useState(1);
  const [selectedOrderTarget, setSelectedOrderTarget] = useState(null); // { type, id, name }

  const [showAdminOrderModal, setShowAdminOrderModal] = useState(false); // Step 2 modal
  const [showAdminConfirmModal, setShowAdminConfirmModal] = useState(false);
  const [showAdminSuccessPopup, setShowAdminSuccessPopup] = useState(false);
  const [adminOrderItems, setAdminOrderItems] = useState([]);
  const [adminOrderWaiterId, setAdminOrderWaiterId] = useState('');
  const [adminOrderTableId, setAdminOrderTableId] = useState('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

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
  const [autoOpenTableModal, setAutoOpenTableModal] = useState(false);
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

  const loadOrdersPage = async (page = ordersPage, limit = ordersLimit, category = ordersFilter) => {
    const res = await api.get('/api/orders', { params: { paginate: 1, page, limit, category } });
    const payload = res.data;
    if (payload.success && Array.isArray(payload.data)) {
      setOrders(payload.data);
      setOrdersTotal(payload.pagination?.total || 0);
      setOrdersPage(payload.pagination?.page || page);
      setOrdersLimit(payload.pagination?.limit || limit);
      return;
    }
    // Fallback if success is true but data is direct array (shouldn't happen with new API)
    if (Array.isArray(payload.data)) {
      setOrders(payload.data);
    } else if (Array.isArray(payload)) {
      setOrders(payload);
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (activeSection === 'orders') {
      loadOrdersPage(ordersPage, ordersLimit, ordersFilter);
    }
  }, [activeSection, ordersPage, ordersLimit, ordersFilter]);

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
    ensureNotificationPermission();
    const socket = createSocket();

    socket.on('notify', (payload) => {
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
      if (payload.type === 'order:paid') {
        pushSystemNotification({
          title: 'Order Checkout Completed',
          body: payload.message || 'An order has been checked out.',
          tag: 'order-paid'
        });
      }
      if (payload.type === 'order:paid') {
        loadOverviewOnly();
      }
    });

    socket.on('orders:new', (order) => {
      setOrders((prev) => [order, ...prev]);
      
      const tableLabel = order?.table?.tableNumber ? `Table ${order.table.tableNumber}` : 'Takeaway';
      pushToast({
        id: order._id,
        title: 'New Order Received',
        message: `${tableLabel} has a new order.`,
        type: 'success'
      });

      pushSystemNotification({
        title: 'New Order Received',
        body: `Table ${order?.table?.tableNumber || '-'} has a new order.`,
        tag: 'order-new'
      });
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

  const handleAdminSubmitOrder = async () => {
    try {
      const type = selectedOrderTarget?.type || 'table';
      const orderTypeMap = {
        'table': 'dine_in',
        'customer': 'takeaway',
        'staff': 'staff'
      };

      const payload = {
        table: type === 'table' ? selectedOrderTarget.id : undefined,
        customerId: type === 'customer' ? selectedOrderTarget.id : undefined,
        staffId: type === 'staff' ? selectedOrderTarget.id : undefined,
        customerName: selectedOrderTarget?.name || 'Walk-in Customer',
        orderType: orderTypeMap[type] || 'dine_in',
        items: adminOrderItems.map(i => ({
          menuItem: i.menuItem?._id || i.menuItem,
          quantity: i.quantity,
          variantId: i.variantId || i.variant?._id,
          variantName: i.variantName || i.variant?.name,
          variantPrice: i.variantPrice || i.variant?.price,
          itemNote: i.itemNote
        })),
        assignedStaff: adminOrderWaiterId || undefined
      };
      const res = await api.post('/api/orders', payload);
      setLastCreatedOrder(res.data);
      setShowAdminConfirmModal(false);
      setShowAdminSuccessPopup(true);
      playSound('success');
      const targetLabel = res.data.table ? `Table ${res.data.table.tableNumber}` : `${res.data.orderType} Order`;
      pushToast({ title: 'Order Confirmed', message: `${targetLabel} is now booked.`, type: 'success' });
      loadAll();
      // Reset form
      setAdminOrderItems([]);
      setAdminOrderWaiterId('');
      setAdminOrderTableId('');
      setSelectedOrderTarget(null);
    } catch (error) {
      pushToast({ title: 'Order Failed', message: error.response?.data?.message || 'Failed to create order', type: 'error' });
      playSound('error');
    }
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
    // Open a tab/window immediately to preserve user-gesture context on mobile browsers.
    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups and try printing again.');
      return;
    }
    printWindow.document.write('<p style="font-family:sans-serif;padding:16px">Preparing invoice...</p>');
    printWindow.document.close();

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
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
    if (activeSection.startsWith('finance')) return 'Finance';
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
    if (activeSection.startsWith('settings') && !isSuperAdmin) {
      setActiveSection('dashboard');
    }
  }, [activeSection, isSuperAdmin]);

  const handleMobileLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return (
    <div className={`admin-shell ${isMobile ? 'mobile-app-shell' : ''}`}>
      {!soundEnabled && (
        <div className="sound-enable-banner" onClick={unblockAudio}>
          <Volume2 size={18} />
          <span>Tap to enable order alerts sound</span>
        </div>
      )}
      <NotificationToasts notifications={toasts} />
      <AdminHeader
        isMobile={isMobile}
        sectionTitle={sectionTitle}
        organizationName={orgName}
        restaurantName={restaurantName}
        currentUser={currentUser}
        showSettingsMenu={isSuperAdmin}
        branchOpen={branchOpen}
        onToggleBranch={() => setBranchOpen((prev) => !prev)}
        branches={branches}
        activeBranchId={activeBranchId}
        onSelectBranch={(branch) => {
          setBranchId(branch.branchId || branch._id);
          window.location.reload();
        }}
        onOpenSetting={isSuperAdmin ? (settingId) => setActiveSection(`settings:${settingId}`) : undefined}
        onLogout={handleMobileLogout}
      />
      <div className={`admin-body ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className={`sidebar-placeholder ${sidebarOpen ? '' : 'closed'}`}>
          {activeSection.startsWith('settings') && !isMobile && isSuperAdmin ? (
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
          <div className="section-wrapper" key={activeSection}>
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
                await loadOrdersPage(ordersPage, ordersLimit, ordersFilter);
                return res.data;
              }}
              page={ordersPage}
              limit={ordersLimit}
              total={ordersTotal}
              filter={ordersFilter}
              onFilterChange={(next) => {
                setOrdersFilter(next);
                setOrdersPage(1);
              }}
              onPageChange={(next) => setOrdersPage(next)}
              onLimitChange={(next) => {
                setOrdersLimit(next);
                setOrdersPage(1);
              }}
              categories={categories}
              onNewOrder={() => {
                setAdminOrderItems([]);
                setAdminOrderTableId('');
                setSelectedOrderTarget(null);
                setAddOrderStep(1);
                loadCustomers();
                setShowAdminAddOrderModal(true);
              }}
              onAddTable={() => {
                setActiveSection('tables:table');
                setTimeout(() => setAutoOpenTableModal(true), 50);
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
              autoOpenAddModal={autoOpenTableModal}
              onAddModalClosed={() => setAutoOpenTableModal(false)}
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
          {activeSection.startsWith('settings') && isSuperAdmin && hasPermission('settings:view') && (
            <>
              {isMobile && (
                <AdminMobileSettingsTabs
                  isMobile={isMobile}
                  activeView={activeSection.split(':')[1] || 'restaurant-details'}
                  onSelect={(view) => setActiveSection(`settings:${view}`)}
                />
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
          {activeSection.startsWith('finance') && hasPermission('billing:view') && (
            <AdminFinance section={activeSection} onNavigate={setActiveSection} />
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
          </div>{/* end section-wrapper */}
        </div>
      </div>
          {/* Step 1: Target Selection Modal */}
          {showAdminAddOrderModal && (
            <AdminAddOrderModal
              open={showAdminAddOrderModal}
              onClose={() => setShowAdminAddOrderModal(false)}
              tables={tables}
              customers={customers}
              staff={users.filter(u => u.role === 'waiter' || u.role === 'admin')}
              onSelect={(target) => {
                setSelectedOrderTarget(target);
                if (target.type === 'table') {
                  setAdminOrderTableId(target.id);
                }
                setShowAdminAddOrderModal(false);
                setShowAdminOrderModal(true);
                setAddOrderStep(2);
              }}
            />
          )}

          {/* Step 2: Dish Selection Modal */}
          {showAdminOrderModal && (
            <AddItemsModal
              open={showAdminOrderModal}
              orderTargetName={selectedOrderTarget?.name} // Pass the target name for the header
              onClose={() => setShowAdminOrderModal(false)}
              menus={menus}
              categories={categories}
              staff={users.filter((u) => u.role === 'waiter' || u.role === 'admin')}
              items={adminOrderItems}
              onAddItem={(item) => {
                const menuItem = menus.find(m => m._id === (item.menuItem?._id || item.menuItem));
                const enrichedItem = {
                  ...item,
                  menuItem: {
                    _id: menuItem?._id,
                    name: menuItem?.name || 'Item'
                  },
                  priceAtOrderTime: item.variantPrice || menuItem?.price || 0
                };

                const existing = [...adminOrderItems];
                const idx = existing.findIndex(
                  (i) =>
                    (i.menuItem?._id || i.menuItem) === (enrichedItem.menuItem?._id || enrichedItem.menuItem) &&
                    (i.variantId || null) === (enrichedItem.variantId || null)
                );
                if (idx >= 0) {
                  existing[idx].quantity += enrichedItem.quantity;
                  setAdminOrderItems(existing);
                } else {
                  setAdminOrderItems([...existing, enrichedItem]);
                }
              }}
              onUpdateItemQuantity={(menuId, variantId, qty) => {
                const updated = adminOrderItems
                  .map((i) => {
                    const id = i.menuItem?._id || i.menuItem;
                    const vId = i.variantId || i.variant?._id || null;
                    if (id === menuId && vId === (variantId || null)) {
                      return { ...i, quantity: qty };
                    }
                    return i;
                  })
                  .filter((i) => i.quantity > 0);
                setAdminOrderItems(updated);
              }}
              onUpdateItemNote={(menuId, variantId, note) => {
                const updated = adminOrderItems.map((i) => {
                  const id = i.menuItem?._id || i.menuItem;
                  const vId = i.variantId || i.variant?._id || null;
                  if (id === menuId && vId === (variantId || null)) {
                    return { ...i, itemNote: note };
                  }
                  return i;
                });
                setAdminOrderItems(updated);
              }}
              onClearCart={() => setAdminOrderItems([])}
              onConfirm={(options) => {
                // handles both "Confirm & Print" and "Confirm Order"
                setShowAdminOrderModal(false);
                setShowAdminConfirmModal(true);
              }}
              confirmLabel="Proceed to Waiter Assignment"
              confirmDisabled={adminOrderItems.length === 0}
              onAssignStaff={setAdminOrderWaiterId}
              assignedStaffId={adminOrderWaiterId}
              tableOptions={tables
                .filter((t) => t.status !== 'occupied' || t._id === adminOrderTableId)
                .map((t) => ({ value: t._id, label: `Table ${t.tableNumber}` }))}
              selectedTableId={adminOrderTableId}
              onTableChange={setAdminOrderTableId}
            />
          )}

          {showAdminConfirmModal && (
            <AdminOrderConfirmModal
              open={showAdminConfirmModal}
              onClose={() => setShowAdminConfirmModal(false)}
              onConfirm={handleAdminSubmitOrder}
              items={adminOrderItems}
              staff={users}
              assignedStaffId={adminOrderWaiterId}
              tableNumber={tables.find((t) => t._id === adminOrderTableId)?.tableNumber || selectedOrderTarget?.name}
            />
          )}

          {showAdminSuccessPopup && lastCreatedOrder && (
            <div className="checkout-overlay">
              <div
                className="checkout-panel text-center p-5"
                style={{ maxWidth: '400px', height: 'auto' }}
              >
                <div className="mb-4 text-success">
                  <div
                    className="icon-circle bg-success-soft text-success mx-auto mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="fw-bold">Order Confirmed!</h3>
                  <p className="text-muted">
                    Table {lastCreatedOrder.table?.tableNumber} is successfully booked.
                  </p>
                </div>
                <button
                  className="btn btn-primary w-100 py-2 fw-bold"
                  onClick={() => setShowAdminSuccessPopup(false)}
                >
                  Great!
                </button>
              </div>
            </div>
          )}

      <AdminMobileNavigation
        isMobile={isMobile}
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        canAccess={canAccessAdminSection}
      />
    </div>
  );
};

export default AdminDashboard;
