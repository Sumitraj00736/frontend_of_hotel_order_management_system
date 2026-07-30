/**
 * AdminSidebar.jsx
 * Main sidebar wrapper — composes sub-components.
 * All styling via Tailwind CSS (no custom CSS imports).
 */
import React, { useEffect, useState } from 'react';

import {
  clearSession,
  getBranchId,
  getBranches,
  getCurrentUser,
  setBranchId,
  hasPermission,
} from '../../../api/session.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { canAccessSection } from '../../../common/accessControl.js';
import { MOBILE_BREAKPOINT } from './components/sidebarConfig.jsx';

import SidebarHeader   from './components/SidebarHeader.jsx';
import SidebarLocation from './components/SidebarLocation.jsx';
import SidebarNav      from './components/SidebarNav.jsx';
import SidebarProfile  from './components/SidebarProfile.jsx';

const AdminSidebar = ({
  activeSection = 'dashboard',
  onSelect,
  isOpen = true,
  onToggleSidebar,
  unreadCount = 0,
}) => {
  /* ─── open/close state for nav groups ─── */
  const [openMenus, setOpenMenus] = useState({ tables: false, menu: false, inventory: false, reports: false });
  const [hoveredMenu, setHoveredMenu]   = useState(null);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [branchOpen,  setBranchOpen]    = useState(false);
  const [dateMode,    setDateMode]      = useState('AD');
  const [isMobile,    setIsMobile]      = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  /* ─── session data ─── */
  const user          = getCurrentUser();
  const isSuperAdmin  = user?.role?.toLowerCase() === 'superadmin';
  const branches      = getBranches() || [];
  const activeBranchId = getBranchId() || branches[0]?.branchId || branches[0]?._id;
  const activeBranch  = branches.find((b) => (b.branchId || b._id) === activeBranchId);
  const restaurantName =
    activeBranch?.orgName ||
    branches.find((b) => b.orgName)?.orgName ||
    user?.orgName || user?.organizationName || user?.restaurantName ||
    activeBranch?.branchName || branches[0]?.branchName ||
    (user?.name?.toLowerCase() !== 'admin' ? user?.name : 'Restaurant');

  /* ─── responsive ─── */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ─── auth ─── */
  const { logout } = useAuth();

  /* ─── handlers ─── */
  const handleSelect = (section) => {
    onSelect?.(section);
    if (isMobile && isOpen) onToggleSidebar?.();
  };

  const toggleMenu = (key) =>
    setOpenMenus((prev) => Object.fromEntries(
      Object.keys(prev).map((k) => [k, k === key ? !prev[k] : false])
    ));

  const handleLogout = async () => {
    try { await logout(); clearSession(); window.location.href = '/login'; }
    catch (err) { console.error('Logout failed:', err); }
  };

  const handleFullScreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
  };

  const handleInvite = async () => {
    const link = `${window.location.origin}/invite`;
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
    else window.prompt('Copy invite link', link);
    setProfileOpen(false);
  };

  const handleFeedback = () => {
    window.location.href = 'mailto:developersana7@gmail.com?subject=App%20Feedback';
    setProfileOpen(false);
  };

  const handleShareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: 'My Profile', url }); } catch {} }
    else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
    setProfileOpen(false);
  };

  /* Profile popover position (desktop only) */
  const profilePopoverStyle = isMobile
    ? undefined
    : { position: 'fixed', left: `${isOpen ? 260 : 78}px`, bottom: '18px', width: '268px' };

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
          ${isMobile ? 'fixed' : 'relative'}
          left-0 top-0 h-screen z-50
          flex flex-col bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out overflow-hidden
        `}
      >
        {/* Brand + toggle */}
        <SidebarHeader
          isOpen={isOpen}
          isMobile={isMobile}
          onToggleSidebar={onToggleSidebar}
        />

        {/* Restaurant / branch */}
        <SidebarLocation
          isOpen={isOpen}
          branchOpen={branchOpen}
          setBranchOpen={setBranchOpen}
          activeBranch={activeBranch}
          activeBranchId={activeBranchId}
          restaurantName={restaurantName}
          branches={branches}
          isSuperAdmin={isSuperAdmin}
          setBranchId={setBranchId}
          onManageBranches={() => { handleSelect('settings:branches'); setBranchOpen(false); }}
        />

        {/* Navigation */}
        <SidebarNav
          isOpen={isOpen}
          isMobile={isMobile}
          activeSection={activeSection}
          handleSelect={handleSelect}
          openMenus={openMenus}
          toggleMenu={toggleMenu}
          hoveredMenu={hoveredMenu}
          setHoveredMenu={setHoveredMenu}
          unreadCount={unreadCount}
          isSuperAdmin={isSuperAdmin}
        />

        {/* Profile card */}
        <SidebarProfile
          isOpen={isOpen}
          isMobile={isMobile}
          user={user}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          profilePopoverStyle={profilePopoverStyle}
          dateMode={dateMode}
          setDateMode={setDateMode}
          onLogout={handleLogout}
          onFullScreen={handleFullScreen}
          onProfileSetting={() => { setProfileOpen(false); handleSelect('settings:restaurant-details'); }}
          onInvite={handleInvite}
          onFeedback={handleFeedback}
          onShareProfile={handleShareProfile}
          onNotificationPrefs={() => { alert('Notification preferences are currently unavailable.'); setProfileOpen(false); }}
        />
      </aside>
    </>
  );
};

export default AdminSidebar;
