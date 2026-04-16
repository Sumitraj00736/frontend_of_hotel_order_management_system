import React from 'react';

const OrderCard = ({ order, onOpen }) => {
  const isOnline = order.source === 'guest';
  const statusColorMap = {
    pending: 'var(--status-pending)',
    preparing: 'var(--status-preparing)',
    ready: 'var(--status-ready)',
    served: 'var(--status-served)',
    paid: 'var(--status-paid)',
    cancelled: 'var(--status-cancelled)'
  };

  const statusLabelMap = {
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    served: 'Served',
    paid: 'Paid',
    cancelled: 'Cancelled'
  };

  return (
    <div className={`kot-card status-${order.status}`}>
      <div className="kot-header">
        <div className="kot-badge-row">
          <span className={`kot-badge ${isOnline ? 'online' : 'dine-in'}`}>
            {isOnline ? '🌐 Online' : '🍽️ Dine In'}
          </span>
          <span className="kot-status-badge" style={{ backgroundColor: statusColorMap[order.status] || '#94a3b8' }}>
            {statusLabelMap[order.status] || order.status}
          </span>
        </div>
        <div className="kot-title-row">
          <div className="kot-title">#{order.kotNo?.split('-')[1] || order._id?.slice(-4)}</div>
          <div className="kot-table-circle">
            {order.table?.tableNumber || '?'}
          </div>
        </div>
      </div>

      <div className="kot-meta-info">
        <div className="meta-item">
          <span className="meta-label">Waiter:</span>
          <span className="meta-value">{order.createdBy?.name || 'N/A'}</span>
        </div>
        <div className="meta-item text-end">
          <span className="meta-label">Time:</span>
          <span className="meta-value">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="kot-divider" />
      
      <div className="kot-items-list">
        {order.items.map((item, idx) => (
          <div key={item._id || idx} className="kot-item">
            <div className="item-name">
              <span className="item-qty">{item.quantity}x</span>
              <span>{item.menuItem?.name || item.name || 'Item'}</span>
            </div>
            {item.variantName && <div className="item-variant">{item.variantName}</div>}
          </div>
        ))}
      </div>

      <div className="kot-divider" />

      <div className="kot-total-row">
        <div className="total-amount">Rs {order.finalAmount?.toLocaleString() || order.totalAmount?.toLocaleString()}</div>
        <div className="item-count">{order.items.length} Items</div>
      </div>

      <div className="kot-actions">
        <button className="primary-action-btn" onClick={() => onOpen(order)}>
          View & Print
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
