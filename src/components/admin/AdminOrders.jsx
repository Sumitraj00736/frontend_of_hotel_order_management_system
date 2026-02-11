import React from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-success";
    case "pending":
      return "bg-warning text-dark";
    case "cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

const AdminOrders = ({
  orders = [],
  paymentMethods,
  onChangePaymentMethod,
  onPay,
  onPrint,
}) => {
  return (
    <div className="card border-0 rounded-4 p-4 shadow-lg bg-dark text-light">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-semibold mb-1">Orders</h4>
          <div className="text-muted small">
            Manage and process active orders
          </div>
        </div>
        <span className="badge bg-secondary px-3 py-2 rounded-pill">
          {orders.length} Active
        </span>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center text-secondary py-5">
          <div className="fs-1">🧾</div>
          <div>No active orders</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 rounded-4 bg-secondary bg-opacity-10 border border-secondary"
            >
              {/* Top Row */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-semibold fs-5">
                  Table {order.table?.tableNumber}
                </div>
                <span className={`badge ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Info */}
              <div className="small text-secondary mb-2">
                Waiter: {order.createdBy?.name || "N/A"} | Kitchen:{" "}
                {order.kitchenAssigned?.name || "Unassigned"}
              </div>

              <div className="small text-secondary mb-3">
                Order Time:{" "}
                {new Date(order.createdAt).toLocaleString()}
              </div>

              {/* Items */}
              <div className="bg-dark rounded-3 p-3 mb-3 border border-secondary">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between small py-1"
                  >
                    <span>
                      {item.menuItem?.name} x {item.quantity}
                    </span>
                    <span>
                      ${item.priceAtOrderTime}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <button
                  className="btn btn-sm btn-outline-light rounded-pill px-3"
                  onClick={() => onPrint(order._id)}
                >
                  🖨 Print Bill
                </button>

                {order.status !== "paid" && (
                  <>
                    <select
                      className="form-select form-select-sm bg-dark text-light border-secondary w-auto"
                      value={paymentMethods[order._id] || "cash"}
                      onChange={(e) =>
                        onChangePaymentMethod(order._id, e.target.value)
                      }
                    >
                      <option value="cash">Cash</option>
                      <option value="fonepay">Fonepay</option>
                    </select>

                    <button
                      className="btn btn-sm btn-success rounded-pill px-3"
                      onClick={() => onPay(order._id)}
                    >
                      ✔ Mark Paid
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
