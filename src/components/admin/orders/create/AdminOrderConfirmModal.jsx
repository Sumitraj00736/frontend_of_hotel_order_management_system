import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, X, ShoppingCart, User } from 'lucide-react';

const AdminOrderConfirmModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  items = [], 
  staff = [], 
  assignedStaffId,
  tableNumber 
}) => {
  if (!open) return null;

  const totalAmount = items.reduce((sum, item) => sum + (item.priceAtOrderTime * item.quantity), 0);
  const selectedStaff = staff.find(s => s._id === assignedStaffId);

  return createPortal(
    <div className="checkout-overlay">
      <div className="checkout-panel" style={{ maxWidth: '500px', height: 'auto', maxHeight: '90vh', borderRadius: '20px', background: '#fff' }}>
        <div className="checkout-header p-4 border-bottom d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="icon-circle bg-success-soft text-success">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold">Confirm New Order</h5>
              <div className="text-muted small">Table {tableNumber || '-'}</div>
            </div>
          </div>
          <button className="btn-close-custom" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-4 overflow-auto" style={{ maxHeight: '60vh' }}>
          <div className="order-summary-card mb-4 bg-light p-3 rounded-3">
            <div className="fw-bold mb-2 small text-uppercase text-muted">Items Overview</div>
            {items.map((item, idx) => (
              <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                <div className="small">
                  <span className="fw-semibold">{item.quantity}x</span> {item.menuItem?.name || 'Item'}
                  {item.variantName && <span className="text-muted"> ({item.variantName})</span>}
                </div>
                <div className="small fw-semibold">Rs {(item.priceAtOrderTime * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="border-top mt-2 pt-2 d-flex justify-content-between align-items-baseline">
              <div className="fw-bold">Total Amount</div>
              <div className="h5 mb-0 fw-bold text-primary">Rs {totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="staff-assignment-card p-3 border rounded-3 border-dashed">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-primary-soft text-primary">
                <User size={18} />
              </div>
              <div>
                <div className="small text-muted">Assigned Waiter</div>
                <div className="fw-bold">{selectedStaff?.name || 'Unassigned'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-top bg-light rounded-bottom-4">
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary w-100 py-2 fw-bold" onClick={onClose}>
              Back to Items
            </button>
            <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" onClick={onConfirm}>
              <CheckCircle size={18} /> Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminOrderConfirmModal;
