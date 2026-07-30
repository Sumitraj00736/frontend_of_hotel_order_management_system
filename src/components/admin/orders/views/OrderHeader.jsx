import React, { useRef, useState, useEffect } from 'react';
import { UtensilsCrossed, Bike, ShoppingBag, ShoppingCart, ChevronDown, MoreVertical, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHeader = ({ title, countLabel, onNewOrder, onAddTable, onFilterChange, searchTerm, onSearchChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef(null);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const orderTypes = [
    { id: 'dine_in', label: 'Dine In Order', icon: <UtensilsCrossed size={16} className="text-orange-500" /> },
    { id: 'delivery', label: 'Delivery Order', icon: <Bike size={16} className="text-orange-500" /> },
    { id: 'takeaway', label: 'Take Away', icon: <ShoppingBag size={16} className="text-orange-500" /> },
    { id: 'pickup', label: 'Pick Up', icon: <ShoppingCart size={16} className="text-orange-500" /> }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-6 shadow-sm mb-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {title || 'Orders'}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time order tracking & administration
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2 md:self-center">
          {/* Search Input Container */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearching ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative flex items-center"
                >
                  <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    className="w-full bg-slate-50 text-slate-800 text-xs font-semibold pl-9 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  <button
                    className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                    onClick={() => { setIsSearching(false); onSearchChange(''); }}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                  onClick={() => setIsSearching(true)}
                  title="Search Orders"
                >
                  <Search size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Create Order Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-bold transition-all shadow-sm ${
                showDropdown 
                  ? 'bg-orange-500 border-orange-500 text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Create Order
              <ChevronDown size={14} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-3 w-56 z-[1050]"
                >
                  <h4 className="text-xxs font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">Select Order Mode</h4>
                  <div className="flex flex-col gap-1">
                    {orderTypes.map((type) => (
                      <button
                        key={type.id}
                        className="flex items-center gap-2.5 w-full text-left px-2 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                        onClick={() => {
                          setShowDropdown(false);
                          onNewOrder?.(type.id);
                        }}
                      >
                        <div className="flex items-center justify-center bg-orange-50 rounded-md p-1.5">
                          {type.icon}
                        </div>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Table Button */}
          <button
            className="relative overflow-hidden font-bold rounded-lg text-xs px-4 py-2 shadow-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-150"
            onClick={() => onAddTable?.()}
          >
            + Add Table
          </button>

          {/* More Action Menu */}
          <div className="relative" ref={moreMenuRef}>
            <button
              className="p-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <MoreVertical size={18} />
            </button>

            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-100 py-1 w-44 z-[1050]"
                >
                  <div className="px-3 py-1.5 font-extrabold text-slate-400 text-xxs uppercase tracking-wider border-b border-slate-50 mb-1">
                    View Records
                  </div>
                  <button
                    className="flex w-full px-3 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => { onFilterChange?.('paid'); setShowMoreMenu(false); }}
                  >
                    💰 Paid Orders
                  </button>
                  <button
                    className="flex w-full px-3 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => { onFilterChange?.('cancelled'); setShowMoreMenu(false); }}
                  >
                    🚫 Cancelled Orders
                  </button>
                  <button
                    className="flex w-full px-3 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => { onFilterChange?.('all'); setShowMoreMenu(false); }}
                  >
                    📑 All Orders
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Stats Aligned Horizontally */}
      <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-slate-600">
            <strong className="text-slate-800 font-extrabold">{countLabel || '0 Orders'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-slate-600">Active Sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-slate-600">Kitchen Queue</span>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
