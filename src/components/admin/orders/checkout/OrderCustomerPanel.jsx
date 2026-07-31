import React, { useState, useMemo } from 'react';
import { User, Users, Search, X, ChevronDown, Check } from 'lucide-react';

const OrderCustomerPanel = ({
  activeTab,
  onTabChange,
  customerName,
  customerId,
  customers = [],
  onCustomerChange,
  staff = [],
  assignedStaffId,
  onAssignStaff,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showList, setShowList] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lower = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(lower) ||
        c.phone?.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const selectedStaff = staff.find((s) => s._id === assignedStaffId);

  const handleSelectCustomer = (customer) => {
    onCustomerChange(customer._id, customer.name);
    setSearchTerm('');
    setShowList(false);
  };

  const handleWalkIn = () => {
    onCustomerChange('', searchTerm || 'Walk-in');
    setSearchTerm('');
    setShowList(false);
  };

  const handleClearCustomer = () => {
    onCustomerChange('', '');
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-visible">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => onTabChange('customer')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition ${
            activeTab === 'customer'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User size={13} /> Customer
        </button>
        <button
          onClick={() => onTabChange('staff')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition ${
            activeTab === 'staff'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Users size={13} /> Staff
        </button>
      </div>

      <div className="p-3 relative">
        {/* ── CUSTOMER TAB ── */}
        {activeTab === 'customer' && (
          <>
            {customerId ? (
              /* Selected customer chip */
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  <span className="text-sm font-medium text-gray-700">{customerName}</span>
                </div>
                <button
                  onClick={handleClearCustomer}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 transition"
                >
                  <X size={11} />
                </button>
              </div>
            ) : (
              <>
                {/* Search input */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setShowList(true); }}
                    onFocus={() => setShowList(true)}
                    onBlur={() => setTimeout(() => setShowList(false), 180)}
                  />
                </div>

                {/* Full list dropdown — always visible on focus */}
                {showList && (
                  <div className="absolute z-50 left-3 right-3 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                    {/* Walk-in option */}
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary/5 border-b border-gray-100 transition font-medium"
                      onMouseDown={handleWalkIn}
                    >
                      {searchTerm
                        ? `+ Add "${searchTerm}" as Walk-in`
                        : '+ Walk-in Customer (no account)'}
                    </button>

                    {/* Customer list */}
                    {filteredCustomers.length === 0 && searchTerm ? (
                      <div className="px-3 py-3 text-xs text-gray-400 text-center">
                        No customers found for "{searchTerm}"
                      </div>
                    ) : (
                      (filteredCustomers.length > 0 ? filteredCustomers : customers).map((c) => (
                        <button
                          key={c._id}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 transition text-left"
                          onMouseDown={() => handleSelectCustomer(c)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User size={11} className="text-primary" />
                            </div>
                            <span className="font-medium text-gray-700">{c.name}</span>
                          </div>
                          {c.phone && (
                            <span className="text-xs text-gray-400">{c.phone}</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── STAFF TAB ── */}
        {activeTab === 'staff' && (
          <div className="relative">
            <label className="text-xs text-gray-500 mb-1 block">Assigned Staff</label>
            <div className="relative">
              <select
                className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition cursor-pointer"
                value={assignedStaffId || ''}
                onChange={(e) => onAssignStaff?.(e.target.value || null)}
              >
                <option value="">— Unassigned —</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}{s.role ? ` (${s.role})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Selected staff chip */}
            {selectedStaff && (
              <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                <Check size={13} className="text-primary" />
                <span className="text-xs font-medium text-gray-700">{selectedStaff.name}</span>
                {selectedStaff.role && (
                  <span className="text-xs text-gray-400">· {selectedStaff.role}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCustomerPanel;
