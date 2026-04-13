import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LogOut, UserRound } from 'lucide-react';
import AdminSettingsMenuList from './AdminSettingsMenuList.jsx';

const AdminProfileMenu = ({ user, organizationName, onOpenSetting, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const displayName = user?.name || 'Admin User';
  const displayEmail = user?.email || user?.phone || 'No email';
  const orgLabel = organizationName || user?.orgName || user?.organizationName || 'Restaurant';
  const avatarText = useMemo(() => {
    const source = `${displayName}`.trim();
    return source ? source.slice(0, 2).toUpperCase() : 'AU';
  }, [displayName]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocumentClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [open]);

  return (
    <div className="mobile-profile-menu-wrap" ref={menuRef}>
      <button
        type="button"
        className="mobile-profile-trigger"
        aria-label="Open profile menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="mobile-profile-avatar">{avatarText}</span>
      </button>

      {open && (
        <div className="mobile-profile-menu">
          <div className="mobile-profile-header">
            <div className="mobile-profile-main">
              <UserRound size={14} />
              <span>{displayName}</span>
            </div>
            <div className="mobile-profile-org">{orgLabel}</div>
            <div className="mobile-profile-contact">{displayEmail}</div>
          </div>

          <AdminSettingsMenuList
            onSelect={(settingId) => {
              onOpenSetting?.(settingId);
              setOpen(false);
            }}
          />

          <button
            type="button"
            className="mobile-profile-logout-btn"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfileMenu;
