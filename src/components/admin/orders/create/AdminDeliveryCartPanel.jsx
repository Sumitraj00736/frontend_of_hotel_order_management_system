import React from 'react';
import { ShoppingBag, ChevronRight, User, Trash2, Map, Minus, Plus, Bike, ChevronDown } from 'lucide-react';

const AdminDeliveryCartPanel = ({
  items,
  cartQty,
  cartTotal,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  deliveryAddress,
  setDeliveryAddress,
  notes,
  setNotes,
  onSelectCustomer,
  staffOptions,
  assignedStaffId,
  onAssignStaff,
  assignedRiderId,
  onAssignRider,
  onConfirm,
  onUpdateItemQuantity,
  onConfirmDisabled
}) => {
  return (
    <div className="additem-cart h-100 d-flex flex-column bg-white shadow-sm" style={{ width: '400px', borderLeft: '1px solid #eef1f6', overflowY: 'auto' }}>
      
      {/* Cart Items Section */}
      <div className="p-3 border-bottom bg-white sticky-top pt-4">
        <h6 className="fw-bold mb-3 fs-5">Cart Items</h6>
        {items.length === 0 ? (
          <div className="text-center py-5 rounded-3 bg-light border border-light">
            <ShoppingBag size={24} className="text-muted mb-2 opacity-50" />
            <div className="text-muted small fw-medium">No items added yet</div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 max-h-300 overflow-auto hide-scrollbar">
            {items.map((i, idx) => (
              <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light">
                <div className="d-flex flex-column">
                  <span className="fw-bold fs-7">{i.menuItem?.name || 'Item'}</span>
                  <span className="text-danger small fw-bold">Rs {i.priceAtOrderTime * i.quantity}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center rounded-pill bg-white shadow-sm px-2 py-1 border">
                    <button className="btn btn-sm p-0 text-muted" onClick={() => onUpdateItemQuantity(idx, i.quantity - 1)}>
                       {i.quantity === 1 ? <Trash2 size={12} className="text-danger" /> : <Minus size={12} />}
                    </button>
                    <span className="fw-bold px-2 fs-7">{i.quantity}</span>
                    <button className="btn btn-sm p-0 text-muted" onClick={() => onUpdateItemQuantity(idx, i.quantity + 1)}>
                       <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-between pt-2 px-1 fw-bold fs-6">
               <span>Total ({cartQty} items)</span>
               <span className="text-danger">Rs {cartTotal}</span>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Form */}
      <div className="p-3 flex-grow-1 d-flex flex-column gap-3">
        <h6 className="fw-bold m-0 fs-5">Add Customer Details</h6>
        
        <button 
          className="btn btn-light w-100 d-flex justify-content-between align-items-center p-2 px-3 rounded-2 shadow-sm border border-light"
          onClick={onSelectCustomer}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="bg-dark text-white rounded p-1"><User size={14} /></div>
            <span className="fw-medium fs-7 text-secondary">Select Existing Customer</span>
          </div>
          <ChevronRight size={14} className="text-muted" />
        </button>

        <div className="text-muted small fw-medium fs-7 my-1">Or, add manually</div>

        <div className="form-group mb-0">
          <label className="form-label small fw-bold text-dark mb-1 fs-8">Customer Name</label>
          <input 
            type="text" 
            className="form-control form-control-sm rounded-2 py-2 shadow-sm border-light" 
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="form-group mb-0">
          <label className="form-label small fw-bold text-dark mb-1 fs-8">Phone Number</label>
          <div className="d-flex">
            <div className="d-flex align-items-center gap-1 bg-white border border-light shadow-sm rounded-start-2 px-2" style={{ borderRight: 'none' }}>
              <span style={{ fontSize: '12px' }}>🇳🇵</span> <ChevronDown size={12} className="text-muted" />
            </div>
            <input 
              type="text" 
              className="form-control form-control-sm py-2 shadow-sm border-light rounded-end-2 rounded-start-0" 
              placeholder="+977"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-0">
          <label className="form-label small fw-bold text-dark mb-1 fs-8">Delivery Address</label>
          <div className="position-relative">
            <input 
              type="text" 
              className="form-control form-control-sm rounded-2 py-2 pe-5 shadow-sm border-light" 
              placeholder="Enter delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
            <div className="position-absolute end-0 top-0 h-100 d-flex align-items-center pe-2">
              <div className="bg-light p-1 rounded"><Map size={14} className="text-muted" /></div>
            </div>
          </div>
        </div>

        <div className="form-group mb-0">
          <label className="form-label small fw-bold text-dark mb-1 fs-8">Notes</label>
          <input 
            type="text" 
            className="form-control form-control-sm rounded-2 py-2 shadow-sm border-light" 
            placeholder="Enter notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2 mt-2">
          <div className="dropdown flex-grow-1">
            <button className="btn btn-light w-100 d-flex justify-content-between align-items-center border shadow-sm rounded-2 py-2" data-bs-toggle="dropdown">
              <div className="d-flex align-items-center gap-2 text-primary">
                 <User size={14} /> <span className="fw-bold fs-7">{staffOptions.find(s => s._id === assignedStaffId)?.name || 'Assign Staff'}</span>
              </div>
              <ChevronRight size={14} className="text-muted" />
            </button>
            <ul className="dropdown-menu w-100 shadow-sm border-0 rounded-3 max-h-200 overflow-auto">
               <li><button className="dropdown-item fs-7 text-muted" onClick={() => onAssignStaff('')}>Unassigned (Staff)</button></li>
               {staffOptions.map(s => (
                 <li key={s._id}><button className="dropdown-item fs-7 fw-bold" onClick={() => onAssignStaff(s._id)}>{s.name} ({s.role})</button></li>
               ))}
            </ul>
          </div>
          
          <div className="dropdown flex-grow-1">
            <button className="btn btn-light w-100 d-flex justify-content-between align-items-center border shadow-sm rounded-2 py-2" data-bs-toggle="dropdown">
              <div className="d-flex align-items-center gap-2 text-primary">
                 <Bike size={14} /> <span className="fw-bold fs-7">{staffOptions.find(s => s._id === assignedRiderId)?.name || 'Assign Rider'}</span>
              </div>
              <ChevronRight size={14} className="text-muted" />
            </button>
            <ul className="dropdown-menu w-100 shadow-sm border-0 rounded-3 max-h-200 overflow-auto">
               <li><button className="dropdown-item fs-7 text-muted" onClick={() => onAssignRider('')}>Unassigned (Rider)</button></li>
               {staffOptions.map(s => (
                 <li key={s._id}><button className="dropdown-item fs-7 fw-bold" onClick={() => onAssignRider(s._id)}>{s.name} ({s.role})</button></li>
               ))}
            </ul>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3 pb-3">
          <button className="btn btn-light flex-grow-1 py-2 fw-bold rounded-2 border shadow-sm" style={{ color: '#64748b' }} onClick={() => {}}>Confirm & Print</button>
          <button className="btn fw-bold flex-grow-1 py-2 rounded-2 text-white shadow" style={{ backgroundColor: '#F08080', border: 'none' }} onClick={onConfirm} disabled={onConfirmDisabled || items.length === 0}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeliveryCartPanel;
