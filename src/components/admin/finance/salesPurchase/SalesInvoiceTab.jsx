import React, { useEffect, useState } from 'react';
import SalesInvoiceKpis from './SalesInvoiceKpis.jsx';
import SalesInvoiceTable from './SalesInvoiceTable.jsx';
import { fetchSalesInvoices } from './salesPurchaseApi.js';

export default function SalesInvoiceTab() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchSalesInvoices({ limit: 100 });
        if (!cancelled) {
          setRows(res.data || []);
          setSummary(res.summary || null);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setRows([]);
          setSummary(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <SalesInvoiceKpis summary={summary} />
      {loading ? <div className="finance-empty">Loading…</div> : <SalesInvoiceTable rows={rows} />}
    </div>
  );
}
