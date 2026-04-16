import React, { useState, useMemo } from 'react';
import { Search, X, Users, User, LayoutGrid } from 'lucide-react';

const AdminAddOrderModal = ({ 
  open, 
  onClose, 
  tables = [], 
  customers = [], 
  staff = [],
  onSelect 
}) => {
  const [activeTab, setActiveTab] = useState('table');
  const [search, setSearch] = useState('');

  if (!open) return null;

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    if (activeTab === 'table') {
      return tables.filter(t => 
        (t.name || `Table ${t.tableNumber}`).toLowerCase().includes(q)
      );
    } else if (activeTab === 'customer') {
      return customers.filter(c => 
        (c.name || '').toLowerCase().includes(q) || 
        (c.phone || '').includes(q)
      );
    } else {
      return staff.filter(s => 
        (s.name || '').toLowerCase().includes(q) || 
        (s.email || '').toLowerCase().includes(q)
      );
    }
  }, [activeTab, search, tables, customers, staff]);

  const handleSelect = (item) => {
    onSelect({
      type: activeTab,
      id: item._id || item.id,
      name: item.name || (activeTab === 'table' ? `Table ${item.tableNumber}` : 'Unnamed'),
      data: item
    });
  };

  return (
    <div className="additem-overlay" style={{ zIndex: 1100 }}>
      <div className="additem-card" style={{ maxWidth: '1000px', height: '80vh' }}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top rounded-top-4">
          <h4 className="fw-bold m-0">Add Order</h4>
          <button className="btn-close-custom" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="p-4 bg-light flex-grow-1 overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
            <div className="d-flex p-1 bg-white rounded-3 shadow-sm" style={{ border: '1px solid #eee' }}>
              {[
                { id: 'table', label: 'Table', icon: <LayoutGrid size={16} /> },
                { id: 'customer', label: 'Customer', icon: <Users size={16} /> },
                { id: 'staff', label: 'Staff', icon: <User size={16} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-sm px-4 py-2 d-flex align-items-center gap-2 fw-semibold rounded-2 transition-all ${
                    activeTab === tab.id ? 'btn-primary shadow-sm' : 'btn-ghost text-muted'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="position-relative" style={{ minWidth: '300px' }}>
              <Search className="position-absolute text-muted" size={18} style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control ps-5 py-2 rounded-3 border-0 shadow-sm"
                placeholder={`Search ${activeTab}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <h6 className="fw-bold text-muted small text-uppercase mb-3">Uncategorized</h6>
            <div className="row g-3">
              {filteredItems.map(item => (
                <div key={item._id || item.id} className="col-md-4 col-lg-3">
                  <div 
                    className="card border-0 shadow-sm h-100 cursor-pointer hover-scale transition-all rounded-3"
                    onClick={() => handleSelect(item)}
                    style={{ border: '1px solid transparent' }}
                  >
                    <div className="card-body p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold text-dark">{item.name || (activeTab === 'table' ? `Table ${item.tableNumber}` : 'Unnamed')}</div>
                        {activeTab !== 'table' && <div className="text-muted small">{item.phone || item.email || item.role}</div>}
                      </div>
                      {activeTab === 'table' && (
                        <span className={`badge rounded-pill px-3 py-1 fw-medium ${item.status === 'occupied' ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success'}`}>
                          {item.status === 'occupied' ? 'Occupied' : 'Open'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-12 text-center py-5">
                  <div className="text-muted mb-2">No {activeTab}s found matching "{search}"</div>
                  <button className="btn btn-link btn-sm" onClick={() => setSearch('')}>Clear search</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddOrderModal;
