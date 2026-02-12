import React from 'react';

const WaiterPromotionTimeline = ({ promotions = [] }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Promotion Timeline</h5>
    {promotions.length === 0 && <div className="text-muted">No promotions yet.</div>}
    <ul className="list-group">
      {promotions.map((promo, index) => (
        <li key={index} className="list-group-item">
          <div className="fw-semibold">{promo.title}</div>
          <div className="small text-muted">Effective: {new Date(promo.effectiveDate).toLocaleDateString()}</div>
          {promo.amount !== undefined && <div className="small text-muted">Hike: NPR {promo.amount}</div>}
          {promo.note && <div className="small text-muted">Note: {promo.note}</div>}
        </li>
      ))}
    </ul>
  </div>
);

export default WaiterPromotionTimeline;
