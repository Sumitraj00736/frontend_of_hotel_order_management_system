import React from 'react';

const BillingSubscription = ({ data }) => {
  const plan = data?.plan || {};
  const usage = data?.usage || {};
  const history = data?.history || [];

  const tiles = [
    { key: 'members', label: 'Members', color: '#f97316' },
    { key: 'tables', label: 'Tables', color: '#8b5cf6' },
    { key: 'customers', label: 'Customers', color: '#fc8019' },
    { key: 'dishes', label: 'Dishes', color: '#2563eb' },
    { key: 'addOns', label: 'Add-ons', color: '#f59e0b' },
    { key: 'spaces', label: 'Spaces', color: '#0ea5e9' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-title">Billing & Subscription</div>
      <div className="settings-card">
        <div className="billing-card">
          <div>
            <div className="pill">merorestro Free</div>
            <div className="billing-plan">{plan.name || 'Free Plan'}</div>
            <div className="billing-meta">Active Since {plan.activeSince ? new Date(plan.activeSince).toLocaleDateString() : '-'}</div>
          </div>
          <button className="btn btn-primary">Upgrade Plan</button>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Usage Details</div>
        <div className="usage-grid">
          {tiles.map((tile) => {
            const item = usage[tile.key] || { used: 0, limit: 0 };
            return (
              <div key={tile.key} className="usage-tile">
                <div className="usage-label">{tile.label}</div>
                <div className="usage-value">{item.used}/{item.limit}</div>
                <div className="usage-bar">
                  <span style={{ width: item.limit ? `${Math.min((item.used / item.limit) * 100, 100)}%` : '0%', background: tile.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Previous Subscription Details</div>
        <table className="settings-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Plan</th>
              <th>Purchase Date</th>
              <th>Expiry Date</th>
              <th>Documents</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">No history found</td>
              </tr>
            ) : (
              history.map((row, idx) => (
                <tr key={row._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{row.planName}</td>
                  <td>{row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : '-'}</td>
                  <td>{row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : '-'}</td>
                  <td>{row.documents || '-'}</td>
                  <td>{row.remarks || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingSubscription;
