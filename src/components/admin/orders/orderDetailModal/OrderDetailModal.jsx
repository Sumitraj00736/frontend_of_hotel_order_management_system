import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import AddItemsModal from '../addItemsModal/AddItemsModal.jsx';
import OrderHeader from './OrderHeader.jsx';
import OrderItemsTable from './OrderItemsTable.jsx';
import OrderCustomerPanel from './OrderCustomerPanel.jsx';
import OrderPaymentPanel from './OrderPaymentPanel.jsx';
import OrderSummaryPanel from './OrderSummaryPanel.jsx';
import OrderInvoicePanel from './OrderInvoicePanel.jsx';
import '../../../../common/css/admin/orders/orderDetail.css';

const OrderDetailModal = ({
  order,
  menus = [],
  staff = [],
  paymentMethods,
  onChangePaymentMethod,
  onPay,
  onPrint,
  onUpdateOrder,
  onClose
}) => {
  const [localOrder, setLocalOrder] = useState(order);
  const [activeTab, setActiveTab] = useState('customer');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'paid');
  const [paymentMode, setPaymentMode] = useState(order.paymentMethod || paymentMethods?.[order._id] || 'cash');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const updateTimersRef = React.useRef({});
  const pendingUpdateRef = React.useRef({ items: null, customerName: null, assignedStaff: null });
  const lastPayloadRef = React.useRef('');
  const [assignedStaffId, setAssignedStaffId] = useState(order.assignedStaff?._id || '');
  const [customerName, setCustomerName] = useState(order.customerName || '');

  React.useEffect(() => {
    setLocalOrder(order);
    setPaymentStatus(order.paymentStatus || 'paid');
    setPaymentMode(order.paymentMethod || paymentMethods?.[order._id] || 'cash');
    setAssignedStaffId(order.assignedStaff?._id || '');
    setCustomerName(order.customerName || '');
  }, [order, paymentMethods]);

  const items = localOrder?.items || [];
  const latestItemsRef = React.useRef(items);

  React.useEffect(() => {
    latestItemsRef.current = items;
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.isComplimentary ? 0 : (item.priceAtOrderTime || 0) * (item.quantity || 1)), 0),
    [items]
  );
  const [discountType, setDiscountType] = useState(order.discountType || 'amount');
  const [discount, setDiscount] = useState(order.discountValue || 0);
  const discountValue =
    discountType === 'percent'
      ? (subtotal * Number(discount || 0)) / 100
      : Number(discount || 0);
  const total = Math.max(0, subtotal - discountValue);

  const buildItemPayload = (item) => ({
    menuItem: item.menuItem?._id || item.menuItem,
    quantity: item.quantity,
    isComplimentary: Boolean(item.isComplimentary),
    variantId: item.variantId || item.variant?._id,
    variantName: item.variantName,
    variantPrice: item.variantPrice,
    itemNote: item.itemNote
  });

  const scheduleOrderSync = ({ items: nextItems, customerName: nextCustomer, assignedStaff: nextStaff } = {}) => {
    if (nextItems) {
      latestItemsRef.current = nextItems;
      setLocalOrder((prev) => ({ ...prev, items: nextItems }));
      pendingUpdateRef.current.items = nextItems;
    }
    if (typeof nextCustomer === 'string') {
      pendingUpdateRef.current.customerName = nextCustomer;
    }
    if (nextStaff !== undefined) {
      pendingUpdateRef.current.assignedStaff = nextStaff;
    }
    if (updateTimersRef.current.order) {
      clearTimeout(updateTimersRef.current.order);
    }
    updateTimersRef.current.order = setTimeout(async () => {
      const payloadItems = (pendingUpdateRef.current.items || latestItemsRef.current).map((i) => buildItemPayload(i));
      const payload = {
        orderId: order._id,
        items: payloadItems
      };
      if (pendingUpdateRef.current.customerName !== null) {
        payload.customerName = pendingUpdateRef.current.customerName;
      }
      if (pendingUpdateRef.current.assignedStaff !== null) {
        payload.assignedStaff = pendingUpdateRef.current.assignedStaff;
      }
      const nextPayloadKey = JSON.stringify(payload);
      if (nextPayloadKey === lastPayloadRef.current) return;
      lastPayloadRef.current = nextPayloadKey;
      const updated = await onUpdateOrder?.(payload);
      if (updated) setLocalOrder(updated);
      pendingUpdateRef.current = { items: null, customerName: null, assignedStaff: null };
    }, 500);
  };

  const handleAddItem = (payload) => {
    const existing = items.map((i) => ({ ...i }));
    const idx = existing.findIndex((i) => {
      const menuId = i.menuItem?._id || i.menuItem;
      const variantId = i.variantId || i.variant?._id || null;
      return menuId === payload.menuItem && (variantId || null) === (payload.variantId || null);
    });
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], quantity: (existing[idx].quantity || 0) + payload.quantity };
    } else {
      existing.push(payload);
    }
    scheduleOrderSync({ items: existing });
  };

  const updateItemQuantity = (menuItemId, variantId, nextQty) => {
    const safeQty = Number(nextQty || 0);
    const updatedItems = items
      .map((i) => {
        const itemMenuId = i.menuItem?._id || i.menuItem;
        const itemVariantId = i.variantId || i.variant?._id || null;
        if (itemMenuId === menuItemId && itemVariantId === (variantId || null)) {
          return { ...i, quantity: safeQty };
        }
        return i;
      })
      .filter((i) => (i.quantity || 0) > 0);

    scheduleOrderSync({ items: updatedItems });
  };

  const updateItemNote = (menuItemId, variantId, note) => {
    const updatedItems = items.map((i) => {
      const itemMenuId = i.menuItem?._id || i.menuItem;
      const itemVariantId = i.variantId || i.variant?._id || null;
      if (itemMenuId === menuItemId && itemVariantId === (variantId || null)) {
        return { ...i, itemNote: note };
      }
      return i;
    });
    scheduleOrderSync({ items: updatedItems });
  };

  const toggleComplimentary = (menuId, variantId) => {
    const updatedItems = items.map((i) => {
      const itemMenuId = i.menuItem?._id || i.menuItem;
      const itemVariantId = i.variantId || i.variant?._id || null;
      if (itemMenuId === menuId && itemVariantId === (variantId || null)) {
        return { ...i, isComplimentary: !i.isComplimentary };
      }
      return i;
    });
    scheduleOrderSync({ items: updatedItems });
  };

  const assignStaff = async (staffId) => {
    setAssignedStaffId(staffId || '');
    scheduleOrderSync({ assignedStaff: staffId || null });
  };

  const updateCustomerName = (nextName) => {
    setCustomerName(nextName);
    scheduleOrderSync({ customerName: nextName });
  };

  if (!localOrder) return null;

  return createPortal(
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-panel" onClick={(e) => e.stopPropagation()}>
        <OrderHeader
          title={`Checkout - Table ${order.table?.tableNumber || '-'}`}
          onClose={onClose}
          onPrint={() => onPrint(order._id)}
        />

        <div className="checkout-body">
          <div className="checkout-left">
            <div className="section-title-row">
              <div className="section-title">Items</div>
              <div className="section-actions">
                <button className="ghost-btn small">Complimentary</button>
                <button className="ghost-btn small" onClick={() => setShowAddItem(true)}>+ Add Item</button>
              </div>
            </div>

            <OrderItemsTable
              items={items}
              onQtyChange={updateItemQuantity}
              onToggleComplimentary={toggleComplimentary}
              onRemove={(menuId, variantId) => updateItemQuantity(menuId, variantId, 0)}
            />

            <OrderCustomerPanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              customerName={customerName}
              onCustomerChange={updateCustomerName}
            />

            <div className="remarks-card">
              <input placeholder="Add remarks to invoice" />
            </div>

            <div className="tender-card">
              <div className="label">Tender Amount</div>
              <input placeholder="Rs 0.00" />
            </div>

            <OrderPaymentPanel
              paymentStatus={paymentStatus}
              paymentMode={paymentMode}
              onStatusChange={setPaymentStatus}
              onModeChange={(mode) => {
                setPaymentMode(mode);
                onChangePaymentMethod(order._id, mode);
              }}
            />
          </div>

          <OrderSummaryPanel
            subtotal={subtotal}
            discountType={discountType}
            discount={discount}
            onDiscountTypeChange={setDiscountType}
            onDiscountChange={setDiscount}
            total={total}
          />

          <div className="checkout-right">
            <OrderInvoicePanel order={order} total={total} />
            <div className="net-card">
              <div>
                <div className="text-muted small">Net sales amount</div>
                <div className="fw-semibold">Rs {total.toFixed(2)}</div>
              </div>
              {order.paymentStatus === 'paid' ? (
                <button className="btn btn-outline-light" disabled>Paid</button>
              ) : (
                <button className="btn btn-danger" onClick={() => onPay({ orderId: order._id, paymentMethod: paymentMode, paymentStatus })}>
                  Confirm Checkout
                </button>
              )}
            </div>
          </div>
        </div>

        {showAddItem && (
          <AddItemsModal
            open={showAddItem}
            onClose={() => setShowAddItem(false)}
            menus={menus}
            staff={staff}
            assignedStaffId={assignedStaffId}
            onAssignStaff={assignStaff}
            orderTableNumber={order.table?.tableNumber}
            items={items}
            onAddItem={handleAddItem}
            onUpdateItemQuantity={updateItemQuantity}
            onUpdateItemNote={updateItemNote}
          />
        )}
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailModal;
