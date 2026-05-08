import React, { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import OrderDetailModal from '../checkout/OrderDetailModal.jsx';
import OrdersHeader from '../filters/OrdersHeader.jsx';
import OrdersFilterTabs from '../filters/OrdersFilterTabs.jsx';
import OrdersGrid from '../filters/OrdersGrid.jsx';
import OrderAnalytics from './OrderAnalytics.jsx';
import KotTicketCard from '../cards/KotTicketCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = ({
  orders = [],
  loading = false,
  kots = [],
  customers = [],
  menus = [],
  staff = [],
  paymentMethods,
  onChangePaymentMethod,
  onPay,
  onPrint,
  onKotPrint,
  onUpdateOrder,
  onKotStatusUpdate,
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
  const [searchTerm, setSearchTerm] = useState('');

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
    all: 'All Order History',
    analytics: 'Analytics'
  };

  const countLabel = `${total} ${filterLabels[filter] || 'Orders'}`;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  const displayOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const q = searchTerm.toLowerCase();
    return orders.filter(o => 
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.table?.tableNumber?.toString() || '').includes(q) ||
      (o.invoiceNo || o.kotNo || '').toLowerCase().includes(q)
    );
  }, [orders, searchTerm]);

  return (
    <div className="full-screen-card px-4 pt-1 pb-5 border-0" style={{ marginTop: '20px' }}>
      <div className="sticky-top pt-2 pb-3" style={{ 
        zIndex: 1020, 
        margin: '-24px -24px 20px -24px', 
        padding: '24px 24px 20px 24px', 
        borderBottom: '1px solid #eef1f6',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
      }}>
        <OrdersHeader 
          title="Orders" 
          countLabel={countLabel} 
          onNewOrder={onNewOrder} 
          onAddTable={onAddTable} 
          onFilterChange={onFilterChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <div className="mt-4">
          <OrdersFilterTabs filter={filter} onChange={onFilterChange} />
        </div>
      </div>
      
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
              className={`btn orders-filter-btn ${orderTypeFilter === t.id ? 'active' : ''}`}
              onClick={() => onOrderTypeChange?.(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="orders-data-section position-relative" style={{ minHeight: '400px' }}>
      
      {loading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-50" style={{ zIndex: 10, borderRadius: '16px', backdropFilter: 'blur(2px)' }}>
          <div className="d-flex flex-column align-items-center gap-3">
             <Loader2 className="animate-spin text-primary" size={42} />
             <div className="fw-700 text-dark opacity-75">Fetching latest data...</div>
          </div>
        </div>
      )}

      {filter === 'analytics' ? (
        <OrderAnalytics orders={orders} />
      ) : filter === 'kot' ? (
        <div className="kot-grid">
          {kots.length > 0 ? (
            kots.map(kot => (
              <KotTicketCard 
                key={kot._id}
                order={kot} 
                onStatusChange={onKotStatusUpdate}
                onPrint={onKotPrint}
              />
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <h5 className="text-muted">No active KOTs found</h5>
            </div>
          )}
        </div>
      ) : (
        <>
          <OrdersGrid 
            orders={displayOrders} 
            onOpen={openDetails} 
            filter={filter} 
            onPrint={onPrint}
            onStatusChange={async (orderId, status) => {
              await onUpdateOrder({ orderId, status });
            }}
          />
          {filter !== 'active' && (
            <div className="orders-pagination mt-4 d-flex justify-content-between align-items-center">
              <div className="orders-page-info fw-600 text-muted small">
                Page {page} of {totalPages}
              </div>
              <div className="orders-page-controls d-flex gap-2">
                <button
                  className="btn btn-sm btn-light border px-3"
                  disabled={page <= 1}
                  onClick={() => onPageChange?.(Math.max(1, page - 1))}
                >
                  Prev
                </button>
                <button
                  className="btn btn-sm btn-light border px-3"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                >
                  Next
                </button>
                <select
                  className="form-select form-select-sm border shadow-sm"
                  style={{ width: 'auto' }}
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
          )}
        </>
      )}
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
            const result = await onPay(id);
            return result;
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
