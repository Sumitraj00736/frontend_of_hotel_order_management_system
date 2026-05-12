import React, { useMemo, useState } from 'react';
import CustomerHeader from './CustomerHeader.jsx';
import CustomerKpiGrid from './CustomerKpiGrid.jsx';
import CustomerTable from './CustomerTable.jsx';
import CustomerModal from './CustomerModal.jsx';
import RewardsModal from './RewardsModal.jsx';
import '../../../common/css/admin/customers/customers.css';

const AdminCustomers = ({
  customers = [],
  rewards,
  setRewards,
  onSaveRewards,
  form,
  setForm,
  onCreateCustomer,
  onUpdateCustomer
}) => {
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const filtered = useMemo(() => {
    return customers
      .filter((c) => {
        const haystack = `${c.name || ''} ${c.email || ''} ${c.phone || ''}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
      .map((c) => ({
        ...c,
        dueAmount: Number(c.openingAmount || 0)
      }));
  }, [customers, search]);

  const totals = useMemo(() => {
    let toReceive = 0;
    let toPay = 0;
    customers.forEach((c) => {
      const amt = Number(c.openingAmount || 0);
      if ((c.openingBalanceType || 'dr') === 'cr') {
        toPay += amt;
      } else {
        toReceive += amt;
      }
    });
    return {
      toReceive,
      toPay,
      netToReceive: toReceive - toPay
    };
  }, [customers]);

  const openCreate = () => {
    setEditCustomer(null);
    setShowModal(true);
    document.body.classList.add('modal-active');
  };

  const handleSave = async () => {
    if (editCustomer) {
      await onUpdateCustomer(editCustomer._id, form);
    } else {
      await onCreateCustomer();
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page-container">
      <div className="glass-card customers-panel">
        <div className="customers-header-section">
          <CustomerHeader
            search={search}
            onSearch={setSearch}
            onAdd={openCreate}
            onMenuToggle={() => setShowMenu((v) => !v)}
          />
          {showMenu && (
            <div className="floating-menu" onMouseLeave={() => setShowMenu(false)}>
              <button
                onClick={() => {
                  setShowRewards(true);
                  document.body.classList.add('modal-active');
                }}
              >
                <i className="fas fa-gift"></i> Rewards Setting
              </button>
              <button><i className="fas fa-file-export"></i> Export</button>
              <button><i className="fas fa-chart-pie"></i> Overview Cards</button>
            </div>
          )}
        </div>

        <div className="customers-body-content">
          <CustomerKpiGrid totals={totals} />
          <div className="table-container-card">
            <CustomerTable
              customers={filtered}
              onEdit={(c) => {
                if (!c?._id) return openCreate();
                setEditCustomer(c);
                setForm({
                  name: c.name || '',
                  email: c.email || '',
                  phone: c.phone || '',
                  loyaltyDiscount: c.loyaltyDiscount || '',
                  openingBalanceType: c.openingBalanceType || 'dr',
                  openingAmount: c.openingAmount || '',
                  legalName: c.legalName || '',
                  taxNumber: c.taxNumber || '',
                  creditLimit: c.creditLimit || '',
                  creditTermDays: c.creditTermDays || '',
                  dob: c.dob ? new Date(c.dob).toISOString().slice(0, 10) : '',
                  address: c.address || ''
                });
                setShowModal(true);
              }}
            />
          </div>
        </div>

        {showModal && (
          <CustomerModal
            form={form}
            setForm={setForm}
            onClose={() => {
              setShowModal(false);
              document.body.classList.remove('modal-active');
            }}
            onSave={async () => {
              await handleSave();
              document.body.classList.remove('modal-active');
            }}
          />
        )}

        {showRewards && (
          <RewardsModal
            rewards={rewards}
            setRewards={setRewards}
            onClose={() => {
              setShowRewards(false);
              document.body.classList.remove('modal-active');
            }}
            onSave={async () => {
              await onSaveRewards();
              setShowRewards(false);
              document.body.classList.remove('modal-active');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;