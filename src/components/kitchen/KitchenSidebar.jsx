/**
 * KitchenSidebar.jsx
 * Thin orchestrator — composes KitchenSidebarHeader, Location, Nav, Footer.
 * All styling via Tailwind CSS (no custom CSS imports).
 */
import React, { useState, useMemo, useEffect } from 'react';
import { clearSession, getBranchId, getBranches, getCurrentUser, setBranchId } from '../../api/session.js';

import KitchenSidebarHeader   from './sidebar/KitchenSidebarHeader.jsx';
import KitchenSidebarLocation from './sidebar/KitchenSidebarLocation.jsx';
import KitchenSidebarNav      from './sidebar/KitchenSidebarNav.jsx';
import KitchenSidebarFooter   from './sidebar/KitchenSidebarFooter.jsx';

const MOBILE_BREAKPOINT = 992;

const KitchenSidebar = ({
  activeSection = 'orders',
  onSelect,
  isOpen = true,
  onToggleSidebar,
  unreadCount = 0,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [branchOpen,  setBranchOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  /* ─── session data ─── */
  const user     = getCurrentUser();
  const branches = getBranches() || [];

  const activeBranchId = getBranchId() || branches[0]?.branchId || branches[0]?._id;
  const activeBranch   = useMemo(
    () => branches.find((b) => (b.branchId || b._id) === activeBranchId),
    [branches, activeBranchId],
  );

  const restaurantName =
    activeBranch?.orgName ||
    branches.find((b) => b.orgName)?.orgName ||
    user?.orgName || user?.restaurantName ||
    activeBranch?.branchName || branches[0]?.branchName ||
    'Mero Restro';

  /* ─── responsive ─── */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ─── handlers ─── */
  const handleSelect = (section) => {
    onSelect?.(section);
    if (isMobile && isOpen) onToggleSidebar?.();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      clearSession();
      window.location.href = '/login';
    }
  };

  /* ─── layout ─── */
  const sidebarWidth = isMobile ? 'w-72' : isOpen ? 'w-64' : 'w-[72px]';
  const mobileSlide  = isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0';

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={onToggleSidebar}
        />
      )}

      <aside
        className={`
          ${sidebarWidth} ${mobileSlide}
          fixed left-0 top-0 h-screen z-50
          flex flex-col bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out overflow-hidden
        `}
      >
        {/* Brand + toggle */}
        <KitchenSidebarHeader
          isOpen={isOpen}
          isMobile={isMobile}
          onToggleSidebar={onToggleSidebar}
        />

        {/* Restaurant / branch */}
        <KitchenSidebarLocation
          isOpen={isOpen}
          branchOpen={branchOpen}
          setBranchOpen={setBranchOpen}
          activeBranch={activeBranch}
          activeBranchId={activeBranchId}
          restaurantName={restaurantName}
          branches={branches}
          setBranchId={setBranchId}
        />

        {/* Navigation */}
        <KitchenSidebarNav
          isOpen={isOpen}
          activeSection={activeSection}
          onSelect={handleSelect}
          unreadCount={unreadCount}
        />

        {/* Profile card */}
        <KitchenSidebarFooter
          isOpen={isOpen}
          isMobile={isMobile}
          user={user}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          onLogout={handleLogout}
          onProfileSelect={handleSelect}
        />
      </aside>
    </>
  );
};

export default KitchenSidebar;