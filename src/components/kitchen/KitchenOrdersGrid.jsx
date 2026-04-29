import React from "react";
import { Clock, ChefHat, Utensils, AlertCircle } from "lucide-react";
import "../../common/css/kitchen/KitchenOrders.css";

const statusColor = (status) => {
  const base = "chip";
  if (status === "served") return `${base} chip-served`;
  if (status === "ready") return `${base} chip-ready`;
  if (status === "preparing") return `${base} chip-preparing`;
  if (status === "paid") return `${base} chip-paid`;
  return base;
};

const KitchenOrdersGrid = ({ orders, onUpdateStatus }) => {
  return (
    <div className="kitchen-container">
      <div className="kitchen-grid">
        {orders.map((order) => (
          <div key={order._id} className="k-card">
            <div className="k-header">
              <div className="k-title">
                <Utensils size={18} className="text-muted" />
                <div>
                  <div className="eyebrow">Table</div>
                  <div className="k-table">#{order.table?.tableNumber || "N/A"}</div>
                </div>
              </div>
              <div className="k-status">
                <span className={statusColor(order.status)}>{order.status}</span>
                <div className="tiny-text text-muted">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="k-meta">
              <span className="pill subtle">
                <ChefHat size={14} /> {order.kitchenAssigned?.name || "Unassigned"}
              </span>
              <span className="pill subtle">
                <Clock size={14} /> {order.spiceLevel || "Medium"}
              </span>
            </div>

            <div className="k-items">
              {order.items.map((item, idx) => (
                <div key={item._id || `${order._id}-${idx}`} className="k-item">
                  <div className="k-item-name">{item.menuItem?.name}</div>
                  <div className="k-item-qty">×{item.quantity}</div>
                </div>
              ))}
            </div>

            {order.specialInstructions && (
              <div className="k-note">
                <AlertCircle size={14} /> <span>{order.specialInstructions}</span>
              </div>
            )}

            <div className="k-actions">
              <button className="k-btn ghost" onClick={() => onUpdateStatus(order._id, "preparing")}>
                Prep
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
    </div>
  );
};

export default KitchenOrdersGrid;