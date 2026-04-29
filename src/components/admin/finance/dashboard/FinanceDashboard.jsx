import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../../../api/client.js';
import {
  TrendingUp, ShoppingCart, DollarSign, Receipt,
  ArrowDownCircle, ArrowUpCircle, RefreshCw, Calendar
} from 'lucide-react';

// Refactored Components
import FinanceDashboardHeader from './components/FinanceDashboardHeader.jsx';
import FinanceKpiGrid from './components/FinanceKpiGrid.jsx';
import FinanceSalesOverview from './components/FinanceSalesOverview.jsx';
import FinanceSalesSummary from './components/FinanceSalesSummary.jsx';
import FinanceTransactionHistory from './components/FinanceTransactionHistory.jsx'; // Using existing component
import FinancePaymentMethods from './components/FinancePaymentMethods.jsx';

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
  const [range,        setRange]        = useState('today'); 

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Calculate dates based on range
      let dateFrom = '';
      const today = new Date();
      if (range === 'today') {
        dateFrom = today.toISOString().split('T')[0];
      } else if (range === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        dateFrom = weekAgo.toISOString().split('T')[0];
      } else if (range === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        dateFrom = monthAgo.toISOString().split('T')[0];
      }

      const [dashRes, txnRes] = await Promise.all([
        api.get('/api/reports/finance-dashboard', { params: { dateFrom } }),
        api.get('/api/reports/transactions', { params: { limit: 10 } }) // Removed dateFrom to show "Recent"
      ]);

      const dash = dashRes.data || {};
      const txnData = txnRes.data?.data || txnRes.data || [];
      console.log('Finance Dashboard TXN Data:', txnData);

      setKpis({
        sales:      dash.kpis?.sales       ?? 0,
        purchase:   dash.kpis?.purchase    ?? 0,
        income:     dash.kpis?.income      ?? 0,
        expenses:   dash.kpis?.expenses    ?? 0,
        paymentIn:  dash.kpis?.paymentIn   ?? 0,
        paymentOut: dash.kpis?.paymentOut  ?? 0,
      });

      const raw = Array.isArray(dash.salesSeries) ? dash.salesSeries : [];
      setChartData(
        raw.length
          ? raw.map((row) => ({
              label: row.label || row.month || row.day || '—',
              revenue: Number(row.sales || 0)
            }))
          : generatePlaceholder()
      );

      setRecentTxns(Array.isArray(txnData) ? txnData.slice(0, 10) : []);
      setPayMethods(dash.paymentBreakdown || []);
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="fd-root">
      <FinanceDashboardHeader 
        range={range} 
        setRange={setRange} 
        loading={loading} 
        onRefresh={loadData} 
      />

      <FinanceKpiGrid kpis={kpis} loading={loading} />

      <div className="fd-mid-row">
        <FinanceSalesOverview chartData={chartData} />
        <FinanceSalesSummary totalSales={kpis?.sales} loading={loading} />
      </div>

      <div className="fd-bottom-row">
        <div className="fd-table-card glass-card">
          <FinanceTransactionHistory rows={recentTxns} loading={loading} />
        </div>
        <FinancePaymentMethods payMethods={payMethods} />
      </div>
    </div>
  );
}

function generatePlaceholder() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return days.map(label => ({ label, revenue: 0 }));
}

function formatTxnDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-CA').replace(/-/g, '.');
}
