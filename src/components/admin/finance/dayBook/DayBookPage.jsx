import React, { useCallback, useEffect, useState } from 'react';
import DayBookGrid from './DayBookGrid.jsx';
import DayBookToolbar from './DayBookToolbar.jsx';
import DayBookReportModal from './DayBookReportModal.jsx';
import { fetchDaybookSummary } from './dayBookApi.js';
import '../../../../common/css/admin/finance/finance.css';

function todayInput() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function DayBookPage({ onNavigateHistory }) {
  const [dayValue, setDayValue] = useState(todayInput);
  const [summary, setSummary] = useState(null);
  const [totals, setTotals] = useState(null);
  const [range, setRange] = useState({ from: null, to: null });
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showSalesSummary, setShowSalesSummary] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDaybookSummary(dayValue);
      setSummary(data.summary);
      setTotals(data.totals);
      setRange({ from: data.from, to: data.to });
    } catch (e) {
      console.error(e);
      setSummary(null);
      setTotals(null);
    } finally {
      setLoading(false);
    }
  }, [dayValue]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="finance-screen">
      <div className="finance-page-head">
        <div>
          <h1 className="finance-page-title">Day Book</h1>
          <div className="finance-breadcrumb">Finance / Day Book</div>
        </div>
        <DayBookToolbar
          dayValue={dayValue}
          onDayChange={setDayValue}
          onSalesSummary={() => setShowSalesSummary(true)}
          onCloseDay={() => setShowReport(true)}
          onHistory={() => onNavigateHistory?.()}
          loading={loading}
        />
      </div>

      {loading ? <div className="finance-empty">Loading…</div> : <DayBookGrid summary={summary} totals={totals} />}

      {showSalesSummary && (
        <div className="finance-modal-overlay" role="dialog">
          <div className="finance-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Sales Summary</h3>
              <button type="button" className="finance-btn ghost" onClick={() => setShowSalesSummary(false)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Net sales for the selected day (from day book summary).
            </p>
            {summary?.netSales && (
              <pre style={{ background: '#f8fafc', padding: 12, borderRadius: 8, overflow: 'auto' }}>
                {JSON.stringify(summary.netSales, null, 2)}
              </pre>
            )}
            <button type="button" className="finance-btn" style={{ marginTop: 12 }} onClick={() => setShowSalesSummary(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <DayBookReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        rowSummary={summary}
        rangeFrom={range.from}
        rangeTo={range.to}
        totals={totals}
        dayValue={dayValue}
        onSaved={load}
      />
    </div>
  );
}
