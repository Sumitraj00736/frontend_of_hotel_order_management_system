import React, { useMemo, useState } from 'react';

const itemsPerPage = 8; // 2 rows x 4 columns

const OrderDetailModal = ({
  order,
  paymentMethods,
  onChangePaymentMethod,
  onPay,
  onPrint,
  onClose
}) => {
  const [page, setPage] = useState(0);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil((order?.items?.length || 0) / itemsPerPage)),
    [order]
  );

  const items = useMemo(() => {
    const start = page * itemsPerPage;
    return order?.items?.slice(start, start + itemsPerPage) || [];
  }, [order, page]);

  if (!order) return null;

  return (
    <div className="modal-overlay fullscreen" onClick={onClose}>
      <div className="modal-panel fullscreen animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3 modal-header-line">
          <div>
            <div className="eyebrow">Order Detail</div>
            <h3 className="mb-0">Table {order.table?.tableNumber}</h3>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-light btn-elev" onClick={() => onPrint(order._id)}>
              🖨 Print Bill
            </button>
            <button className="btn btn-outline-light btn-elev" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="soft-card mb-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
            <div className="pill">Waiter: {order.createdBy?.name || 'N/A'}</div>
            <div className="pill">Kitchen: {order.kitchenAssigned?.name || 'Unassigned'}</div>
            <div className="pill">Spice: {order.spiceLevel || 'medium'}</div>
            <div className="pill">Time: {new Date(order.createdAt).toLocaleString()}</div>
          </div>
          {order.specialInstructions && <div className="muted-box mt-2">Notes: {order.specialInstructions}</div>}
        </div>

        <div className="modal-body-scroll soft-card">
          <div className="order-items-grid-paged">
            {items.map((item) => (
              <div key={item._id} className="order-item-card fixed">
                {item.menuItem?.imageUrl && (
                  <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="order-item-thumb large" />
                )}
                <div className="fw-semibold">
                  {item.menuItem?.name} x {item.quantity}
                </div>
                <div className="text-muted tiny-text">NPR {item.priceAtOrderTime}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="fw-bold fs-5">Total: NPR {order.totalAmount?.toFixed(2) ?? '0.00'}</div>
          <div className="d-flex gap-2 align-items-center">
            {order.status !== 'paid' && (
              <>
                <select
                  className="form-select form-select-sm w-auto"
                  value={paymentMethods[order._id] || 'cash'}
                  onChange={(e) => onChangePaymentMethod(order._id, e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="fonepay">Fonepay</option>
                </select>
                <button className="btn btn-success" onClick={() => onPay(order._id)}>
                  ✔ Mark Paid
                </button>
              </>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center gap-2 mt-2">
          <button
            className="btn btn-outline-light btn-sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
          <span className="small text-muted align-self-center">
            Page {page + 1} / {pageCount}
          </span>
          <button
            className="btn btn-outline-light btn-sm"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
