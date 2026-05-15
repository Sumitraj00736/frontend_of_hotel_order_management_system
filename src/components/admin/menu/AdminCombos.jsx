import React, { useState, useMemo } from 'react';

const AdminCombos = ({ combos = [], onRefresh }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return combos.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [combos, search]);

  return (
    <div className="container-fluid py-4">
      {/* Glass-morphism Effect Header */}
      <div className="card border-0 shadow-lg mb-4 overflow-hidden" style={{ borderRadius: '15px' }}>
        <div className="card-body p-4 bg-white">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-6">
              <h4 className="fw-bold mb-1 text-dark">Combo Collections</h4>
              <p className="text-muted small mb-0">Manage and monitor your promotional bundles</p>
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex gap-2">
                <div className="position-relative flex-grow-1">
                  <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light rounded-pill ps-4"
                    placeholder="Search by name..."
                    style={{ fontSize: '0.9rem' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button 
                  className="btn btn-light rounded-4px px-4 shadow-sm fw-medium"
                  onClick={onRefresh}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filtered.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5 rounded-4">
          <div className="py-4">
            <div className="mb-3 display-1 text-light">📦</div>
            <h5 className="text-secondary">No Combos Found</h5>
            <button className="btn btn-link text-decoration-none" onClick={() => setSearch('')}>Clear search</button>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted text-uppercase small" style={{ letterSpacing: '1px' }}>
                  <th className="ps-4 py-3">#</th>
                  <th className="py-3">Combo Item</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr key={c._id || idx} className="border-bottom">
                    <td className="ps-4 text-muted small">{idx + 1}</td>
                    <td>
                      <div className="fw-bold text-dark">{c.name}</div>
                      <div className="text-muted small">{c.subMenu?.name || 'Standard Menu'}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border fw-normal px-3 py-2">
                        {c.category?.name || 'General'}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-primary">
                        Rs {c.priceOffer || c.priceActual}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small fw-medium ${
                        c.active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
                      }`}>
                        <span className={`rounded-circle ${c.active ? 'bg-success' : 'bg-danger'}`} style={{ width: '6px', height: '6px' }}></span>
                        {c.active ? 'Active' : 'Hidden'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCombos;