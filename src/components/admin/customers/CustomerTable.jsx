import React from 'react';
import { MoreHorizontal, User, Mail, Phone, Calendar, Percent, Banknote, UserPlus } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const CustomerTable = ({ customers, onEdit }) => {
  if (!customers.length) {
    return (
      <div className="customers-empty-state">
        <div className="empty-icon-container">
          <UserPlus size={48} color="#fc8019" />
        </div>
        <h4>No customers found</h4>
        <p>Create a new customer or import a new data.</p>
        <button className="add-first-btn" onClick={() => onEdit()}>
          + Add New Customer
        </button>
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="modern-customer-table">
        <thead>
          <tr>
            <th>SN</th>
            <th><User size={14} /> Customer</th>
            <th><Mail size={14} /> Email</th>
            <th><Phone size={14} /> Phone</th>
            <th><Calendar size={14} /> DOB</th>
            <th><Percent size={14} /> Loyalty</th>
            <th><Banknote size={14} /> Due Amount</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr key={c._id || c.id || idx}>
              <td><span className="sn-badge">{idx + 1}</span></td>
              <td className="font-bold text-dark">{c.name || '-'}</td>
              <td className="text-muted">{c.email || '-'}</td>
              <td>{c.phone || '-'}</td>
              <td>{formatDate(c.dob)}</td>
              <td>
                <span className="loyalty-pill">
                  {c.loyaltyDiscount || 0}%
                </span>
              </td>
              <td>
                <span className={`due-amount-badge ${Number(c.dueAmount) > 0 ? 'has-due' : 'no-due'}`}>
                  Rs {Number(c.dueAmount || 0).toLocaleString('en-IN')}
                </span>
              </td>
              <td className="text-right">
                <button className="action-row-btn" onClick={() => onEdit(c)}>
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;