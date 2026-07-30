import React from 'react';
import { X, Trophy, Coins, Save, RotateCcw } from 'lucide-react';
import FormField, { inputClass } from '../reusable/FormField.jsx';

const RewardsModal = ({ rewards, setRewards, onClose, onSave }) => {
  const set = (key, val) => setRewards((prev) => ({ ...prev, [key]: val }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <Trophy size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Loyalty</p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">Rewards Setting</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Define how many points customers earn based on their purchase amount.
          </p>
          <FormField label="Purchase Amount (Sales)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rs</span>
              <input
                className={`${inputClass} pl-9`}
                type="number"
                value={rewards.salesAmount}
                onChange={(e) => set('salesAmount', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </FormField>
          <FormField label="Reward Points Earned" required>
            <div className="relative">
              <Coins size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputClass} pl-9`}
                type="number"
                value={rewards.rewardPoints}
                onChange={(e) => set('rewardPoints', e.target.value)}
                placeholder="0"
              />
            </div>
          </FormField>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={onSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-200 transition-all active:scale-95">
            <Save size={14} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;
