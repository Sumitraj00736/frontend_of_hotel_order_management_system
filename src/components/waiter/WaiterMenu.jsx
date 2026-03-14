import React from 'react';

const WaiterMenu = ({ search, onSearch, menuItems, onAdd }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Menu</h5>
    <input
      className="form-control mb-3"
      placeholder="Search menu"
      value={search}
      onChange={(e) => onSearch(e.target.value)}
    />
    <div className="waiter-menu-grid scrollable">
      {menuItems.map((item) => (
        <button key={item._id} className="menu-card" onClick={() => onAdd(item)}>
          {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="menu-thumb" />}
          <div className="fw-semibold">{item.name}</div>
          <div className="tiny-text text-muted">{item.category}</div>
          <div className="fw-bold">NPR {item.price}</div>
        </button>
      ))}
    </div>
  </div>
);

export default WaiterMenu;
