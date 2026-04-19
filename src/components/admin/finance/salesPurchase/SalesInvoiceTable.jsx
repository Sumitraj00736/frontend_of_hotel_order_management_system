import React from 'react';
import { formatMoney } from '../shared/formatMoney.js';

export default function SalesInvoiceTable({ rows }) {
  if (!rows?.length) return <div className="finance-empty">No sales invoices found.</div>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="finance-data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>ID</th>
            <th>Parties</th>
            <th>Order Type</th>
            <th>TXN Amount</th>
            <th>Mode</th>
            <th>Status</th>
            <th>TXN Date</th>
            <th>Billed By</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.id}-${row.txnDate}`}>
              <td>{row.sn}</td>
              <td style={{ color: '#2563eb' }}>{row.id}</td>
              <td>{row.parties}</td>
              <td>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{row.orderType}</span>
              </td>
              <td style={{ color: '#16a34a', fontWeight: 600 }}>{formatMoney(row.txnAmount)}</td>
              <td>{row.mode}</td>
              <td>
                <span style={{ color: '#16a34a' }}>{row.status}</span>
              </td>
              <td>{row.txnDate ? new Date(row.txnDate).toLocaleDateString('en-CA').replace(/-/g, '.') : '—'}</td>
              <td>{row.billedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
