import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { CheckCircle, ShoppingCart, Search, Home, UtensilsCrossed } from 'lucide-react';
import api from '../api/client.js';
import NotificationToasts from '../components/NotificationToasts.jsx';
import { createSocket } from '../api/socket.js';
import { clearSession, getBranchPermissions, getBranchRole, getCurrentUser } from '../api/session.js';
import { WAITER_ALLOWED_PERMISSIONS } from '../common/permissions.js';
import { ensureNotificationPermission, pushSystemNotification } from '../utils/systemNotifications.js';
import { getPushStatus, isPushSupported, subscribePush, getCurrentBrowserToken, sendTestPush } from '../utils/pushClient.js';
import { getMessagingInstance, onMessage } from '../utils/firebase.js';
import WaiterSidebar from '../components/waiter/Sidebar/WaiterSidebar.jsx';
import WaiterCart from '../components/waiter/Cart/WaiterCart.jsx';
import WaiterMenu from '../components/waiter/Menu/WaiterMenu.jsx';
import WaiterHeader from '../components/waiter/Header/WaiterHeader.jsx';
import WaiterOrders from '../components/waiter/Orders/WaiterOrders.jsx';
import WaiterCheckoutModal from '../components/waiter/Orders/WaiterCheckoutModal.jsx';
import WaiterProfile from '../components/waiter/Profile/WaiterProfile.jsx';
import WaiterAnalytics from '../components/waiter/Analytics/WaiterAnalytics.jsx';
import WaiterPromotionTimeline from '../components/waiter/PromotionTimeline/WaiterPromotionTimeline.jsx';
import NotificationPage from '../components/admin/notifications/NotificationPage.jsx';
import MenuSection from '../components/admin/orders/addItemsModal/MenuSection.jsx';
import CustomizeDishModal from '../components/admin/orders/addItemsModal/CustomizeDishModal.jsx';
import '../common/css/admin/common/adminLayout.css';
import '../common/css/waiter/waiterDashboard.css';
import '../common/css/admin/orders/orderDetail.css';

