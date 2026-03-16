import React, { useState } from 'react';

const AdminPromotionTimeline = ({ user, promotions = [], onAdd }) => {
  const [form, setForm] = useState({ title: '', amount: '', effectiveDate: '', note: '' });

  return (
    <div className="card glass-card">
      <h5 className="mb-3">Promotion Timeline</h5>
      <div className="row g-2 mb-3">
        <div className="col-6">
          <input className="form-control" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="col-6">
          <input className="form-control" placeholder="Hike Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div className="col-6">
          <input className="form-control" type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} />
        </div>
        <div className="col-6">
          <input className="form-control" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        <div className="col-12">
          <button
            className="btn btn-primary w-100"
            onClick={() => {
              if (!form.title || !form.effectiveDate) return;
              onAdd(user._id, form);
              setForm({ title: '', amount: '', effectiveDate: '', note: '' });
            }}
          >
            Add Promotion
          </button>
        </div>
      </div>

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
};

export default AdminPromotionTimeline;
