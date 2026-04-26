import React, { useState } from 'react';

const ActivityLog = ({ logs, filters, onFilterChange, onPageChange, onLimitChange }) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const data = logs?.data || [];
  const total = logs?.total || 0;
  const page = logs?.page || 1;
  const limit = logs?.limit || 50;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const formatMeta = (item) => {
    const parts = [];
    if (item.action) parts.push(`Action: ${item.action}`);
    if (item.entityType || item.entityId) parts.push(`Entity: ${item.entityType || 'record'}${item.entityId ? ` (${item.entityId})` : ''}`);
    if (item.requestId) parts.push(`Request: ${item.requestId}`);
    if (item.metadata?.amount !== undefined) parts.push(`Amount: Rs ${Number(item.metadata.amount || 0).toLocaleString()}`);
    if (item.metadata?.role) parts.push(`Role: ${item.metadata.role}`);
    if (item.metadata?.status) parts.push(`Status: ${item.metadata.status}`);
    if (item.metadata?.paymentMethod) parts.push(`Method: ${item.metadata.paymentMethod}`);
    if (item.metadata?.deviceId) parts.push(`Device: ${item.metadata.deviceId}`);
    if (item.metadata?.matchedCount !== undefined || item.metadata?.modifiedCount !== undefined) {
      parts.push(`Subscriptions: ${item.metadata?.modifiedCount ?? 0} updated${item.metadata?.matchedCount !== undefined ? ` of ${item.metadata.matchedCount}` : ''}`);
    }
    if (item.metadata?.successCount !== undefined || item.metadata?.failureCount !== undefined) {
      parts.push(`Push: ${item.metadata?.successCount || 0} success / ${item.metadata?.failureCount || 0} failed`);
    }
    if (Array.isArray(item.metadata?.failureCodes) && item.metadata.failureCodes.length) {
      parts.push(`Errors: ${item.metadata.failureCodes.join(', ')}`);
    }
    return parts.length ? parts.join(' • ') : '-';
  };

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
            <option value="Finance Payment">Finance Payment</option>
            <option value="Push Subscription">Push Subscription</option>
            <option value="Push Notification">Push Notification</option>
            <option value="Staff Profile">Staff Profile</option>
            <option value="Staff Status">Staff Status</option>
            <option value="Staff Role">Staff Role</option>
          </select>
          <select className="field-input" value={filters.action} onChange={(e) => onFilterChange?.({ action: e.target.value })}>
            <option value="">Action: All</option>
            <option value="payment.create">payment.create</option>
            <option value="payment.update">payment.update</option>
            <option value="payment.void">payment.void</option>
            <option value="user.create">user.create</option>
            <option value="user.update">user.update</option>
            <option value="user.status.update">user.status.update</option>
            <option value="user.role.update">user.role.update</option>
            <option value="user.delete">user.delete</option>
            <option value="push.subscribe">push.subscribe</option>
            <option value="push.unsubscribe">push.unsubscribe</option>
            <option value="push.toggle">push.toggle</option>
            <option value="push.test">push.test</option>
          </select>
          <select className="field-input" value={filters.entityType} onChange={(e) => onFilterChange?.({ entityType: e.target.value })}>
            <option value="">Entity: All</option>
            <option value="payment">payment</option>
            <option value="user">user</option>
            <option value="push-subscription">push-subscription</option>
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
              <th>Details</th>
              <th>Performed By</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">
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
                  <td className="text-muted" style={{ maxWidth: 340, whiteSpace: 'normal' }}>{formatMeta(item)}</td>
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
