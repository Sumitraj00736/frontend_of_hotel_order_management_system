import React from 'react';

const RewardsModal = ({ rewards, setRewards, onClose, onSave }) => {
  const updateField = (key, value) => {
    setRewards((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="customers-modal-overlay" onClick={onClose}>
      <div className="customers-modal" onClick={(e) => e.stopPropagation()}>
        <button className="customers-modal-close" onClick={onClose}>✕</button>
        <h3>Rewards Setting</h3>
        <div className="customers-reward-row">
          <div>
            <label>Sales *</label>
            <input
              value={rewards.salesAmount}
              onChange={(e) => updateField('salesAmount', e.target.value)}
              placeholder="Rs 0"
            />
          </div>
          <div>
            <label>Reward Point *</label>
            <input
              value={rewards.rewardPoints}
              onChange={(e) => updateField('rewardPoints', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <div className="customers-footer">
          <button className="btn-secondary" onClick={onClose}>Reset</button>
          <button className="btn-primary" onClick={onSave}>Save Reward Point</button>
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;
