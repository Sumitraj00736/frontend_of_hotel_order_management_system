import React, { useCallback, useEffect, useState } from 'react';
import { fetchFinanceDashboard, fetchTransactions } from './transactionsApi.js';
import '../../../../common/css/admin/finance/finance.css';

// Modular Components
import TransactionHeader from './components/TransactionHeader.jsx';
import TransactionFilters from './components/TransactionFilters.jsx';
import TransactionKpiGrid from './components/TransactionKpiGrid.jsx';
import TransactionTable from './components/TransactionTable.jsx';
import TransactionPagination from './components/TransactionPagination.jsx';

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
    <div className="fd-root">
      <TransactionHeader>
        <TransactionFilters 
          dateFrom={dateFrom} 
          setDateFrom={setDateFrom} 
          dateTo={dateTo} 
          setDateTo={setDateTo} 
          loading={loading}
          onRefresh={load}
        />
      </TransactionHeader>

      <TransactionKpiGrid kpis={kpis} />

      <TransactionTable rows={rows} loading={loading} />

      <TransactionPagination 
        page={page} 
        limit={limit} 
        total={total} 
        rowsCount={rows.length}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
