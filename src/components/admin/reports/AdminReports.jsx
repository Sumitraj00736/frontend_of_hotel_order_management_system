import React, { useMemo } from 'react';
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

const TAB_OPTIONS = [
  { value: 'company', label: 'Company' },
  { value: 'waiter', label: 'Waiter' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'stock', label: 'Stock' }
];
// Cool palette (no gray/orange): blue, green, purple, teal, light blue
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
    <ul className="small mb-0">
      {data.map((row) => (
        <li key={row._id || row.name}>
          {row.name || 'Unknown'}: {row.orders} orders, NPR {row.sales.toFixed(2)}
        </li>
      ))}
    </ul>
  </div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="stat-card">
    <div className="d-flex align-items-center gap-2 mb-2">
      {icon}
      <h6 className="mb-0">{title}</h6>
    </div>
    <div style={{ width: '100%', height: 220 }}>{children}</div>
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
  const [selectedWaiterId, setSelectedWaiterId] = React.useState('');
  const [selectedKitchenId, setSelectedKitchenId] = React.useState('');
  const [trendRange, setTrendRange] = React.useState('month6');
  const [purchaseForm, setPurchaseForm] = React.useState({ title: '', amount: '', paymentMethod: 'cash', paidAt: '' });
  const [expenseForm, setExpenseForm] = React.useState({ title: '', amount: '', paymentMethod: 'cash', paidAt: '' });

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

  const waiterOptions = useMemo(
    () => waiterList.map((w) => ({ id: w._id, name: w.name || 'Unknown' })),
    [waiterList]
  );
  const kitchenOptions = useMemo(
    () => kitchenList.map((k) => ({ id: k._id, name: k.name || 'Unknown' })),
    [kitchenList]
  );

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
      <h5 className="mb-3">Reports & Analytics</h5>

      {view === 'company' && (
        <div className="reports-grid">
          <div className="stat-card span-2">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="fw-semibold">Finance Filters</div>
              <div className="d-flex gap-2 flex-wrap">
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
                  className="btn btn-outline-light btn-sm"
                  onClick={() => onChangeFinanceFilters?.({ dateFrom: '', dateTo: '' })}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="tiny-text text-muted mt-2">Filters affect Sales, Purchase, Expenses, Payment In/Out cards.</div>
          </div>

          <div className="stat-card tall span-2">
            <div className="d-flex align-items-center gap-2 mb-1">
              <Wallet size={18} />
              <h6 className="mb-0">Total Sales</h6>
            </div>
            <div className="fs-3 fw-bold">NPR {salesSummary?.totalSales?.toFixed(2) || '0.00'}</div>
            <div className="text-muted small">Total Orders: {salesSummary?.totalOrders || 0}</div>
            <div className="info-pill mt-2">
              <UsersIcon size={14} /> Top Waiter: {topWaiter?.name || 'N/A'}
              <span className="ms-2">|</span>
              <Utensils size={14} className="ms-2" /> Top Kitchen: {topKitchen?.name || 'N/A'}
            </div>
          </div>
          <ChartCard title="Company Sales Trend (6 months)" icon={<TrendingUp size={16} />}>
            <ResponsiveContainer>
              <LineChart data={analytics?.companyMonthly || []}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke={CHART_COLORS[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke={CHART_COLORS[1]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Frequent Menu Items" icon={<PieIcon size={16} />}>
            <ResponsiveContainer>
              <BarChart data={frequentItems.map(([name, count]) => ({ name, count }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={CHART_COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Purchase vs Expense" icon={<Activity size={16} />}>
            <ResponsiveContainer>
              <BarChart data={financeSeries}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="purchase" fill={CHART_COLORS[2]} />
                <Bar dataKey="expense" fill={CHART_COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Add Purchase</h6>
            </div>
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
                className="btn btn-primary btn-sm"
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
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Add Expense</h6>
            </div>
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
                className="btn btn-primary btn-sm"
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

          <div className="stat-card span-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Recent Purchases</h6>
              <span className="pill-neutral">Latest 5</span>
            </div>
            <div className="scrollable-tight">
              <ul className="list-group">
                {purchases.slice(0, 5).map((p) => (
                  <li key={p._id} className="list-group-item d-flex justify-content-between">
                    <span>{p.title || 'Purchase'}</span>
                    <span className="fw-semibold">NPR {Number(p.amount || 0).toFixed(2)}</span>
                  </li>
                ))}
                {purchases.length === 0 && <li className="list-group-item text-muted">No purchases yet.</li>}
              </ul>
            </div>
          </div>

          <div className="stat-card span-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Recent Expenses</h6>
              <span className="pill-neutral">Latest 5</span>
            </div>
            <div className="scrollable-tight">
              <ul className="list-group">
                {expenses.slice(0, 5).map((e) => (
                  <li key={e._id} className="list-group-item d-flex justify-content-between">
                    <span>{e.title || 'Expense'}</span>
                    <span className="fw-semibold">NPR {Number(e.amount || 0).toFixed(2)}</span>
                  </li>
                ))}
                {expenses.length === 0 && <li className="list-group-item text-muted">No expenses yet.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {view === 'waiter' && (
        <div className="reports-grid">
          <PerformanceList title="Last 1 Month" data={analytics?.waiterPerformance?.last1Month || []} />
          <PerformanceList title="Last 3 Months" data={analytics?.waiterPerformance?.last3Months || []} />
          <PerformanceList title="Last 6 Months" data={analytics?.waiterPerformance?.last6Months || []} />

          <ChartCard title="Waiter Sales Share" icon={<PieIcon size={16} />}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={waiterPie} dataKey="value" nameKey="name" outerRadius={80} label>
                  {waiterPie.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Waiter Ranking (Sales / Orders / Tables)" icon={<UsersIcon size={16} />}>
            <ResponsiveContainer>
              <BarChart data={waiterBars}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill={CHART_COLORS[0]} />
                <Bar dataKey="orders" fill={CHART_COLORS[1]} />
                <Bar dataKey="tables" fill={CHART_COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stat-card span-2">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 className="mb-0">Individual Waiter Trend</h6>
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm w-auto"
                  value={selectedWaiterId}
                  onChange={(e) => {
                    setSelectedWaiterId(e.target.value);
                    if (e.target.value) onLoadPromotions(e.target.value);
                  }}
                >
                  <option value="">Select waiter</option>
                  {waiterOptions.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm w-auto"
                  value={trendRange}
                  onChange={(e) => setTrendRange(e.target.value)}
                >
                  {TREND_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={waiterLine}>
                  <XAxis dataKey={trendRange === 'week' ? 'day' : 'month'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke={CHART_COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke={CHART_COLORS[1]} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {promotionUser && promotionUser._id === selectedWaiterId && (
            <AdminPromotionTimeline user={promotionUser} promotions={promotionList} onAdd={() => {}} />
          )}
        </div>
      )}

      {view === 'kitchen' && (
        <div className="d-flex flex-column gap-4">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <PerformanceList title="Last 1 Month" data={analytics?.kitchenPerformance?.last1Month || []} />
            </div>
            <div className="col-12 col-md-4">
              <PerformanceList title="Last 3 Months" data={analytics?.kitchenPerformance?.last3Months || []} />
            </div>
            <div className="col-12 col-md-4">
              <PerformanceList title="Last 6 Months" data={analytics?.kitchenPerformance?.last6Months || []} />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <ChartCard title="Kitchen Sales Share">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={kitchenPie} dataKey="value" nameKey="name" outerRadius={80} label>
                      {kitchenPie.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
            <div className="col-12 col-lg-8">
              <ChartCard title="Kitchen Ranking (Sales / Orders / Tables)">
                <ResponsiveContainer>
                  <BarChart data={kitchenBars}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill={CHART_COLORS[0]} />
                    <Bar dataKey="orders" fill={CHART_COLORS[1]} />
                    <Bar dataKey="tables" fill={CHART_COLORS[2]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>

          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 className="mb-0">Individual Kitchen Trend</h6>
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm w-auto"
                  value={selectedKitchenId}
                  onChange={(e) => setSelectedKitchenId(e.target.value)}
                >
                  <option value="">Select kitchen</option>
                  {kitchenOptions.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm w-auto"
                  value={trendRange}
                  onChange={(e) => setTrendRange(e.target.value)}
                >
                  {TREND_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={kitchenLine}>
                  <XAxis dataKey={trendRange === 'week' ? 'day' : 'month'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke={CHART_COLORS[0]} strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke={CHART_COLORS[1]} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {view === 'stock' && (
        <div className="reports-grid">
          <ChartCard title="Top Consumers" icon={<BarChart3 size={16} />}>
            <ResponsiveContainer>
              <BarChart data={(stockData.topConsumers || []).map((i) => ({ name: i.name || 'Ingredient', qty: i.totalConsumed }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill={CHART_COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Low Stock</h6>
              <span className="pill-amber pill">Count: {stockData.lowStock?.length || 0}</span>
            </div>
            <div className="scrollable-tight">
              <ul className="list-group">
                {(stockData.lowStock || []).map((i) => (
                  <li key={i._id} className="list-group-item d-flex justify-content-between">
                    <span>{i.name} ({i.unit})</span>
                    <span className="text-muted tiny-text">{i.currentStock}/{i.reorderLevel}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="stat-card span-2">
            <h6 className="mb-2">Usage vs Restock</h6>
            <div className="scrollable-tight">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Consumed</th>
                    <th>Restocked</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {(stockData.byIngredient || []).map((i) => (
                    <tr key={i.ingredientId}>
                      <td>{i.name}</td>
                      <td>{i.totalConsumed || 0}</td>
                      <td>{i.totalRestocked || 0}</td>
                      <td>{i.currentStock ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="stat-card span-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Restock History</h6>
              <span className="pill-neutral">Last 100</span>
            </div>
            <div className="scrollable-tight">
              <ul className="list-group">
                {(stockData.restocks || []).map((r) => (
                  <li key={r._id} className="list-group-item">
                    <div className="fw-semibold">{r.ingredient?.name || 'Ingredient'} +{r.delta}</div>
                    <div className="tiny-text text-muted">{new Date(r.createdAt).toLocaleString()} · {r.createdBy?.name || 'N/A'}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
