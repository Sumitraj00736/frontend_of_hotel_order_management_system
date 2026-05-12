import React from 'react';
import { X, Trophy, Coins, Save, RotateCcw } from 'lucide-react';

const RewardsModal = ({ rewards, setRewards, onClose, onSave }) => {
  const updateField = (key, value) => {
    setRewards((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="reward-modal-overlay" onClick={onClose}>
      <div className="modal-content rewards-modal-glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-icon-title">
            <Trophy size={24} color="#fc8019" />
            <h3>Rewards Setting</h3>
          </div>
          <button className="close-icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Define how many points customers earn based on their purchase amount.
          </p>
          <div className="modal-form-grid">
            <div className="form-group">
              <label>Purchase Amount (Sales) *</label>
              <div className="input-with-prefix">
                <span>Rs</span>
                <input
                  type="number"
                  value={rewards.salesAmount}
                  onChange={(e) => updateField('salesAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Reward Points Earned *</label>
              <div className="input-with-prefix">
                <Coins size={16} />
                <input
                  type="number"
                  value={rewards.rewardPoints}
                  onChange={(e) => updateField('rewardPoints', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="footer-btn secondary" onClick={onClose}>
            <RotateCcw size={16} /> Reset
          </button>
          <button className="footer-btn primary" onClick={onSave}>
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;