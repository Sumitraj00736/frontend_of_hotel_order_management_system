import React, { useEffect, useState } from 'react';
import api from '../../../../api/client.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from 'lucide-react';

const fmt = n => `Rs ${Number(n || 0).toLocaleString()}`;

export default function FinanceReports() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const [summaryRes, dashRes] = await Promise.all([
        api.get('/api/reports/summary', { params }),
        api.get('/api/reports/finance-dashboard', { params }).catch(() => ({ data: {} }))
      ]);

      const s = summaryRes.data || {};
      const d = dashRes.data   || {};

      setSummary({
        revenue:   s.totalSales    ?? d.kpis?.sales      ?? 0,
        expenses:  s.expenses      ?? d.kpis?.expenses   ?? 0,
        purchases: s.purchase      ?? d.kpis?.purchase   ?? 0,
        income:    s.income        ?? d.kpis?.income     ?? 0,
        profit:    (s.totalSales ?? d.kpis?.sales ?? 0) - (s.expenses ?? d.kpis?.expenses ?? 0) - (s.purchase ?? d.kpis?.purchase ?? 0) + (s.income ?? d.kpis?.income ?? 0),
        orders:    s.totalOrders   ?? 0,
        avgOrder:  s.totalOrders ? ((s.totalSales ?? 0) / s.totalOrders) : 0,
      });

      const series = Array.isArray(d.salesSeries) ? d.salesSeries : [];
      setChartData(series.map((row) => ({
        label: row.label || row.month || row.day || '—',
        revenue: Number(row.sales || 0),
        expenses: 0
      })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const profitColor = summary?.profit >= 0 ? '#16a34a' : '#dc2626';

  return (
    <div className="fd-root">
      <div className="fd-header">
        <h1 className="fd-title">Reports</h1>
        <div className="fd-header-actions">
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Calendar size={15} color="#94a3b8" />
            <input type="date" className="fd-date-input" value={dateFrom}
              onChange={e => setDateFrom(e.target.value)} placeholder="From" />
            <span style={{ color:'#94a3b8' }}>—</span>
            <input type="date" className="fd-date-input" value={dateTo}
              onChange={e => setDateTo(e.target.value)} placeholder="To" />
            <button className="fd-action-btn primary" onClick={load} disabled={loading}>Apply</button>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="fd-kpi-grid">
        {[
          { label:'Total Revenue', val: fmt(summary?.revenue), icon:'📈', bg:'#f5f3ff', col:'#7c3aed' },
          { label:'Total Expenses',val: fmt(summary?.expenses),icon:'📉', bg:'#fef2f2', col:'#dc2626' },
          { label:'Purchases',     val: fmt(summary?.purchases),icon:'🛒', bg:'#fff7ed', col:'#ea580c' },
          { label:'Other Income',  val: fmt(summary?.income),  icon:'💰', bg:'#f0fdf4', col:'#16a34a' },
          { label:'Net Profit',    val: fmt(summary?.profit),  icon:'💹', bg: summary?.profit >= 0 ? '#f0fdf4':'#fef2f2', col: profitColor },
          { label:'Total Orders',  val: summary?.orders ?? '—',icon:'🧾', bg:'#ecfeff', col:'#0891b2' },
        ].map((k,i) => (
          <div key={i} className="fd-kpi-card">
            <div className="fd-kpi-icon" style={{ background:k.bg, color:k.col, fontSize:20 }}>{k.icon}</div>
            <div className="fd-kpi-body">
              <div className="fd-kpi-label">{k.label}</div>
              <div className="fd-kpi-value" style={{ color: k.label === 'Net Profit' ? profitColor : undefined }}>
                {loading ? '—' : k.val}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="fd-chart-card" style={{ marginTop: 0 }}>
        <div className="fd-card-head">
          <div>
            <div className="fd-card-title">Revenue vs Expenses</div>
            <div className="fd-card-sub">Daily comparison for selected period</div>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="fd-empty" style={{ height: 200 }}>No chart data for selected period</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `Rs ${v}`} />
              <Tooltip
                contentStyle={{ border:'none', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.1)', fontSize:12 }}
                formatter={(v, n) => [`Rs ${v}`, n]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue"  name="Revenue"  fill="#f5a524" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Profit / Loss Statement */}
      <div className="fd-table-card" style={{ marginTop: 0 }}>
        <div className="fd-card-head" style={{ marginBottom: 16 }}>
          <div className="fd-card-title">Profit / Loss Statement</div>
        </div>
        <table className="fd-table">
          <tbody>
            {[
              { label:'Total Revenue (Sales)',   val: summary?.revenue,   color:'#16a34a' },
              { label:'(-) Total Expenses',      val: -(summary?.expenses  || 0), color:'#dc2626' },
              { label:'(-) Total Purchases',     val: -(summary?.purchases || 0), color:'#dc2626' },
              { label:'(+) Other Income',        val: summary?.income,    color:'#16a34a' },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight:500, color:'#475569' }}>{row.label}</td>
                <td style={{ textAlign:'right', fontWeight:600, color: row.color || '#0f172a' }}>
                  {loading ? '—' : fmt(row.val)}
                </td>
              </tr>
            ))}
            <tr style={{ borderTop:'2px solid #e2e8f0' }}>
              <td style={{ fontWeight:700, fontSize:15, color:'#0f172a' }}>Net Profit / Loss</td>
              <td style={{ textAlign:'right', fontWeight:800, fontSize:16, color: profitColor }}>
                {loading ? '—' : fmt(summary?.profit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
