import React from 'react';
import { Banknote, CreditCard, Smartphone, Landmark } from 'lucide-react';

const PAYMENT_TYPES = [
  { value: 'cash',    label: 'Cash',          Icon: Banknote    },
  { value: 'card',    label: 'Card',          Icon: CreditCard  },
  { value: 'fonepay', label: 'Fonepay',       Icon: Smartphone  },
  { value: 'bank',    label: 'Bank Transfer', Icon: Landmark    },
];

const OrderPaymentPanel = ({ payments, onUpdatePayments, totalToPay }) => {
  const selectedType = payments[0]?.type || 'cash';

  const handleTypeSelect = (type) => {
    // Amount is always fixed = total, no manual editing
    onUpdatePayments([{ type, amount: totalToPay }]);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <CreditCard size={14} className="text-primary" />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Payment Method
        </span>
      </div>

      {/* Type selector grid */}
      <div className="p-3 grid grid-cols-2 gap-2">
        {PAYMENT_TYPES.map(({ value, label, Icon }) => {
          const isActive = selectedType === value;
          return (
            <button
              key={value}
              onClick={() => handleTypeSelect(value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <Icon
                size={16}
                strokeWidth={1.8}
                className={isActive ? 'text-primary' : 'text-gray-400'}
              />
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Fixed amount display — read-only */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100">
        <span className="text-xs text-gray-500">Amount to collect</span>
        <span className="text-sm font-bold text-gray-800">
          Rs {(totalToPay || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderPaymentPanel;
