import React from 'react';
import { X, UserPlus } from 'lucide-react';
import FormField, { inputClass, selectClass } from '../reusable/FormField.jsx';

const UserInviteModal = ({ userForm, setUserForm, onClose, onCreate, roles = [] }) => {
  const set = (key, val) => setUserForm({ ...userForm, [key]: val });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
              <UserPlus size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Invite Staff</p>
              <h3 className="text-base font-black text-slate-800 leading-tight mt-0.5">Create account</h3>
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
            <input className={inputClass} placeholder="Full name" value={userForm.name} onChange={(e) => set('name', e.target.value)} />
          </FormField>
          <FormField label="Email" required>
            <input className={inputClass} placeholder="Email address" value={userForm.email} onChange={(e) => set('email', e.target.value)} />
          </FormField>
          <FormField label="Phone">
            <input className={inputClass} placeholder="Phone number" value={userForm.phone || ''} onChange={(e) => set('phone', e.target.value)} />
          </FormField>
          <FormField label="Password" required>
            <input className={inputClass} type="password" placeholder="Create password" value={userForm.password} onChange={(e) => set('password', e.target.value)} />
          </FormField>
          <FormField label="Role">
            <select className={selectClass} value={userForm.role} onChange={(e) => set('role', e.target.value)}>
              {roles.length === 0 ? (
                <>
                  <option value="waiter">Waiter</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="admin">Admin</option>
                </>
              ) : (
                roles.map((r) => (
                  <option key={r.value || r._id || r.name} value={r.value || r.name}>
                    {r.label || r.name}
                  </option>
                ))
              )}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={selectClass} value={userForm.status || 'active'} onChange={(e) => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
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
            onClick={onCreate}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all active:scale-95"
          >
            Invite Staff
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInviteModal;
