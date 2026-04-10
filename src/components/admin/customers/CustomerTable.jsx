import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const CustomerTable = ({ customers, onEdit }) => {
  if (!customers.length) {
    return (
      <div className="customers-table customers-empty">
        <h4>No customer found</h4>
        <p>Create a new customer or import a new data.</p>
        <button className="btn-primary" onClick={onEdit}>+ Add New Customer</button>
      </div>
    );
  }

  return (
    <div className="customers-table">
      <div className="customers-table-head">
        <div>SN</div>
        <div>Customer</div>
        <div>Email</div>
        <div>Phone Number</div>
        <div>DOB</div>
        <div>Loyalty Dis</div>
        <div>Due Amount</div>
        <div />
      </div>
      {customers.map((c, idx) => (
        <div className="customers-row" key={c._id || c.id || idx}>
          <div>{idx + 1}</div>
          <div>{c.name || '-'}</div>
          <div>{c.email || '-'}</div>
          <div>{c.phone || '-'}</div>
          <div>{formatDate(c.dob)}</div>
          <div>{c.loyaltyDiscount || 0}%</div>
          <div>{c.dueAmount ? `Rs ${c.dueAmount}` : 'Rs 0'}</div>
          <button className="icon-btn" onClick={() => onEdit(c)}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CustomerTable;
