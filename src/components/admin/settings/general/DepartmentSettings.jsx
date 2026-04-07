import React, { useEffect, useState } from 'react';

const DepartmentSettings = ({ items = [], onCreate, onUpdate, onDelete }) => {
  const [form, setForm] = useState({ name: '', description: '' });

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await onCreate?.({ name: form.name.trim(), description: form.description.trim() });
    setForm({ name: '', description: '' });
  };

  return (
    <div className="settings-page">
      <div className="settings-title">Department</div>
      <div className="settings-toolbar">
        <button className="btn btn-primary" onClick={handleCreate}>+ Add Department</button>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Create Department</div>
        <div className="settings-grid two">
          <input
            className="field-input"
            placeholder="Department name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="field-input"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Departments</div>
        <table className="settings-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="settings-empty">
                  No department found
                </td>
              </tr>
            ) : (
              items.map((dept, idx) => (
                <tr key={dept._id}>
                  <td>{idx + 1}</td>
                  <td>{dept.name}</td>
                  <td>{dept.description || '-'}</td>
                  <td>{dept.active ? 'Active' : 'Inactive'}</td>
                  <td className="table-actions">
                    <button className="btn btn-ghost" onClick={() => onUpdate?.(dept._id, { active: !dept.active })}>
                      Toggle
                    </button>
                    <button className="btn btn-ghost" onClick={() => onDelete?.(dept._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentSettings;
