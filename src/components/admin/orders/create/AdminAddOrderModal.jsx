import React, { useState, useMemo } from 'react';
import { Search, X, Users, User, LayoutGrid } from 'lucide-react';

const AdminAddOrderModal = ({ 
  open, 
  onClose, 
  type = 'dine_in',
  initialTab = 'table', 
  tables = [], 
  customers = [], 
  staff = [],
  onSelect 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState('');

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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
    <div className="additem-overlay">
      <div className="additem-card" style={{ maxWidth: '1000px', height: '80vh' }}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top rounded-top-4">
          <div>
            <h4 className="fw-800 m-0 text-dark" style={{ letterSpacing: '-0.02em' }}>
              Add {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h4>
            <div className="text-muted small fw-500">Select {activeTab === 'table' ? 'a table' : activeTab === 'customer' ? 'a customer' : 'staff member'} to proceed</div>
          </div>
          <button className="btn-close-custom bg-light border-0 rounded-circle p-2 px-3" onClick={onClose}><X size={20} /></button>
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
                  className={`btn btn-sm px-4 py-2 d-flex align-items-center gap-2 fw-700 rounded-2 transition-all ${
                    activeTab === tab.id 
                      ? 'text-white border-0 shadow-sm' 
                      : 'btn-ghost text-muted border-0'
                  }`}
                  style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #FFB87A 0%, #FC8019 100%)' } : {}}
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
                      <div className="min-width-0">
                        <div className="fw-800 text-dark text-truncate" style={{ fontSize: '0.9rem' }}>{item.name || (activeTab === 'table' ? `Table ${item.tableNumber}` : 'Unnamed')}</div>
                        {activeTab !== 'table' && <div className="text-muted small fw-500 text-truncate">{item.phone || item.email || item.role}</div>}
                      </div>
                      {activeTab === 'table' && (
                        <span className={`badge rounded-pill px-3 py-1 fw-700 text-uppercase`} style={{ 
                          fontSize: '0.65rem',
                          backgroundColor: item.status === 'occupied' ? '#fee2e2' : '#f0fdf4',
                          color: item.status === 'occupied' ? '#fc8019' : '#10b981'
                        }}>
                          {item.status === 'occupied' ? 'Busy' : 'Free'}
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
