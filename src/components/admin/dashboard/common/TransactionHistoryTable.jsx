import React from 'react';

const TransactionHistoryTable = ({
  rows = [],
  page = 1,
  limit = 20,
  total = 0,
  filters,
  onFilterChange,
  onPageChange,
  onLimitChange,
  onExport
}) => {
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="panel-title">Transaction History</div>
        <div className="transaction-actions">
          <input
            type="date"
            value={filters?.dateFrom || ''}
            onChange={(e) => onFilterChange?.({ dateFrom: e.target.value })}
          />
          <input
            type="date"
            value={filters?.dateTo || ''}
            onChange={(e) => onFilterChange?.({ dateTo: e.target.value })}
          />
          <button className="chip ghost" onClick={onExport}>Export CSV</button>
          <button className="chip ghost">View All</button>
        </div>
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
      <div className="orders-pagination">
        <div className="orders-page-info">
          Page {page} of {totalPages}
        </div>
        <div className="orders-page-controls">
          <button className="chip ghost" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            Prev
          </button>
          <button className="chip ghost" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
            Next
          </button>
          <select className="chip ghost" value={limit} onChange={(e) => onLimitChange?.(Number(e.target.value))}>
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
