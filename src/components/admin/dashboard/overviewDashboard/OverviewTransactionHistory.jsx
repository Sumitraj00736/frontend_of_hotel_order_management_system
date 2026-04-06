import React from 'react';

const OverviewTransactionHistory = ({ rows = [] }) => (
  <div className="panel">
    <div className="panel-heading">
      <div className="panel-title">Transaction History</div>
      <button className="chip ghost">View All</button>
    </div>
    <div className="transaction-table">
      {rows.length === 0 ? (
        <div className="transaction-empty">
          <div className="empty-illustration">No transaction found</div>
          <div className="panel-sub">Create a new transaction or import a new data.</div>
        </div>
      ) : (
        <table className="table table-sm transaction-table-grid">
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
            {rows.map((row, idx) => (
              <tr key={`${row.txnNo}-${idx}`}>
                <td>{row.entryDate ? new Date(row.entryDate).toLocaleDateString() : '-'}</td>
                <td>{row.txnDate ? new Date(row.txnDate).toLocaleDateString() : '-'}</td>
                <td>{row.txnNo}</td>
                <td>{row.particular}</td>
                <td>{row.txnType}</td>
                <td>{row.parties}</td>
                <td>{row.paymentMode}</td>
                <td>Rs {row.amount}</td>
                <td>{row.status}</td>
                <td>{row.entryBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

export default OverviewTransactionHistory;
