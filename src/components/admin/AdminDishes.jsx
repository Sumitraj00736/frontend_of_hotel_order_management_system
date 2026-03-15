import React, { useMemo, useState } from 'react';

const AdminDishes = ({ dishes, categories, submenus, onToggle, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [showInsight, setShowInsight] = useState(false);

  const filtered = useMemo(
    () =>
      dishes.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
    [dishes, search]
  );

  const catMap = useMemo(() => new Map(categories.map((c) => [c._id, c.name])), [categories]);
  const subMap = useMemo(() => new Map(submenus.map((s) => [s._id, s.name])), [submenus]);

  const total = dishes.length;
  const active = dishes.filter((d) => d.isAvailable).length;
  const typeCounts = dishes.reduce((acc, d) => {
    const key = d.type || 'Uncategorized';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0] || ['Uncategorized', 0];

  return (
    <div className="card glass-card full-screen-card">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">Dishes</h5>
        <div className="d-flex gap-2">
          <input className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-outline-light" onClick={onRefresh}>Refresh</button>
          <button className="btn btn-primary">+ Add New</button>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="stat-card" style={{ minWidth: 160 }}>
          <div className="d-flex align-items-center gap-2">
            <span role="img" aria-label="total">📊</span>
            <div className="text-muted tiny-text">Total</div>
          </div>
          <div className="fs-4 fw-semibold">{total}/1000</div>
          <div className="text-success tiny-text">{active} Active</div>
        </div>
        <div className="stat-card" style={{ minWidth: 200, position: 'relative' }}>
          <div className="d-flex align-items-center gap-2">
            <span role="img" aria-label="top-type">🍽️</span>
            <div className="text-muted tiny-text">Top Dish Type</div>
          </div>
          <div className="fs-5 fw-semibold">{topType[0]}</div>
          <button className="btn btn-outline-light btn-sm" style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setShowInsight((s) => !s)}>
            i
          </button>
          {showInsight && (
            <div className="soft-card" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 5, width: 280 }}>
              <div className="fw-semibold mb-1">Top dish type on your restaurant</div>
              <div className="tiny-text text-muted mb-2">Detailed insights</div>
              {Object.entries(typeCounts).map(([label, count]) => (
                <div key={label} className="d-flex justify-content-between mb-1">
                  <span>{label}</span>
                  <span>{count}</span>
                </div>
              ))}
              <div className="tiny-text text-muted mt-2">
                Your restaurant's food distribution shows {topType[0]} leading with {topType[1]} item(s) in the menu.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>SN</th>
              <th>Dish Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Type</th>
              <th>Sub Menu</th>
              <th>Preparation Time</th>
              <th>KOT Type</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, idx) => (
              <tr key={d._id}>
                <td>{idx + 1}</td>
                <td className="fw-semibold">{d.name}</td>
                <td className="text-success">Rs {d.price}{d.maxPrice ? ` - Rs ${d.maxPrice}` : ''}</td>
                <td>{catMap.get(d.category) || '-'}</td>
                <td>{d.type || '-'}</td>
                <td>{subMap.get(d.subMenu) || '-'}</td>
                <td>{d.preparationTimeMinutes ? `${d.preparationTimeMinutes} min` : '-'}</td>
                <td>{d.kotType || '-'}</td>
                <td>
                  <input type="checkbox" checked={!!d.isAvailable} onChange={() => onToggle(d)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDishes;
