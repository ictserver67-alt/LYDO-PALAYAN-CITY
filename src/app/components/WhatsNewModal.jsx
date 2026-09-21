'use client';

import React, { useState, useEffect } from 'react';

export const UPDATES_DATA = [
  {
    version: 'v2.4.0',
    date: 'September 21, 2026',
    tag: 'Compliance & Security',
    tagColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    title: 'NPC DPO/DPS Registration Seal & Legal Compliance',
    description: 'The Palayan City Youth Portal is officially registered with the National Privacy Commission in full compliance with Republic Act No. 10173 (Data Privacy Act of 2012).',
    highlights: [
      'Official NPC DPO/DPS Registration Seal (Valid until 23 June 2027) with QR verification displayed on portal.',
      'Comprehensive Privacy Policy and Terms of Service modal accessible throughout the portal.',
      'Embedded data privacy consent notices on scholar application and user registration forms.'
    ]
  },
  {
    version: 'v2.3.0',
    date: 'September 17, 2026',
    tag: 'Feature',
    tagColor: 'bg-gold/15 text-gold border-gold/30',
    title: 'Separated Scholar Names (Fname, Mname, Lname, Suffix)',
    description: 'Scholar profile encoding and editing now capture distinct name components for precise masterlist sorting and government payroll compliance.',
    highlights: [
      'Dedicated input fields for First Name, Middle Name, Last Name (Surname), and Suffix dropdown (Jr., Sr., II, III, IV, etc.).',
      'Real-time live Full Name Preview during encoding.',
      '100% backward compatibility: existing scholar records preserved and automatically parsed.'
    ]
  },
  {
    version: 'v2.2.0',
    date: 'September 14, 2026',
    tag: 'Enhancement',
    tagColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    title: 'Advanced Excel (.xlsx) Masterlist Export',
    description: 'Export scholar applications directly into professional Microsoft Excel (.xlsx) spreadsheets with comprehensive filtering.',
    highlights: [
      'Separate columns for Application No, Last Name, First Name, Middle Name, Suffix, Barangay, School, and Contact info.',
      'Physical appearance / attendance status tracking ("Attended: YES / NO") for cash card & allowance verification.',
      'Custom export filters by Barangay, Evaluation Status (Approved, Pending, Disapproved), and Special Circumstances.'
    ]
  },
  {
    version: 'v2.1.0',
    date: 'September 10, 2026',
    tag: 'Admin Tools',
    tagColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    title: 'Admin Password Reset & Attendance Reset Controls',
    adminOnly: true,
    description: 'Administrative controls to support on-ground verification workflows and credential management.',
    highlights: [
      'Direct password reset capability for SK and encoder accounts inside the User Accounts dashboard.',
      'One-click Attendance Reset to reset "Appeared" flags for new physical paper re-verification sessions.',
      'Official CPDO (City Planning & Development Office) and LGU Palayan City branding integration.'
    ]
  }
];

export default function WhatsNewModal({ isOpen, onClose, user = null }) {
  const [dontShowToday, setDontShowToday] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const isAdmin = user?.role === 'admin';
  const todayStr = new Date().toISOString().split('T')[0];

  const handleClose = () => {
    if (dontShowToday) {
      try {
        localStorage.setItem('lydo_whats_new_dismissed_date', todayStr);
      } catch (err) {
        console.warn('Could not save dismissal state:', err);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  // Filter out admin-only updates for non-admin users (students, public, encoders, SK)
  const visibleUpdates = UPDATES_DATA.filter(u => {
    if (u.adminOnly && !isAdmin) return false;
    return true;
  });

  const filteredUpdates = activeFilter === 'all' 
    ? visibleUpdates 
    : visibleUpdates.filter(u => u.tag.toLowerCase().includes(activeFilter.toLowerCase()));

  // Filter tabs dynamically based on user role
  const filterTabs = [
    { id: 'all', label: 'All Updates' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'feature', label: 'Features' },
    { id: 'enhancement', label: 'Enhancements' }
  ];

  if (isAdmin) {
    filterTabs.push({ id: 'admin', label: 'Admin Tools' });
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[130] p-4 font-sans animate-in fade-in duration-200">
      <div className="glass-panel border border-gold/30 w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Layer 1: Header Stack */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-md">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gold-gradient tracking-tight">
                  What&apos;s New
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                  Release Notes
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Latest updates, enhancements & compliance for Palayan City Youth Portal
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white rounded-full p-1.5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Layer 2: Category Filters Stack */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-black/20 shrink-0 overflow-x-auto text-xs">
          <span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mr-1">Filter:</span>
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-gold text-forest-dark font-bold shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Layer 3: Scrollable Updates Content Stack */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {filteredUpdates.map((update, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold/30 transition-all space-y-2.5"
            >
              {/* Card Header Stack */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${update.tagColor}`}>
                    {update.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-gold">
                    {update.version}
                  </span>
                </div>
                <span className="text-[11px] text-white/40 font-mono">
                  {update.date}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {update.title}
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {update.description}
                </p>
              </div>

              {/* Highlights Bullet Stack */}
              <ul className="space-y-1.5 pt-2 border-t border-white/5">
                {update.highlights.map((point, pIdx) => (
                  <li key={pIdx} className="text-xs text-white/80 flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Layer 4: Footer / Dismissal Action Stack */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* "Don't show up for today" Checkbox */}
          <label className="flex items-center gap-2 text-xs text-white/70 hover:text-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={e => setDontShowToday(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 text-gold focus:ring-gold accent-gold cursor-pointer"
            />
            <span>Don&apos;t show this again today</span>
          </label>

          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-gold-gradient text-forest-dark font-black text-xs rounded-xl hover:shadow-lg transition-all cursor-pointer glow-btn"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
}
