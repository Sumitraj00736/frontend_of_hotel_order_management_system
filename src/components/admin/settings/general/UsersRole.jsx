import React, { useMemo, useState } from 'react';
import { PERMISSION_GROUPS } from '../../../../common/permissions.js';

const defaultCards = [
  { name: 'Admin', icon: '🧭' },
  { name: 'Billing', icon: '💳' },
  { name: 'Kitchen', icon: '🍳' },
  { name: 'Server', icon: '🍽️' },
  { name: 'SuperAdmin', icon: '🛡️' }
];

const UsersRole = ({ data, onCreateRole, onUpdateRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#ef4444', permissions: [] });

  const counts = useMemo(() => {
    const map = {};
    (data?.counts || []).forEach((c) => {
      map[c._id] = c.total;
    });
    return map;
  }, [data]);

  const roles = data?.roles || [];

  const togglePermission = (perm) => {
    setForm((prev) => {
      const has = prev.permissions.includes(perm);
      const next = has ? prev.permissions.filter((p) => p !== perm) : [...prev.permissions, perm];
      return { ...prev, permissions: next };
    });
  };

  const submit = async () => {
    if (!form.name) return;
    if (editing) {
      await onUpdateRole?.(editing._id, form);
    } else {
      await onCreateRole?.(form);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', description: '', color: '#ef4444', permissions: [] });
  };

  return (
    <div className="settings-page">
      <div className="settings-title">Users Role</div>
      <div className="settings-toolbar">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add New</button>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Default Roles</div>
        <div className="role-grid">
          {defaultCards.map((card) => (
            <div key={card.name} className="role-card">
              <div className="role-icon">{card.icon}</div>
              <div>
                <div className="role-name">{card.name}</div>
                <div className="role-meta">Total User: {counts[card.name.toLowerCase()] || 0}</div>
              </div>
            </div>
          ))}
          {roles.map((role) => (
            <div key={role._id} className="role-card">
              <div className="role-icon" style={{ background: role.color }}>{role.name.charAt(0)}</div>
              <div>
                <div className="role-name">{role.name}</div>
                <div className="role-meta">Total User: {counts[role.name] || 0}</div>
              </div>
              <button
                className="role-edit-btn"
                onClick={() => {
                  setEditing(role);
                  setForm({
                    name: role.name,
                    description: role.description || '',
                    color: role.color || '#ef4444',
                    permissions: role.permissions || []
                  });
                  setShowModal(true);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="role-modal" onClick={(e) => e.stopPropagation()}>
            <div className="role-modal-header">
              <div className="modal-title">{editing ? 'Edit Role' : 'Create Role'}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <label className="field-label">Role Name *</label>
            <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="field-label">Role Description</label>
            <input className="field-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="field-label">Select Color *</label>
            <div className="color-row">
              {['#16a34a', '#f97316', '#8b5cf6', '#0ea5e9', '#ef4444', '#111827'].map((c) => (
                <button
                  key={c}
                  className={`color-swatch ${form.color === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm({ ...form, color: c })}
                />
              ))}
            </div>

            <div className="permission-panel">
              <div className="settings-card-title">Select Permissions</div>
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.title} className="permission-group">
                  <div className="permission-title">{group.title}</div>
                  <div className="permission-table">
                    <div className="permission-head">
                      <span>Permission</span>
                      <span>Allow</span>
                    </div>
                    {group.items.map((item) => (
                      <label key={item.key} className="permission-row">
                        <span>{item.label}</span>
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(item.key)}
                          onChange={() => togglePermission(item.key)}
                        />
                        <span className="toggle-indicator" />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Create Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersRole;
