import React, { useEffect, useState } from 'react';
import { formatMoney } from '../shared/formatMoney.js';
import { fetchPurchaseReturns } from './salesPurchaseApi.js';
import PurchaseReturnFormModal from './PurchaseReturnFormModal.jsx';

export default function PurchaseReturnsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPurchaseReturns();
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

  const totalQty = rows.reduce((s, r) => {
    const line = Array.isArray(r.items) ? r.items.reduce((a, i) => a + Number(i.qty || 0), 0) : 0;
    return s + line;
  }, 0);
  const totalAmt = rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button type="button" className="finance-btn primary" onClick={() => setShowAdd(true)}>
          + Add New
        </button>
      </div>
      <div className="finance-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="finance-kpi-card">
          <div className="label">Total Quantity Returned</div>
          <div className="value">{totalQty}</div>
        </div>
        <div className="finance-kpi-card">
          <div className="label">Total Returned Amount</div>
          <div className="value">{formatMoney(totalAmt)}</div>
        </div>
        <div className="finance-kpi-card">
          <div className="label">Most Returned</div>
          <div className="value" style={{ fontSize: '0.95rem' }}>
            No Item
          </div>
        </div>
        <div className="finance-kpi-card">
          <div className="label">Top Returner</div>
          <div className="value" style={{ fontSize: '0.95rem' }}>
            No supplier
          </div>
        </div>
      </div>

      {loading ? (
        <div className="finance-empty">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="finance-empty">No purchase returns found. Create a new purchase return.</div>
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
                  <td>{r.supplierName || '—'}</td>
                  <td>{formatMoney(r.totalAmount)}</td>
                  <td>{r.paymentMethod}</td>
                  <td>{r.paymentStatus === 'unpaid_credit' ? 'Credit' : 'Paid'}</td>
                  <td>{r.billDate ? new Date(r.billDate).toLocaleDateString('en-CA').replace(/-/g, '.') : '—'}</td>
                  <td>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PurchaseReturnFormModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}
