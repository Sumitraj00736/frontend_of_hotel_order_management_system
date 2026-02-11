import React from 'react';

const WaiterMenu = ({ search, onSearch, menuItems, onAdd }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Menu</h5>
    <input
      className="form-control mb-2"
      placeholder="Search menu"
      value={search}
      onChange={(e) => onSearch(e.target.value)}
    />
    <div className="list-group">
      {menuItems.map((item) => (
        <button key={item._id} className="list-group-item list-group-item-action" onClick={() => onAdd(item)}>
          <div className="d-flex justify-content-between">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </div>
          <small className="text-muted">{item.category}</small>
        </button>
      ))}
    </div>
  </div>
);

export default WaiterMenu;
