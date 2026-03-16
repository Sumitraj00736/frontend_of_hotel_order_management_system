import React, { useState } from 'react';

const AdminUsers = ({ users, userForm, setUserForm, onCreateUser, onEditUser, onLoadPromotions }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleCreate = async () => {
    await onCreateUser();
    setOpenModal(false);
  };

  return (
    <div className="card glass-card full-width-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-0">Users</h5>
          <small className="text-muted">Manage staff accounts</small>
        </div>
        <button className="btn btn-primary" onClick={() => setOpenModal(true)}>+ Add User</button>
      </div>

      <div className="content grid-3">
        {users.map((u) => (
          <div key={u._id} className="card glass-card">
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-semibold">{u.name}</div>
                <div className="badge bg-secondary text-uppercase">{u.role}</div>
              </div>
              <button className="btn btn-sm btn-outline-light" onClick={() => onEditUser(u)}>
                Edit
              </button>
            </div>
            <div className="text-muted small mt-1">{u.email}</div>
            <div className="text-muted small">Phone: {u.phone || 'N/A'}</div>
            <div className="text-muted small">
              DOJ: {u.dateOfJoining ? new Date(u.dateOfJoining).toLocaleDateString() : 'N/A'} | Salary: {u.salary ?? 'N/A'}
            </div>
            <div className="text-muted small">Shift: {u.shiftStart || '--'} - {u.shiftEnd || '--'}</div>
            <button className="btn btn-sm btn-outline-light mt-2" onClick={() => onLoadPromotions(u)}>
              Promotions
            </button>
          </div>
        ))}
      </div>

      {openModal && (
        <div className="modal-overlay fullscreen" onClick={() => setOpenModal(false)}>
          <div className="modal-panel fullscreen small animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 modal-header-line">
              <div>
                <div className="eyebrow">Add User</div>
                <h5 className="mb-0">Create account</h5>
              </div>
              <button className="btn btn-outline-light" onClick={() => setOpenModal(false)}>
                Close
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Name</label>
                  <div className="input-icon">
                    <span>👤</span>
                    <input className="form-control" placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Email</label>
                  <div className="input-icon">
                    <span>✉️</span>
                    <input className="form-control" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Phone</label>
                  <div className="input-icon">
                    <span>📞</span>
                    <input className="form-control" placeholder="Phone" value={userForm.phone || ''} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Password</label>
                  <div className="input-icon">
                    <span>🔒</span>
                    <input className="form-control" type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Role</label>
                  <div className="input-icon">
                    <span>🎯</span>
                    <select className="form-select" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                      <option value="waiter">Waiter</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Date of Joining</label>
                  <div className="input-icon">
                    <span>📅</span>
                    <input className="form-control" type="date" value={userForm.dateOfJoining || ''} onChange={(e) => setUserForm({ ...userForm, dateOfJoining: e.target.value })} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Salary</label>
                  <div className="input-icon">
                    <span>💰</span>
                    <input className="form-control" placeholder="Salary" value={userForm.salary || ''} onChange={(e) => setUserForm({ ...userForm, salary: e.target.value })} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Shift Start</label>
                  <div className="input-icon">
                    <span>⏰</span>
                    <input className="form-control" placeholder="Shift Start (e.g. 09:00)" value={userForm.shiftStart || ''} onChange={(e) => setUserForm({ ...userForm, shiftStart: e.target.value })} />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label">Shift End</label>
                  <div className="input-icon">
                    <span>🏁</span>
                    <input className="form-control" placeholder="Shift End (e.g. 18:00)" value={userForm.shiftEnd || ''} onChange={(e) => setUserForm({ ...userForm, shiftEnd: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-light" onClick={() => setOpenModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
