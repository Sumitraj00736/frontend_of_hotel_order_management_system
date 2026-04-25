import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, Landmark } from 'lucide-react';
import { getCurrentUser, getBranches, getBranchId, setBranchId } from '../../../api/session.js';
import '../../../common/css/admin/sidebar/adminSidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',       icon: '🏠' },
  { id: 'transactions', label: 'Transactions',     icon: '↕️' },
  { id: 'daybook',      label: 'Day Book',         icon: '📖' },
  { id: 'sales-purchase', label: 'Sales',          icon: '🧾', sub: 'sales-invoices' },
  { id: 'purchase',     label: 'Purchase',         icon: '🛒', sub: 'purchase-bills' },
  { id: 'income',       label: 'Income',           icon: '💰' },
  { id: 'expenses',     label: 'Expenses',         icon: '💸' },
  { id: 'payments',     label: 'Payments',         icon: '💳' },
  { id: 'cashbanks',    label: 'Cash & Banks',     icon: '🏦' },
  { id: 'reports',      label: 'Reports',          icon: '📊' },
];

export default function FinanceSidebar({ section, onNavigate, onBack }) {
  const [branchOpen, setBranchOpen] = useState(false);
  const parts = String(section || 'finance:dashboard').split(':');
  const view  = parts[1] || 'dashboard';

  const user = getCurrentUser();
  const branches = getBranches() || [];
  const activeBranchId = getBranchId() || branches[0]?.branchId || branches[0]?._id;
  const activeBranch = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const restaurantName =
    activeBranch?.orgName || branches[0]?.orgName || user?.orgName || user?.organizationName || user?.restaurantName || user?.name || 'Restaurant';

  return (
    <div className="sidebar admin-sidebar slide open">
      {/* ── Brand Header ── */}
      <div className="sidebar-top">
        <div className="sidebar-brand blocky">
          <span className="brand-mark">V</span>
          <span className="brand-text">merorestro</span>
        </div>
        <button className="collapse-btn" onClick={onBack} aria-label="Back to dashboard" title="Back to dashboard">
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* ── Location Card ── */}
      <div
        className="location-card"
        onClick={() => setBranchOpen((v) => !v)}
      >
        <div className="location-main">
          <div className="location-title">{restaurantName}</div>
          <span className="chevron"><ChevronDown size={14} /></span>
        </div>
        <div className="pill badge-premium">Premium (Trial)</div>

        {branchOpen && branches.length > 0 && (
          <div className="branch-popover">
            {branches.map((b) => (
              <button
                key={b.branchId || b._id}
                className={`branch-item ${activeBranchId === (b.branchId || b._id) ? 'active' : ''}`}
                onClick={() => {
                  setBranchId(b.branchId || b._id);
                  window.location.reload();
                }}
              >
                {b.branchName || b.name || b.code || 'Branch'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Finance Label ── */}
      <div className="sidebar-separator" />
      <div className="d-flex align-items-center gap-2 px-1 mb-1" style={{ color: '#9aa4b2', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <Landmark size={12} />
        Finance
      </div>

      {/* ── Nav Sections ── */}
      <div className="sidebar-buttons" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="mb-2">
          {NAV_ITEMS.map((item) => {
            const isActive = view === item.id ||
              (item.id === 'sales-purchase' && view === 'purchase') ||
              (item.id === 'sales-purchase' && view === 'sales-purchase');
            return (
              <button
                key={item.id}
                className={`sidebar-button ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.id === 'purchase') {
                    onNavigate(`finance:sales-purchase:purchase-bills`);
                  } else if (item.sub) {
                    onNavigate(`finance:${item.id}:${item.sub}`);
                  } else {
                    onNavigate(`finance:${item.id}`);
                  }
                }}
                style={{ fontSize: 13 }}
              >
                <span className="sidebar-icon" style={{ fontSize: 16 }}>{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
