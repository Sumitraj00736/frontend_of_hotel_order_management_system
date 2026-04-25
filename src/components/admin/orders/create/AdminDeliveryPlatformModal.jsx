import React, { useState } from 'react';
import { Search, PhoneCall, Globe } from 'lucide-react';

const AdminDeliveryPlatformModal = ({ show, onClose, onContinue }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('Direct Order');
  const platforms = [
    {
      name: 'Direct Order',
      icon: PhoneCall,
      toneClass: 'admin-platform-option-direct',
      description: 'Manual phone and walk-in orders handled directly by your team.',
      meta: 'Fastest for counter service',
      available: true
    },
    {
      name: 'Website',
      icon: Globe,
      toneClass: 'admin-platform-option-website',
      description: 'Sync incoming web orders from your branded ordering flow.',
      meta: 'Coming soon',
      available: false
    }
  ];

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.48)', zIndex: 1055 }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered admin-delivery-platform-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content admin-delivery-platform-modal border-0 shadow-lg overflow-hidden">
          <div className="modal-header border-0 admin-delivery-platform-header">
            <div>
              <span className="admin-delivery-platform-kicker">Order Intake</span>
              <h5 className="modal-title fw-bold mb-1">Select Delivery Platform</h5>
              <p className="admin-delivery-platform-subtitle mb-0">
                Choose how this order entered the system so the workflow stays organized.
              </p>
            </div>
            <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
          </div>
          <div className="modal-body admin-delivery-platform-body">
            <div className="admin-delivery-platform-toolbar">
              <div className="position-relative flex-grow-1 admin-delivery-platform-search">
                <Search size={14} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control form-control-sm ps-5 rounded-3 border-0 shadow-none"
                  placeholder="Search platform"
                />
              </div>
              <button className="btn btn-sm admin-delivery-platform-add-btn rounded-3 fw-semibold d-flex align-items-center gap-1 px-3">
                + Add Platform
              </button>
            </div>

            <div className="row g-3 admin-delivery-platform-grid">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatform === platform.name;

                return (
                  <div className="col-md-6" key={platform.name}>
                    <button
                      type="button"
                      className={`admin-platform-option ${platform.toneClass} ${isSelected ? 'is-selected' : ''} ${!platform.available ? 'is-disabled' : ''}`}
                      onClick={() => platform.available && setSelectedPlatform(platform.name)}
                    >
                      <div className="admin-platform-option-top">
                        <div className="d-flex align-items-center gap-3">
                          <div className="admin-platform-option-icon">
                            <Icon size={18} />
                          </div>
                          <div className="text-start">
                            <div className="admin-platform-option-title">{platform.name}</div>
                            <div className="admin-platform-option-meta">{platform.meta}</div>
                          </div>
                        </div>
                        <div className={`admin-platform-option-radio ${isSelected ? 'is-selected' : ''}`}>
                          <span />
                        </div>
                      </div>

                      <p className="admin-platform-option-description mb-0 text-start">
                        {platform.description}
                      </p>

                      {!platform.available && (
                        <span className="admin-platform-option-badge">Upcoming</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="admin-delivery-platform-reminder">
              <div className="admin-delivery-platform-reminder-title">Reminder</div>
              <div className="admin-delivery-platform-reminder-text">
                Set a default <span>Delivery Platform</span> so you do not need to choose it for every new order.
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 admin-delivery-platform-footer">
            <button type="button" className="btn admin-delivery-platform-secondary-btn flex-grow-1 fw-semibold py-2 rounded-3 border-0" onClick={onClose}>
              Discard
            </button>
            <button
              type="button"
              className="btn admin-delivery-platform-primary-btn flex-grow-1 fw-bold py-2 rounded-3 text-white shadow-sm"
              onClick={() => onContinue(selectedPlatform)}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDeliveryPlatformModal;
