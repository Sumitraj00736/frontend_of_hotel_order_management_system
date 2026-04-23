import React, { useState, useMemo } from 'react';
import { User, Search } from 'lucide-react';

const OrderCustomerPanel = ({ activeTab, onTabChange, customerName, customerId, customers = [], onCustomerChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lower = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name?.toLowerCase().includes(lower) || 
      c.phone?.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const handleSelect = (customer) => {
    onCustomerChange(customer._id, customer.name);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onCustomerChange('', '');
  };

  return (
    <div className="customer-card">
      <div className="tab-row">
        <button className={activeTab === 'customer' ? 'active' : ''} onClick={() => onTabChange('customer')}>Customer</button>
        <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => onTabChange('staff')}>Staff</button>
      </div>
      <div className="tab-content" style={{ position: 'relative' }}>
        {customerId ? (
          <div className="d-flex align-items-center justify-content-between p-2 border rounded bg-light">
            <div className="d-flex align-items-center gap-2">
              <User size={16} className="text-secondary" />
              <span className="fw-medium">{customerName}</span>
            </div>
            <button className="btn-close" style={{ fontSize: '0.6rem' }} onClick={handleClear}></button>
          </div>
        ) : (
          <div>
             <div className="position-relative">
               <input
                className="form-control form-control-sm ps-4"
                placeholder="Search phone or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsOpen(true)}
               />
               <Search size={14} className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
             </div>
             
             {isOpen && (
               <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                 {searchTerm && (
                   <div 
                     className="p-2 border-bottom text-primary cursor-pointer hover-bg-light"
                     onClick={() => {
                        onCustomerChange('', searchTerm); // Walk-in with typed name
                        setIsOpen(false);
                     }}
                   >
                     + Add "{searchTerm}" as Walk-in
                   </div>
                 )}
                 {filteredCustomers.length === 0 && !searchTerm && (
                   <div className="p-2 text-muted small text-center">Type to search existing customers</div>
                 )}
                 {filteredCustomers.map(c => (
                   <div 
                     key={c._id} 
                     className="p-2 border-bottom cursor-pointer hover-bg-light d-flex justify-content-between align-items-center"
                     onClick={() => handleSelect(c)}
                   >
                     <span>{c.name}</span>
                     {c.phone && <span className="small text-muted">{c.phone}</span>}
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCustomerPanel;
