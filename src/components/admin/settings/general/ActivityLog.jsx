import React, { useState } from 'react';

const ActivityLog = ({ logs, filters, onFilterChange, onPageChange, onLimitChange }) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const data = logs?.data || [];
  const total = logs?.total || 0;
  const page = logs?.page || 1;
  const limit = logs?.limit || 50;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div className="settings-page">
      <div className="settings-title">Activity Log</div>
      <div className="settings-toolbar">
        <button className="btn btn-ghost" onClick={() => setFilterOpen((v) => !v)}>Filter</button>
      </div>

      {filterOpen && (
        <div className="filter-bar">
          <input
            className="field-input"
            placeholder="Search"
            value={filters.search}
            onChange={(e) => onFilterChange?.({ search: e.target.value })}
          />
          <input
            className="field-input"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange?.({ dateFrom: e.target.value })}
          />
          <input
            className="field-input"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange?.({ dateTo: e.target.value })}
          />
          <select className="field-input" value={filters.type} onChange={(e) => onFilterChange?.({ type: e.target.value })}>
            <option value="">Type: All</option>
            <option value="Order Created">Order Created</option>
            <option value="Order Updated">Order Updated</option>
            <option value="Order KOT Status Updated">Order KOT Status Updated</option>
            <option value="Order Checkout">Order Checkout</option>
            <option value="Staffs Invited">Staffs Invited</option>
            <option value="Restaurant Created">Restaurant Created</option>
          </select>
        </div>
      )}

      <div className="settings-card">
        <table className="settings-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Date</th>
              <th>Title</th>
              <th>Type</th>
              <th>Description</th>
              <th>Performed By</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No activity found
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item._id || idx}>
                  <td>{(page - 1) * limit + idx + 1}</td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td className="text-muted">{item.description}</td>
                  <td>{item.performedBy?.name || item.performedBy?.email || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-bar">
        <button className="btn btn-ghost" onClick={() => onPageChange?.(Math.max(page - 1, 1))} disabled={page <= 1}>Prev</button>
        <span className="page-status">Page {page} of {totalPages}</span>
        <button className="btn btn-ghost" onClick={() => onPageChange?.(Math.min(page + 1, totalPages))} disabled={page >= totalPages}>Next</button>
        <select className="field-input page-size" value={limit} onChange={(e) => onLimitChange?.(Number(e.target.value))}>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default ActivityLog;
