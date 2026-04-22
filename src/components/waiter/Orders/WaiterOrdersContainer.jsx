import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import WaiterOrders from './WaiterOrders.jsx';

const WaiterOrdersContainer = ({ orders, onEdit, onBill, onCheckout }) => {
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Close more menu when clicking outside
  React.useEffect(() => {
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

    // Status / Type Filtering
    if (activeTab === 'recent') {
      // Recent active orders: Exclude paid/cancelled
      filtered = filtered.filter(o => o.status !== 'paid' && o.status !== 'cancelled');
    } else if (activeTab === 'dine_in') {
      filtered = filtered.filter(o => o.orderType === 'dine_in');
    } else if (activeTab === 'delivery') {
      filtered = filtered.filter(o => o.orderType === 'delivery');
    } else if (activeTab === 'takeaway') {
      filtered = filtered.filter(o => o.orderType === 'takeaway');
    } else if (activeTab === 'pickup') {
      filtered = filtered.filter(o => o.orderType === 'pickup');
    } else if (activeTab === 'paid') {
      filtered = filtered.filter(o => o.status === 'paid');
    } else if (activeTab === 'cancelled') {
      filtered = filtered.filter(o => o.status === 'cancelled');
    }

    // Search Filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => {
        const items = o.items || [];
        const matchDish = items.some(i => (i.menuItem?.name || '').toLowerCase().includes(q) || (i.name || '').toLowerCase().includes(q));
        const matchTime = new Date(o.createdAt).toLocaleTimeString().toLowerCase().includes(q);
        const matchWaiter = (o.createdBy?.name || '').toLowerCase().includes(q);
        const matchCustomer = (o.customerName || '').toLowerCase().includes(q);
        const matchPrice = (o.finalAmount || o.totalAmount || 0).toString().includes(q);
        
        return matchDish || matchTime || matchWaiter || matchCustomer || matchPrice;
      });
    }

    return filtered;
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="waiter-orders-container d-flex flex-column h-100 gap-3">
      {/* Top Controller */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 p-3 bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
        
        {/* Tabs */}
        <div className="d-flex align-items-center gap-2 overflow-auto hide-scrollbar" style={{ flexWrap: 'nowrap' }}>
          {['recent', 'dine_in', 'delivery', 'takeaway', 'pickup'].map(tab => (
            <button
              key={tab}
              className={`btn btn-sm px-3 py-2 fw-bold text-nowrap rounded-pill ${activeTab === tab ? 'bg-primary text-white' : 'btn-light text-muted border border-light bg-light'}`}
              onClick={() => setActiveTab(tab)}
              style={{ transition: 'all 0.2s ease', borderColor: '#e2e8f0' }}
            >
              {tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
              {tab === 'recent' && <span className="ms-1 badge bg-white text-primary rounded-1 shadow-sm">{orders.filter(o => o.status !== 'paid' && o.status !== 'cancelled').length}</span>}
            </button>
          ))}
          
          <div className="more-options-dropdown position-relative ms-2">
             <button 
                className={`btn btn-sm px-3 py-2 fw-bold text-nowrap rounded-pill d-flex align-items-center gap-1 ${['paid', 'cancelled'].includes(activeTab) ? 'bg-dark text-white' : 'btn-light text-muted bg-white border border-light'}`}
                onClick={(e) => { e.stopPropagation(); setShowMoreMenu(!showMoreMenu); }}
                style={{ borderColor: '#e2e8f0' }}
             >
               {['paid', 'cancelled'].includes(activeTab) ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'More Options'} <ChevronDown size={14} />
             </button>
             {showMoreMenu && (
               <div className="position-absolute bg-white rounded-3 shadow-lg p-2 top-100 start-0 mt-2" style={{ zIndex: 100, minWidth: '160px', border: '1px solid #e2e8f0' }}>
                  <button className="btn btn-sm text-start w-100 fw-bold border-0 bg-transparent text-success py-2 px-3 hover-bg-light rounded-2" onClick={() => { setActiveTab('paid'); setShowMoreMenu(false); }}>Paid Orders</button>
                  <button className="btn btn-sm text-start w-100 fw-bold border-0 bg-transparent text-danger py-2 px-3 hover-bg-light rounded-2" onClick={() => { setActiveTab('cancelled'); setShowMoreMenu(false); }}>Cancelled Orders</button>
               </div>
             )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="position-relative" style={{ width: '100%', maxWidth: '300px' }}>
          <Search className="position-absolute text-muted" size={16} style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control form-control-sm ps-5 py-2 pe-3 rounded-pill bg-light border-0 shadow-none"
            placeholder="Search dish, user, time..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      </div>

      {/* Orders Grid output */}
      <WaiterOrders 
        orders={filteredOrders} 
        onEdit={onEdit} 
        onBill={onBill} 
        onCheckout={onCheckout} 
      />
    </div>
  );
};

export default WaiterOrdersContainer;
