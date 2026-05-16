import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Users as UsersIcon, Utensils, Wallet, Activity, BarChart3 } from 'lucide-react';
import AdminPromotionTimeline from '../promotions/AdminPromotionTimeline.jsx';
import '../../../common/css/admin/reports/adminReports.css';

const TAB_OPTIONS = [
  { value: 'company', label: 'Company' },
  { value: 'waiter', label: 'Waiter' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'stock', label: 'Stock' }
];

const CHART_COLORS = ['#2563eb', '#10b981', '#a855f7', '#14b8a6', '#0ea5e9'];
const TREND_OPTIONS = [
  { value: 'week', label: 'Last 1 Week' },
  { value: 'month1', label: 'Last 1 Month' },
  { value: 'month3', label: 'Last 3 Months' },
  { value: 'month6', label: 'Last 6 Months' }
];

const PerformanceList = ({ title, data }) => (
  <div className="stat-card">
    <h6>{title}</h6>
    {data.length === 0 && <div className="text-muted small">No data yet.</div>}
    <ul className="small mb-0 ps-3">
      {data.map((row) => (
        <li key={row._id || row.name} className="mb-1">
          <strong>{row.name || 'Unknown'}</strong>: {row.orders} orders, <span className="text-nowrap">NPR {row.sales.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="stat-card chart-card-wrapper">
    <div className="d-flex align-items-center gap-2 mb-2">
      {icon}
      <h6 className="mb-0">{title}</h6>
    </div>
    <div className="report-chart-box">{children}</div>
  </div>
);

const AdminReports = ({
  analytics,
  salesSummary,
  onLoadPromotions,
  promotionUser,
  promotionList,
  view = 'company',
  onChangeView,
  stock,
  purchases = [],
  expenses = [],
  financeFilters = {},
  onChangeFinanceFilters,
  onCreatePurchase,
  onCreateExpense
}) => {
  const [selectedWaiterId, setSelectedWaiterId] = useState('');
  const [selectedKitchenId, setSelectedKitchenId] = useState('');
  const [trendRange, setTrendRange] = useState('month6');
  const [purchaseForm, setPurchaseForm] = useState({ title: '', amount: '', paymentMethod: 'cash', paidAt: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', paymentMethod: 'cash', paidAt: '' });

  const currentView = view || 'company';
  const handleViewChange = onChangeView || (() => {});

  const waiterRanks = analytics?.waiterRanking || [];
  const kitchenRanks = analytics?.kitchenRanking || [];
  const waiterList = analytics?.waiterList || [];
  const kitchenList = analytics?.kitchenList || [];

  const waiterPie = waiterRanks.map((w) => ({ name: w.name || 'Unknown', value: w.sales }));
  const kitchenPie = kitchenRanks.map((k) => ({ name: k.name || 'Unknown', value: k.sales }));

  const waiterBars = waiterRanks.map((w) => ({ name: w.name || 'Unknown', sales: w.sales, orders: w.orders, tables: w.tablesBooked }));
  const kitchenBars = kitchenRanks.map((k) => ({ name: k.name || 'Unknown', sales: k.sales, orders: k.orders, tables: k.tablesBooked }));

  const waiterLine = useMemo(() => {
    if (!selectedWaiterId) return [];
    if (trendRange === 'week') return analytics?.waiterDaily?.[selectedWaiterId] || [];
    if (trendRange === 'month1') return (analytics?.waiterMonthly?.[selectedWaiterId] || []).slice(-1);
    if (trendRange === 'month3') return (analytics?.waiterMonthly?.[selectedWaiterId] || []).slice(-3);
    return analytics?.waiterMonthly?.[selectedWaiterId] || [];
  }, [analytics, selectedWaiterId, trendRange]);

  const kitchenLine = useMemo(() => {
    if (!selectedKitchenId) return [];
    if (trendRange === 'week') return analytics?.kitchenDaily?.[selectedKitchenId] || [];
    if (trendRange === 'month1') return (analytics?.kitchenMonthly?.[selectedKitchenId] || []).slice(-1);
    if (trendRange === 'month3') return (analytics?.kitchenMonthly?.[selectedKitchenId] || []).slice(-3);
    return analytics?.kitchenMonthly?.[selectedKitchenId] || [];
  }, [analytics, selectedKitchenId, trendRange]);

  const frequentItems = analytics?.frequentItems || [];
  const stockData = stock || {};
  const topWaiter = waiterRanks[0];
  const topKitchen = kitchenRanks[0];

  const waiterOptions = useMemo(() => waiterList.map((w) => ({ id: w._id, name: w.name || 'Unknown' })), [waiterList]);
  const kitchenOptions = useMemo(() => kitchenList.map((k) => ({ id: k._id, name: k.name || 'Unknown' })), [kitchenList]);

  const financeSeries = useMemo(() => {
    const toKey = (d) => new Date(d).toISOString().slice(0, 10);
    const start = financeFilters?.dateFrom ? new Date(financeFilters.dateFrom) : new Date(Date.now() - 6 * 86400000);
    const end = financeFilters?.dateTo ? new Date(financeFilters.dateTo) : new Date();
    const days = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      days.push(toKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    const purchaseMap = new Map();
    purchases.forEach((p) => {
      const key = toKey(p.paidAt || p.createdAt || new Date());
      purchaseMap.set(key, (purchaseMap.get(key) || 0) + (p.amount || 0));
    });
    const expenseMap = new Map();
    expenses.forEach((e) => {
      const key = toKey(e.paidAt || e.createdAt || new Date());
      expenseMap.set(key, (expenseMap.get(key) || 0) + (e.amount || 0));
    });
    return days.map((d) => ({
      day: d,
      purchase: purchaseMap.get(d) || 0,
      expense: expenseMap.get(d) || 0
    }));
  }, [purchases, expenses, financeFilters]);

  return (
    <div className="card glass-card full-width-card full-screen-card reports-card">
      <div className="reports-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <h5 className="mb-0 fw-bold">Reports & Analytics</h5>
        
        {/* Navigation Tab Panel Container */}
        <div className="nav-tabs-wrapper">
          <div className="btn-group" role="group" aria-label="Report Views">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`btn btn-sm ${currentView === tab.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handleViewChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- COMPANY VIEW --- */}
      {currentView === 'company' && (
        <div className="reports-grid reports-grid-company">
          <div className="stat-card span-full">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="fw-semibold text-dark">Finance Filters</div>
              <div className="d-flex gap-2 flex-wrap filter-inputs-row">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={financeFilters?.dateFrom || ''}
                  onChange={(e) => onChangeFinanceFilters?.({ ...financeFilters, dateFrom: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={financeFilters?.dateTo || ''}
                  onChange={(e) => onChangeFinanceFilters?.({ ...financeFilters, dateTo: e.target.value })}
                />
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => onChangeFinanceFilters?.({ dateFrom: '', dateTo: '' })}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="tiny-text text-muted mt-2">Filters affect Sales, Purchase, Expenses, Payment In/Out cards.</div>
          </div>

          <div className="stat-card span-full highlight-card">
            <div className="d-flex align-items-center gap-2 mb-1">
              <Wallet size={18} className="text-primary" />
              <h6 className="mb-0 text-muted">Total Sales</h6>
            </div>
            <div className="fs-2 fw-bold text-dark">NPR {salesSummary?.totalSales?.toFixed(2) || '0.00'}</div>
            <div className="text-muted small">Total Orders: {salesSummary?.totalOrders || 0}</div>
            <div className="info-pill mt-3 d-inline-flex flex-wrap align-items-center gap-2">
              <span className="d-flex align-items-center gap-1"><UsersIcon size={14} /> Top Waiter: <strong>{topWaiter?.name || 'N/A'}</strong></span>
              <span className="text-muted d-none d-sm-inline">|</span>
              <span className="d-flex align-items-center gap-1"><Utensils size={14} /> Top Kitchen: <strong>{topKitchen?.name || 'N/A'}</strong></span>
            </div>
          </div>

          <ChartCard title="Company Sales Trend (6 months)" icon={<TrendingUp size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.companyMonthly || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="sales" name="Sales" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="orders" name="Orders" stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Frequent Menu Items" icon={<PieIcon size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequentItems.map(([name, count]) => ({ name, count }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Count" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Purchase vs Expense" icon={<Activity size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeSeries} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="purchase" name="Purchase" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stat-card">
            <h6 className="mb-3 text-dark">Add Purchase</h6>
            <div className="d-flex flex-column gap-2">
              <input
                className="form-control form-control-sm"
                placeholder="Title"
                value={purchaseForm.title}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, title: e.target.value })}
              />
              <input
                className="form-control form-control-sm"
                type="number"
                min="0"
                placeholder="Amount"
                value={purchaseForm.amount}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
              />
              <select
                className="form-select form-select-sm"
                value={purchaseForm.paymentMethod}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="fonepay">Fonepay</option>
                <option value="card">Card</option>
                <option value="bank">Bank</option>
              </select>
              <input
                className="form-control form-control-sm"
                type="date"
                value={purchaseForm.paidAt}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, paidAt: e.target.value })}
              />
              <button
                className="btn btn-primary btn-sm w-100 mt-1"
                onClick={() => {
                  if (!purchaseForm.amount) return;
                  onCreatePurchase?.({
                    title: purchaseForm.title,
                    amount: Number(purchaseForm.amount || 0),
                    paymentMethod: purchaseForm.paymentMethod,
                    paidAt: purchaseForm.paidAt || undefined
                  });
                  setPurchaseForm({ title: '', amount: '', paymentMethod: 'cash', paidAt: '' });
                }}
              >
                Save Purchase
              </button>
            </div>
          </div>

          <div className="stat-card">
            <h6 className="mb-3 text-dark">Add Expense</h6>
            <div className="d-flex flex-column gap-2">
              <input
                className="form-control form-control-sm"
                placeholder="Title"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              />
              <input
                className="form-control form-control-sm"
                type="number"
                min="0"
                placeholder="Amount"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              />
              <select
                className="form-select form-select-sm"
                value={expenseForm.paymentMethod}
                onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="fonepay">Fonepay</option>
                <option value="card">Card</option>
                <option value="bank">Bank</option>
              </select>
              <input
                className="form-control form-control-sm"
                type="date"
                value={expenseForm.paidAt}
                onChange={(e) => setExpenseForm({ ...expenseForm, paidAt: e.target.value })}
              />
              <button
                className="btn btn-primary btn-sm w-100 mt-1"
                onClick={() => {
                  if (!expenseForm.amount || !expenseForm.title) return;
                  onCreateExpense?.({
                    title: expenseForm.title,
                    amount: Number(expenseForm.amount || 0),
                    paymentMethod: expenseForm.paymentMethod,
                    paidAt: expenseForm.paidAt || undefined
                  });
                  setExpenseForm({ title: '', amount: '', paymentMethod: 'cash', paidAt: '' });
                }}
              >
                Save Expense
              </button>
            </div>
          </div>

          <div className="stat-card span-half">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-dark">Recent Purchases</h6>
              <span className="badge bg-light text-dark border">Latest 5</span>
            </div>
            <div className="scrollable-tight">
              <ul className="list-group list-group-flush">
                {purchases.slice(0, 5).map((p) => (
                  <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                    <span className="text-truncate me-2">{p.title || 'Purchase'}</span>
                    <span className="fw-semibold text-nowrap">NPR {Number(p.amount || 0).toFixed(2)}</span>
                  </li>
                ))}
                {purchases.length === 0 && <li className="list-group-item text-muted text-center py-3 bg-transparent">No purchases yet.</li>}
              </ul>
            </div>
          </div>

          <div className="stat-card span-half">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-dark">Recent Expenses</h6>
              <span className="badge bg-light text-dark border">Latest 5</span>
            </div>
            <div className="scrollable-tight">
              <ul className="list-group list-group-flush">
                {expenses.slice(0, 5).map((e) => (
                  <li key={e._id} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                    <span className="text-truncate me-2">{e.title || 'Expense'}</span>
                    <span className="fw-semibold text-nowrap">NPR {Number(e.amount || 0).toFixed(2)}</span>
                  </li>
                ))}
                {expenses.length === 0 && <li className="list-group-item text-muted text-center py-3 bg-transparent">No expenses yet.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- WAITER VIEW --- */}
      {currentView === 'waiter' && (
        <div className="reports-grid reports-grid-waiter">
          <PerformanceList title="Last 1 Month" data={analytics?.waiterPerformance?.last1Month || []} />
          <PerformanceList title="Last 3 Months" data={analytics?.waiterPerformance?.last3Months || []} />
          <PerformanceList title="Last 6 Months" data={analytics?.waiterPerformance?.last6Months || []} />

          <ChartCard title="Waiter Sales Share" icon={<PieIcon size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={waiterPie} dataKey="value" nameKey="name" outerRadius="80%" cx="50%" cy="50%" label>
                  {waiterPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Waiter Ranking" icon={<UsersIcon size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waiterBars} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="sales" name="Sales" fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
                <Bar dataKey="orders" name="Orders" fill={CHART_COLORS[1]} radius={[2, 2, 0, 0]} />
                <Bar dataKey="tables" name="Tables" fill={CHART_COLORS[2]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stat-card span-full">
            <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row mb-3 gap-2">
              <h6 className="mb-0 text-dark">Individual Waiter Trend</h6>
              <div className="d-flex gap-2 controls-row">
                <select
                  className="form-select form-select-sm"
                  value={selectedWaiterId}
                  onChange={(e) => {
                    setSelectedWaiterId(e.target.value);
                    if (e.target.value) onLoadPromotions(e.target.value);
                  }}
                >
                  <option value="">Select waiter</option>
                  {waiterOptions.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm"
                  value={trendRange}
                  onChange={(e) => setTrendRange(e.target.value)}
                >
                  {TREND_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="report-chart-box report-chart-box-tall">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waiterLine} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey={trendRange === 'week' ? 'day' : 'month'} tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="sales" name="Sales" stroke={CHART_COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" name="Orders" stroke={CHART_COLORS[1]} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {promotionUser && promotionUser._id === selectedWaiterId && (
            <div className="span-full w-100 m-0 p-0">
              <AdminPromotionTimeline user={promotionUser} promotions={promotionList} onAdd={() => {}} />
            </div>
          )}
        </div>
      )}

      {/* --- KITCHEN VIEW --- */}
      {currentView === 'kitchen' && (
        <div className="reports-grid reports-grid-kitchen">
          <PerformanceList title="Last 1 Month" data={analytics?.kitchenPerformance?.last1Month || []} />
          <PerformanceList title="Last 3 Months" data={analytics?.kitchenPerformance?.last3Months || []} />
          <PerformanceList title="Last 6 Months" data={analytics?.kitchenPerformance?.last6Months || []} />

          <ChartCard title="Kitchen Sales Share" icon={<PieIcon size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={kitchenPie} dataKey="value" nameKey="name" outerRadius="80%" cx="50%" cy="50%" label>
                  {kitchenPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Kitchen Ranking" icon={<Utensils size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kitchenBars} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="sales" name="Sales" fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
                <Bar dataKey="orders" name="Orders" fill={CHART_COLORS[1]} radius={[2, 2, 0, 0]} />
                <Bar dataKey="tables" name="Tables" fill={CHART_COLORS[2]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stat-card span-full">
            <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row mb-3 gap-2">
              <h6 className="mb-0 text-dark">Individual Kitchen Trend</h6>
              <div className="d-flex gap-2 controls-row">
                <select
                  className="form-select form-select-sm"
                  value={selectedKitchenId}
                  onChange={(e) => setSelectedKitchenId(e.target.value)}
                >
                  <option value="">Select kitchen</option>
                  {kitchenOptions.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm"
                  value={trendRange}
                  onChange={(e) => setTrendRange(e.target.value)}
                >
                  {TREND_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="report-chart-box report-chart-box-tall">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kitchenLine} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey={trendRange === 'week' ? 'day' : 'month'} tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="sales" name="Sales" stroke={CHART_COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" name="Orders" stroke={CHART_COLORS[1]} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* --- STOCK VIEW --- */}
      {currentView === 'stock' && (
        <div className="reports-grid reports-grid-stock">
          <ChartCard title="Top Consumers" icon={<BarChart3 size={16} />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(stockData.topConsumers || []).map((i) => ({ name: i.name || 'Ingredient', qty: i.totalConsumed }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Bar dataKey="qty" name="Qty Consumed" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-dark">Low Stock Warnings</h6>
              <span className="badge bg-danger text-white">Count: {stockData.lowStock?.length || 0}</span>
            </div>
            <div className="scrollable-tight">
              <ul className="list-group list-group-flush">
                {(stockData.lowStock || []).map((i) => (
                  <li key={i._id} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                    <span className="text-truncate me-2">{i.name} <small className="text-muted">({i.unit})</small></span>
                    <span className="badge bg-light text-danger border">{i.currentStock} / {i.reorderLevel}</span>
                  </li>
                ))}
                {(stockData.lowStock || []).length === 0 && <li className="list-group-item text-muted text-center py-3 bg-transparent">Stock levels healthy.</li>}
              </ul>
            </div>
          </div>

          <div className="stat-card span-full">
            <h6 className="mb-3 text-dark">Usage vs Restock Detailed Ledger</h6>
            <div className="table-responsive stock-table-wrap">
              <table className="table table-sm table-hover align-middle border-top mb-0">
                <thead>
                  <tr className="table-light">
                    <th>Material Name</th>
                    <th className="text-end">Consumed</th>
                    <th className="text-end">Restocked</th>
                    <th className="text-end">Current Available</th>
                  </tr>
                </thead>
                <tbody>
                  {(stockData.byIngredient || []).map((i) => (
                    <tr key={i.ingredientId}>
                      <td className="fw-medium">{i.name}</td>
                      <td className="text-end text-danger">{i.totalConsumed || 0}</td>
                      <td className="text-end text-success">+{i.totalRestocked || 0}</td>
                      <td className="text-end fw-semibold">{i.currentStock ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="stat-card span-full">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 text-dark">Restock Activity History</h6>
              <span className="badge bg-light text-secondary border">Last 100 Entries</span>
            </div>
            <div className="scrollable-tight restock-history-timeline">
              <ul className="list-group list-group-flush">
                {(stockData.restocks || []).map((r) => (
                  <li key={r._id} className="list-group-item px-0 py-2 bg-transparent">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="fw-semibold text-dark">{r.ingredient?.name || 'Ingredient'}</span>
                        <div className="tiny-text text-muted">{new Date(r.createdAt).toLocaleString()} · logged by {r.createdBy?.name || 'System'}</div>
                      </div>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">+{r.delta}</span>
                    </div>
                  </li>
                ))}
                {(stockData.restocks || []).length === 0 && <li className="list-group-item text-muted text-center py-3 bg-transparent">No logged restocks yet.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;