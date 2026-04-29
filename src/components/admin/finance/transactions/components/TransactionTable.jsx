import React from 'react';
import { formatMoney } from '../../shared/formatMoney.js';

const TransactionTable = ({ rows, loading }) => {
  if (loading) return <div className="fd-empty">Loading transactions...</div>;
  if (!rows?.length) return <div className="fd-empty">No transactions found for the selected range.</div>;

  return (
    <div className="fd-table-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="fd-table">
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
                <td>{row.entryDate ? new Date(row.entryDate).toLocaleDateString() : '—'}</td>
                <td>{row.txnDate ? new Date(row.txnDate).toLocaleDateString() : '—'}</td>
                <td>
                  <span className="fd-inv-link">{row.txnNo}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{row.particular}</td>
                <td>
                  <span className={`fd-type-badge ${row.txnType?.toLowerCase().includes('sales') ? 'sales' : row.txnType?.toLowerCase().includes('expense') ? 'expense' : ''}`}>
                    {row.txnType}
                  </span>
                </td>
                <td>{row.parties}</td>
                <td>
                  <span style={{ fontSize: '12px', color: '#64748b', background: '#f8fafc', padding: '2px 8px', borderRadius: '4px' }}>
                    {row.paymentMode}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: '#0f172a' }}>
                  {formatMoney(row.amount)}
                </td>
                <td>
                  <span className={`fd-status-badge ${row.status === 'paid' ? 'paid' : 'unpaid'}`}>
                    {row.status}
                  </span>
                </td>
                <td style={{ color: '#94a3b8', fontSize: '12px' }}>{row.entryBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
