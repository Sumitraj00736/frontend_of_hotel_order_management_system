import React, { useState } from 'react';
import { Search, PhoneCall, Globe } from 'lucide-react';

const AdminDeliveryPlatformModal = ({ show, onClose, onContinue }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('Direct Order');

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg p-2">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Select Delivery Platform</h5>
            <button type="button" className="btn-close shadow-none" onClick={onClose}></button>
          </div>
          <div className="modal-body pb-0 mt-3">
            <div className="d-flex justify-content-between mb-4 gap-2">
              <div className="position-relative flex-grow-1" style={{ maxWidth: '150px' }}>
                <Search size={14} className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" className="form-control form-control-sm ps-4 rounded-3 border-light shadow-sm" placeholder="Search" />
              </div>
              <button className="btn btn-sm btn-danger rounded-3 fw-bold shadow-sm d-flex align-items-center gap-1 px-3">
                + Add Platform
              </button>
            </div>

            <div className="row g-3 mb-5">
              <div className="col-6">
                <div 
                  className="card cursor-pointer h-100 rounded-3 transition-all"
                  style={{ border: selectedPlatform === 'Direct Order' ? '2px solid #000' : '1px solid #eef1f6', boxShadow: selectedPlatform === 'Direct Order' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}
                  onClick={() => setSelectedPlatform('Direct Order')}
                >
                  <div className="card-body d-flex align-items-center justify-content-between p-3">
                     <div className="d-flex align-items-center gap-2">
                       <div className="bg-dark text-white rounded d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                          <PhoneCall size={18} />
                       </div>
                       <span className="fw-bold fs-6">Direct Order</span>
                     </div>
                     <div className={`rounded-circle border ${selectedPlatform === 'Direct Order' ? 'border-primary' : 'border-secondary'}`} style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {selectedPlatform === 'Direct Order' && <div className="bg-primary rounded-circle" style={{ width: 8, height: 8 }} />}
                     </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div 
                  className="card cursor-pointer h-100 rounded-3 transition-all position-relative"
                  style={{ border: selectedPlatform === 'Website' ? '1px solid #eef1f6' : '1px solid #eef1f6', opacity: 0.7 }}
                >
                  <div className="card-body d-flex align-items-center justify-content-between p-3" onClick={() => setSelectedPlatform('Website')}>
                     <div className="d-flex align-items-center gap-2">
                       <div className="bg-danger text-white rounded d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                         <span className="fw-bold">RX</span>
                       </div>
                       <span className="fw-bold fs-6">Website</span>
                     </div>
                     <div className={`rounded-circle border ${selectedPlatform === 'Website' ? 'border-primary' : 'border-secondary'}`} style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {selectedPlatform === 'Website' && <div className="bg-primary rounded-circle" style={{ width: 8, height: 8 }} />}
                     </div>
                  </div>
                  <span className="badge bg-light text-dark border position-absolute end-0 bottom-0 m-2">Website</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="fw-bold text-danger mb-1" style={{ fontSize: '15px' }}>Reminder:</div>
              <div className="text-dark">Set a default <span className="text-primary text-decoration-underline cursor-pointer">Delivery Platform</span> so you don't have to select one every time.</div>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0 d-flex gap-3 w-100">
            <button type="button" className="btn bg-light flex-grow-1 fw-bold py-2 rounded-3 border-0 text-muted" onClick={onClose}>Discard</button>
            <button type="button" className="btn flex-grow-1 fw-bold py-2 rounded-3 text-white shadow-sm" onClick={() => onContinue(selectedPlatform)} style={{ backgroundColor: '#90C0A4', border: 'none' }}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDeliveryPlatformModal;
