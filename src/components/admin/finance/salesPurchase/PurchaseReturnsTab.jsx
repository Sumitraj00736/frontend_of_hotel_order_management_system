import React, { useEffect, useState, useMemo } from 'react';
import { RotateCw, DollarSign, Package, Plus, Users } from 'lucide-react';
import { formatMoney } from '../../shared/formatMoney.js';
import { fetchPurchaseReturns } from './salesPurchaseApi.js';
import PurchaseReturnFormModal from './PurchaseReturnFormModal.jsx';

export default function PurchaseReturnsTab({ dateFrom, dateTo, refreshKey, setLoading }) {
  const [rows, setRows] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const data = await fetchPurchaseReturns(params);
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
  }, [dateFrom, dateTo, refreshKey, setLoading]);

  const kpis = useMemo(() => {
    const totalQty = rows.reduce((s, r) => {
      const line = Array.isArray(r.items) ? r.items.reduce((a, i) => a + Number(i.qty || 0), 0) : 0;
      return s + line;
    }, 0);
    const totalAmt = rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0);
    const supplierCounts = {};
    rows.forEach((r) => {
      const n = r.supplierName || '—';
      supplierCounts[n] = (supplierCounts[n] || 0) + 1;
    });
    const topSupplier = Object.entries(supplierCounts).sort((a, b) => b[1] - a[1])[0];

    return [
      { label: 'Return Qty', value: totalQty, icon: Package, color: '#7c3aed' },
      { label: 'Return Amount', value: formatMoney(totalAmt), icon: DollarSign, color: '#dc2626' },
      { label: 'Top Supplier', value: topSupplier ? topSupplier[0] : '—', icon: Users, color: '#f5a524' }
    ];
  }, [rows]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="fd-action-btn primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          <span>Add Purchase Return</span>
        </button>
      </div>

      <div className="fd-kpi-grid">
        {kpis.map((item, idx) => (
          <div key={idx} className="fd-kpi-card" style={{ '--card-index': idx }}>
            <div className="fd-account-icon" style={{ background: `${item.color}15`, color: item.color }}>
              <item.icon size={20} />
            </div>
            <div>
              <div className="fd-account-label">{item.label}</div>
              <div className="fd-account-balance" style={{ fontSize: '18px' }}>{item.value}</div>
            </div>
            <div className="fd-kpi-accent" style={{ background: item.color }} />
          </div>
        ))}
      </div>

      <div className="fd-table-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="fd-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Return ID</th>
                <th>Supplier</th>
                <th>Net Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>TXN Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i}>
                  <td style={{ color: '#94a3b8', fontSize: '12px' }}>{i + 1}</td>
                  <td className="fd-inv-link">{r.billReferenceNumber || r._id}</td>
                  <td style={{ fontWeight: 600 }}>{r.supplierName || '—'}</td>
                  <td style={{ fontWeight: 700, color: '#dc2626' }}>{formatMoney(r.totalAmount)}</td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '2px 8px', borderRadius: '4px' }}>
                      {r.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`fd-status-badge ${r.paymentStatus === 'unpaid_credit' ? 'unpaid' : 'paid'}`}>
                      {r.paymentStatus === 'unpaid_credit' ? 'Credit' : 'Paid'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>{r.billDate ? new Date(r.billDate).toLocaleDateString() : '—'}</td>
                  <td style={{ fontSize: '11px', color: '#94a3b8' }}>{r.status === 'void' ? 'Voided' : '—'}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="fd-empty">No purchase returns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PurchaseReturnFormModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}
