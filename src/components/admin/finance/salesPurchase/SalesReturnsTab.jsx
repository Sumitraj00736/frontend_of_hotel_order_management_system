import React, { useEffect, useState } from 'react';
import { formatMoney } from '../shared/formatMoney.js';
import { fetchSalesReturns } from './salesPurchaseApi.js';
import SalesReturnFormModal from './SalesReturnFormModal.jsx';

export default function SalesReturnsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSalesReturns();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalReturns = rows.length;
  const totalAmt = rows.reduce((s, r) => s + Number(r.netAmount ?? r.totalAmount ?? 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button type="button" className="finance-btn primary" onClick={() => setShowAdd(true)}>
          + Add New
        </button>
      </div>
      <div className="finance-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="finance-kpi-card">
          <div className="label">Total Returns</div>
          <div className="value">{totalReturns}</div>
        </div>
        <div className="finance-kpi-card">
          <div className="label">Total Amount</div>
          <div className="value">{formatMoney(totalAmt)}</div>
        </div>
        <div className="finance-kpi-card">
          <div className="label">Most Returned</div>
          <div className="value" style={{ fontSize: '0.95rem' }}>
            {rows.length ? '—' : 'No Item'}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="finance-empty">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="finance-empty">No sales returns found. Create a new sales return.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="finance-data-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>ID</th>
                <th>Parties</th>
                <th>TXN Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>TXN Date</th>
                <th>Billed By</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i}>
                  <td>{i + 1}</td>
                  <td>{r.billReferenceNumber || r._id}</td>
                  <td>{r.customerName || '—'}</td>
                  <td>{formatMoney(r.netAmount ?? r.totalAmount)}</td>
                  <td>{r.paymentMethod}</td>
                  <td>{r.paymentStatus === 'unpaid_credit' ? 'Credit' : 'Paid'}</td>
                  <td>{r.txnDate ? new Date(r.txnDate).toLocaleDateString('en-CA').replace(/-/g, '.') : '—'}</td>
                  <td>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SalesReturnFormModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}
