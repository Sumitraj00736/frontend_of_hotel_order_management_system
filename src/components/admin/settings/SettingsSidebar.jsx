import React, { useState } from 'react';
import { ChevronDown, ArrowLeft, Settings } from 'lucide-react';
import { hasPermission, getCurrentUser, getBranches, getBranchId, setBranchId } from '../../../api/session.js';

import '../../../common/css/admin/sidebar/adminSidebar.css';

const navSections = [
  {
    title: 'General Setting',
    items: [
      { id: 'restaurant-details', label: 'Restaurant Details' },
      { id: 'tax-rates', label: 'Tax & Rates' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'activity-log', label: 'Activity Log' },
      { id: 'department', label: 'Department' },
      { id: 'billing', label: 'Billing & Subscription' },
      { id: 'users-role', label: 'Users Role' },
      { id: 'trash', label: 'Trash' }
    ]
  },
  {
    title: 'Order Setting',
    items: [
      { id: 'invoice-setting', label: 'Invoice Setting' },
      { id: 'kot-setting', label: 'KOT Setting' },
      { id: 'printer', label: 'Printer' }
    ]
  },
  {
    title: 'RestroX',
    items: [
      { id: 'support', label: 'Support & Feedback' },
      { id: 'release', label: 'Release Notes' }
    ]
  }
];

const SettingsSidebar = ({ active, onSelect, onBack }) => {
  const [branchOpen, setBranchOpen] = useState(false);

  const user = getCurrentUser();
  const branches = getBranches() || [];
  const activeBranchId = getBranchId() || branches[0]?.branchId || branches[0]?._id;
  const activeBranch = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const restaurantName = activeBranch?.branchName || user?.restaurantName || user?.name || 'Restaurant';

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

      {/* ── Settings Label ── */}
      <div className="sidebar-separator" />
      <div className="d-flex align-items-center gap-2 px-1 mb-1" style={{ color: '#9aa4b2', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <Settings size={12} />
        Settings
      </div>

      {/* ── Nav Sections ── */}
      <div className="sidebar-buttons" style={{ flex: 1, overflowY: 'auto' }}>
        {navSections.map((section) => (
          <div key={section.title} className="mb-2">
            <div className="tiny-text text-muted fw-semibold px-1 mb-1" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9aa4b2' }}>
              {section.title}
            </div>
            {section.items
              .filter(() => hasPermission('settings:view'))
              .map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-button ${active === item.id ? 'active' : ''}`}
                  onClick={() => onSelect?.(item.id)}
                  style={{ fontSize: 13 }}
                >
                  <span className="sidebar-icon" style={{ width: 8, height: 8, borderRadius: '50%', background: active === item.id ? '#d9583f' : '#d1d5db', display: 'inline-block', flexShrink: 0 }} />
                  <span className="sidebar-label">{item.label}</span>
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;
