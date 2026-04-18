import React, { useRef, useState } from 'react';

const OrdersHeader = ({ title, countLabel, onNewOrder, onAddTable }) => {
  const [rippling, setRippling] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

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

  return (
    <div className="orders-header-container d-flex justify-content-between align-items-center p-3 mb-0 bg-white border-bottom">
      <div className="d-flex gap-3 align-items-center">
        <h4 className="fw-800 m-0 text-dark" style={{ letterSpacing: '-0.02em' }}>{title}</h4>
        <div className="orders-count-pill">
          {countLabel}
        </div>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-light border fw-600 rounded-3 shadow-sm px-3" onClick={onNewOrder}>
          + New Order
        </button>
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
