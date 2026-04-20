import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DayBookHistoryTable from './DayBookHistoryTable.jsx';
import { fetchDaybookHistory } from './dayBookApi.js';
import '../../../../common/css/admin/finance/finance.css';

export default function DayBookHistoryPage({ onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchDaybookHistory({ limit: 100 });
        if (!cancelled) setRows(res.data || []);
      } catch (e) {
        console.error(e);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="finance-screen">
      <div className="finance-page-head">
        <div>
          <div className="finance-breadcrumb">
            <button type="button" onClick={onBack}>
              <ArrowLeft size={16} style={{ verticalAlign: 'middle' }} /> Daybook
            </button>
            <span>/</span>
            <span>Daybook History</span>
          </div>
          <h1 className="finance-page-title" style={{ marginTop: 8 }}>
            Daybook History
          </h1>
        </div>
      </div>
      {loading ? <div className="finance-empty">Loading…</div> : <DayBookHistoryTable rows={rows} />}
    </div>
  );
}
