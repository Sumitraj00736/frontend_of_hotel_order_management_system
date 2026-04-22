import React, { useRef, useState, useEffect } from 'react';
import { UtensilsCrossed, Bike, ShoppingBag, ShoppingCart, ChevronDown } from 'lucide-react';

const OrdersHeader = ({ title, countLabel, onNewOrder, onAddTable }) => {
  const [rippling, setRippling] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTable = (e) => {
    // Calculate ripple origin from click position inside button
    const rect = btnRef.current.getBoundingClientRect();
    setRipplePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setRippling(true);
    // After ripple plays, trigger the parent animated navigation
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
    <div className="orders-header-container d-flex justify-content-between align-items-center p-3 mb-0 bg-white border-bottom position-relative">
      <div className="d-flex gap-3 align-items-center">
        <h4 className="fw-800 m-0 text-dark" style={{ letterSpacing: '-0.02em' }}>{title}</h4>
        <div className="orders-count-pill">
          {countLabel}
        </div>
      </div>
      <div className="d-flex gap-2">
        <div className="position-relative" ref={dropdownRef}>
          <button 
            className={`btn border fw-600 rounded-3 shadow-sm px-3 d-flex align-items-center gap-2 ${showDropdown ? 'btn-danger text-white border-danger' : 'btn-light'}`}
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ transition: 'all 0.2s ease' }}
          >
            + Add New Order <span className="badge bg-light text-dark rounded-1 p-1 px-2 d-none d-sm-inline ms-1">N</span> <ChevronDown size={16} />
          </button>
          
          {showDropdown && (
            <div className="position-absolute bg-white rounded-4 shadow-lg p-3" style={{ top: 'calc(100% + 8px)', right: 0, width: 'max-content', zIndex: 1050, minWidth: '400px', border: '1px solid #eaeaea' }}>
              <h5 className="fw-bold mb-3 text-dark px-1">Add New Order</h5>
              <div className="row g-2">
                {orderTypes.map(type => (
                  <div className="col-6" key={type.id}>
                    <button
                      className="btn btn-light w-100 d-flex align-items-center gap-2 py-3 px-3 text-start border-0 fw-600 rounded-3"
                      style={{ backgroundColor: '#f8f9fc', color: '#1e293b', transition: 'all 0.15s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fc'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      onClick={() => {
                        setShowDropdown(false);
                        onNewOrder?.(type.id);
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center bg-white rounded-3 shadow-sm" style={{ width: '36px', height: '36px', minWidth: '36px' }}>
                        {type.icon}
                      </div>
                      <span className="ms-1">{type.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          ref={btnRef}
          className="btn btn-primary fw-600 rounded-3 shadow-sm px-3 orders-add-table-btn"
          onClick={handleAddTable}
          style={{ position: 'relative', overflow: 'hidden', transition: 'transform 0.15s ease' }}
        >
          {rippling && (
            <span
              className="orders-table-ripple"
              style={{ left: ripplePos.x, top: ripplePos.y }}
            />
          )}
          + Add Table
        </button>
      </div>
    </div>
  );
};

export default OrdersHeader;
