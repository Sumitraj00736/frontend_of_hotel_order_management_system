import React, { useCallback, useEffect, useState } from 'react';
import { fetchDaybookSummary } from './dayBookApi.js';
import '../../../../common/css/admin/finance/finance.css';

// Modular Components
import DayBookHeader from './components/DayBookHeader.jsx';
import DayBookToolbar from './components/DayBookToolbar.jsx';
import DayBookGrid from './components/DayBookGrid.jsx';
import DayBookSalesModal from './components/DayBookSalesModal.jsx';
import DayBookReportModal from './DayBookReportModal.jsx';

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
    <div className="fd-root">
      <DayBookHeader>
        <DayBookToolbar
          dayValue={dayValue}
          onDayChange={setDayValue}
          onSalesSummary={() => setShowSalesSummary(true)}
          onCloseDay={() => setShowReport(true)}
          onHistory={() => onNavigateHistory?.()}
          loading={loading}
        />
      </DayBookHeader>

      {loading ? (
        <div className="fd-empty">Loading daybook summary...</div>
      ) : (
        <DayBookGrid summary={summary} totals={totals} />
      )}

      <DayBookSalesModal 
        open={showSalesSummary} 
        onClose={() => setShowSalesSummary(false)} 
        netSales={summary?.netSales} 
      />

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
