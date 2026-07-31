import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Save, CreditCard, Receipt, PlusCircle } from 'lucide-react';
import AddItemsModal from '../addItems/AddItemsModal.jsx';
import OrderHeader from './OrderHeader.jsx';
import OrderItemsTable from './OrderItemsTable.jsx';
import OrderCustomerPanel from './OrderCustomerPanel.jsx';
import OrderPaymentPanel from './OrderPaymentPanel.jsx';
import OrderSummaryPanel from './OrderSummaryPanel.jsx';
import OrderInvoicePanel from './OrderInvoicePanel.jsx';
import ThermalReceiptModal from './ThermalReceiptModal.jsx';

const OrderDetailModal = ({
  order,
  menus = [],
  categories = [],
  staff = [],
  customers = [],
  paymentMethods,
  onChangePaymentMethod,
  onPay,
  onPrint,
  onUpdateOrder,
  onClose,
  initialShowAddItem = false,
}) => {
  const [localOrder, setLocalOrder] = useState(order);
  const [activeTab, setActiveTab] = useState('customer');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'paid');
  // Payment objects use { type, amount } — not method
  const [payments, setPayments] = useState([
    { type: order.paymentMethod || paymentMethods?.[order._id] || 'cash', amount: 0 },
  ]);
  const [showAddItem, setShowAddItem] = useState(initialShowAddItem);
  const [showReceipt, setShowReceipt] = useState(false);
  const [tenderAmount, setTenderAmount] = useState(0);
  const [finalOrder, setFinalOrder] = useState(null);

  const [assignedStaffId, setAssignedStaffId] = useState(order.assignedStaff?._id || '');
  const [customerName, setCustomerName] = useState(order.customerName || '');
  const [customerId, setCustomerId] = useState(order.customerId || '');
  const [discountType, setDiscountType] = useState(order.discountType || 'amount');
  const [discount, setDiscount] = useState(order.discountValue || 0);
  const [taxRate, setTaxRate] = useState(order.taxRate || 0);
  const [tipsAmount, setTipsAmount] = useState(order.tipsAmount || 0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date(order.updatedAt || order.createdAt));

  const updateTimersRef = React.useRef({});
  const pendingUpdateRef = React.useRef({ items: null, customerName: null, assignedStaff: null });
  const lastPayloadRef = React.useRef('');

  React.useEffect(() => {
    setLocalOrder(order);
    setPaymentStatus(order.paymentStatus || 'paid');
    setPayments([{ type: order.paymentMethod || paymentMethods?.[order._id] || 'cash', amount: 0 }]);
    setAssignedStaffId(order.assignedStaff?._id || '');
    setCustomerName(order.customerName || '');
    setCustomerId(order.customerId || '');
  }, [order, paymentMethods]);

  const items = localOrder?.items || [];
  const latestItemsRef = React.useRef(items);

  React.useEffect(() => {
    latestItemsRef.current = items;
  }, [items]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.isComplimentary ? 0 : (item.priceAtOrderTime || 0) * (item.quantity || 1)),
        0
      ),
    [items]
  );

  const discountValue =
    discountType === 'percent'
      ? (subtotal * Number(discount || 0)) / 100
      : Number(discount || 0);
  const taxableAmount = Math.max(0, subtotal - discountValue);
  const taxAmount = (taxableAmount * Number(taxRate || 0)) / 100;
  const total = Math.max(0, taxableAmount + taxAmount + Number(tipsAmount || 0));

  const buildItemPayload = (item) => ({
    menuItem: item.menuItem?._id || item.menuItem,
    quantity: item.quantity,
    isComplimentary: Boolean(item.isComplimentary),
    variantId: item.variantId || item.variant?._id,
    variantName: item.variantName,
    variantPrice: item.variantPrice,
    itemNote: item.itemNote,
  });

  const syncWithBackend = async (options = {}) => {
    const payloadItems = (pendingUpdateRef.current.items || latestItemsRef.current).map(buildItemPayload);
    const payload = { orderId: order._id, items: payloadItems };
    if (pendingUpdateRef.current.customerName !== null)
      payload.customerName = pendingUpdateRef.current.customerName;
    if (pendingUpdateRef.current.customerId !== undefined)
      payload.customerId = pendingUpdateRef.current.customerId;
    if (pendingUpdateRef.current.assignedStaff !== null)
      payload.assignedStaff = pendingUpdateRef.current.assignedStaff;

    const nextKey = JSON.stringify(payload);
    if (!options.force && nextKey === lastPayloadRef.current) return;
    lastPayloadRef.current = nextKey;

    setIsSyncing(true);
    try {
      const updated = await onUpdateOrder?.(payload);
      if (updated) {
        setLocalOrder(updated);
        setLastSaved(new Date());
      }
    } finally {
      setIsSyncing(false);
      pendingUpdateRef.current = { items: null, customerName: null, assignedStaff: null };
    }
  };

  const scheduleOrderSync = (updates = {}) => {
    const { items: nextItems, customerName: nextCustomer, assignedStaff: nextStaff } = updates;
    if (nextItems) {
      latestItemsRef.current = nextItems;
      setLocalOrder((prev) => ({ ...prev, items: nextItems }));
      pendingUpdateRef.current.items = nextItems;
    }
    if (typeof nextCustomer === 'string') pendingUpdateRef.current.customerName = nextCustomer;
    if (nextStaff !== undefined) pendingUpdateRef.current.assignedStaff = nextStaff;
    if (updateTimersRef.current.order) clearTimeout(updateTimersRef.current.order);
    updateTimersRef.current.order = setTimeout(() => syncWithBackend(), 1500);
  };

  const handleManualSave = () => {
    if (updateTimersRef.current.order) {
      clearTimeout(updateTimersRef.current.order);
      updateTimersRef.current.order = null;
    }
    syncWithBackend({ force: true });
  };

  const handleConfirmPay = async () => {
    try {
      setIsSyncing(true);
      const result = await onPay({
        orderId: order._id,
        payments,
        paymentStatus,
        customerName,
        customerId,
        discountType,
        discountValue: discount,
        tenderAmount: Number(tenderAmount || 0),
        taxRate: Number(taxRate || 0),
        tipsAmount: Number(tipsAmount || 0),
        roundOff: 0,
      });
      const merged = {
        ...localOrder,
        ...(result && typeof result === 'object' ? result : {}),
        items: (result?.items?.length ? result.items : localOrder?.items) || [],
        totalAmount: total,
        customerName,
        customerPhone: localOrder.customerPhone,
        deliveryAddress: localOrder.deliveryAddress,
      };
      setFinalOrder(merged);
      setShowReceipt(true);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddItem = (payload) => {
    // Use latestItemsRef (not stale `items` state) to avoid duplicate rows
    const existing = latestItemsRef.current.map((i) => ({ ...i }));
    const payloadMenuId = payload.menuItem?._id || payload.menuItem;
    const idx = existing.findIndex((i) => {
      const menuId = i.menuItem?._id || i.menuItem;
      const variantId = i.variantId || i.variant?._id || null;
      return menuId === payloadMenuId && (variantId || null) === (payload.variantId || null);
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
        const iMenuId = i.menuItem?._id || i.menuItem;
        const iVariantId = i.variantId || i.variant?._id || null;
        if (iMenuId === menuItemId && iVariantId === (variantId || null)) return { ...i, quantity: safeQty };
        return i;
      })
      .filter((i) => (i.quantity || 0) > 0);
    scheduleOrderSync({ items: updatedItems });
  };

  const updateItemNote = (menuItemId, variantId, note) => {
    const updatedItems = items.map((i) => {
      const iMenuId = i.menuItem?._id || i.menuItem;
      const iVariantId = i.variantId || i.variant?._id || null;
      if (iMenuId === menuItemId && iVariantId === (variantId || null)) return { ...i, itemNote: note };
      return i;
    });
    scheduleOrderSync({ items: updatedItems });
  };

  const toggleComplimentary = (menuId, variantId) => {
    const updatedItems = items.map((i) => {
      const iMenuId = i.menuItem?._id || i.menuItem;
      const iVariantId = i.variantId || i.variant?._id || null;
      if (iMenuId === menuId && iVariantId === (variantId || null)) return { ...i, isComplimentary: !i.isComplimentary };
      return i;
    });
    scheduleOrderSync({ items: updatedItems });
  };

  const assignStaff = async (staffId) => {
    setAssignedStaffId(staffId || '');
    scheduleOrderSync({ assignedStaff: staffId || null });
  };

  if (!localOrder) return null;

  const isPaid = order.status === 'paid';

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1200] flex bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full h-full bg-gray-50 flex flex-col overflow-hidden"
          initial={{ y: -40, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <OrderHeader
            title={`Checkout — Table ${order.table?.tableNumber || '–'}`}
            onClose={onClose}
            onPrint={() => onPrint(order._id)}
          />

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* ─── Left column: items + customer + remarks + payment ─── */}
            <div className="flex flex-col flex-1 min-w-0 gap-3 p-4 overflow-y-auto">
              {/* Section header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Order Items</h3>
                {!isPaid && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddItem(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition"
                    >
                      <PlusCircle size={13} /> Add Item
                    </button>
                  </div>
                )}
              </div>

              <OrderItemsTable
                items={items}
                onQtyChange={updateItemQuantity}
                onToggleComplimentary={toggleComplimentary}
                onRemove={(menuId, variantId) => updateItemQuantity(menuId, variantId, 0)}
                isPaid={isPaid}
              />

              <OrderCustomerPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                customerName={customerName}
                customerId={customerId}
                customers={customers}
                onCustomerChange={(id, name) => {
                  setCustomerId(id);
                  setCustomerName(name);
                  scheduleOrderSync({ customerName: name, customerId: id });
                }}
                staff={staff}
                assignedStaffId={assignedStaffId}
                onAssignStaff={assignStaff}
              />

              {/* Remarks */}
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm px-3 py-2">
                <input
                  className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
                  placeholder="Add remarks to invoice..."
                />
              </div>

              <OrderPaymentPanel
                payments={payments}
                onUpdatePayments={setPayments}
                totalToPay={total}
              />
            </div>

            {/* ─── Middle column: summary ─── */}
            <div className="w-80 flex flex-col gap-3 p-4 border-l border-gray-100 overflow-y-auto shrink-0">
              <h3 className="text-sm font-semibold text-gray-700">Bill Summary</h3>

              <OrderSummaryPanel
                subtotal={subtotal}
                discountType={discountType}
                discount={discount}
                onDiscountTypeChange={setDiscountType}
                onDiscountChange={setDiscount}
                taxRate={taxRate}
                onTaxRateChange={setTaxRate}
                tipsAmount={tipsAmount}
                onTipsChange={setTipsAmount}
                tenderAmount={tenderAmount}
                onTenderAmountChange={setTenderAmount}
                total={total}
              />

              {/* Sync status */}
              <p className="text-xs text-gray-400 text-center">
                {isSyncing
                  ? 'Syncing...'
                  : `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>

              {/* Action buttons */}
              {!isPaid ? (
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={handleManualSave}
                    disabled={isSyncing}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    <Save size={15} />
                    {isSyncing ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleConfirmPay}
                    disabled={isSyncing}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-hover transition shadow-md disabled:opacity-50"
                  >
                    <CreditCard size={15} />
                    {isSyncing ? 'Processing...' : 'Confirm Checkout'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setFinalOrder(order); setShowReceipt(true); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-green-700 border border-green-300 rounded-xl hover:bg-green-50 transition mt-auto"
                >
                  <Receipt size={15} /> Print Receipt
                </button>
              )}
            </div>

            {/* ─── Right column: invoice preview (independently scrollable) ─── */}
            <div className="w-96 flex flex-col p-4 border-l border-gray-100 shrink-0 overflow-hidden">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 shrink-0">Invoice Preview</h3>
              <div className="flex-1 overflow-y-auto">
                <OrderInvoicePanel
                  order={localOrder}
                  total={total}
                  staff={staff}
                  previewState={{
                    subtotal,
                    discountType,
                    discountValue: discount,
                    taxableAmount,
                    taxRate,
                    taxAmount,
                    tipsAmount,
                    roundOff: 0,
                    tenderAmount: Number(tenderAmount || 0),
                    paymentStatus,
                    paymentMethod: payments[0]?.type,
                    payments,
                    customerName,
                    assignedStaffId,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

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
          categories={categories}
        />
      )}

      {showReceipt && finalOrder && (
        <ThermalReceiptModal
          isOpen={showReceipt}
          order={finalOrder}
          storeName={finalOrder.branchName || finalOrder.orgName || 'Restaurant'}
          storePhone={finalOrder.branchPhone || ''}
          onClose={() => {
            setShowReceipt(false);
            onClose();
          }}
        />
      )}
    </AnimatePresence>,
    document.body
  );
};

export default OrderDetailModal;
