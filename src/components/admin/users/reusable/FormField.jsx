import React from 'react';

const FormField = ({ label, children, required = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-600 tracking-wide">
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

export const inputClass =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all';

export const selectClass =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all';

export default FormField;
