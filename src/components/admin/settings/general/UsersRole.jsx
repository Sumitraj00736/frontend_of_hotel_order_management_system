import React, { useMemo, useState } from 'react';
import { PERMISSION_GROUPS, WAITER_ALLOWED_PERMISSIONS } from '../../../../common/permissions.js';

const iconByRole = {
  admin: '🧭',
  billing: '💳',
  kitchen: '🍳',
  waiter: '🍽️',
  superadmin: '🛡️',
  manager: '📋'
};

const UsersRole = ({ data, onCreateRole, onUpdateRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#fc8019', permissions: [] });

  const counts = useMemo(() => {
    const map = {};
    (data?.counts || []).forEach((c) => {
      map[c._id] = c.total;
      map[String(c._id || '').toLowerCase()] = c.total;
    });
    return map;
  }, [data]);

  const roles = data?.roles || [];

  const normalizePermissions = (roleName, list) => {
    if (!roleName) return list;
    const key = roleName.toLowerCase().trim();
    if (key !== 'waiter') return list;
    return list.filter((perm) => waiterAllowed.has(perm));
  };

  const togglePermission = (perm) => {
    setForm((prev) => {
      const has = prev.permissions.includes(perm);
      const next = has ? prev.permissions.filter((p) => p !== perm) : [...prev.permissions, perm];
      return { ...prev, permissions: normalizePermissions(prev.name || editing?.name, next) };
    });
  };

  const isWaiterRole = useMemo(() => {
    const name = (editing?.name || form.name || '').toLowerCase().trim();
    return name === 'waiter';
  }, [editing?.name, form.name]);

  const waiterAllowed = useMemo(() => new Set(WAITER_ALLOWED_PERMISSIONS), []);

  const submit = async () => {
    if (!form.name) return;
    if (editing) {
      await onUpdateRole?.(editing._id, form);
    } else {
      await onCreateRole?.(form);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', description: '', color: '#fc8019', permissions: [] });
  };

  return (
    <div className="settings-page">
      <div className="settings-title">Users Role</div>
      <div className="settings-toolbar">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add New</button>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Roles & Access</div>
        <div className="role-grid">
          {roles.map((role) => (
            <div key={role._id} className="role-card">
              <div className="role-icon" style={{ background: role.color }}>
                {iconByRole[role.name] || role.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="role-name">{role.name}</div>
                <div className="role-meta">
                  Total User: {counts[role.name] || 0}
                  {role.isDefault ? ' · Default role' : ''}
                </div>
              </div>
              <button
                className="role-edit-btn"
                onClick={() => {
                  setEditing(role);
                  const basePermissions = role.permissions || [];
                  setForm({
                    name: role.name,
                    description: role.description || '',
                    color: role.color || '#fc8019',
                    permissions: normalizePermissions(role.name, basePermissions)
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
            <input
              className="field-input"
              value={form.name}
              disabled={editing?.isDefault}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {editing?.isDefault && (
              <div className="profile-sub" style={{ marginTop: 6 }}>
                Default role names are fixed. You can still update permissions, description, and color.
              </div>
            )}
            <label className="field-label">Role Description</label>
            <input className="field-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <label className="field-label">Select Color *</label>
            <div className="color-row">
              {['#16a34a', '#f97316', '#8b5cf6', '#0ea5e9', '#fc8019', '#111827'].map((c) => (
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
                    {group.items.map((item) => {
                      const disabled = isWaiterRole && !waiterAllowed.has(item.key);
                      return (
                        <label key={item.key} className={`permission-row ${disabled ? 'disabled' : ''}`}>
                          <span>{item.label}</span>
                          <input
                            type="checkbox"
                            checked={form.permissions.includes(item.key)}
                            onChange={() => !disabled && togglePermission(item.key)}
                            disabled={disabled}
                          />
                          <span className="toggle-indicator" />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>{editing ? 'Update Role' : 'Create Role'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersRole;
