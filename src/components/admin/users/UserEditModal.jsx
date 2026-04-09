import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

const UserEditModal = ({ user, roles = [], onClose, onSave }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    role: user?.role || '',
    status: user?.status || 'active',
    dateOfJoining: user?.dateOfJoining ? user.dateOfJoining.slice(0, 10) : '',
    salary: user?.salary || '',
    shiftStart: user?.shiftStart || '',
    shiftEnd: user?.shiftEnd || ''
  });

  const roleOptions = useMemo(
    () => roles.map((r) => ({ value: r.value || r.name, label: r.label || r.name })),
    [roles]
  );

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password || undefined,
      dateOfJoining: form.dateOfJoining || undefined,
      salary: form.salary === '' ? undefined : Number(form.salary),
      shiftStart: form.shiftStart || undefined,
      shiftEnd: form.shiftEnd || undefined,
      status: form.status,
      role: form.role || undefined
    };
    await onSave?.(payload);
  };

  return (
    <div className="users-modal-overlay" onClick={onClose}>
      <div className="users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="users-modal-header">
          <div>
            <div className="users-modal-title">Edit Staff</div>
            <div className="users-modal-subtitle">Update staff details and access</div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="users-modal-grid">
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          </label>
          <label>
            <span>Email</span>
            <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          </label>
          <label>
            <span>Phone</span>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </label>
          <label className="password-field">
            <span>Password</span>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Leave blank to keep current"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          <label>
            <span>Role</span>
            <select
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              disabled={user?.isOwner}
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={user?.isOwner}
            >
              <option value="active">active</option>
              <option value="pending">pending</option>
              <option value="inactive">inactive</option>
            </select>
          </label>
          <label>
            <span>Date of Joining</span>
            <input
              type="date"
              value={form.dateOfJoining}
              onChange={(e) => handleChange('dateOfJoining', e.target.value)}
            />
          </label>
          <label>
            <span>Salary</span>
            <input
              type="number"
              value={form.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
            />
          </label>
          <label>
            <span>Shift Start</span>
            <input value={form.shiftStart} onChange={(e) => handleChange('shiftStart', e.target.value)} />
          </label>
          <label>
            <span>Shift End</span>
            <input value={form.shiftEnd} onChange={(e) => handleChange('shiftEnd', e.target.value)} />
          </label>
        </div>

        <div className="users-modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
