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
import AdminPromotionTimeline from './AdminPromotionTimeline.jsx';

const TAB_OPTIONS = ['company', 'waiter', 'kitchen'];
const CHART_COLORS = ['#f97316', '#22d3ee', '#e2e8f0', '#94a3b8', '#38bdf8'];
const TREND_OPTIONS = [
  { value: 'week', label: 'Last 1 Week' },
  { value: 'month1', label: 'Last 1 Month' },
  { value: 'month3', label: 'Last 3 Months' },
  { value: 'month6', label: 'Last 6 Months' }
];

const TabButton = ({ active, onClick, label }) => (
  <button className={`sidebar-button ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </button>
);

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

const ChartCard = ({ title, children }) => (
  <div className="stat-card">
    <h6 className="mb-3">{title}</h6>
    <div style={{ width: '100%', height: 220 }}>{children}</div>
  </div>
);

const AdminReports = ({ analytics, salesSummary, onLoadPromotions, promotionUser, promotionList }) => {
  const [activeTab, setActiveTab] = useState('company');
  const [selectedWaiterId, setSelectedWaiterId] = useState('');
  const [selectedKitchenId, setSelectedKitchenId] = useState('');
  const [trendRange, setTrendRange] = useState('month6');

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

  return (
    <div className="card glass-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Reports & Analytics</h5>
        <div className="d-flex gap-2">
          {TAB_OPTIONS.map((tab) => (
            <TabButton
              key={tab}
              label={tab.toUpperCase()}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      </div>

      {activeTab === 'company' && (
        <div className="d-flex flex-column gap-4">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <h6>Total Sales</h6>
          <div className="fs-4">NPR {salesSummary?.totalSales?.toFixed(2) || '0.00'}</div>
                <div className="text-muted small">Total Orders: {salesSummary?.totalOrders || 0}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <h6>Top Waiter</h6>
                <div className="fs-5">{topWaiter?.name || 'N/A'}</div>
                <div className="text-muted small">NPR {topWaiter?.sales?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <h6>Top Kitchen</h6>
                <div className="fs-5">{topKitchen?.name || 'N/A'}</div>
                <div className="text-muted small">NPR {topKitchen?.sales?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <ChartCard title="Company Sales Trend (6 months)">
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
            </div>
            <div className="col-12 col-lg-6">
              <ChartCard title="Frequent Menu Items">
                <ResponsiveContainer>
                  <BarChart data={frequentItems.map(([name, count]) => ({ name, count }))}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'waiter' && (
        <div className="d-flex flex-column gap-4">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <PerformanceList title="Last 1 Month" data={analytics?.waiterPerformance?.last1Month || []} />
            </div>
            <div className="col-12 col-md-4">
              <PerformanceList title="Last 3 Months" data={analytics?.waiterPerformance?.last3Months || []} />
            </div>
            <div className="col-12 col-md-4">
              <PerformanceList title="Last 6 Months" data={analytics?.waiterPerformance?.last6Months || []} />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <ChartCard title="Waiter Sales Share">
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
            </div>
            <div className="col-12 col-lg-8">
              <ChartCard title="Waiter Ranking (Sales / Orders / Tables)">
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
            </div>
          </div>

          <div className="stat-card">
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
            <div style={{ width: '100%', height: 240 }}>
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

      {activeTab === 'kitchen' && (
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
    </div>
  );
};

export default AdminReports;
