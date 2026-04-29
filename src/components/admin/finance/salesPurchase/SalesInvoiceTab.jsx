import React, { useEffect, useState } from 'react';
import SalesInvoiceKpiGrid from './components/SalesInvoiceKpiGrid.jsx';
import SalesInvoiceTable from './SalesInvoiceTable.jsx';
import { fetchSalesInvoices } from './salesPurchaseApi.js';

export default function SalesInvoiceTab({ dateFrom, dateTo, refreshKey, setLoading }) {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = { limit: 100 };
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        
        const res = await fetchSalesInvoices(params);
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
  }, [dateFrom, dateTo, refreshKey, setLoading]);

  return (
    <div>
      <SalesInvoiceKpiGrid summary={summary} />
      <SalesInvoiceTable rows={rows} />
    </div>
  );
}
