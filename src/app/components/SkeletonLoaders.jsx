'use client';

import React from 'react';

/**
 * Base Skeleton block with custom gold-tinted shimmer
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`skeleton-shimmer animate-pulse rounded ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Ghost Skeleton for KPI Cards (Admins / Overview)
 */
export function KpiCardsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel border-l-4 border-gold/30 p-6 flex items-center justify-between rounded-xl relative overflow-hidden"
        >
          <div className="flex flex-col gap-2.5 w-full pr-4">
            <Skeleton className="h-3 w-28 bg-white/10" />
            <Skeleton className="h-8 w-20 bg-white/20" />
            <Skeleton className="h-2.5 w-36 bg-white/10" />
          </div>
          <Skeleton className="w-12 h-12 rounded-xl shrink-0 bg-white/10" />
        </div>
      ))}
    </div>
  );
}

/**
 * Ghost Skeleton for Document Table rows
 */
export function DocumentTableSkeleton({ rows = 5, isAdmin = true }) {
  return (
    <div className="overflow-x-auto w-full border border-white/5 rounded-lg animate-in fade-in duration-300">
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
        <tbody className="divide-y divide-white/5 text-sm">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="hover:bg-white/5 transition-all">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-7 h-7 rounded bg-white/10 shrink-0" />
                  <div className="flex flex-col gap-1.5 w-full">
                    <Skeleton className={`h-4 bg-white/20 ${i % 2 === 0 ? 'w-48' : 'w-40'}`} />
                    <Skeleton className="h-2.5 w-24 bg-white/10" />
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-6 w-24 rounded-full bg-gold/10" />
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-4 w-28 bg-white/10" />
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-4 w-24 bg-white/10" />
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-7 w-20 rounded bg-gold/15" />
                  {isAdmin && <Skeleton className="h-7 w-16 rounded bg-red-500/15" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Ghost Skeleton for the Scholar Directory Table
 */
export function ScholarTableSkeleton({ rows = 6, showActions = true }) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
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
              <th className="py-4 px-6 text-center">Appeared?</th>
              <th className="py-4 px-6">Status</th>
              {showActions && <th className="py-4 px-6 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="hover:bg-white/5 transition-all">
                {/* Application No */}
                <td className="py-4 px-6">
                  <Skeleton className="h-4.5 w-24 bg-gold/20 rounded font-mono" />
                </td>
                {/* Student Name */}
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className={`h-4 bg-white/25 rounded ${i % 2 === 0 ? 'w-44' : 'w-36'}`} />
                    <Skeleton className="h-2.5 w-32 bg-white/10 rounded" />
                  </div>
                </td>
                {/* Birthdate / Sex */}
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-24 bg-white/15 rounded" />
                    <Skeleton className="h-2.5 w-12 bg-white/10 rounded" />
                  </div>
                </td>
                {/* Barangay */}
                <td className="py-4 px-6">
                  <Skeleton className="h-4 w-24 bg-white/15 rounded" />
                </td>
                {/* School Details */}
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className={`h-4 bg-white/20 rounded ${i % 3 === 0 ? 'w-40' : 'w-32'}`} />
                    <Skeleton className="h-2.5 w-20 bg-white/10 rounded" />
                  </div>
                </td>
                {/* Circumstances */}
                <td className="py-4 px-6">
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
                    {i % 2 === 0 && <Skeleton className="h-5 w-12 rounded-full bg-white/10" />}
                  </div>
                </td>
                {/* Appeared */}
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center">
                    <Skeleton className="w-5 h-5 rounded-md bg-white/15" />
                  </div>
                </td>
                {/* Status */}
                <td className="py-4 px-6">
                  <Skeleton className="h-6 w-20 rounded-full bg-gold/15" />
                </td>
                {/* Actions */}
                {showActions && (
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Skeleton className="w-7 h-7 rounded-lg bg-gold/20" />
                      <Skeleton className="w-7 h-7 rounded-lg bg-white/10" />
                      <Skeleton className="w-7 h-7 rounded-lg bg-red-500/20" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shimmering footer status bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[11px] text-white/50 font-medium">Synchronizing scholar master records...</span>
        </div>
        <Skeleton className="h-4 w-28 bg-white/10 rounded" />
      </div>
    </div>
  );
}

/**
 * Ghost Skeleton for Analytics Tab
 */
export function AnalyticsGhostView() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Title Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-60 bg-gold/20 rounded" />
        <Skeleton className="h-3.5 w-96 max-w-full bg-white/10 rounded" />
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="glass-panel border-white/10 p-5 rounded-xl flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2.5 w-full">
              <Skeleton className="h-2.5 w-32 bg-white/10" />
              <Skeleton className="h-7 w-20 bg-white/20" />
              <Skeleton className="h-2.5 w-36 bg-white/10" />
            </div>
            <Skeleton className="w-12 h-12 rounded-lg bg-gold/10 shrink-0" />
          </div>
        ))}
      </div>

      {/* Main Grid: Category Breakdown + Trend Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Category Progress Bars */}
        <div className="glass-panel border-white/10 p-5 rounded-xl lg:col-span-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-44 bg-gold/20 rounded" />
            <Skeleton className="h-2.5 w-56 bg-white/10 rounded" />
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {[80, 60, 45, 30, 20].map((width, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-28 bg-white/15" />
                  <Skeleton className="h-3 w-14 bg-gold/20" />
                </div>
                <div className="h-2 w-full bg-forest-dark/50 rounded-full overflow-hidden border border-white/5">
                  <Skeleton className="h-full bg-gold/20" style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Trends Table Skeleton */}
        <div className="glass-panel border-white/10 p-5 rounded-xl lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-52 bg-white/25 rounded" />
              <Skeleton className="h-2.5 w-64 bg-white/10 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-36 rounded-lg bg-white/10" />
              <Skeleton className="h-8 w-20 rounded-lg bg-white/10" />
            </div>
          </div>

          <div className="overflow-x-auto w-full border border-white/5 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gold/80 text-xs font-semibold uppercase">
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Uploads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-4"><Skeleton className="h-3.5 w-28 bg-white/20" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-5 w-16 rounded-full bg-white/10" /></td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        <Skeleton className="h-5 w-20 rounded-full bg-gold/15" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end">
                        <Skeleton className="h-3.5 w-10 bg-white/15" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Ghost Skeleton for Scholar Dashboard (Applicant View)
 */
export function ScholarDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Status Dashboard Banner Skeleton */}
      <div className="glass-panel rounded-2xl p-5 sm:p-8 border border-gold/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Skeleton className="h-3 w-32 bg-white/20 rounded" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-28 rounded-full bg-gold/25" />
            <Skeleton className="h-5 w-32 rounded bg-white/10" />
          </div>
          <Skeleton className="h-2.5 w-44 bg-white/10 rounded" />
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <Skeleton className="h-9 w-40 rounded-lg bg-white/10" />
          <Skeleton className="h-2.5 w-48 bg-white/10 rounded" />
        </div>
      </div>

      {/* Official Scoreboard Skeleton */}
      <div className="glass-panel border-l-4 border-gold rounded-xl p-4 sm:p-6 flex flex-col gap-4">
        <Skeleton className="h-5 w-60 bg-gold/25 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5].map((tile) => (
            <div key={tile} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center flex flex-col items-center gap-2">
              <Skeleton className="h-2.5 w-20 bg-white/15" />
              <Skeleton className="h-6 w-14 bg-white/25" />
            </div>
          ))}
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-36 bg-white/15" />
            <Skeleton className="h-8 w-44 bg-gold/25" />
          </div>
          <Skeleton className="h-10 w-64 max-w-full bg-white/10 rounded" />
        </div>
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Card */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 flex flex-col gap-4">
          <Skeleton className="h-5 w-48 bg-gold/20 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((f) => (
              <div key={f} className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-24 bg-white/15" />
                <Skeleton className="h-4 w-36 bg-white/25" />
              </div>
            ))}
          </div>
        </div>

        {/* Personal Card */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 flex flex-col gap-4">
          <Skeleton className="h-5 w-48 bg-gold/20 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((f) => (
              <div key={f} className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-24 bg-white/15" />
                <Skeleton className="h-4 w-36 bg-white/25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Ghost Skeleton for initial Session Validation / Security Gateway
 */
export function GatewayGhostLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-forest-gradient p-4 select-none relative font-sans">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Palayan City Seal & Title Skeleton */}
      <div className="flex flex-col items-center gap-3 mb-6 text-center animate-in fade-in duration-500">
        <div className="relative">
          <img
            src="/logo_palayan.png"
            alt="Palayan City Seal"
            className="w-20 h-20 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] object-contain animate-pulse"
          />
          <div className="absolute inset-0 bg-gold/10 rounded-full blur-md animate-ping pointer-events-none" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-xl font-black text-gold-gradient tracking-tight uppercase">Palayan City Youth Portal</h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gold/20 mt-1">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="text-[11px] text-white/70 font-semibold tracking-wider uppercase">
              Verifying Secure Session...
            </span>
          </div>
        </div>
      </div>

      {/* Gateway Card Skeleton */}
      <div className="w-full max-w-md glass-panel border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Role tabs skeleton */}
        <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <Skeleton className="h-9 rounded-lg bg-gold/20" />
          <Skeleton className="h-9 rounded-lg bg-white/5" />
        </div>

        {/* Input fields skeletons */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-28 bg-white/20" />
            <Skeleton className="h-11 w-full rounded-lg bg-white/10" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24 bg-white/20" />
            <Skeleton className="h-11 w-full rounded-lg bg-white/10" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-11 w-full rounded-xl bg-gold/25 mt-1" />

        {/* Security badge skeleton */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
          <Skeleton className="w-4 h-4 rounded-full bg-emerald-400/20" />
          <Skeleton className="h-3 w-48 bg-white/15" />
        </div>
      </div>
    </div>
  );
}
