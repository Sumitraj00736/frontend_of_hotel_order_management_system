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
  categories = []
}) => {
  const [selected, setSelected] = useState(null);

  const openDetails = (order) => {
    if (!paymentMethods[order._id]) {
      onChangePaymentMethod(order._id, order.paymentMethod || 'cash');
    }
    setSelected(order);
  };
  const closeDetails = () => setSelected(null);

  const countLabel = `${total} ${filter === 'kot' ? 'KOTs & Bills' : 'Recent Orders'}`;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  return (
    <div className="card glass-card full-screen-card">
      <OrdersHeader title="Orders" countLabel={countLabel} onNewOrder={onNewOrder} onAddTable={onAddTable} />
      <OrdersFilterTabs filter={filter} onChange={onFilterChange} />
      <OrdersGrid orders={orders} onOpen={openDetails} />
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
