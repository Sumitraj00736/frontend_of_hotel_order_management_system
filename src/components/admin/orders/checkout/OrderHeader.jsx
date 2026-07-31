import React from 'react';
import { X, Printer, Zap, Download } from 'lucide-react';

const OrderHeader = ({ title, onClose, onPrint }) => {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white rounded-t-2xl">
      <h2 className="text-base font-semibold text-gray-800 tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition"
        >
          <Zap size={13} /> Quick Mode
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition"
        >
          <Download size={13} /> Download
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition"
        >
          <Printer size={13} /> Print Estimate
        </button>
        <button
          onClick={onClose}
          className="ml-1 flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrderHeader;
