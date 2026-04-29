import React, { useRef, useState, useEffect } from 'react';
import { UtensilsCrossed, Bike, ShoppingBag, ShoppingCart, ChevronDown, MoreVertical, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersHeader = ({ title, countLabel, onNewOrder, onAddTable, onFilterChange, searchTerm, onSearchChange }) => {
  const [rippling, setRippling] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const btnRef = useRef(null);
  const dropdownRef = useRef(null);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTable = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    setRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setRippling(true);

    setTimeout(() => {
      setRippling(false);
      onAddTable?.();
    }, 320);
  };

  const orderTypes = [
    { id: 'dine_in', label: 'Dine In order', icon: <UtensilsCrossed size={18} /> },
    { id: 'delivery', label: 'Delivery order', icon: <Bike size={18} /> },
    { id: 'takeaway', label: 'Take away', icon: <ShoppingBag size={18} /> },
    { id: 'pickup', label: 'Pick up', icon: <ShoppingCart size={18} /> }
  ];

  return (
    <div className="orders-header-wrap mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3 sm-flex-column sm-gap-2">
        <div>
          <h4 className="fw-900 m-0 text-dark" style={{ letterSpacing: '-0.03em', fontSize: '1.6rem' }}>
            Orders Management
          </h4>
          <div className="text-muted small fw-600 mt-1">
            Real-time order tracking & administration
          </div>
        </div>

        <div className="d-flex gap-2 align-items-center flex-wrap">
          {/* SEARCH */}
          <AnimatePresence>
            {isSearching ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '70vw', maxWidth: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="position-relative"
              >
                <Search size={16} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  autoFocus
                  type="text"
                  className="form-control form-control-sm ps-5 border-0 bg-light rounded-pill fw-600"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  style={{ height: '38px', fontSize: '13px' }}
                />
                <button
                  className="btn btn-link position-absolute p-0 text-muted"
                  style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  onClick={() => { setIsSearching(false); onSearchChange(''); }}
                >
                  <X size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="btn btn-light border p-2 rounded-3 d-flex align-items-center justify-content-center"
                onClick={() => setIsSearching(true)}
              >
                <Search size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* CREATE ORDER */}
          <div className="position-relative" ref={dropdownRef}>
            <button
              className={`btn border fw-700 rounded-3 shadow-sm px-3 d-flex align-items-center gap-2 ${showDropdown ? 'text-white' : 'btn-light'}`}
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                backgroundColor: showDropdown ? '#FC8019' : '#fff',
                borderColor: showDropdown ? '#FC8019' : '#e2e8f0',
                fontSize: '0.85rem'
              }}
            >
              Create Order
              <ChevronDown size={14} />
            </button>

            {showDropdown && (
              <div
                className="position-absolute bg-white rounded-4 shadow-lg p-3"
                style={{
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '90vw',
                  maxWidth: '400px',
                  zIndex: 1050,
                  border: '1px solid #eaeaea'
                }}
              >
                <h5
  className="fw-bold mb-3 text-dark px-1 text-center"
  style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}
>
  Select Order Mode
</h5>

                <div className="row g-2">
                  {orderTypes.map(type => (
                    <div className="col-12 col-sm-6" key={type.id}>
                      <button
                        className="btn btn-light w-100 d-flex align-items-center gap-2 py-2 py-sm-3 px-2 px-sm-3 text-start border-0 fw-600 rounded-3"
                        style={{ backgroundColor: '#f8f9fc', transition: 'all 0.15s ease' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fc';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onClick={() => {
                          setShowDropdown(false);
                          onNewOrder?.(type.id);
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center bg-white rounded-3 shadow-sm"
                          style={{ width: '36px', height: '36px', minWidth: '36px' }}>
                          {type.icon}
                        </div>
                        <span>{type.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ADD TABLE */}
          <button
            ref={btnRef}
            className="btn fw-700 rounded-3 shadow-sm px-3"
            onClick={handleAddTable}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #FFB87A 0%, #FC8019 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          >
            {rippling && (
              <span
                className="orders-table-ripple"
                style={{ left: ripplePos.x, top: ripplePos.y }}
              />
            )}
            + Add Table
          </button>

          {/* MORE MENU */}
          <div className="position-relative" ref={moreMenuRef}>
            <button
              className="btn btn-light border p-2 rounded-3"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <MoreVertical size={20} />
            </button>

            {showMoreMenu && (
              <div
                className="position-absolute bg-white rounded-3 shadow-lg py-2"
                style={{
                  top: 'calc(100% + 8px)',
                  right: 0,
                  zIndex: 1050,
                  minWidth: '180px',
                  border: '1px solid #eaeaea'
                }}
              >
                <div className="px-3 py-2 fw-bold text-muted small border-bottom mb-1">
                  View Records
                </div>

                <button className="dropdown-item px-3 py-2"
                  onClick={() => { onFilterChange?.('paid'); setShowMoreMenu(false); }}>
                  💰 Paid Orders
                </button>

                <button className="dropdown-item px-3 py-2"
                  onClick={() => { onFilterChange?.('cancelled'); setShowMoreMenu(false); }}>
                  🚫 Cancelled Orders
                </button>

                <button className="dropdown-item px-3 py-2"
                  onClick={() => { onFilterChange?.('all'); setShowMoreMenu(false); }}>
                  📑 All Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="d-flex gap-4 border-top pt-3 mt-2 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 8, height: 8, background: '#FC8019', borderRadius: '50%' }} />
          <span className="small fw-700">{countLabel || '0 Orders'} Total</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }} />
          <span className="small fw-700">Active Sessions</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%' }} />
          <span className="small fw-700">Kitchen Queue</span>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;