import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Printer } from 'lucide-react';

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

  const totalDishes = (order?.items || []).reduce((acc, i) => acc + i.quantity, 0);

  const handleStatusSelect = (val) => {
    setShowStatusMenu(false);
    onStatusChange(order._id, val);
  };

  const currentPrintStatus = order.status === 'served' ? 'Completed' :
                             order.status === 'cancelled' ? 'Cancelled' : 
                             order.status.charAt(0).toUpperCase() + order.status.slice(1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative hover:shadow-md transition-shadow">
      <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-2 mb-3">
        KOT {order.kotNo?.split('-')[1] || order._id?.slice(-4)}
      </h3>
      
      {/* KOT Info Details */}
      <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-500 mb-3">
        <div className="flex justify-between">
          <span>Type: {order.orderType === 'dine_in' ? 'Dine In' : 
                       order.orderType === 'delivery' ? 'Delivery' :
                       order.orderType === 'pickup' ? 'Pick up' : 'Takeaway'}</span>
          {order.table && <span className="font-bold text-slate-700">Table {order.table.tableNumber}</span>}
        </div>
        <div>Order By: {order.createdBy?.name || 'N/A'}</div>
        <div>Order At: {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
        
        {(order.orderType === 'delivery' || order.orderType === 'takeaway') && (
          <div className="mt-2 p-2.5 bg-orange-50 border border-orange-100 rounded-lg text-slate-600 font-medium">
            <div className="font-extrabold text-xs text-orange-700 mb-1">Customer Details</div>
            <div><strong>Name:</strong> {order.customerName || order.customerId?.name || 'Walk-in'}</div>
            {order.customerPhone && <div><strong>Phone:</strong> {order.customerPhone}</div>}
            {order.deliveryAddress && <div className="truncate"><strong>Address:</strong> {order.deliveryAddress}</div>}
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-slate-200 my-2" />
      
      {/* Items Header */}
      <div className="flex text-[11px] font-bold text-slate-400 py-1 uppercase tracking-wider">
        <span className="w-10">S.N</span>
        <span className="flex-1">Dishes</span>
        <span className="w-12 text-right">QTY</span>
      </div>

      <div className="border-t border-dashed border-slate-200 my-2" />

      {/* Items List */}
      <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
        {(order?.items || []).map((item, idx) => (
          <div className="flex text-xs font-semibold text-slate-700" key={item._id || idx}>
            <span className="w-10 text-slate-400">{idx + 1}.</span>
            <span className="flex-1 truncate">{item.menuItem?.name || item.name || 'Item'}</span>
            <span className="w-12 text-right font-bold text-slate-800">{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-slate-200 my-3" />

      {/* Totals */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-600">
        <span>Total (Dishes/QTY)</span>
        <span className="text-slate-800">{(order?.items || []).length} / {totalDishes}</span>
      </div>

      <div className="border-t border-dashed border-slate-200 my-3" />

      {/* Footer Info */}
      <div className="flex flex-col gap-0.5 text-[9px] font-semibold text-slate-400 text-center uppercase tracking-wide">
        <div>Printed By: {order.createdBy?.name || 'Admin'}</div>
        <div>Printed At: {new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
        <div className="text-orange-500 font-extrabold mt-1">Thank You!</div>
      </div>

      {/* KOT Actions */}
      <div className="flex gap-2 border-t border-slate-100 pt-3 mt-4">
        {/* Status Dropdown */}
        <div className="relative flex-1" ref={statusRef}>
          <button 
            className="flex items-center justify-between w-full px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            {currentPrintStatus}
            <ChevronDown size={14} />
          </button>
          
          {showStatusMenu && (
            <div className="absolute left-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-slate-100 py-1 w-full z-10">
              <div 
                className={`px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer ${currentPrintStatus === 'Pending' ? 'bg-orange-50/50 text-orange-600' : ''}`}
                onClick={() => handleStatusSelect('pending')}
              >
                Pending
              </div>
              <div 
                className={`px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer ${currentPrintStatus === 'Completed' ? 'bg-orange-50/50 text-orange-600' : ''}`}
                onClick={() => handleStatusSelect('served')}
              >
                Completed
              </div>
              <div 
                className={`px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer ${currentPrintStatus === 'Cancelled' ? 'bg-orange-50/50 text-orange-600' : ''}`}
                onClick={() => handleStatusSelect('cancelled')}
              >
                Cancelled
              </div>
            </div>
          )}
        </div>

        {/* Print Button Group */}
        <div className="relative flex-1" ref={printRef}>
          <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white">
            <button 
              className="flex items-center justify-center gap-1.5 flex-1 px-2.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border-r border-slate-200 transition-all"
              onClick={() => onPrint(order._id)}
            >
              <Printer size={13} />
              Print
            </button>
            <button 
              className="px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all"
              onClick={() => setShowPrintMenu(!showPrintMenu)}
            >
              <ChevronDown size={12} />
            </button>
          </div>
          
          {showPrintMenu && (
            <div className="absolute right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border border-slate-100 py-1 w-32 z-10">
              <div 
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                onClick={() => { setShowPrintMenu(false); onPrint(order._id, 'kot'); }}
              >
                Print KOT
              </div>
              <div 
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                onClick={() => { setShowPrintMenu(false); onPrint(order._id, 'invoice'); }}
              >
                Print Invoice
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KotTicketCard;
