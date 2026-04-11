import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../api/client.js';
import NotificationToasts from '../components/NotificationToasts.jsx';
import { createSocket } from '../api/socket.js';
import { getBranchPermissions, getBranchRole, getCurrentUser } from '../api/session.js';
import { WAITER_ALLOWED_PERMISSIONS } from '../common/permissions.js';
import WaiterSidebar from '../components/waiter/WaiterSidebar.jsx';
import WaiterCart from '../components/waiter/WaiterCart.jsx';
import WaiterMenu from '../components/waiter/WaiterMenu.jsx';
import WaiterOrders from '../components/waiter/WaiterOrders.jsx';
import WaiterProfile from '../components/waiter/WaiterProfile.jsx';
import WaiterAnalytics from '../components/waiter/WaiterAnalytics.jsx';
import WaiterPromotionTimeline from '../components/waiter/WaiterPromotionTimeline.jsx';
import NotificationPage from '../components/admin/notifications/NotificationPage.jsx';
import '../common/css/admin/common/adminLayout.css';
import '../common/css/waiter/waiterDashboard.css';

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
      return ['dashboard', 'orders', 'menu', 'notifications', 'profile'].filter((section) => {
        if (section === 'orders' || section === 'profile') return true;
        const perm = sectionPermissions[section];
        return perm ? can(perm) : true;
      });
    }

    const items = [];
    if (can('dashboard:view')) items.push('dashboard');
    if (can('orders:view')) items.push('orders');
    if (can('menu:view')) items.push('menu');
    if (can('notifications:view')) items.push('notifications');
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
    const socket = createSocket();
    socket.on('orders:update', (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });
    socket.on('orders:new', (order) => {
      setOrders((prev) => {
        if (prev.some((o) => o._id === order._id)) return prev;
        return [order, ...prev];
      });
    });
    socket.on('tables:update', (table) => {
      setTables((prev) => prev.map((t) => (t._id === table._id ? table : t)));
    });
    socket.on('notify', (payload) => {
      if (payload.waiterId && payload.waiterId !== (currentUser?._id || currentUser?.id)) return;
      setNotifications((prev) => [{ ...payload, read: false }, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, [currentUser?._id, currentUser?.id]);

  const filteredMenu = useMemo(() => {
    const available = menus.filter((item) => item.isAvailable !== false);
    if (!search) return available;
    return available.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, search]);

  const addToCart = (item) => {
    if (item.isAvailable === false) {
      alert('This item is unavailable');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem === item._id);
      if (existing) {
        return prev.map((c) => (c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { menuItem: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQty = (menuItem, quantity) => {
    const safeQty = Math.max(1, Number(quantity) || 1);
    setCart((prev) => prev.map((c) => (c.menuItem === menuItem ? { ...c, quantity: safeQty } : c)));
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
    if (!selectedTable) return alert('Select a table first');
    if (cart.length === 0) return alert('Add at least one item');
    if (cart.some((c) => !c.quantity || c.quantity < 1)) {
      return alert('Quantity must be at least 1 for all items');
    }
    setShowCheckout(true);
  };

  const placeOrder = async () => {
    const payload = {
      table: selectedTable,
      items: cart.map((c) => ({ menuItem: c.menuItem, quantity: c.quantity })),
      spiceLevel,
      specialInstructions: instructions,
      customerName: selectedCustomer || undefined
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

        {activeSection === 'dashboard' && can('dashboard:view') && (
          <div className="content waiter-pos-layout">
            {can('menu:view') ? (
              <WaiterMenu search={search} onSearch={setSearch} menuItems={filteredMenu} onAdd={addToCart} />
            ) : <div />}
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
        )}

        {activeSection === 'orders' && can('orders:view') && (
          <div className="content">
            <div className="d-flex align-items-center mb-4 p-1 bg-white rounded-pill shadow-sm position-relative" style={{ width: '260px', border: '1px solid #e2e8f0' }}>
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
                className={`btn border-0 fw-bold position-relative flex-grow-1 ${orderViewMode === 'myOrders' ? 'text-white' : 'text-secondary'}`}
                style={{ zIndex: 1, transition: 'color 0.3s', padding: '8px 0' }}
                onClick={() => setOrderViewMode('myOrders')}
              >
                My Orders
              </button>
              <button 
                className={`btn border-0 fw-bold position-relative flex-grow-1 ${orderViewMode === 'allOrders' ? 'text-white' : 'text-secondary'}`}
                style={{ zIndex: 1, transition: 'color 0.3s', padding: '8px 0' }}
                onClick={() => setOrderViewMode('allOrders')}
              >
                All Orders
              </button>
            </div>
            <WaiterOrders orders={filteredOrders} onEdit={loadOrderToEdit} onBill={generateBill} />
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
            <WaiterProfile profile={profile} />
            <WaiterAnalytics analytics={myAnalytics} />
            <WaiterPromotionTimeline promotions={promotions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterApp;
