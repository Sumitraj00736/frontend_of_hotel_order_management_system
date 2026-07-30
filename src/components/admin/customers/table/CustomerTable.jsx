import React from 'react';
import { Pencil, UserPlus, User, Mail, Phone, Calendar, Percent, Banknote } from 'lucide-react';
import CustomerAvatar from '../reusable/CustomerAvatar.jsx';
import DueBadge from '../reusable/DueBadge.jsx';
import LoyaltyBadge from '../reusable/LoyaltyBadge.jsx';

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ── Empty State ─────────────────────────────────────────────── */
const CustomerTableEmpty = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
      <UserPlus size={32} className="text-orange-400" />
    </div>
    <div className="text-center">
      <p className="text-sm font-bold text-slate-700">No customers found</p>
      <p className="text-xs font-semibold text-slate-400 mt-1">Create a new customer or import existing data.</p>
    </div>
    <button
      onClick={onAdd}
      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-sm shadow-orange-200 transition-all active:scale-95"
    >
      + Add New Customer
    </button>
  </div>
);

/* ── Table Head ──────────────────────────────────────────────── */
const COL_HEADERS = [
  { icon: null,                       label: 'SN' },
  { icon: <User size={12} />,        label: 'Customer' },
  { icon: <Mail size={12} />,        label: 'Email' },
  { icon: <Phone size={12} />,       label: 'Phone' },
  { icon: <Calendar size={12} />,    label: 'DOB' },
  { icon: <Percent size={12} />,     label: 'Loyalty' },
  { icon: <Banknote size={12} />,    label: 'Due Amount' },
  { icon: null,                       label: '' },
];

const CustomerTableHead = () => (
  <div className="grid grid-cols-[40px_1fr_1fr_120px_120px_90px_130px_48px] items-center gap-4 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
    {COL_HEADERS.map((h, i) => (
      <span key={i} className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {h.icon}{h.label}
      </span>
    ))}
  </div>
);

/* ── Customer Row ────────────────────────────────────────────── */
const CustomerRow = ({ customer, index, onEdit }) => (
  <div className="grid grid-cols-[40px_1fr_1fr_120px_120px_90px_130px_48px] items-center gap-4 px-5 py-3.5 border-b border-slate-50 hover:bg-orange-50/30 transition-colors group">
    <span className="text-xs font-bold text-slate-400 text-center">{index}</span>
    <div className="flex items-center gap-3 min-w-0">
      <CustomerAvatar name={customer.name} size="md" />
      <p className="text-sm font-bold text-slate-800 truncate">{customer.name || '—'}</p>
    </div>
    <span className="text-xs font-semibold text-slate-500 truncate">{customer.email || '—'}</span>
    <span className="text-xs font-semibold text-slate-600">{customer.phone || '—'}</span>
    <span className="text-xs font-semibold text-slate-600">{formatDate(customer.dob)}</span>
    <div><LoyaltyBadge discount={customer.loyaltyDiscount || 0} /></div>
    <div><DueBadge amount={customer.dueAmount || 0} /></div>
    <div className="flex justify-center">
      <button
        onClick={() => onEdit(customer)}
        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Pencil size={15} />
      </button>
    </div>
  </div>
);

/* ── CustomerTable ───────────────────────────────────────────── */
const CustomerTable = ({ customers, onEdit }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mx-6 my-5 overflow-hidden">
    {customers.length === 0 ? (
      <CustomerTableEmpty onAdd={() => onEdit()} />
    ) : (
      <>
        <CustomerTableHead />
        {customers.map((c, idx) => (
          <CustomerRow key={c._id || idx} customer={c} index={idx + 1} onEdit={onEdit} />
        ))}
      </>
    )}
  </div>
);

export default CustomerTable;
