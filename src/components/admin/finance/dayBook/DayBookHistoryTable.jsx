import React from 'react';
import { formatMoney, formatDurationMs } from '../shared/formatMoney.js';

export default function DayBookHistoryTable({ rows }) {
  if (!rows?.length) {
    return <div className="finance-empty">No daybook history yet.</div>;
  }

  return (
    <table className="finance-data-table">
      <thead>
        <tr>
          <th>SN</th>
          <th>Details</th>
          <th>Closed By</th>
          <th>Closed On</th>
          <th>Sales</th>
          <th>Duration</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const d = row.day ? new Date(row.day) : null;
          const title = d
            ? `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}'s Day Report`
            : 'Day Report';
          const closedOn = row.closedAt
            ? `${new Date(row.closedAt).toLocaleDateString('en-CA')} | ${new Date(row.closedAt).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              })}`
            : '—';
          const by = row.closedBy?.name || row.closedBy?.email || '—';
          return (
            <tr key={row._id || i}>
              <td>{i + 1}</td>
              <td>{title}</td>
              <td style={{ color: '#2563eb' }}>{by}</td>
              <td>{closedOn}</td>
              <td>{formatMoney(row.salesAmount)}</td>
              <td>{formatDurationMs(row.durationMs)}</td>
              <td>{row.remarks || '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
