import React from "react";
import { Clock, ChefHat, CheckCircle, Utensils, AlertCircle } from "lucide-react";

const statusColor = (status) => {
  if (status === "served") return "chip chip-served";
  if (status === "ready") return "chip chip-ready";
  if (status === "preparing") return "chip chip-preparing";
  if (status === "paid") return "chip chip-paid";
  return "chip";
};

const KitchenOrdersGrid = ({ orders, onUpdateStatus }) => {
  return (
    <div className="kitchen-grid full-height">
      {orders.map((order) => (
        <div key={order._id} className="k-card">
          <div className="k-header">
            <div className="k-title">
              <Utensils size={18} />
              <div>
                <div className="eyebrow">Table</div>
                <div className="k-table">#{order.table?.tableNumber || "N/A"}</div>
              </div>
            </div>
            <div className="k-status">
              <span className={statusColor(order.status)}>{order.status}</span>
              <div className="tiny-text text-muted">
                {new Date(order.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="k-meta">
            <span className="pill subtle">
              <ChefHat size={14} /> {order.kitchenAssigned?.name || "Unassigned"}
            </span>
            <span className="pill subtle">
              <Clock size={14} /> Spice: {order.spiceLevel || "medium"}
            </span>
          </div>

          <div className="k-items">
            {order.items.map((item) => (
              <div key={item._id} className="k-item">
                <div className="k-item-name">{item.menuItem?.name}</div>
                <div className="k-item-qty">x{item.quantity}</div>
              </div>
            ))}
          </div>

          {order.specialInstructions && (
            <div className="k-note">
              <AlertCircle size={14} /> {order.specialInstructions}
            </div>
          )}

          <div className="k-actions">
            <button className="k-btn ghost" onClick={() => onUpdateStatus(order._id, "preparing")}>
              Preparing
            </button>
            <button className="k-btn warn" onClick={() => onUpdateStatus(order._id, "ready")}>
              Ready
            </button>
            <button className="k-btn success" onClick={() => onUpdateStatus(order._id, "served")}>
              Served
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KitchenOrdersGrid;
