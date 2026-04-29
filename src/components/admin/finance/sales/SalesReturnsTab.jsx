import React, { useEffect, useState, useMemo } from 'react';
import { RotateCcw, DollarSign, Package, Plus } from 'lucide-react';
import { formatMoney } from '../shared/formatMoney.js';
import { fetchSalesReturns } from './salesApi.js';

export default function SalesReturnsTab({ dateFrom, dateTo, refreshKey, setLoading }) {
  const [rows, setRows] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const data = await fetchSalesReturns(params);
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
    const totalAmt = rows.reduce((s, r) => s + Number(r.netAmount ?? r.totalAmount ?? 0), 0);
    return [
      { label: 'Total Returns', value: rows.length, icon: RotateCcw, color: '#ea580c' },
      { label: 'Return Amount', value: formatMoney(totalAmt), icon: DollarSign, color: '#dc2626' },
      { label: 'Returned Items', value: rows.length ? '—' : 'None', icon: Package, color: '#7c3aed' }
    ];
  }, [rows]);

  return (
    <div>
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
                <th>Parties</th>
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
                  <td style={{ fontWeight: 600 }}>{r.customerName || '—'}</td>
                  <td style={{ fontWeight: 700, color: '#dc2626' }}>{formatMoney(r.netAmount ?? r.totalAmount)}</td>
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
                  <td style={{ fontSize: '12px' }}>{r.txnDate ? new Date(r.txnDate).toLocaleDateString() : '—'}</td>
                  <td style={{ fontSize: '11px', color: '#94a3b8' }}>{r.status === 'void' ? 'Voided' : '—'}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="fd-empty">No sales returns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      </div>
    </div>
  );
}
