import React from 'react';
import { formatMoney } from '../shared/formatMoney.js';

export default function TransactionsTable({ rows }) {
  if (!rows?.length) {
    return <div className="finance-empty">No transactions for this range.</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="finance-data-table">
        <thead>
          <tr>
            <th>Entry Date</th>
            <th>TXN Date</th>
            <th>TXN No</th>
            <th>Particular</th>
            <th>TXN Type</th>
            <th>Parties</th>
            <th>PMT Mode</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Entry By</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.entryDate ? new Date(row.entryDate).toISOString().slice(0, 10) : '—'}</td>
              <td>{row.txnDate ? new Date(row.txnDate).toISOString().slice(0, 10) : '—'}</td>
              <td style={{ color: '#2563eb' }}>{row.txnNo}</td>
              <td>{row.particular}</td>
              <td>{row.txnType}</td>
              <td>{row.parties}</td>
              <td>{row.paymentMode}</td>
              <td>{formatMoney(row.amount)}</td>
              <td style={{ color: row.status === 'paid' ? '#16a34a' : '#ca8a04' }}>{row.status}</td>
              <td>{row.entryBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