const WaiterApp = () => {
  const currentUser = getCurrentUser();
  const [tables, setTables] = useState([]);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [spiceLevel, setSpiceLevel] = useState('medium');
  const [instructions, setInstructions] = useState('');
  const [profile, setProfile] = useState(null);
  const [myAnalytics, setMyAnalytics] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderViewMode, setOrderViewMode] = useState('myOrders');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [checkoutOrderData, setCheckoutOrderData] = useState(null);
  const [addCategory, setAddCategory] = useState('all');
  const [addSubMenu, setAddSubMenu] = useState('all');
  const [customizeItem, setCustomizeItem] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [orderType, setOrderType] = useState('dine_in');

  const pushToast = useCallback((payload) => {
    const id = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = { id, toast: true, ...payload };
    setToasts((prev) => [toast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, payload.duration || 3500);
  }, []);

  // Toggle body scroll when mobile cart drawer is open
  useEffect(() => {
    if (mobileCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileCartOpen]);

  const branchRole = useMemo(() => (getBranchRole() || currentUser?.role || '').toLowerCase(), [currentUser?.role]);
  const effectiveRole = (branchRole || currentUser?.role || '').toLowerCase();
  const allowedPermissions = useMemo(() => {
    const perms = getBranchPermissions().map((p) => p.toLowerCase());
    if (perms.includes('*')) return ['*'];
    if (branchRole === 'waiter') {
      const defaults = WAITER_ALLOWED_PERMISSIONS.map((p) => p.toLowerCase());
      if (!perms.length) return defaults;
      return Array.from(new Set([...perms, ...defaults]));
    }
    return perms;
  }, [branchRole]);

  const can = (perm) => {
    if (!perm) return true;
    if (branchRole && ['admin', 'superadmin'].includes(branchRole)) return true;
    if (allowedPermissions.includes('*')) return true;
    return allowedPermissions.includes(perm.toLowerCase());
  };

  const availableSections = useMemo(() => {
    const sectionPermissions = {
      dashboard: 'dashboard:view',
      orders: 'orders:view',
      menu: 'menu:view',
      notifications: 'notifications:view'
    };

    if (effectiveRole === 'waiter') {
      return ['orders', 'takeaway', 'notifications', 'dashboard', 'menu', 'profile'].filter((section) => {
        if (section === 'orders' || section === 'profile' || section === 'takeaway') return true;
        const perm = sectionPermissions[section];
        return perm ? can(perm) : true;
      });
    }

    const items = [];
    if (can('orders:view')) items.push('orders');
    if (can('notifications:view')) items.push('notifications');
    if (can('dashboard:view')) items.push('dashboard');
    if (can('menu:view')) items.push('menu');
    items.push('profile');
    return items;
  }, [allowedPermissions.join('|'), effectiveRole]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationFilters, setNotificationFilters] = useState({});

  const loadData = async (ordersScope = 'mine') => {
    const results = await Promise.allSettled([
      api.get('/api/tables'),
      api.get('/api/menus'),
      api.get('/api/orders', { params: ordersScope === 'all' ? { scope: 'all' } : {} }),
      api.get('/api/profile/me'),
      api.get('/api/profile/waiter/analytics'),
      api.get('/api/promotions/me')
    ]);

    if (results[0].status === 'fulfilled') setTables(results[0].value.data);
    if (results[1].status === 'fulfilled') setMenus(results[1].value.data);
    if (results[2].status === 'fulfilled') {
      const payload = results[2].value.data;
      setOrders(Array.isArray(payload?.data) ? payload.data : payload);
    }
    if (results[3].status === 'fulfilled') setProfile(results[3].value.data);
    if (results[4].status === 'fulfilled') setMyAnalytics(results[4].value.data);
    if (results[5].status === 'fulfilled') setPromotions(results[5].value.data);
  };

  const loadCustomers = async () => {
    if (!can('customers:view')) return;
    try {
      const res = await api.get('/api/customers');
      setCustomers(res.data || []);
    } catch (error) {
      setCustomers([]);
    }
  };

  const loadNotifications = async (filters = {}) => {
    const res = await api.get('/api/notifications', { params: filters });
    setNotifications(res.data);
  };

  useEffect(() => {
    loadData('mine');
    loadNotifications();
    loadCustomers();
  }, []);

  useEffect(() => {
    if (activeSection === 'allOrders') {
      loadData('all');
    } else if (activeSection === 'myOrders' || activeSection === 'orders' || activeSection === 'dashboard') {
      loadData('mine');
    }
  }, [activeSection]);

  useEffect(() => {
    if (!availableSections.includes(activeSection) && !['myOrders', 'allOrders'].includes(activeSection)) {
      setActiveSection(availableSections[0] || 'dashboard');
    }
  }, [availableSections, activeSection]);

  useEffect(() => {
    loadNotifications(notificationFilters);
  }, [notificationFilters]);

  useEffect(() => {
    ensureNotificationPermission();
    const socket = createSocket();
    socket.on('orders:update', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });
    socket.on('orders:new', (order) => {
      setOrders((prev) => {
        if (prev.some((o) => o._id === order._id)) return prev;
        return [order, ...prev];
      });
      
      const tableLabel = order?.table?.tableNumber ? `Table ${order.table.tableNumber}` : 'Takeaway';
      pushToast({
        title: 'New Order Received',
        message: `${tableLabel} has a new order.`,
        type: 'success'
      });
      
      pushSystemNotification({
        title: 'New Order Received',
        body: `${tableLabel} has a new order.`,
        tag: 'waiter-order-new'
      });
    });
    socket.on('tables:update', (table) => {
      setTables((prev) => prev.map((t) => (t._id === table._id ? table : t)));
    });
    socket.on('notify', (payload) => {
      if (payload.waiterId && payload.waiterId !== (currentUser?._id || currentUser?.id)) return;
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
      pushToast({
        title: payload.title || 'Notification',
        message: payload.message || 'Notification received',
        type: 'info'
      });
      if (payload.type === 'order:paid') {
        pushSystemNotification({
          title: 'Order Checkout Completed',
          body: payload.message || 'An order has been checked out.',
          tag: 'waiter-order-paid'
        });
      }
    });

    const initPush = async () => {
      const supported = await isPushSupported();
      if (!supported) return;
      try {
        const [status, browserToken] = await Promise.all([
          getPushStatus(),
          getCurrentBrowserToken()
        ]);

        const shouldSubscribe = !status?.exists || (browserToken && status.fcmToken !== browserToken);

        if (shouldSubscribe) {
          if (Notification.permission === 'default' || Notification.permission === 'granted') {
            const handleSubscribe = async () => {
              try {
                await subscribePush();
                pushToast({ title: 'Success', message: 'Notifications enabled!', type: 'success' });
              } catch (err) {
                pushToast({ title: 'Error', message: err.message, type: 'error' });
              }
            };

            if (Notification.permission === 'granted') {
              handleSubscribe();
            } else {
              pushToast({
                title: '🔔 Notifications',
                message: 'Click here to enable real-time order alerts.',
                duration: 15000,
                onClick: handleSubscribe
              });
            }
          }
        }
      } catch (err) {
        console.warn('FCM setup for waiter failed:', err);
      }
    };
    initPush();

    // Foreground FCM listener
    let unsubscribeFCM = () => {};
    const setupFCMForeground = async () => {
      const messaging = await getMessagingInstance();
      if (messaging) {
        unsubscribeFCM = onMessage(messaging, (payload) => {
          console.log('[FCM] Foreground message received:', payload);
          pushToast({
            title: payload.notification?.title || 'New Update',
            message: payload.notification?.body || 'Check the details.',
            type: 'info'
          });
        });
      }
    };
    setupFCMForeground();

    return () => {
      socket.disconnect();
      unsubscribeFCM();
    };
  }, [currentUser]);

  const menuCategories = useMemo(() => {
    const names = new Set();
    menus.forEach((m) => {
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const label = m.category?.name || m.categoryName || (catId && catId.length !== 24 ? catId : null) || 'Uncategorized';
      if (label && label !== 'Uncategorized') names.add(label);
    });
    const result = Array.from(names);
    if (result.length) result.push('Uncategorized');
    return result;
  }, [menus]);

  const menuSubMenus = useMemo(() => {
    const names = new Set();
    menus.forEach((m) => {
      const label = m.subMenu?.name || m.subMenuName || (typeof m.subMenu === 'string' && m.subMenu.length !== 24 ? m.subMenu : null) || '';
      if (label) names.add(label);
    });
    return Array.from(names);
  }, [menus]);

  const filteredMenu = useMemo(() => {
    return menus.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const catId = m.category?._id || (typeof m.category === 'string' ? m.category : null);
      const cat = m.category?.name || m.categoryName || (catId && catId.length !== 24 ? catId : null) || 'Uncategorized';
      const sub = m.subMenu?.name || m.subMenuName || (typeof m.subMenu === 'string' && m.subMenu.length !== 24 ? m.subMenu : null) || '';
      if (m.isAvailable === false) return false;
      if (addCategory === 'recommended' && !m.isRecommended) return false;
      if (addCategory !== 'all' && cat !== addCategory) return false;
      if (addSubMenu !== 'all' && sub !== addSubMenu) return false;
      if (search && !name.includes(search.toLowerCase())) return false;
      return true;
    });
  }, [menus, addCategory, addSubMenu, search]);

  const addToCart = (itemPayload) => {
    const item = itemPayload.onAdd ? itemPayload : menus.find(m => m._id === (itemPayload.menuItem || itemPayload._id));
    if (!item || item.isAvailable === false) {
      alert('This item is unavailable');
      return;
    }
    
    // Handle variants from MenuSection
    const variantId = itemPayload.variantId || null;
    const variantName = itemPayload.variantName || null;
    const variantPrice = itemPayload.variantPrice || null;

    setCart((prev) => {
      const existing = prev.find((c) => 
        c.menuItem === item._id && 
        (c.variantId || null) === (variantId || null)
      );
      if (existing) {
        return prev.map((c) => (
          (c.menuItem === item._id && (c.variantId || null) === (variantId || null))
            ? { ...c, quantity: c.quantity + (itemPayload.quantity || 1) } 
            : c
        ));
      }
      return [
        ...prev, 
        { 
          menuItem: item._id, 
          name: item.name, 
          price: variantPrice ?? item.price, 
          quantity: itemPayload.quantity || 1,
          variantId,
          variantName,
          variantPrice
        }
      ];
    });
  };

  const updateQty = (menuItem, quantity, variantId = null) => {
    setCart((prev) => {
      const qty = Number(quantity);
      if (qty <= 0) return prev.filter((c) => !(c.menuItem === menuItem && (c.variantId || null) === (variantId || null)));
      return prev.map((c) => (c.menuItem === menuItem && (c.variantId || null) === (variantId || null)) ? { ...c, quantity: qty } : c);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const currentUserId = currentUser?._id || currentUser?.id;
  const filteredOrders = useMemo(() => {
    if (orderViewMode === 'allOrders') return orders;
    return orders.filter((o) => {
      const creatorId = o.createdBy?._id || o.createdBy;
      return creatorId === currentUserId || o.source === 'guest';
    });
  }, [orders, orderViewMode, currentUserId]);

  const handleInitCheckout = () => {
    if (orderType === 'dine_in' && !selectedTable) return alert('Select a table first');
    if (orderType === 'takeaway' && !selectedCustomer && !customers.length) {
      // If takeaway but no customer selected and no customers list, we might still allow it as "Walk-in"
    }
    if (cart.length === 0) return alert('Add at least one item');
    if (cart.some((c) => !c.quantity || c.quantity < 1)) {
      return alert('Quantity must be at least 1 for all items');
    }
    setShowCheckout(true);
    setMobileCartOpen(false);
  };

  const placeOrder = async () => {
    const payload = {
      table: orderType === 'dine_in' ? selectedTable : undefined,
      items: cart.map((c) => ({ menuItem: c.menuItem, quantity: c.quantity })),
      spiceLevel,
      specialInstructions: instructions,
      customerName: selectedCustomer || (orderType === 'takeaway' ? 'Walk-in Customer' : undefined),
      orderType: orderType === 'takeaway' ? 'takeaway' : 'dine_in'
    };

    try {
      if (editingOrderId) {
        await api.put(`/api/orders/${editingOrderId}`, payload);
      } else {
        await api.post('/api/orders', payload);
      }
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || 'Failed to place order');
      return;
    }

    setShowCheckout(false);
    setOrderSuccess(true);

    setTimeout(() => {
      setOrderSuccess(false);
      setCart([]);
      setSelectedTable(null);
      setSelectedCustomer('');
      setEditingOrderId(null);
      setSpiceLevel('medium');
      setInstructions('');
      loadData();
      setShowEditModal(false);
    }, 2000);
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
    setSpiceLevel(order.spiceLevel || 'medium');
    setInstructions(order.specialInstructions || '');
    setShowEditModal(true);
  };

  const generateBill = async (orderId) => {
    const bill = await api.get(`/api/bills/${orderId}`);
    alert(`Bill for table ${bill.data.tableNumber}: NPR ${bill.data.totalAmount.toFixed(2)}`);
  };

  const checkoutOrder = async (order) => {
    if (!order?._id) return;
    setCheckoutOrderData(order);
  };

  const confirmCheckoutOrder = async (payload) => {
    const paymentMethod = payload?.paymentMethod;
    if (!['cash', 'fonepay', 'card', 'bank'].includes(paymentMethod)) {
      alert('Invalid payment method. Use: cash, fonepay, card, bank');
      return;
    }
    try {
      await api.post(`/api/bills/${payload.orderId}/pay`, {
        paymentMethod,
        paymentStatus: payload.paymentStatus || 'paid',
        discountType: payload.discountType,
        discountValue: payload.discountValue
      });
      alert('Order checked out successfully.');
      loadData(orderViewMode === 'allOrders' ? 'all' : 'mine');
      setCheckoutOrderData(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed');
    }
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
  const showFloatingCart = activeSection === 'dashboard' || activeSection === 'menu';
  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return (
    <div className="admin-shell">
      <NotificationToasts notifications={notifications} />

      {showEditModal && (
        <div className="checkout-modal-overlay" style={{ zIndex: 1500 }}>
          <style>{`
            .edit-modal-box .pos-cart-sidebar {
              height: 100% !important;
              top: 0 !important;
            }
          `}</style>
          <div className="bg-white overflow-hidden d-flex flex-column shadow-lg edit-modal-box" style={{ width: '95vw', maxWidth: '1600px', height: '90vh', borderRadius: '24px' }}>
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
              <h4 className="m-0 fw-bold text-dark">Edit Order Details (KOT {editingOrderId?.slice(-4)})</h4>
              <button 
                className="btn btn-outline-dark rounded-circle fw-bold" 
                style={{ width: '40px', height: '40px' }}
                onClick={() => {
                   setShowEditModal(false);
                   setCart([]);
                   setEditingOrderId(null);
                }}>
                X
              </button>
            </div>
            <div className="waiter-pos-layout flex-grow-1 p-4 bg-white overflow-hidden">
              <div className="pos-menu-section h-100 overflow-auto pe-2" style={{ paddingBottom: '80px' }}>
                {can('menu:view') ? (
                  <WaiterMenu search={search} onSearch={setSearch} menuItems={filteredMenu} onAdd={addToCart} />
                ) : <div />}
              </div>
              <div className="pos-cart-section h-100 overflow-hidden">
                {can('orders:view') ? (
                  <WaiterCart
                    cart={cart}
                    cartTotal={cartTotal}
                    onUpdateQty={updateQty}
                    onPlaceOrder={handleInitCheckout}
                    editing={Boolean(editingOrderId)}
                    spiceLevel={spiceLevel}
                    onSpiceChange={setSpiceLevel}
                    instructions={instructions}
                    onInstructionsChange={setInstructions}
                    tables={tables}
                    selectedTable={selectedTable}
                    onSelectTable={setSelectedTable}
                    onFreeTable={freeTable}
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    onSelectCustomer={setSelectedCustomer}
                    showCustomer={can('customers:view')}
                  />
                ) : <div />}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal-box">
            <h4>Confirm Order Details</h4>
            <div className="checkout-summary">
              <p><strong>Table:</strong> {tables.find(t => t._id === selectedTable)?.tableNumber || '-'}</p>
              <p><strong>Items:</strong> {cart.length}</p>
              <p><strong>Total:</strong> NPR {cartTotal.toFixed(2)}</p>
            </div>
            <div className="checkout-items-preview">
              {cart.map(c => (
                <div key={c.menuItem} className="checkout-preview-item">
                  <span>{c.name} x{c.quantity}</span>
                  <span>NPR {c.price * c.quantity}</span>
                </div>
              ))}
            </div>
            <div className="checkout-modal-actions">
              <button className="btn btn-outline-secondary" onClick={() => setShowCheckout(false)}>Cancel</button>
              <button className="pos-btn-submit" onClick={placeOrder}>Confirm & Place Order</button>
            </div>
          </div>
        </div>
      )}

      {checkoutOrderData && (
        <WaiterCheckoutModal
          order={checkoutOrderData}
          onClose={() => setCheckoutOrderData(null)}
          onConfirm={confirmCheckoutOrder}
          onPrint={generateBill}
        />
      )}

      {orderSuccess && (
        <div className="checkout-modal-overlay">
          <div className="success-animation-box">
            <CheckCircle size={80} color="#10b981" className="success-pop-icon" />
            <h3>Order Placed!</h3>
          </div>
        </div>
      )}

      <div className={`admin-body ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className={`sidebar-placeholder ${sidebarOpen ? '' : 'closed'}`}>
          <WaiterSidebar
            activeSection={activeSection}
            onSelect={setActiveSection}
            isOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            unreadCount={unreadCount}
            sections={availableSections}
          />
        </div>
        <NotificationToasts notifications={toasts} />

        {/* Global Mobile Header - Persistent across all tabs */}
        <div className="d-md-none">
          <WaiterHeader user={currentUser} onLogout={handleLogout} />
        </div>

        {activeSection === 'dashboard' && can('dashboard:view') && (
          <div className="content waiter-pos-layout position-relative">
            <div className="pos-menu-section h-100 p-3 overflow-hidden d-flex flex-column">
              {can('menu:view') ? (
                <div className="flex-grow-1 overflow-auto rounded-3 bg-white p-3 shadow-sm" style={{ border: '1px solid #eef1f6' }}>
                  <MenuSection
                    addSubMenu={addSubMenu}
                    menuSubMenus={menuSubMenus}
                    addSearch={search}
                    onSearchChange={setSearch}
                    addCategory={addCategory}
                    menuCategories={menuCategories}
                    onCategoryChange={({ category, subMenu }) => {
                      if (category) setAddCategory(category);
                      if (subMenu !== undefined) setAddSubMenu(subMenu);
                    }}
                    filteredMenus={filteredMenu}
                    onAdd={addToCart}
                    onCustomize={setCustomizeItem}
                    tableOptions={tables}
                    selectedTableId={selectedTable}
                    onTableChange={setSelectedTable}
                  />
                </div>
              ) : <div />}
            </div>
            
            <div className="pos-cart-section h-100 overflow-hidden d-none d-md-block">
              {can('orders:view') ? (
                <WaiterCart
                  cart={cart}
                  cartTotal={cartTotal}
                  onUpdateQty={updateQty}
                  onPlaceOrder={handleInitCheckout}
                  editing={Boolean(editingOrderId)}
                  spiceLevel={spiceLevel}
                  onSpiceChange={setSpiceLevel}
                  instructions={instructions}
                  onInstructionsChange={setInstructions}
                  tables={tables}
                  selectedTable={selectedTable}
                  onSelectTable={setSelectedTable}
                  onFreeTable={freeTable}
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  onSelectCustomer={setSelectedCustomer}
                  showCustomer={can('customers:view') || orderType === 'takeaway'}
                  orderType={orderType}
                  onOrderTypeChange={setOrderType}
                  onClose={() => setMobileCartOpen(false)}
                />
              ) : <div />}
            </div>
          </div>
        )}

        {activeSection === 'takeaway' && (
          <div className="content waiter-orders-content">
            <div className="card-header-sleek d-flex justify-content-between align-items-center mb-4">
              <h4 className="m-0">Takeaway & Online Orders</h4>
            </div>
            <WaiterOrders
              orders={orders.filter(o => o.orderType !== 'dine_in')}
              onEdit={(order) => {
                setEditingOrderId(order._id);
                setCart(order.items.map(i => ({
                  menuItem: i.menuItem,
                  quantity: i.quantity,
                  variantId: i.variantId,
                  variantName: i.variantName,
                  variantPrice: i.variantPrice,
                  itemNote: i.itemNote
                })));
                setSelectedTable(order.table?._id || null);
                setSelectedCustomer(order.customerId || '');
                setSpiceLevel(order.spiceLevel || 'medium');
                setInstructions(order.specialInstructions || '');
                setActiveSection('dashboard');
              }}
              onBill={(id) => window.open(`/api/orders/${id}/bill`, '_blank')}
              onCheckout={(order) => {
                setCheckoutOrderData(order);
                setShowCheckout(true);
              }}
            />
          </div>
        )}

        {activeSection === 'orders' && can('orders:view') && (
          <div className="content waiter-orders-content">
            <div className="d-flex align-items-center mb-4 p-1 bg-white rounded-pill shadow-sm position-relative order-toggle-container" style={{ border: '1px solid #e2e8f0' }}>
              <div 
                className="position-absolute bg-primary rounded-pill"
                style={{ 
                  height: 'calc(100% - 8px)', 
                  width: 'calc(50% - 4px)',
                  left: '4px',
                  top: '4px',
                  transform: orderViewMode === 'myOrders' ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 0
                }}
              />
              <button 
                className={`btn border-0 fw-bold position-relative flex-grow-1 waiter-order-toggle-btn ${orderViewMode === 'myOrders' ? 'text-white' : 'text-secondary'}`}
                style={{ zIndex: 1, transition: 'color 0.3s', padding: '6px 0' }}
                onClick={() => setOrderViewMode('myOrders')}
              >
                My Orders
              </button>
              <button 
                className={`btn border-0 fw-bold position-relative flex-grow-1 waiter-order-toggle-btn ${orderViewMode === 'allOrders' ? 'text-white' : 'text-secondary'}`}
                style={{ zIndex: 1, transition: 'color 0.3s', padding: '6px 0' }}
                onClick={() => setOrderViewMode('allOrders')}
              >
                All Orders
              </button>
            </div>
            <WaiterOrders orders={filteredOrders} onEdit={loadOrderToEdit} onBill={generateBill} onCheckout={checkoutOrder} />
          </div>
        )}

        {activeSection === 'menu' && can('menu:view') && (
          <div className="content">
            <WaiterMenu search={search} onSearch={setSearch} menuItems={filteredMenu} onAdd={addToCart} />
          </div>
        )}

        {activeSection === 'notifications' && can('notifications:view') && (
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

        {activeSection === 'profile' && (
          <div className="content grid-3">
            <WaiterProfile profile={profile} onLogout={handleLogout} />
            <WaiterAnalytics analytics={myAnalytics} />
            <WaiterPromotionTimeline promotions={promotions} />
          </div>
        )}

        {showFloatingCart && can('orders:view') && (
          <div className="d-md-none">
            <div className="mobile-fab-cart" onClick={() => setMobileCartOpen(true)}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span className="badge">{cart.length}</span>}
            </div>
            {mobileCartOpen && <div className="cart-mobile-backdrop" onClick={() => setMobileCartOpen(false)} />}
            <div className={`pos-cart-section h-100 overflow-hidden ${mobileCartOpen ? 'mobile-open' : ''}`}>
              <div className="mobile-drawer-handle" onClick={() => setMobileCartOpen(false)} />
              <WaiterCart
                cart={cart}
                cartTotal={cartTotal}
                onUpdateQty={updateQty}
                onPlaceOrder={handleInitCheckout}
                editing={Boolean(editingOrderId)}
                spiceLevel={spiceLevel}
                onSpiceChange={setSpiceLevel}
                instructions={instructions}
                onInstructionsChange={setInstructions}
                tables={tables}
                selectedTable={selectedTable}
                onSelectTable={setSelectedTable}
                onFreeTable={freeTable}
                customers={customers}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
                showCustomer={can('customers:view') || orderType === 'takeaway'}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                onClose={() => setMobileCartOpen(false)}
              />
            </div>
          </div>
        )}
      <CustomizeDishModal
        open={Boolean(customizeItem)}
        item={customizeItem}
        onClose={() => setCustomizeItem(null)}
        onAdd={addToCart}
      />
      </div>
    </div>
  );
};

export default WaiterApp;
