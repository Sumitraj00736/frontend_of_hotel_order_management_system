/**
 * kitchen/orders/KitchenOrderCard.jsx
 * Kitchen order card — orange & white theme, no black, no purple.
 * Shows: table, order #, time, items (name + qty only), chef, status.
 */
import React from 'react';
import { ChefHat, Flame, AlertTriangle, Clock, CheckCheck, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import KitchenStatusBadge from '../common/KitchenStatusBadge.jsx';

/* ─── Top accent strip color per status ─── */
const ACCENT = {
  pending:   'from-orange-200  to-orange-300',
  preparing: 'from-blue-400   to-blue-500',
  ready:     'from-orange-400  to-amber-500',
  served:    'from-emerald-400 to-emerald-500',
  paid:      'from-orange-400  to-orange-500',
};

/* ─── Card background tint per status ─── */
const CARD_BG = {
  pending:   'bg-white',
  preparing: 'bg-blue-50/20',
  ready:     'bg-orange-50/30',
  served:    'bg-emerald-50/20',
  paid:      'bg-orange-50/20',
};

/* ─── Action button config ─── */
const ACTIONS = [
  {
    label: 'Prep',
    status: 'preparing',
    icon: Play,
    className: 'border border-orange-200 text-orange-600 hover:bg-orange-50 bg-white',
  },
  {
    label: 'Ready',
    status: 'ready',
    icon: Flame,
    className: 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-400 shadow-sm shadow-amber-200',
  },
  {
    label: 'Served',
    status: 'served',
    icon: CheckCheck,
    className: 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400 shadow-sm shadow-emerald-200',
  },
];

const KitchenOrderCard = ({ order, onUpdateStatus }) => {
  const accent = ACCENT[order.status]  || ACCENT.pending;
  const cardBg = CARD_BG[order.status] || CARD_BG.pending;

  const orderTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  /* Elapsed time in minutes */
  const elapsedMin = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);

  const chefName = order.kitchenAssigned?.name || null;

  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, duration: 0.4 }}
      className={`relative rounded-2xl border border-orange-100 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 ${cardBg}`}
    >

      {/* ─── Status accent top strip ─── */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent} shrink-0`} />

      {/* ─── Card Header ─── */}
      <div className="flex items-start justify-between gap-3 px-4 pt-3.5 pb-3 border-b border-orange-100">
        <div className="flex items-center gap-3">

          {/* Table number badge — orange theme, no black */}
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 leading-none">
              {order.table?.tableNumber ? 'TBL' : 'T/O'}
            </span>
            <span className="text-[18px] font-extrabold leading-tight">
              {order.table?.tableNumber || '—'}
            </span>
          </div>

          {/* Order number + time */}
          <div>
            <div className="text-[13px] font-bold text-orange-600 leading-tight">
              Order #{(order._id || '').slice(-5).toUpperCase()}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock size={11} className="text-orange-300" />
              <span className="text-[11px] text-slate-500 font-medium">{orderTime}</span>
              {elapsedMin > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  elapsedMin > 20 ? 'bg-rose-100 text-rose-600' :
                  elapsedMin > 10 ? 'bg-amber-100 text-amber-600' :
                                    'bg-orange-50 text-orange-400'
                }`}>
                  {elapsedMin}m ago
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <KitchenStatusBadge status={order.status} />
      </div>

      {/* ─── Chef pill — only shown when assigned ─── */}
      {chefName && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50/50 border-b border-orange-100">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-700 bg-white border border-orange-200 px-2.5 py-1 rounded-lg">
            <ChefHat size={12} className="text-orange-500" />
            {chefName}
          </span>
          {order.spiceLevel && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-700 bg-white border border-orange-200 px-2.5 py-1 rounded-lg">
              <Flame size={12} className="text-orange-400" />
              {order.spiceLevel}
            </span>
          )}
        </div>
      )}

      {/* ─── Items List — only name + qty, NO IDs ─── */}
      <div className="flex-1 px-4 py-3 flex flex-col gap-1">
        <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">
          Items · {order.items?.length || 0}
        </div>
        {order.items?.map((item, idx) => (
          <div
            key={item._id || `${order._id}-${idx}`}
            className="flex items-center gap-2.5 py-1.5 border-b border-dashed border-orange-100 last:border-0"
          >
            {/* Qty badge */}
            <span className="w-6 h-6 rounded-lg bg-orange-500 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
              {item.quantity}
            </span>
            {/* Item name only — no ID, no category */}
            <span className="text-[13px] font-semibold text-slate-700 truncate">
              {item.menuItem?.name || item.name || 'Item'}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Special Instructions ─── */}
      {order.specialInstructions && (
        <div className="mx-4 mb-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-800 font-medium leading-snug">
            {order.specialInstructions}
          </p>
        </div>
      )}

      {/* ─── Action Buttons ─── */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4 pt-2">
        {ACTIONS.map(({ label, status, icon: Icon, className }) => (
          <button
            key={status}
            onClick={() => onUpdateStatus(order._id, status)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 active:scale-95 ${className}`}
          >
            <Icon size={13} strokeWidth={2.5} />
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default KitchenOrderCard;
