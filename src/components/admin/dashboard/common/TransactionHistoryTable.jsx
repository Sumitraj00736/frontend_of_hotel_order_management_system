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
  const statusClass = (status = '') => {
    const normalized = status.toLowerCase();
    if (normalized.includes('paid')) return 'paid';
    if (normalized.includes('pending')) return 'pending';
    if (normalized.includes('cancel')) return 'cancelled';
    return 'default';
  };

  return (
    <div className="panel panel-history">
      <div className="panel-heading">
        <div>
          <div className="panel-title">Transaction History</div>
          <div className="panel-sub">Recent payment activity across the branch.</div>
        </div>
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
                <th>Status</th>
                <th>Entry Date</th>
                <th>TXN Date</th>
                <th>TXN No</th>
                <th>Particular</th>
                <th>TXN Type</th>
                <th>Parties</th>
                <th>PMT Mode</th>
                <th>Amount</th>
                <th>Entry By</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`${row.txnNo}-${idx}`}>
                  <td data-label="Status">
                    <span className={`status-pill ${statusClass(row.status)}`}>
                      <span className="status-dot" />
                      {row.status}
                    </span>
                  </td>
                  <td data-label="Entry Date">{row.entryDate ? new Date(row.entryDate).toLocaleDateString() : '-'}</td>
                  <td data-label="TXN Date">{row.txnDate ? new Date(row.txnDate).toLocaleDateString() : '-'}</td>
                  <td data-label="TXN No">{row.txnNo}</td>
                  <td data-label="Particular">{row.particular}</td>
                  <td data-label="TXN Type">{row.txnType}</td>
                  <td data-label="Parties">{row.parties}</td>
                  <td data-label="PMT Mode">{row.paymentMode}</td>
                  <td data-label="Amount">Rs {Number(row.amount || 0).toLocaleString()}</td>
                  <td data-label="Entry By">{row.entryBy}</td>
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
