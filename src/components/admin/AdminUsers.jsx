import React from 'react';

const AdminUsers = ({ users, userForm, setUserForm, onCreateUser, onEditUser, onLoadPromotions }) => (
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
      <div className="col-6">
        <input className="form-control" type="date" value={userForm.dateOfJoining || ''} onChange={(e) => setUserForm({ ...userForm, dateOfJoining: e.target.value })} />
      </div>
      <div className="col-6">
        <input className="form-control" placeholder="Salary" value={userForm.salary || ''} onChange={(e) => setUserForm({ ...userForm, salary: e.target.value })} />
      </div>
      <div className="col-6">
        <input className="form-control" placeholder="Shift Start (e.g. 09:00)" value={userForm.shiftStart || ''} onChange={(e) => setUserForm({ ...userForm, shiftStart: e.target.value })} />
      </div>
      <div className="col-6">
        <input className="form-control" placeholder="Shift End (e.g. 18:00)" value={userForm.shiftEnd || ''} onChange={(e) => setUserForm({ ...userForm, shiftEnd: e.target.value })} />
      </div>
      <div className="col-12">
        <button className="btn btn-primary w-100" onClick={onCreateUser}>Create</button>
      </div>
    </div>
    <ul className="list-group">
      {users.map((u) => (
        <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <div>{u.name} ({u.role})</div>
            <div className="small text-muted">{u.email}</div>
            <div className="small text-muted">
              DOJ: {u.dateOfJoining ? new Date(u.dateOfJoining).toLocaleDateString() : 'N/A'} | Salary: {u.salary ?? 'N/A'}
            </div>
            <div className="small text-muted">Shift: {u.shiftStart || '--'} - {u.shiftEnd || '--'}</div>
          </div>
          <div className="d-flex flex-column gap-2">
            <button className="btn btn-sm btn-outline-light" onClick={() => onEditUser(u)}>
              Edit Profile
            </button>
            <button className="btn btn-sm btn-outline-light" onClick={() => onLoadPromotions(u)}>
              Promotions
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminUsers;
