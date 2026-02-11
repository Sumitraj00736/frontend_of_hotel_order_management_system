import React from 'react';

const AdminUsers = ({ users, userForm, setUserForm, onCreateUser }) => (
  <div className="card glass-card">
    <h5 className="mb-3">Users</h5>
    <div className="row g-2 mb-3">
      <div className="col-6">
        <input className="form-control" placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
      </div>
      <div className="col-6">
        <input className="form-control" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
      </div>
      <div className="col-6">
        <input className="form-control" type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
      </div>
      <div className="col-6">
        <select className="form-select" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
          <option value="waiter">Waiter</option>
          <option value="kitchen">Kitchen</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="col-12">
        <button className="btn btn-primary w-100" onClick={onCreateUser}>Create</button>
      </div>
    </div>
    <ul className="list-group">
      {users.map((u) => (
        <li key={u._id} className="list-group-item d-flex justify-content-between">
          <span>{u.name} ({u.role})</span>
          <span className="text-muted">{u.email}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminUsers;
