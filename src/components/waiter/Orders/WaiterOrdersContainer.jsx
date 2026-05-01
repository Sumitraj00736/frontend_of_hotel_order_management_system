import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, Filter, X } from 'lucide-react';
import WaiterOrders from './WaiterOrders.jsx';
import './WaiterOrdersContainer.css';

const WaiterOrdersContainer = ({ orders = [], onEdit, onBill, onCheckout }) => {
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.more-options-dropdown')) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    const filterMap = {
      recent: o => o.status !== 'paid' && o.status !== 'cancelled',
      dine_in: o => o.orderType === 'dine_in',
      delivery: o => o.orderType === 'delivery',
      takeaway: o => o.orderType === 'takeaway',
      pickup: o => o.orderType === 'pickup',
      paid: o => o.status === 'paid',
      cancelled: o => o.status === 'cancelled',
    };

    if (filterMap[activeTab]) {
      filtered = filtered.filter(filterMap[activeTab]);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => {
        const matchDish = (o.items || []).some(i => (i.name || '').toLowerCase().includes(q));
        const matchCustomer = (o.customerName || '').toLowerCase().includes(q);
        const matchTable = (o.tableNo || '').toString().includes(q);
        return matchDish || matchCustomer || matchTable;
      });
    }

    return filtered;
  }, [orders, activeTab, searchQuery]);

  const activeCount = orders.filter(o => o.status !== 'paid' && o.status !== 'cancelled').length;

  return (
    <div className="waiter-dashboard-wrapper">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-main">
          <div className="tab-scroll-container">
            {['recent', 'dine_in', 'delivery', 'takeaway', 'pickup'].map(tab => (
              <button
                key={tab}
                className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace('_', ' ')}
                {tab === 'recent' && <span className="tab-badge">{activeCount}</span>}
              </button>
            ))}

            <div className="more-options-dropdown">
              <button 
                className={`tab-pill more-btn ${['paid', 'cancelled'].includes(activeTab) ? 'active-special' : ''}`}
                onClick={(e) => { e.stopPropagation(); setShowMoreMenu(!showMoreMenu); }}
              >
                <Filter size={16} />
                <span className="d-none d-sm-inline">
                   {['paid', 'cancelled'].includes(activeTab) ? activeTab : 'History'}
                </span>
                <ChevronDown size={14} className={showMoreMenu ? 'rotate' : ''} />
              </button>

              {showMoreMenu && (
                <div className="dropdown-menu-custom">
                  <div className="dropdown-item text-success" onClick={() => { setActiveTab('paid'); setShowMoreMenu(false); }}>
                    Paid Orders
                  </div>
                  <div className="dropdown-item text-danger" onClick={() => { setActiveTab('cancelled'); setShowMoreMenu(false); }}>
                    Cancelled Orders
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search table, dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <X className="clear-search" size={16} onClick={() => setSearchQuery('')} />}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="orders-content-area">
        {filteredOrders.length > 0 ? (
          <WaiterOrders 
            orders={filteredOrders} 
            onEdit={onEdit} 
            onBill={onBill} 
            onCheckout={onCheckout} 
          />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h4>No orders found</h4>
            <p className="text-muted">Try changing your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterOrdersContainer;