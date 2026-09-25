import React from 'react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout, 
  onOpenPrivacyModal, 
  onOpenWhatsNew,
  mobileOpen = false,
  onCloseMobile
}) {
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const isOfficer = user.role === 'SK' || user.role === 'LYDC';
  const isEncoder = user.role === 'encoder';
  const isScholar = user.role === 'scholar';

  const adminMenu = [
    { id: 'home', label: 'Document Portal', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )},
    { id: 'analytics', label: 'Analytics Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'pending', label: 'Pending Approvals', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )},
    { id: 'scholar-list', label: 'Scholar List', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { id: 'deadlines', label: 'Deadlines Tracker', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'concerns', label: 'Concerns Manager', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )},
    { id: 'accounts', label: 'User Accounts', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )}
  ];

  const officerMenu = [
    { id: 'home', label: 'Document Portal', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )},
    { id: 'analytics', label: 'Analytics Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'deadlines', label: 'Deadlines', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'scholar-list', label: 'Scholar List', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )}
  ];

  const encoderMenu = [
    { id: 'scholar-list', label: 'Scholar List', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )}
  ];

  const scholarMenu = [
    { id: 'dashboard', label: 'My Application', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'deadlines', label: 'Deadlines', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  ];

  const menuItems = isAdmin ? adminMenu : (isEncoder ? encoderMenu : (isScholar ? scholarMenu : officerMenu));

  return (
    <>
      {/* Mobile Backdrop Overlay (under 768px) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 animate-in fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Navigation Sidebar Drawer */}
      <aside
        className={`w-64 h-screen fixed left-0 top-0 glass-panel flex flex-col justify-between text-white p-6 z-50 border-r border-gold/20 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Brand Header with Close Button on Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                <img src="/logo_palayan.png" alt="Palayan City Seal" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-gold-gradient leading-tight text-lg">PALAYAN CITY</h1>
                <p className="text-xs text-white/50 tracking-wider">YOUTH PORTAL</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-gold-gradient text-forest-dark font-bold shadow-md'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile & Logout */}
        <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4 shrink-0">
          {/* What's New Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenWhatsNew) onOpenWhatsNew();
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center justify-between p-2 rounded-xl bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:border-gold/60 transition-all text-left cursor-pointer group shadow-sm"
            title="See what's new in this release"
          >
            <div className="flex items-center gap-2">
              <span className="text-gold flex items-center justify-center">
                <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </span>
              <span className="text-xs font-bold text-gold">What&apos;s New</span>
            </div>
            <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-gold text-forest-dark font-mono">
              UPDATES
            </span>
          </button>

          {/* NPC Registration & Data Privacy Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenPrivacyModal) onOpenPrivacyModal('seal');
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-gold/20 hover:border-gold/50 hover:bg-white/[0.06] transition-all text-left cursor-pointer group shadow-sm"
            title="View NPC Registration Seal & Data Privacy Policy"
          >
            <img 
              src="/npc_seal.png" 
              alt="NPC Seal" 
              className="w-5 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-extrabold text-white group-hover:text-gold flex items-center gap-1.5 leading-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NPC DPO/DPS Registered
              </span>
              <span className="text-[9px] text-white/40 mt-0.5">Privacy Policy & Terms</span>
            </div>
          </button>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gold text-sm font-semibold capitalize shrink-0">
              {user.username.slice(0, 2)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate capitalize leading-tight">{user.display_name}</span>
              <span className="text-xs text-white/50 truncate uppercase tracking-widest">{user.role}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-3 w-full py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
