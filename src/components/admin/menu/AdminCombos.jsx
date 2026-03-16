import React, { useState } from 'react';

const AdminCombos = ({ combos, onRefresh }) => {
  const [search, setSearch] = useState('');
  const filtered = combos.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">Combo Offers</h5>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Search combo" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-outline-light btn-sm" onClick={onRefresh}>Refresh</button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="soft-card text-center py-5">
          <div className="fw-semibold">No Combo Offer found</div>
          <div className="text-muted small">Create a new Combo Offer.</div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>#</th><th>Name</th><th>Price</th><th>Category</th><th>Sub Menu</th><th>Active</th></tr></thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr key={c._id}>
                  <td>{idx + 1}</td>
                  <td>{c.name}</td>
                  <td className="text-success">Rs {c.priceOffer || c.priceActual}</td>
                  <td>{c.category?.name || '-'}</td>
                  <td>{c.subMenu?.name || '-'}</td>
                  <td>{c.active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCombos;
