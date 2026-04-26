import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ChefHat,
  Calendar,
  Wallet,
  History,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ReceiptText,
  Armchair,
  Search,
  LayoutGrid,
  List,
  X,
  ChevronRight
} from 'lucide-react';

import '../../../common/css/admin/history/adminHistory.css';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className={`stat-tile ${colorClass || ''}`}>
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <div className="tiny-text text-muted mb-1">{title}</div>
        <div className="fw-bold fs-5">{value}</div>
      </div>
      <div className="hist-stat-icon">{icon}</div>
    </div>
  </div>
);

const PaymentBadge = ({ method }) => {
  const config = {
    cash: { cls: 'pill-green', label: 'Cash' },
    card: { cls: 'pill-blue', label: 'Card' },
    fonepay: { cls: 'pill-blue', label: 'Fonepay' },
    esewa: { cls: 'pill-amber', label: 'eSewa' },
  };
  const { cls, label } = config[method?.toLowerCase()] || { cls: 'pill-neutral', label: method || 'N/A' };
  return (
    <span className={`pill ${cls} d-inline-flex align-items-center gap-1`}>
      <Wallet size={11} />
      {label}
    </span>
  );
};

const getHistoryPaymentMethod = (item) => {
  if (item.paymentMethod) return item.paymentMethod;
  if (Array.isArray(item.paymentMethods) && item.paymentMethods.length === 1) return item.paymentMethods[0];
  if (Array.isArray(item.paymentMethods) && item.paymentMethods.length > 1) return 'split';
  return 'N/A';
};

const getHistoryTotal = (item) => Number(item.grandTotal ?? item.totalAmount ?? item.finalAmount ?? 0);

const getHistoryDate = (item) => item.closedAt || item.paidAt || item.createdAt;

const getWaiterName = (item) => item.waiterName || item.waiter?.name || 'N/A';

const HistoryCard = ({ item, variants }) => (
  <motion.div
    variants={variants}
    layout
    className="hist-card"
  >
    {/* Card Header */}
    <div className="hist-card-header">
      <div className="d-flex align-items-center gap-2">
        <div className="hist-table-badge">
          <Armchair size={14} />
        </div>
        <div>
          <div className="fw-semibold" style={{ fontSize: 14 }}>{item.tableNumber ? `Table ${item.tableNumber}` : item.customerName || 'Sales Invoice'}</div>
          <div className="tiny-text text-muted">#{item.invoiceNo || item._id?.slice(-6)}</div>
        </div>
      </div>
      <PaymentBadge method={getHistoryPaymentMethod(item)} />
    </div>

    {/* Meta Info */}
    <div className="hist-meta">
      <div className="d-flex align-items-center gap-1">
        <User size={11} className="text-muted" />
        <span>{getWaiterName(item)}</span>
      </div>
      <div className="d-flex align-items-center gap-1">
        <ChefHat size={11} className="text-muted" />
        <span>{item.kitchen?.name || 'N/A'}</span>
      </div>
      <div className="d-flex align-items-center gap-1">
        <Calendar size={11} className="text-muted" />
        <span>{new Date(getHistoryDate(item)).toLocaleString()}</span>
      </div>
    </div>

    {/* Items Receipt */}
    <div className="hist-receipt">
      <div className="hist-receipt-title">Order Items</div>
      <div className="hist-receipt-list">
        {(item.items || []).slice(0, 4).map((menu, index) => (
          <div key={index} className="hist-receipt-row">
            <span className="text-truncate">{menu.name} <span className="text-muted">×{menu.quantity}</span></span>
            <span className="hist-item-price">NPR {((menu.priceAtOrderTime || menu.price || 0) * menu.quantity).toFixed(0)}</span>
          </div>
        ))}
        {item.items?.length > 4 && (
          <div className="hist-receipt-more">+{item.items.length - 4} more items</div>
        )}
      </div>
    </div>

    {/* Footer Total */}
    <div className="hist-card-footer">
      <span className="hist-label">TOTAL</span>
      <span className="hist-total">NPR {getHistoryTotal(item).toFixed(2)}</span>
    </div>
  </motion.div>
);

const AdminHistory = ({ history = [] }) => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [payFilter, setPayFilter] = useState('all');

  const stats = useMemo(() => {
    const total = history.reduce((sum, item) => sum + getHistoryTotal(item), 0);
    const count = history.length;
    return {
      total: total.toFixed(2),
      count,
      avg: count > 0 ? (total / count).toFixed(2) : '0.00'
    };
  }, [history]);

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !search ||
        String(item.tableNumber).includes(search) ||
        (item.invoiceNo || '').toLowerCase().includes(search.toLowerCase()) ||
        getWaiterName(item).toLowerCase().includes(search.toLowerCase()) ||
        (item.customerName || '').toLowerCase().includes(search.toLowerCase());
      const paymentMethod = String(getHistoryPaymentMethod(item)).toLowerCase();
      const matchPay = payFilter === 'all' || paymentMethod === payFilter || (payFilter === 'split' && paymentMethod === 'split');
      return matchSearch && matchPay;
    });
  }, [history, search, payFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.25 } },
    exit: { y: -8, opacity: 0, transition: { duration: 0.15 } }
  };

  if (history.length === 0) {
    return (
      <div className="hist-empty">
        <div className="hist-empty-icon"><ReceiptText size={56} /></div>
        <h5 className="mb-1">No History Yet</h5>
        <p className="text-muted small">Paid orders will appear here once checked out.</p>
      </div>
    );
  }

  return (
    <div className="hist-container">

      {/* ── Stats Row ── */}
      <div className="overview-grid">
        <StatCard title="Total Paid Orders" value={stats.count} icon={<ShoppingCart size={18} />} colorClass="accent-blue" />
        <StatCard title="Total Revenue" value={`NPR ${stats.total}`} icon={<DollarSign size={18} />} colorClass="accent-green" />
        <StatCard title="Avg. Order Value" value={`NPR ${stats.avg}`} icon={<TrendingUp size={18} />} colorClass="accent-purple" />
      </div>

      {/* ── Toolbar ── */}
      <div className="hist-toolbar">
        <div className="hist-search-wrap">
          <Search size={14} className="hist-search-icon" />
          <input
            className="hist-search"
            placeholder="Search by table, invoice, or waiter…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="hist-search-clear" onClick={() => setSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="d-flex gap-2 align-items-center">
          <select
            className="hist-select"
            value={payFilter}
            onChange={(e) => setPayFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="fonepay">Fonepay</option>
            <option value="esewa">eSewa</option>
            <option value="split">Split</option>
          </select>

          <div className="hist-view-toggle">
            <button
              className={`hist-view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`hist-view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Result Count ── */}
      <div className="tiny-text text-muted mb-2">
        Showing <strong>{filtered.length}</strong> of {history.length} orders
      </div>

      {/* ── Grid / List ── */}
      {filtered.length === 0 ? (
        <div className="hist-no-results">
          <Search size={24} className="mb-2 opacity-25" />
          <div>No results for "<strong>{search}</strong>"</div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            className={view === 'grid' ? 'hist-grid' : 'hist-list'}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {filtered.map((item) => (
              <HistoryCard key={item._id} item={item} variants={itemVariants} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AdminHistory;
