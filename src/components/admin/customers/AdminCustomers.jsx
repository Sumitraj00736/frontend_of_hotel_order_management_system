import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Gift, FileDown, LayoutGrid } from 'lucide-react';
import CustomerHeader   from './header/CustomerHeader.jsx';
import CustomerKpiGrid  from './CustomerKpiGrid.jsx';
import CustomerTable    from './table/CustomerTable.jsx';
import CustomerModal    from './modals/CustomerModal.jsx';
import RewardsModal     from './modals/RewardsModal.jsx';

/* ── Options floating menu ─────────────────────────────────── */
const OptionsMenu = ({ onOpenRewards, onClose }) => {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-6 top-[72px] w-52 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/60 z-40 py-1.5">
      <button onClick={onOpenRewards} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
        <Gift size={15} className="text-amber-500" /> Rewards Setting
      </button>
      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
        <FileDown size={15} className="text-slate-400" /> Export
      </button>
      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
        <LayoutGrid size={15} className="text-slate-400" /> Overview Cards
      </button>
    </div>
  );
};

/* ── AdminCustomers ─────────────────────────────────────────── */
const AdminCustomers = ({
  customers = [],
  rewards,
  setRewards,
  onSaveRewards,
  form,
  setForm,
  onCreateCustomer,
  onUpdateCustomer,
}) => {
  const [search,       setSearch]       = useState('');
  const [showMenu,     setShowMenu]     = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [showRewards,  setShowRewards]  = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const filtered = useMemo(() =>
    customers
      .filter((c) =>
        `${c.name || ''} ${c.email || ''} ${c.phone || ''}`.toLowerCase().includes(search.toLowerCase())
      )
      .map((c) => ({ ...c, dueAmount: Number(c.openingAmount || 0) })),
    [customers, search]
  );

  const totals = useMemo(() => {
    let toReceive = 0, toPay = 0;
    customers.forEach((c) => {
      const amt = Number(c.openingAmount || 0);
      if ((c.openingBalanceType || 'dr') === 'cr') toPay += amt;
      else toReceive += amt;
    });
    return { toReceive, toPay, netToReceive: toReceive - toPay };
  }, [customers]);

  const openCreate = () => { setEditCustomer(null); setShowModal(true); };

  const openEdit = (c) => {
    if (!c?._id) return openCreate();
    setEditCustomer(c);
    setForm({
      name: c.name || '', email: c.email || '', phone: c.phone || '',
      loyaltyDiscount: c.loyaltyDiscount || '', openingBalanceType: c.openingBalanceType || 'dr',
      openingAmount: c.openingAmount || '', legalName: c.legalName || '',
      taxNumber: c.taxNumber || '', creditLimit: c.creditLimit || '',
      creditTermDays: c.creditTermDays || '',
      dob: c.dob ? new Date(c.dob).toISOString().slice(0, 10) : '',
      address: c.address || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editCustomer) await onUpdateCustomer(editCustomer._id, form);
    else await onCreateCustomer();
    setShowModal(false);
  };

  return (
    <div className="relative flex flex-col h-screen bg-slate-50/60 overflow-hidden">
      {/* Sticky Header */}
      <CustomerHeader
        search={search}
        onSearch={setSearch}
        onAdd={openCreate}
        onMenuToggle={() => setShowMenu((v) => !v)}
      />

      {/* Floating options menu */}
      {showMenu && (
        <OptionsMenu
          onOpenRewards={() => { setShowRewards(true); setShowMenu(false); }}
          onClose={() => setShowMenu(false)}
        />
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-6 relative">
        {/* KPI Grid */}
        <CustomerKpiGrid totals={totals} />

        {/* Table */}
        <CustomerTable customers={filtered} onEdit={openEdit} />
      </div>

      {/* Modals */}
      {showModal && (
        <CustomerModal form={form} setForm={setForm} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
      {showRewards && (
        <RewardsModal
          rewards={rewards}
          setRewards={setRewards}
          onClose={() => setShowRewards(false)}
          onSave={async () => { await onSaveRewards(); setShowRewards(false); }}
        />
      )}
    </div>
  );
};

export default AdminCustomers;