import React, { useState } from 'react';
import OrderDetailModal from '../orderDetailModal/OrderDetailModal.jsx';
import OrdersHeader from './OrdersHeader.jsx';
import OrdersFilterTabs from './OrdersFilterTabs.jsx';
import OrdersGrid from './OrdersGrid.jsx';
import '../../../../common/css/admin/orders/kotCards.css';

const AdminOrders = ({
  orders = [],
  customers = [],
  menus = [],
  staff = [],
  paymentMethods,
  onChangePaymentMethod,
  onPay,
  onPrint,
  onUpdateOrder,
  page = 1,
  limit = 12,
  total = 0,
  filter = 'active',
  onFilterChange,
  onPageChange,
  onLimitChange,
  onNewOrder,
  onAddTable,
  categories = [],
  orderTypeFilter = '',
  onOrderTypeChange
}) => {
  const [selected, setSelected] = useState(null);
  const [autoAddItem, setAutoAddItem] = useState(false);

  const openDetails = (order, triggerAdd = false) => {
    if (!paymentMethods[order._id]) {
      onChangePaymentMethod(order._id, order.paymentMethod || 'cash');
    }
    setAutoAddItem(triggerAdd);
    setSelected(order);
  };
  const closeDetails = () => setSelected(null);

  const filterLabels = {
    active: 'Active Orders',
    kot: 'KOTs & Bills',
    paid: 'Paid History',
    cancelled: 'Cancelled Records',
    all: 'All Order History'
  };

  const countLabel = `${total} ${filterLabels[filter] || 'Orders'}`;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  return (
    <div className="card glass-card full-screen-card">
      <OrdersHeader 
        title="Orders" 
        countLabel={countLabel} 
        onNewOrder={onNewOrder} 
        onAddTable={onAddTable} 
        onFilterChange={onFilterChange}
      />
      <OrdersFilterTabs filter={filter} onChange={onFilterChange} />
      
      {['all', 'paid', 'cancelled'].includes(filter) && (
        <div className="d-flex gap-2 mb-3 overflow-auto pb-2 noscrollbar">
          {[
            { id: '', label: 'All Modes' },
            { id: 'dine_in', label: 'Dine In' },
            { id: 'delivery', label: 'Delivery' },
            { id: 'takeaway', label: 'Takeaway' },
            { id: 'pickup', label: 'Pickup' }
          ].map(t => (
            <button
              key={t.id}
              className={`btn btn-sm fw-600 rounded-pill px-3 text-nowrap ${orderTypeFilter === t.id ? 'active' : ''}`}
              style={orderTypeFilter === t.id 
                ? { backgroundColor: '#FC8019', color: '#fff', border: '1px solid #FC8019' } 
                : { backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}
              onClick={() => onOrderTypeChange?.(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <OrdersGrid 
        orders={orders} 
        onOpen={openDetails} 
        filter={filter} 
        onPrint={onPrint}
        onStatusChange={async (orderId, status) => {
          await onUpdateOrder({ orderId, status });
        }}
      />
      <div className="orders-pagination">
        <div className="orders-page-info">
          Page {page} of {totalPages}
        </div>
        <div className="orders-page-controls">
          <button
            className="chip ghost"
            disabled={page <= 1}
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
          >
            Prev
          </button>
          <button
            className="chip ghost"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
          >
            Next
          </button>
          <select
            className="chip ghost"
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
          >
            {[6, 12, 24, 48].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          menus={menus}
          categories={categories}
          staff={staff}
          customers={customers}
          paymentMethods={paymentMethods}
          initialShowAddItem={autoAddItem}
          onChangePaymentMethod={onChangePaymentMethod}
          onPay={async (id) => {
            await onPay(id);
            closeDetails();
          }}
          onPrint={onPrint}
          onUpdateOrder={async (payload) => {
            const updated = await onUpdateOrder?.(payload);
            if (updated) setSelected(updated);
            return updated;
          }}
          onClose={closeDetails}
        />
      )}
    </div>
  );
};

export default AdminOrders;
