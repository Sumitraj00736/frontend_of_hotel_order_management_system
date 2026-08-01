/**
 * kitchen/sidebar/KitchenSidebarFooter.jsx
 * Bottom profile card + logout popover — mirrors admin SidebarProfile.
 */
import React from 'react';
import { ChevronsUpDown, UserRound, LogOut, Maximize2 } from 'lucide-react';

const FooterAction = ({ icon, label, bg, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
  >
    <span className={`w-7 h-7 rounded-lg ${bg} ${text} flex items-center justify-center shrink-0`}>
      {icon}
    </span>
    {label}
  </button>
);

const KitchenSidebarFooter = ({
  isOpen,
  isMobile,
  user,
  profileOpen,
  setProfileOpen,
  onLogout,
  onProfileSelect,
}) => {
  const compact = !isOpen && !isMobile;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'K';

  /* Popover position (desktop only) */
  const popoverStyle = isMobile
    ? undefined
    : { position: 'fixed', left: `${isOpen ? 260 : 78}px`, bottom: '18px', width: '248px' };

  const handleFullScreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
    setProfileOpen(false);
  };

  return (
    <div className="shrink-0 border-t border-slate-100 px-3 py-3">
      {/* Profile trigger */}
      <button
        onClick={() => setProfileOpen((v) => !v)}
        className={`
          relative w-full flex items-center gap-3
          px-3 py-2.5 rounded-2xl
          bg-gradient-to-br from-slate-50 to-slate-100/60
          border border-slate-200/80
          hover:border-slate-300 hover:shadow-sm
          transition-all duration-200
          ${compact ? 'justify-center p-2.5' : ''}
        `}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`
            ${compact ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl
            bg-gradient-to-br from-orange-400 to-orange-600
            flex items-center justify-center
            text-white font-bold text-sm
            shadow-md shadow-orange-200 ring-2 ring-white
          `}>
            {initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
        </div>

        {!compact && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                {user?.name || 'Chef'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email || ''}</div>
            </div>
            <ChevronsUpDown
              size={14}
              className={`text-slate-400 shrink-0 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {/* Popover */}
      {profileOpen && (
        <div
          className="z-[1600] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/80 overflow-hidden"
          style={popoverStyle || { position: 'relative', marginTop: '8px' }}
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-orange-200">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-bold text-slate-900 truncate">{user?.name || 'Chef'}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email || ''}</div>
                <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Online
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2 flex flex-col gap-0.5">
            <FooterAction
              icon={<UserRound size={14} />}
              label="Profile Settings"
              bg="bg-blue-50"
              text="text-blue-500"
              onClick={() => { setProfileOpen(false); onProfileSelect?.('profile'); }}
            />
            <FooterAction
              icon={<Maximize2 size={14} />}
              label="Enter Full Screen"
              bg="bg-purple-50"
              text="text-purple-500"
              onClick={handleFullScreen}
            />
          </div>

          {/* Logout */}
          <div className="px-2 pb-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors"
            >
              <span className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                <LogOut size={14} className="text-rose-600" />
              </span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenSidebarFooter;
