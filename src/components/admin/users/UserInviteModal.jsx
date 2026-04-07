import React from 'react';

const UserInviteModal = ({ userForm, setUserForm, onClose, onCreate, roles = [] }) => {
  return (
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-panel fullscreen small animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3 modal-header-line">
          <div>
            <div className="eyebrow">Invite Staff</div>
            <h5 className="mb-0">Create account</h5>
          </div>
          <button className="btn btn-outline-light" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-body-scroll">
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label">Name</label>
              <input className="form-control" placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Email</label>
              <input className="form-control" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Phone</label>
              <input className="form-control" placeholder="Phone" value={userForm.phone || ''} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Role</label>
              <select className="form-select" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                {roles.length === 0 ? (
                  <>
                    <option value="waiter">Waiter</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="admin">Admin</option>
                  </>
                ) : (
                  roles.map((role) => (
                    <option key={role.value || role._id || role.name} value={role.value || role.name}>
                      {role.label || role.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">Status</label>
              <select className="form-select" value={userForm.status || 'active'} onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-light" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onCreate}>Invite</button>
        </div>
      </div>
    </div>
  );
};

export default UserInviteModal;
