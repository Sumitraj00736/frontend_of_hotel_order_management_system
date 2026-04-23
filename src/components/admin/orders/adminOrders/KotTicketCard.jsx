import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Printer } from 'lucide-react';
import '../../../../common/css/admin/orders/kotTicketCard.css';

const KotTicketCard = ({ order, onStatusChange, onPrint }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  
  const statusRef = useRef(null);
  const printRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusMenu(false);
      if (printRef.current && !printRef.current.contains(e.target)) setShowPrintMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalDishes = order.items.reduce((acc, i) => acc + i.quantity, 0);

  const handleStatusSelect = (val) => {
    setShowStatusMenu(false);
    onStatusChange(order._id, val);
  };

  const currentPrintStatus = order.status === 'served' ? 'Completed' :
                             order.status === 'cancelled' ? 'Cancelled' : 
                             order.status.charAt(0).toUpperCase() + order.status.slice(1);

  return (
    <div className="kot-ticket-container">
      <h3 className="kot-ticket-main-title">KOT {order.kotNo?.split('-')[1] || order._id?.slice(-4)}</h3>
      
      <div className="kot-ticket-info">
        <div className="kot-ticket-row">
          <span>Type: {order.orderType === 'dine_in' ? 'Dine In' : 
                       order.orderType === 'delivery' ? 'Delivery' :
                       order.orderType === 'pickup' ? 'Pick up' : 'Takeaway'}</span>
          <span>{order.table ? `Table: Table ${order.table.tableNumber}` : ''}</span>
        </div>
        <div className="kot-ticket-row">
          <span>Order By: {order.createdBy?.name || 'N/A'}</span>
        </div>
        <div className="kot-ticket-row">
          <span>Order At: {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
      </div>

      <div className="kot-ticket-divider-dashed" />
      
      <div className="kot-ticket-table-header">
        <span style={{ width: '40px' }}>S.N</span>
        <span style={{ flex: 1 }}>Dishes</span>
        <span style={{ width: '50px', textAlign: 'right' }}>QTY</span>
      </div>

      <div className="kot-ticket-divider-dashed" />

      <div className="kot-ticket-items">
        {order.items.map((item, idx) => (
          <div className="kot-ticket-item" key={item._id || idx}>
            <span style={{ width: '40px' }}>{idx + 1}.</span>
            <span style={{ flex: 1 }}>{item.menuItem?.name || item.name || 'Item'}</span>
            <span style={{ width: '50px', textAlign: 'right' }}>{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="kot-ticket-divider-dashed" />

      <div className="kot-ticket-totals">
        <span>Total (Dishes/QTY)</span>
        <span>{order.items.length}/{totalDishes}</span>
      </div>

      <div className="kot-ticket-divider-dashed" />

      <div className="kot-ticket-footer-info">
        <div>Printed By: {order.createdBy?.name || 'Admin'}</div>
        <div>Printed At: {new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
        <div className="kot-ticket-thank-you">Thank You!</div>
      </div>

      <div className="kot-ticket-actions">
        {/* Status Dropdown */}
        <div className="kot-ticket-dropdown" ref={statusRef}>
          <button 
            className="kot-action-btn"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            {currentPrintStatus} <ChevronDown size={16} />
          </button>
          
          {showStatusMenu && (
            <div className="kot-dropdown-menu">
               <div className="kot-dropdown-search">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                 <input type="text" placeholder="Search options..." />
               </div>
               <div className={`kot-dropdown-item ${currentPrintStatus === 'Pending' ? 'active text-danger' : ''}`} onClick={() => handleStatusSelect('pending')}>Pending</div>
               <div className={`kot-dropdown-item ${currentPrintStatus === 'Completed' ? 'active text-danger' : ''}`} onClick={() => handleStatusSelect('served')}>Completed</div>
               <div className={`kot-dropdown-item ${currentPrintStatus === 'Cancelled' ? 'active text-danger' : ''}`} onClick={() => handleStatusSelect('cancelled')}>Cancelled</div>
            </div>
          )}
        </div>

        {/* Print Button */}
        <div className="kot-ticket-dropdown" ref={printRef}>
          <div className="kot-action-btn-group">
            <button className="kot-action-btn print-icon-btn" onClick={() => onPrint(order._id)}>
              <Printer size={16} /> Print
            </button>
            <button className="kot-action-btn drop-icon-btn" onClick={() => setShowPrintMenu(!showPrintMenu)}>
              <ChevronDown size={14} />
            </button>
          </div>
          
          {showPrintMenu && (
            <div className="kot-dropdown-menu right-aligned">
               <div className="kot-dropdown-item" onClick={() => { setShowPrintMenu(false); onPrint(order._id); }}>Print KOT</div>
               <div className="kot-dropdown-item" onClick={() => { setShowPrintMenu(false); onPrint(order._id); }}>Print Invoice</div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default KotTicketCard;
