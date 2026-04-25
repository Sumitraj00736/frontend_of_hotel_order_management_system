import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../../../api/client.js';
import {
  TrendingUp, ShoppingCart, DollarSign, Receipt,
  ArrowDownCircle, ArrowUpCircle, RefreshCw, Calendar
} from 'lucide-react';

const KPI_CONFIG = [
  { key: 'sales',      label: 'Sales',       icon: TrendingUp,      color: '#7c3aed', bg: '#f5f3ff' },
  { key: 'purchase',   label: 'Purchase',    icon: ShoppingCart,    color: '#ea580c', bg: '#fff7ed' },
  { key: 'income',     label: 'Income',      icon: DollarSign,      color: '#16a34a', bg: '#f0fdf4' },
  { key: 'expenses',   label: 'Expenses',    icon: Receipt,         color: '#dc2626', bg: '#fef2f2' },
  { key: 'paymentIn',  label: 'Payment In',  icon: ArrowDownCircle, color: '#0891b2', bg: '#ecfeff' },
  { key: 'paymentOut', label: 'Payment Out', icon: ArrowUpCircle,   color: '#9333ea', bg: '#faf5ff' },
];

function fmt(n) { return `Rs ${Number(n || 0).toLocaleString()}`; }

export default function FinanceDashboard({ financeDashboardData, report, transactionHistory }) {
  const [kpis,         setKpis]         = useState(null);
  const [chartData,    setChartData]    = useState([]);
  const [recentTxns,   setRecentTxns]   = useState([]);
  const [payMethods,   setPayMethods]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [range,        setRange]        = useState('today'); // Kept for UI

  useEffect(() => {
    if (!financeDashboardData && !report) return;
    setLoading(false);

    const dash = financeDashboardData || {};
    const rep = report || {};
    
    setKpis({
      sales:      dash.totalRevenue      ?? rep.totalRevenue      ?? 0,
      purchase:   dash.totalPurchases    ?? rep.totalPurchases    ?? 0,
      income:     dash.totalIncome       ?? rep.totalIncome       ?? 0,
      expenses:   dash.totalExpenses     ?? rep.totalExpenses     ?? 0,
      paymentIn:  dash.totalPaymentIn    ?? 0,
      paymentOut: dash.totalPaymentOut   ?? 0,
    });

    const raw = dash.dailyRevenue || dash.salesByDay || [];
    setChartData(raw.length ? raw : generatePlaceholder());

    const txnRows = Array.isArray(transactionHistory?.data) 
      ? transactionHistory.data 
      : Array.isArray(transactionHistory) ? transactionHistory : [];
    
    setRecentTxns(txnRows.slice(0, 8));
    setPayMethods(dash.paymentBreakdown || []);
  }, [financeDashboardData, report, transactionHistory]);

  return (
    <div className="fd-root">
      {/* ── Header ── */}
      <div className="fd-header">
        <div>
          <h1 className="fd-title">Finance</h1>
        </div>
        <div className="fd-header-actions">
          <div className="fd-range-tabs">
            {['today','week','month'].map(r => (
              <button
                key={r}
                className={`fd-range-btn ${range === r ? 'active' : ''}`}
                onClick={() => setRange(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <button className="fd-refresh-btn" disabled={loading}>
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="fd-kpi-grid">
        {KPI_CONFIG.map(cfg => {
          const Icon = cfg.icon;
          const val  = kpis?.[cfg.key] ?? 0;
          return (
            <div key={cfg.key} className="fd-kpi-card">
              <div className="fd-kpi-icon" style={{ background: cfg.bg, color: cfg.color }}>
                <Icon size={20} />
              </div>
              <div className="fd-kpi-body">
                <div className="fd-kpi-label">{cfg.label}</div>
                <div className="fd-kpi-value">{loading ? '—' : fmt(val)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="fd-mid-row">
        {/* Sales Overview */}
        <div className="fd-chart-card">
          <div className="fd-card-head">
            <div>
              <div className="fd-card-title">Sales Overview</div>
              <div className="fd-card-sub">Here is a live overview of your sales</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f5a524" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f5a524" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `Rs ${v}`} />
              <Tooltip
                contentStyle={{ border: 'none', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={v => [`Rs ${v}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f5a524" strokeWidth={2.5}
                fill="url(#salesGrad)" dot={{ r: 4, fill: '#f5a524' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Summary */}
        <div className="fd-summary-card">
          <div className="fd-card-head">
            <div>
              <div className="fd-card-title">Sales Summary</div>
              <div className="fd-card-sub">Real-time sales tracking</div>
            </div>
          </div>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <div style={{ color: '#64748b', fontSize: 13 }}>Total Sales</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '8px 0 24px' }}>
              {loading ? '—' : fmt(kpis?.sales)}
            </div>
          </div>
          <div className="fd-summary-rows">
            <div className="fd-summary-row">
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="fd-dot" style={{ background:'#f5a524' }} /> Paid
              </span>
              <strong>{loading ? '—' : fmt(kpis?.sales)}</strong>
            </div>
            <div className="fd-summary-row">
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="fd-dot" style={{ background:'#ef4444' }} /> Unpaid Sales
              </span>
              <strong>Rs 0</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="fd-bottom-row">
        {/* Recent Transactions */}
        <div className="fd-table-card">
          <div className="fd-card-head">
            <div>
              <div className="fd-card-title">Recent Payment In/Out Transactions</div>
              <div className="fd-card-sub">Manage your payment In/Out history and track transactions</div>
            </div>
          </div>
          {loading ? (
            <div className="fd-empty">Loading…</div>
          ) : recentTxns.length === 0 ? (
            <div className="fd-empty">No recent transactions</div>
          ) : (
            <table className="fd-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>TXN No</th>
                  <th>Particular</th>
                  <th>Type</th>
                  <th>Mode</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date || r.txnDate || r.entryDate || '—'}</td>
                    <td><span className="fd-inv-link">{r.txnNo || r.invoiceNo || '—'}</span></td>
                    <td>{r.particular || r.customerName || r.description || '—'}</td>
                    <td><span className="fd-type-badge">{r.txnType || r.type || 'Sales'}</span></td>
                    <td>{r.pmtMode || r.paymentMethod || 'Cash'}</td>
                    <td style={{ color: '#16a34a', fontWeight: 600 }}>Rs {r.amount || 0}</td>
                    <td>
                      <span className={`fd-status-badge ${(r.status || 'paid').toLowerCase()}`}>
                        {r.status || 'Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Payment Methods */}
        <div className="fd-pay-methods-card">
          <div className="fd-card-head">
            <div>
              <div className="fd-card-title">Payment Methods</div>
              <div className="fd-card-sub">Top payment methods overview</div>
            </div>
          </div>
          {payMethods.length === 0 ? (
            <div className="fd-add-method">
              <div className="fd-add-method-icon">+</div>
              <div style={{ fontWeight: 600 }}>Add Payment Method</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>Create a new payment method to collect payments</div>
            </div>
          ) : (
            <div className="fd-method-list">
              {payMethods.map((m, i) => (
                <div key={i} className="fd-method-row">
                  <span>{m.method}</span>
                  <strong>{fmt(m.amount)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generatePlaceholder() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return days.map(label => ({ label, revenue: 0 }));
}
