import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Save, RotateCcw, UserPlus, UserCog } from 'lucide-react';
import FormField, { inputClass, selectClass } from '../reusable/FormField.jsx';

const CustomerModal = ({ form, setForm, onClose, onSave }) => {
  const [showExtra, setShowExtra] = useState(false);
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const isEdit = Boolean(form._id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
              {isEdit ? <UserCog size={20} className="text-orange-500" /> : <UserPlus size={20} className="text-orange-500" />}
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                {isEdit ? 'Edit Customer' : 'New Customer'}
              </p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">
                {isEdit ? 'Update customer details' : 'Add New Customer'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto flex flex-col gap-5">

          {/* Section: General */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">General Information</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. John Doe" />
              </FormField>
              <FormField label="Phone Number">
                <input className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+977" />
              </FormField>
              <FormField label="Email Address">
                <input className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" />
              </FormField>
              <FormField label="Loyalty Discount (%)">
                <input className={inputClass} type="number" value={form.loyaltyDiscount} onChange={(e) => set('loyaltyDiscount', e.target.value)} placeholder="0.00" />
              </FormField>
            </div>
          </div>

          {/* Section: Opening Balance */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Opening Balance</p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {[
                  { val: 'dr', label: 'To Collect (Dr)', active: 'bg-emerald-500 text-white border-emerald-500', inactive: 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400' },
                  { val: 'cr', label: 'To Pay (Cr)',     active: 'bg-rose-500 text-white border-rose-500',       inactive: 'bg-white text-slate-600 border-slate-200 hover:border-rose-400' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => set('openingBalanceType', opt.val)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${form.openingBalanceType === opt.val ? opt.active : opt.inactive}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <FormField label="Opening Amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rs</span>
                  <input className={`${inputClass} pl-9`} type="number" value={form.openingAmount} onChange={(e) => set('openingAmount', e.target.value)} placeholder="0.00" />
                </div>
              </FormField>
            </div>
          </div>

          {/* Additional Details Toggle */}
          <button
            onClick={() => setShowExtra((v) => !v)}
            className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            {showExtra ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showExtra ? 'Hide Additional Details' : 'View Additional Details'}
          </button>

          {showExtra && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Legal Name">
                <input className={inputClass} value={form.legalName} onChange={(e) => set('legalName', e.target.value)} placeholder="Official Business Name" />
              </FormField>
              <FormField label="Tax / PAN Number">
                <input className={inputClass} value={form.taxNumber} onChange={(e) => set('taxNumber', e.target.value)} placeholder="Tax ID" />
              </FormField>
              <FormField label="Credit Limit">
                <input className={inputClass} value={form.creditLimit} onChange={(e) => set('creditLimit', e.target.value)} placeholder="Rs 0" />
              </FormField>
              <FormField label="Credit Term (Days)">
                <input className={inputClass} value={form.creditTermDays} onChange={(e) => set('creditTermDays', e.target.value)} placeholder="0" />
              </FormField>
              <FormField label="Date of Birth">
                <input className={inputClass} type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
              </FormField>
              <FormField label="Address">
                <input className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Full Address" />
              </FormField>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={onSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all active:scale-95">
            <Save size={14} /> Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
