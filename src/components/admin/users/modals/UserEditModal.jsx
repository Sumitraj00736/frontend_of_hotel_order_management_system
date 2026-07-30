import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, X, UserCog } from 'lucide-react';
import FormField, { inputClass, selectClass } from '../reusable/FormField.jsx';
import UserAvatar from '../reusable/UserAvatar.jsx';

const UserEditModal = ({ user, roles = [], onClose, onSave }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name:          user?.name          || '',
    email:         user?.email         || '',
    phone:         user?.phone         || '',
    password:      '',
    role:          user?.role          || '',
    status:        user?.status        || 'active',
    dateOfJoining: user?.dateOfJoining ? user.dateOfJoining.slice(0, 10) : '',
    salary:        user?.salary        || '',
    shiftStart:    user?.shiftStart    || '',
    shiftEnd:      user?.shiftEnd      || '',
  });

  const roleOptions = useMemo(
    () => roles.map((r) => ({ value: r.value || r.name, label: r.label || r.name })),
    [roles]
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    const payload = {
      name:          form.name,
      email:         form.email,
      phone:         form.phone,
      password:      form.password || undefined,
      dateOfJoining: form.dateOfJoining || undefined,
      salary:        form.salary === '' ? undefined : Number(form.salary),
      shiftStart:    form.shiftStart || undefined,
      shiftEnd:      form.shiftEnd || undefined,
      status:        form.status,
      role:          form.role || undefined,
    };
    await onSave?.(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <UserAvatar name={user?.name} image={user?.image} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <UserCog size={14} className="text-orange-500" />
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Edit Staff</p>
              </div>
              <h3 className="text-base font-black text-slate-800 mt-0.5">{user?.name || 'Staff Member'}</h3>
              <p className="text-xs font-semibold text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          <FormField label="Name" required>
            <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
          </FormField>
          <FormField label="Email" required>
            <input className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email address" />
          </FormField>
          <FormField label="Phone">
            <input className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Phone number" />
          </FormField>

          {/* Password with toggle */}
          <FormField label="New Password">
            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Leave blank to keep current"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FormField>

          <FormField label="Role">
            <select className={selectClass} value={form.role} onChange={(e) => set('role', e.target.value)} disabled={user?.isOwner}>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={selectClass} value={form.status} onChange={(e) => set('status', e.target.value)} disabled={user?.isOwner}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </FormField>

          <FormField label="Date of Joining">
            <input className={inputClass} type="date" value={form.dateOfJoining} onChange={(e) => set('dateOfJoining', e.target.value)} />
          </FormField>
          <FormField label="Salary (Rs)">
            <input className={inputClass} type="number" value={form.salary} onChange={(e) => set('salary', e.target.value)} placeholder="Monthly salary" />
          </FormField>
          <FormField label="Shift Start">
            <input className={inputClass} value={form.shiftStart} onChange={(e) => set('shiftStart', e.target.value)} placeholder="e.g. 09:00 AM" />
          </FormField>
          <FormField label="Shift End">
            <input className={inputClass} value={form.shiftEnd} onChange={(e) => set('shiftEnd', e.target.value)} placeholder="e.g. 06:00 PM" />
          </FormField>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
