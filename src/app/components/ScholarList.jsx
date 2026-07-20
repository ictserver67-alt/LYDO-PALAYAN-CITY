import React, { useState, useEffect } from 'react';
import { BARANGAYS } from '../api/_utils/constants';
import ScholarFormModal from './ScholarFormModal';

export default function ScholarList({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBarangay, setFilterBarangay] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedAfs, setGeneratedAfs] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterBarangay, filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filterBarangay !== 'All') queryParams.append('barangay', filterBarangay);
      if (filterStatus !== 'All') queryParams.append('status', filterStatus);

      const res = await fetch(`/api/admin/listApplications?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusBadges = {
    'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Approved': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const handleOpenEncode = () => {
    setSelectedApp(null);
    setIsModalOpen(true);
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/updateScholarStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status.');

      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenEdit = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = (newAfs = null) => {
    setIsModalOpen(false);
    setSelectedApp(null);
    if (newAfs) {
      setGeneratedAfs(newAfs);
    }
    fetchApplications();
  };

  const handleDeleteScholar = async (id, name) => {
    if (!confirm(`Are you sure you want to delete the scholar application of ${name}?`)) return;
    try {
      const res = await fetch('/api/admin/deleteScholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchApplications();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete scholar.');
      }
    } catch (err) {
      console.error('Delete scholar error:', err);
      alert('An error occurred while deleting the record.');
    }
  };

  const getQrDataUrl = () => {
    let base = typeof window !== 'undefined' ? window.location.origin : 'https://lydo-palayan-city.vercel.app';
    if (base.includes('-projects.vercel.app') || base.includes('localhost') || base.includes('127.0.0.1')) {
      base = 'https://lydo-palayan-city.vercel.app';
    }
    return `${base}/#apply=scholar`;
  };

  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      {/* Header & Main Actions */}
      <div className="glass-panel rounded-xl p-6 border border-gold/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gold-gradient">Scholar List & Directory</h2>
          <p className="text-xs text-white/50 mt-1">
            {(user?.role === 'encoder' || user?.role === 'admin') 
              ? 'Manage scholar profiles, encode physical applications, and edit details' 
              : 'Browse and view the registered scholar profiles and directory'}
          </p>
        </div>

        {(user?.role === 'encoder' || user?.role === 'admin') && (
          <div className="flex gap-2.5 shrink-0 flex-wrap">
            <button 
              onClick={() => setIsQrModalOpen(true)}
              className="px-4 py-3 border border-gold/30 hover:bg-gold/10 text-gold font-bold uppercase text-[10px] tracking-wider rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              title="Show Registration QR Code for scholars"
            >
              <svg className="w-4.5 h-4.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-3.75A1.125 1.125 0 013.75 8.625v-3.75zM3.75 14.625c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-3.75a1.125 1.125 0 01-1.125-1.125v-3.75zM14.625 3.75c-.621 0-1.125.504-1.125 1.125v3.75c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125v-3.75c0-.621-.504-1.125-1.125-1.125h-3.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.625 14.625h1.5m1.5 0h1.5M14.625 17.625h1.5m1.5 0h1.5M14.625 20.25h1.5m1.5 0h1.5" />
              </svg>
              Registration QR Code
            </button>
            <button 
              onClick={handleOpenEncode}
              className="px-5 py-3 bg-gold-gradient text-forest-dark font-black tracking-wider uppercase text-xs rounded-lg flex items-center gap-2 hover:shadow-lg transition-all cursor-pointer glow-btn"
            >
              <svg className="w-4 h-4 text-forest-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Encode New Scholar
            </button>
          </div>
        )}
      </div>

      {/* Generated Application No Notification */}
      {generatedAfs && (
        <div className="p-6 bg-gold/10 border border-gold/30 rounded-xl text-center flex flex-col gap-2 items-center relative animate-in zoom-in-95">
          <button 
            onClick={() => setGeneratedAfs(null)} 
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-all cursor-pointer"
          >
            &times;
          </button>
          <p className="text-xs text-white/60 uppercase tracking-widest font-semibold">Scholar Encoded Successfully!</p>
          <p className="text-[10px] text-white/40">Generated Application Number:</p>
          <h1 className="text-3xl font-black text-gold tracking-tight">{generatedAfs}</h1>
          <p className="text-xs text-white/50 mt-1">Please write this number down on the physical application form.</p>
        </div>
      )}

      {/* Filters Box */}
      <div className="glass-panel rounded-xl p-5 border border-gold/15 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <span className="text-[10px] text-white/40 uppercase font-semibold">Search Scholar</span>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, AFS no., school, barangay..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field text-xs py-2 pl-8 pr-3 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Barangay Filter */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-white/40 uppercase font-semibold">Filter by Barangay</span>
          <select
            value={filterBarangay}
            onChange={e => setFilterBarangay(e.target.value)}
            className="input-field text-xs py-2 px-3 min-w-[160px] cursor-pointer"
          >
            <option value="All" className="bg-forest-dark text-white">All Barangays</option>
            {BARANGAYS.map(b => (
              <option key={b} value={b} className="bg-forest-dark text-white">{b}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-white/40 uppercase font-semibold">Filter by Status</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input-field text-xs py-2 px-3 min-w-[160px] cursor-pointer"
          >
            <option value="All" className="bg-forest-dark text-white">All Statuses</option>
            <option value="Pending" className="bg-forest-dark text-white">For Review (Pending)</option>
            <option value="Approved" className="bg-forest-dark text-white">Approved</option>
            <option value="Rejected" className="bg-forest-dark text-white">Disapproved (Rejected)</option>
          </select>
        </div>

        {/* Refresh Button */}
        <div className="flex items-end self-end h-[38px]">
          <button
            onClick={fetchApplications}
            className="p-2 rounded-lg border border-gold/25 text-gold hover:bg-gold/10 transition-all cursor-pointer"
            title="Refresh logs"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="glass-panel rounded-2xl border border-gold/15 p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/60">
            <svg className="animate-spin h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs">Fetching scholar records...</span>
          </div>
        ) : (() => {
          const q = searchQuery.toLowerCase().trim();
          const filtered = q
            ? applications.filter(a =>
                (a.student_full_name || '').toLowerCase().includes(q) ||
                (a.application_no || '').toLowerCase().includes(q) ||
                (a.school || '').toLowerCase().includes(q) ||
                (a.barangay || '').toLowerCase().includes(q) ||
                (a.email || '').toLowerCase().includes(q) ||
                (a.contact_number || '').toLowerCase().includes(q)
              )
            : applications;

          if (filtered.length === 0) return (
            <div className="text-center py-12 text-white/40 text-sm flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>{q ? `No results for "${searchQuery}"` : 'No scholar applications found in system.'}</span>
            </div>
          );

          return (
          <div className="overflow-x-auto w-full border border-white/5 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gold/80 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Application No.</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Birthdate / Sex</th>
                  <th className="py-4 px-6">Barangay</th>
                  <th className="py-4 px-6">School Details</th>
                  <th className="py-4 px-6">Circumstances</th>
                  <th className="py-4 px-6">Status</th>
                  {(user?.role === 'encoder' || user?.role === 'admin') && <th className="py-4 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white/80">
                {filtered.map((app) => {
                  // Circumstances labels
                  const circs = [];
                  if (app.is_solo_parent_beneficiary) circs.push('Solo Parent');
                  if (app.is_orphan) circs.push('Orphan');
                  if (app.is_pwd) circs.push('PWD');
                  if (app.is_ip) circs.push('IP');
                  if (app.is_out_of_school_youth) circs.push('OSY');

                  const bdate = app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'Asia/Manila'
                  }) : '—';

                  return (
                    <tr key={app.id} className="hover:bg-white/5 transition-all">
                      <td className="py-4 px-6 font-semibold text-gold font-mono">{app.application_no}</td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-white">{app.student_full_name}</span>
                        <p className="text-xs text-white/40 mt-0.5">{app.email} • {app.contact_number}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span>{bdate}</span>
                        <p className="text-xs text-white/40 mt-0.5">{app.sex}</p>
                      </td>
                      <td className="py-4 px-6 text-white/70">{app.barangay}</td>
                      <td className="py-4 px-6">
                        <span>{app.school}</span>
                        <p className="text-xs text-white/40 mt-0.5">SY {app.school_year}</p>
                      </td>
                      <td className="py-4 px-6">
                        {circs.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {circs.map(c => (
                              <span key={c} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white/60">
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-white/30 text-xs">None</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {(user?.role === 'encoder' || user?.role === 'admin') ? (
                          <select
                            value={app.status}
                            onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                            className={`px-2.5 py-1.5 bg-forest-dark border rounded-lg text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-all hover:bg-forest-light outline-none ${
                              app.status === 'Approved' ? 'text-green-400 border-green-500/30' :
                              app.status === 'Rejected' ? 'text-red-400 border-red-500/30' :
                              'text-yellow-400 border-yellow-500/30'
                            }`}
                          >
                            <option value="Pending" className="bg-forest-dark text-yellow-400">For Review</option>
                            <option value="Approved" className="bg-forest-dark text-green-400">Approved</option>
                            <option value="Rejected" className="bg-forest-dark text-red-400">Disapproved</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusBadges[app.status]}`}>
                            {app.status === 'Pending' ? 'For Review' : (app.status === 'Approved' ? 'Approved' : 'Disapproved')}
                          </span>
                        )}
                      </td>
                      {(user?.role === 'encoder' || user?.role === 'admin') && (
                        <td className="py-4 px-6 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="p-1.5 border border-white/10 rounded text-white/60 hover:text-gold hover:border-gold/30 transition-all cursor-pointer"
                            title="Edit profile & evaluations"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteScholar(app.id, app.student_full_name)}
                              className="p-1.5 border border-red-500/25 rounded text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all cursor-pointer"
                              title="Delete scholar record"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          );
        })()}
      </div>

      {/* Form Modal (handles both Create and Edit) */}
      <ScholarFormModal
        isOpen={isModalOpen}
        application={selectedApp}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApp(null);
        }}
        onSave={handleSaveSuccess}
      />

      {/* QR Code Registration Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="glass-panel border border-gold/25 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative p-6 flex flex-col items-center text-center gap-5">
            <button 
              onClick={() => setIsQrModalOpen(false)} 
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-all cursor-pointer rounded-full p-1 bg-white/5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div>
              <h3 className="text-lg font-bold text-gold-gradient leading-tight">Student Registration QR Code</h3>
              <p className="text-[10px] text-white/50 mt-1">Let students scan this code to register & fill up the scholarship form</p>
            </div>

            <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl relative shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=d4af37&bgcolor=082010&data=${encodeURIComponent(getQrDataUrl())}`} 
                alt="Scholar Registration QR Code"
                className="w-[200px] h-[200px] rounded-lg border border-gold/25"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <input 
                type="text"
                readOnly
                value={getQrDataUrl()}
                className="input-field text-[10px] text-center font-mono py-2 select-all cursor-text text-white/80"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getQrDataUrl());
                    alert('Copied link to clipboard!');
                  }}
                  className="flex-1 py-2 px-3 border border-gold/30 hover:bg-gold/10 text-gold text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=000000&bgcolor=ffffff&data=${encodeURIComponent(getQrDataUrl())}`;
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Print QR Code - PALAYAN CITY YOUTH PORTAL</title>
                          <style>
                            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; font-family: sans-serif; text-align: center; }
                            img { border: 2px solid #000; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                            h2 { margin: 0 0 10px 0; color: #111; }
                          </style>
                        </head>
                        <body>
                          <h2>PALAYAN CITY YOUTH PORTAL</h2>
                          <p style="margin-bottom: 30px; font-weight: bold; color: #444;">Scan to Register as Scholar & Submit Application</p>
                          <img src="${qrUrl}" width="350" height="350" />
                          <p style="font-size: 14px; font-family: monospace; color: #555;">${getQrDataUrl()}</p>
                          <script>
                            window.onload = function() {
                              setTimeout(function() { window.print(); window.close(); }, 500);
                            };
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }}
                  className="flex-1 py-2 px-3 bg-gold-gradient text-forest-dark text-xs font-black rounded-lg transition-all cursor-pointer glow-btn hover:shadow-md"
                >
                  Print QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
