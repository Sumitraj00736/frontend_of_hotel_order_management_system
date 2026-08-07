import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import OrderDetailModal from "../checkout/OrderDetailModal.jsx";
import OrderHeader from "./OrderHeader.jsx";
import OrdersFilterTabs from "./OrdersFilterTabs.jsx";
import OrdersGrid from "./OrdersGrid.jsx";
import OrderAnalytics from "./OrderAnalytics.jsx";

const AdminOrders = ({
  orders = [],
  loading = false,
  kots = [],
  customers = [],
  menus = [],
  staff = [],
  paymentMethods = {},
  onChangePaymentMethod,
  onPay,
  onPrint,
  onKotPrint,
  onUpdateOrder,
  onKotStatusUpdate,
  page = 1,
  limit = 12,
  total = 0,
  filter = "active",
  onFilterChange,
  onPageChange,
  onLimitChange,
  onNewOrder,
  onAddTable,
  categories = [],
  orderTypeFilter = "",
  onOrderTypeChange,
}) => {
  const [selected, setSelected] = useState(null);
  const [autoAddItem, setAutoAddItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openDetails = (order, triggerAdd = false) => {
    if (!paymentMethods[order._id]) {
      onChangePaymentMethod(order._id, order.paymentMethod || "cash");
    }
    setAutoAddItem(triggerAdd);
    setSelected(order);
  };
  const closeDetails = () => setSelected(null);

  const filterLabels = {
    active: "Active Orders",
    kot: "KOTs & Bills",
    paid: "Paid History",
    cancelled: "Cancelled Records",
    all: "All Order History",
    analytics: "Analytics",
  };

  const countLabel = `${total} ${filterLabels[filter] || "Orders"}`;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  const displayOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const q = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        (o.customerName || "").toLowerCase().includes(q) ||
        (o.table?.tableNumber?.toString() || "").includes(q) ||
        (o.invoiceNo || o.kotNo || "").toLowerCase().includes(q),
    );
  }, [orders, searchTerm]);

  return (
    <div className="flex flex-col h-screen bg-slate-50/30 overflow-hidden">
      {/* Sticky Header Wrapper */}
      <div className="shrink-0 pt-4 pb-2 bg-slate-50/80 backdrop-blur-md mb-6 border-b border-slate-100/50">
        <OrderHeader
          title="Orders"
          countLabel={countLabel}
          onNewOrder={onNewOrder}
          onAddTable={onAddTable}
          onFilterChange={onFilterChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <div className="mt-2">
          <OrdersFilterTabs filter={filter} onChange={onFilterChange} />
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-visible px-4 pb-12">
        {" "}
        {/* Mode Filters (for History filters) */}
        {["all", "paid", "cancelled"].includes(filter) && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {[
              { id: "", label: "All Modes" },
              { id: "dine_in", label: "Dine In" },
              { id: "delivery", label: "Delivery" },
              { id: "takeaway", label: "Takeaway" },
              { id: "pickup", label: "Pickup" },
            ].map((t) => (
              <button
                key={t.id}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  orderTypeFilter === t.id
                    ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/10"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                }`}
                onClick={() => onOrderTypeChange?.(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {/* Main Content Area */}
        <div className="relative z-0 min-h-[400px] w-full overflow-visible">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-2xl z-10 flex items-center justify-center transition-all">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-orange-500" size={36} />
                <div className="text-xs font-bold text-slate-600">
                  Fetching latest data...
                </div>
              </div>
            </div>
          )}

          {filter === "analytics" ? (
            <OrderAnalytics orders={orders} />
          ) : filter === "kot" ? (
            <OrdersGrid
              orders={kots}
              onOpen={openDetails}
              filter="kot"
              onPrint={onKotPrint}
              onStatusChange={onKotStatusUpdate}
            />
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

              {/* Pagination Controls */}
              {filter !== "active" && (
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8 border-t border-slate-100 pt-6">
                  <div className="text-xs font-bold text-slate-400">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-colors"
                      disabled={page <= 1}
                      onClick={() => onPageChange?.(Math.max(1, page - 1))}
                    >
                      Prev
                    </button>
                    <button
                      className="px-3.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-colors"
                      disabled={page >= totalPages}
                      onClick={() =>
                        onPageChange?.(Math.min(totalPages, page + 1))
                      }
                    >
                      Next
                    </button>
                    <select
                      className="text-xs font-bold border border-slate-200 rounded-lg bg-white px-2 py-1.5 text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
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
        {/* Details Modal */}
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
    </div>
  );
};

export default AdminOrders;
