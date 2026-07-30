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
    if (normalized.includes('paid')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (normalized.includes('pending')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (normalized.includes('cancel')) return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  const statusDotColor = (status = '') => {
    const normalized = status.toLowerCase();
    if (normalized.includes('paid')) return 'bg-emerald-500';
    if (normalized.includes('pending')) return 'bg-amber-500';
    if (normalized.includes('cancel')) return 'bg-rose-500';
    return 'bg-slate-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-5">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Transaction History</h3>
          <p className="text-xs font-semibold text-slate-400 mt-1">Recent payment activity across the branch.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:border-orange-500"
            value={filters?.dateFrom || ''}
            onChange={(e) => onFilterChange?.({ dateFrom: e.target.value })}
          />
          <input
            type="date"
            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:border-orange-500"
            value={filters?.dateTo || ''}
            onChange={(e) => onFilterChange?.({ dateTo: e.target.value })}
          />
          <button 
            className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 transition-all rounded-lg bg-white text-slate-600"
            onClick={onExport}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-slate-50/55 rounded-xl border border-slate-100">
            <span className="text-3xl mb-2">💸</span>
            <h4 className="text-xs font-extrabold text-slate-800 tracking-tight">No transactions found</h4>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">
              Create a new transaction or import fresh data.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-semibold text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 px-4">Entry Date</th>
                <th className="pb-3 px-4">TXN Date</th>
                <th className="pb-3 px-4">TXN No</th>
                <th className="pb-3 px-4">Particular</th>
                <th className="pb-3 px-4">TXN Type</th>
                <th className="pb-3 px-4">Parties</th>
                <th className="pb-3 px-4">PMT Mode</th>
                <th className="pb-3 px-4">Amount</th>
                <th className="pb-3 pl-4">Entry By</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`${row.txnNo}-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                  <td className="py-3.5 pr-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border rounded-md uppercase tracking-wider ${statusClass(row.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor(row.status)}`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{row.entryDate ? new Date(row.entryDate).toLocaleDateString() : '-'}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{row.txnDate ? new Date(row.txnDate).toLocaleDateString() : '-'}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">{row.txnNo}</td>
                  <td className="py-3.5 px-4 max-w-[150px] truncate text-slate-800">{row.particular}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{row.txnType}</td>
                  <td className="py-3.5 px-4 max-w-[120px] truncate text-slate-500">{row.parties}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{row.paymentMode}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-black text-slate-800">Rs {Number(row.amount || 0).toLocaleString()}</td>
                  <td className="py-3.5 pl-4 whitespace-nowrap text-slate-500">{row.entryBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {rows.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6 border-t border-slate-100 pt-5">
          <div className="text-xs font-bold text-slate-400">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-colors"
              disabled={page <= 1} 
              onClick={() => onPageChange?.(page - 1)}
            >
              Prev
            </button>
            <button 
              className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-colors"
              disabled={page >= totalPages} 
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </button>
            <select 
              className="text-xs font-bold border border-slate-200 rounded-lg bg-white px-2 py-1.5 text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              value={limit} 
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryTable;
