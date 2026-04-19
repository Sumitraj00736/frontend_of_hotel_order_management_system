import React, { useCallback, useEffect, useState } from 'react';
import TransactionKpiCards from './TransactionKpiCards.jsx';
import TransactionsTable from './TransactionsTable.jsx';
import { fetchFinanceDashboard, fetchTransactions } from './transactionsApi.js';
import '../../../../common/css/admin/finance/finance.css';

export default function TransactionsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [kpis, setKpis] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rangeParams =
        dateFrom || dateTo
          ? { ...(dateFrom ? { dateFrom } : {}), ...(dateTo ? { dateTo } : {}) }
          : {};
      const [dash, tx] = await Promise.all([
        fetchFinanceDashboard(rangeParams),
        fetchTransactions({ ...rangeParams, page, limit })
      ]);
      setKpis(dash.kpis || null);
      setRows(tx.data || []);
      setTotal(tx.total || 0);
      if (tx.warning) console.warn(tx.warning);
    } catch (e) {
      console.error(e);
      setKpis(null);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="finance-screen">
      <div className="finance-page-head">
        <div>
          <h1 className="finance-page-title">Transactions</h1>
          <div className="finance-breadcrumb">Finance / Transactions</div>
        </div>
        <div className="finance-toolbar">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <button type="button" className="finance-btn" onClick={() => load()} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <TransactionKpiCards kpis={kpis} />

      {loading ? <div className="finance-empty">Loading…</div> : <TransactionsTable rows={rows} />}

      <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#64748b' }}>
        Page {page} — showing {rows.length} of {total} row(s)
        {total > limit && (
          <span style={{ marginLeft: 12 }}>
            <button type="button" className="finance-btn ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <button
              type="button"
              className="finance-btn ghost"
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
