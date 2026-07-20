import React, { useState } from 'react';

export default function DocumentTable({ documents, title, onRefresh, isAdmin }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Custom Delete Modal States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(null); // { fileId, name }
  const [deleteStatus, setDeleteStatus] = useState(null); // { text, isError }
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredDocs = (documents || []).filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                       (doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Extract unique categories
  const categories = ['All', ...new Set((documents || []).map(d => d.category))];

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed, opening in new tab instead:', err);
      window.open(url, '_blank');
    }
  };

  const handleDeleteTrigger = (fileId, name) => {
    setDeletingDoc({ fileId, name });
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteAction = async () => {
    if (!deletingDoc) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/deleteDocument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: deletingDoc.fileId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete document.');

      setDeleteConfirmOpen(false);
      setDeletingDoc(null);
      setDeleteStatus({ text: data.message || 'Document deleted permanently.', isError: false });
      if (onRefresh) onRefresh();
    } catch (err) {
      setDeleteStatus({ text: err.message, isError: true });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-gold/15 w-full flex flex-col gap-4">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gold-gradient">{title || 'Document Portal'}</h2>
          <p className="text-xs text-white/50">{filteredDocs.length} documents found</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field w-full sm:w-64 pl-10 text-sm"
            />
            <svg className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="input-field text-sm cursor-pointer min-w-[150px]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-forest-dark text-white">
                {cat}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-2.5 rounded-lg border border-gold/20 hover:bg-gold/10 text-gold text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              title="Refresh lists"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto w-full border border-white/5 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gold/80 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Document Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Uploaded By</th>
              <th className="py-4 px-6">Upload Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-white/80 font-medium">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-white/40">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3m-3 0h-3m-2 0H4" />
                    </svg>
                    <span>No verified files available.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc, i) => (
                <tr key={i} className="hover:bg-white/5 transition-all">
                  <td className="py-4 px-6 text-white truncate max-w-xs">{doc.name}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white/60 font-mono text-xs">{doc.uploadedBy}</td>
                  <td className="py-4 px-6 text-white/60">
                    {new Date(doc.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'Asia/Manila'
                    })}
                  </td>
                  <td className="py-4 px-6 text-right flex justify-end gap-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gold/40 hover:bg-gold/10 text-gold font-bold text-xs hover:shadow-sm transition-all cursor-pointer"
                      title="Open in new tab"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                    <button
                      onClick={() => handleDownload(doc.url, doc.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold-gradient text-forest-dark font-extrabold text-xs hover:shadow-md transition-all glow-btn cursor-pointer"
                      title="Download file"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTrigger(doc.fileId, doc.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs hover:shadow-md transition-all cursor-pointer"
                        title="Delete document permanently"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Confirm Delete Modal */}
      {deleteConfirmOpen && deletingDoc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-150">
          <div className="glass-panel border border-red-500/30 max-w-sm w-full rounded-xl p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <h3 className="text-md font-bold uppercase tracking-wider">Confirm Delete</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-bold text-white">"{deletingDoc.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-2 shrink-0">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeletingDoc(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/5 text-white/70 cursor-pointer disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-extrabold cursor-pointer transition-all hover:shadow-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : 'Delete File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Status Notification Modal */}
      {deleteStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-150">
          <div className={`glass-panel border max-w-sm w-full rounded-xl p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-150 ${deleteStatus.isError ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
            <div className={`flex items-center gap-3 ${deleteStatus.isError ? 'text-red-400' : 'text-emerald-400'}`}>
              {deleteStatus.isError ? (
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              ) : (
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              <h3 className="text-md font-bold uppercase tracking-wider">
                {deleteStatus.isError ? 'Error Occurred' : 'Action Succeeded'}
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {deleteStatus.text}
            </p>
            <div className="flex justify-end mt-2 shrink-0">
              <button
                onClick={() => setDeleteStatus(null)}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer glow-btn ${deleteStatus.isError ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gold-gradient text-forest-dark'}`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
