import React from 'react';

const AdminMenus = ({ menus, menuForm, setMenuForm, onCreateMenu, onEditMenu }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Menus</h5>
    <div className="row g-2 mb-3">
      <div className="col-4">
        <input className="form-control" placeholder="Name" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} />
      </div>
      <div className="col-4">
        <input className="form-control" placeholder="Category" value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} />
      </div>
      <div className="col-2">
        <input className="form-control" placeholder="Price" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
      </div>
      <div className="col-2">
        <button className="btn btn-primary w-100" onClick={onCreateMenu}>Add</button>
      </div>
    </div>
    <ul className="list-group">
      {menus.map((menu) => (
        <li key={menu._id} className="list-group-item d-flex justify-content-between align-items-center">
          <span>{menu.name} (NPR {menu.price})</span>
          <button className="btn btn-sm btn-outline-light" onClick={() => onEditMenu(menu)}>Edit</button>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminMenus;
