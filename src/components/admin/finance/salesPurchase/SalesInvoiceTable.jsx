import React from 'react';
import { formatMoney } from '../shared/formatMoney.js';

export default function SalesInvoiceTable({ rows }) {
  if (!rows?.length) return <div className="fd-empty">No sales invoices found for this range.</div>;

  return (
    <div className="fd-table-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="fd-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Invoice ID</th>
              <th>Customer / Table</th>
              <th>Type</th>
              <th>Grand Total</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Mode</th>
              <th>Status</th>
              <th>TXN Date</th>
              <th>Billed By</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.id}-${row.txnDate}`}>
                <td style={{ color: '#94a3b8', fontSize: '12px' }}>{row.sn}</td>
                <td className="fd-inv-link">{row.id}</td>
                <td style={{ fontWeight: 600 }}>{row.parties}</td>
                <td>
                  <span className="fd-type-badge">{row.orderType}</span>
                </td>
                <td style={{ fontWeight: 700, color: '#0f172a' }}>{formatMoney(row.txnAmount)}</td>
                <td style={{ color: '#16a34a', fontWeight: 500 }}>{formatMoney(row.amountPaid)}</td>
                <td style={{ color: row.amountDue > 0 ? '#dc2626' : '#94a3b8' }}>{formatMoney(row.amountDue)}</td>
                <td>
                  <span style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '2px 8px', borderRadius: '4px' }}>
                    {row.mode}
                  </span>
                </td>
                <td>
                  <span className={`fd-status-badge ${row.status}`}>
                    {row.status}
                  </span>
                </td>
                <td style={{ fontSize: '12px' }}>
                  {row.txnDate ? new Date(row.txnDate).toLocaleDateString() : '—'}
                </td>
                <td style={{ color: '#64748b', fontSize: '12px' }}>{row.billedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
