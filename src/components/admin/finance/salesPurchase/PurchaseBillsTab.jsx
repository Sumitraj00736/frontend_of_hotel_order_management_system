import React, { useEffect, useState } from 'react';
import { formatMoney } from '../shared/formatMoney.js';
import { fetchPurchases } from './salesPurchaseApi.js';
import PurchaseBillFormModal from './PurchaseBillFormModal.jsx';

export default function PurchaseBillsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPurchases();
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

  const kpis = React.useMemo(() => {
    const totalPurchases = rows.reduce((s, r) => s + Number((r.grandTotal ?? r.amount) || 0), 0);
    const qty = rows.reduce((s, r) => {
      const line = Array.isArray(r.items) ? r.items.reduce((a, i) => a + Number(i.qty || i.quantity || 0), 0) : 0;
      return s + line;
    }, 0);
    const supplierCounts = {};
    rows.forEach((r) => {
      const n = r.supplierName || '—';
      supplierCounts[n] = (supplierCounts[n] || 0) + 1;
    });
    const topSupplier = Object.entries(supplierCounts).sort((a, b) => b[1] - a[1])[0];
    return {
      qty,
      totalPurchases,
      topSupplier: topSupplier ? topSupplier[0] : 'No supplier',
      topSupplierCount: topSupplier ? topSupplier[1] : 0
    };
  }, [rows]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button type="button" className="finance-btn primary" onClick={() => setShowAdd(true)}>
          + Add New
        </button>
      </div>
      <div className="finance-kpi-grid">
        <div className="finance-kpi-card">
          <div className="label">Total Quantity Purchased</div>
          <div className="value">{kpis.qty}</div>
        </div>
        <div className="finance-kpi-card">
          <div className="label">Total Purchases</div>
          <div className="value">{formatMoney(kpis.totalPurchases)}</div>
        </div>
        <div className="finance-kpi-card">
          <div className="label">Top Supplier</div>
          <div className="value" style={{ fontSize: '0.95rem' }}>
            {kpis.topSupplier}{' '}
            <span style={{ color: '#64748b', fontWeight: 400 }}>({kpis.topSupplierCount} times)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="finance-empty">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="finance-empty">No purchase bill found. Create a new purchase bill.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="finance-data-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>ID</th>
                <th>Parties</th>
                <th>Bill Ref</th>
                <th>TXN Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>TXN Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i}>
                  <td>{i + 1}</td>
                  <td style={{ color: '#2563eb' }}>{r.referenceNo || r._id}</td>
                  <td>{r.supplierName || '—'}</td>
                  <td>{r.billReferenceNumber || r.referenceNo || '—'}</td>
                  <td style={{ color: '#16a34a' }}>{formatMoney(r.grandTotal ?? r.amount)}</td>
                  <td>{r.paymentMethod}</td>
                  <td>{r.amountDue > 0 ? `Credit (${formatMoney(r.amountDue)})` : 'Paid'}</td>
                  <td>{r.paidAt ? new Date(r.paidAt).toLocaleDateString('en-CA').replace(/-/g, '.') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PurchaseBillFormModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}
