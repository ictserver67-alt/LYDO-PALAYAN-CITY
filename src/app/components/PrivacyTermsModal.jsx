'use client';

import React, { useState } from 'react';

export default function PrivacyTermsModal({ isOpen, onClose, initialTab = 'seal' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync initialTab if changed on re-open
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[120] p-4 font-sans animate-in fade-in duration-200">
      <div className="glass-panel border border-gold/30 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="/npc_seal.png" 
              alt="NPC Seal" 
              className="w-8 h-12 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.2)]" 
            />
            <div>
              <h2 className="text-lg font-bold text-gold-gradient leading-tight">
                Data Privacy & Terms of Service
              </h2>
              <p className="text-[11px] text-white/50">
                LGU Palayan City • Local Youth Development Office (LYDO)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white rounded-full p-1.5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/20 shrink-0 px-6">
          <button
            onClick={() => setActiveTab('seal')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'seal'
                ? 'border-gold text-gold bg-white/[0.03]'
                : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            NPC Registration Seal
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-gold text-gold bg-white/[0.03]'
                : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'border-gold text-gold bg-white/[0.03]'
                : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Terms & Conditions
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-6 text-white/80 text-xs leading-relaxed space-y-4">
          
          {/* TAB 1: NPC SEAL */}
          {activeTab === 'seal' && (
            <div className="flex flex-col items-center gap-6 py-2">
              <div className="relative group p-2 bg-white/5 border border-gold/30 rounded-2xl shadow-xl flex items-center justify-center">
                <img 
                  src="/npc_seal.png" 
                  alt="National Privacy Commission DPO/DPS Registered Seal" 
                  className="max-h-[380px] w-auto object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.15)]" 
                />
              </div>

              <div className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-gold font-bold text-sm">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Official National Privacy Commission (NPC) Certification
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <span className="text-white/40 block uppercase tracking-wider text-[9px]">Registration Type</span>
                    <span className="text-white font-semibold">DPO / DPS Registered</span>
                    <p className="text-white/50 text-[10px] mt-0.5">Data Protection Officer & Data Processing System</p>
                  </div>

                  <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                    <span className="text-white/40 block uppercase tracking-wider text-[9px]">Validity Period</span>
                    <span className="text-emerald-400 font-bold">Valid until 23 June 2027</span>
                    <p className="text-white/50 text-[10px] mt-0.5">Verified & Signed by Privacy Commissioner</p>
                  </div>
                </div>

                <p className="text-white/70 text-[11px] leading-relaxed">
                  In compliance with Republic Act No. 10173, also known as the <strong className="text-white">Data Privacy Act of 2012</strong>, the City Government of Palayan (Local Youth Development Office and City Planning & Development Office) has duly registered its Data Processing Systems and designated Data Protection Officer with the National Privacy Commission.
                </p>

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/50">
                  <span>Signatory: <strong>Atty. Johann Carlos S. Barcena</strong>, Privacy Commissioner</span>
                  <span className="text-gold font-mono">“Datos ng Pilipino, Protektado Ko!”</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gold uppercase tracking-wider">
                  Palayan City Youth Portal Privacy Notice
                </h3>
                <p className="text-white/50 text-[11px]">Last Updated: September 2026 • Compliant with Republic Act No. 10173</p>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">1. Commitment to Privacy</h4>
                <p>
                  The Local Youth Development Office (LYDO) and the City Government of Palayan respect and value your privacy rights as a data subject. This Privacy Policy outlines how we collect, process, store, protect, and dispose of your personal and sensitive personal information in accordance with R.A. 10173 (Data Privacy Act of 2012) and its Implementing Rules and Regulations.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">2. Personal Data We Collect</h4>
                <p>When you register, apply for scholarship assistance, or submit youth governance documents, we collect:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-white/70">
                  <li><strong>Scholar Information:</strong> Full name (First, Middle, Last, Suffix), Date of Birth, Sex, Barangay of Residence, Contact Number, Email Address, School Name, and School Year.</li>
                  <li><strong>Special Circumstances Data:</strong> Solo parent beneficiary status, orphan status, person with disability (PWD) identification, indigenous people (IP) affiliation, and out-of-school youth status.</li>
                  <li><strong>Youth Governance Documents:</strong> SK Minutes of Meetings, Comprehensive Barangay Youth Development Plans (CBYDP), Annual Barangay Youth Investment Programs (ABYIP), and Financial/Accomplishment reports.</li>
                  <li><strong>System Logs:</strong> IP address, login timestamps, and audit activity records to ensure portal security and administrative transparency.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">3. Purpose and Lawful Basis of Processing</h4>
                <p>Your personal data is processed solely for legitimate public interest purposes:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-white/70">
                  <li>Evaluating, ranking, and verifying eligibility for local educational financial assistance programs (LYDC Resolution No. 5).</li>
                  <li>Monitoring attendance and scholar appearance during physical document verification.</li>
                  <li>Tracking SK compliance with statutory youth governance deliverables.</li>
                  <li>Complying with statutory audits conducted by the Commission on Audit (COA), DILG, and National Youth Commission (NYC).</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">4. Data Storage, Security, and Protection</h4>
                <p>
                  We implement robust technical, organizational, and physical safeguards. Data is encrypted in transit using industry-standard TLS/SSL encryption and stored securely in dedicated PostgreSQL databases with multi-factor authentication, row-level controls, and continuous audit logging. Documents are archived within secured cloud storage with restricted administrative access.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">5. Data Sharing and Disclosure</h4>
                <p>
                  We do not sell, rent, or trade your personal information. Data sharing is limited to authorized government agencies (e.g., COA for fund auditing, DILG, NYC) strictly upon lawful request and in compliance with data sharing agreements.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">6. Rights of the Data Subject</h4>
                <p>Under the Data Privacy Act of 2012, you are entitled to:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-white/70">
                  <li><strong>Right to be Informed:</strong> To know whether personal data pertaining to you is being processed.</li>
                  <li><strong>Right to Access:</strong> To request a copy of the personal information we hold about you.</li>
                  <li><strong>Right to Rectification:</strong> To dispute inaccuracies and request correction of your profile data.</li>
                  <li><strong>Right to Erasure or Blocking:</strong> To request suspension, withdrawal, or deletion of your data upon reasonable grounds.</li>
                  <li><strong>Right to Damages:</strong> To be indemnified for damages sustained due to inaccurate or unlawfully obtained data.</li>
                </ul>
              </section>

              <section className="space-y-1.5 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                <h4 className="font-semibold text-gold text-xs">7. Data Protection Officer (DPO) Contact</h4>
                <p className="text-white/60 text-[11px]">
                  For any questions, concerns, or requests regarding your personal data and privacy rights, you may contact the City Government of Palayan Data Protection Office:
                </p>
                <div className="mt-1 font-mono text-[11px] text-white/80 space-y-0.5">
                  <p>Office: Local Youth Development Office / CPDO, City Hall, Palayan City</p>
                  <p>Email: <span className="text-gold">dpo@palayancity.gov.ph</span> / <span className="text-gold">lydo@palayancity.gov.ph</span></p>
                  <p>National Privacy Commission Registration: Valid until June 23, 2027</p>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gold uppercase tracking-wider">
                  Terms and Conditions of Use
                </h3>
                <p className="text-white/50 text-[11px]">Palayan City Youth Portal • City Government of Palayan</p>
              </div>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">1. Acceptance of Terms</h4>
                <p>
                  By accessing or registering on the Palayan City Youth Portal, whether as a student scholar, Sangguniang Kabataan (SK) official, LYDC member, or administrative encoder, you agree to be bound by these Terms and Conditions and our Privacy Policy.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">2. User Account Responsibilities</h4>
                <p>
                  You are responsible for maintaining the confidentiality of your username and password. Any action performed through your credentials shall be presumed to be authorized by you. You must immediately notify the administrator of any unauthorized use or security breach.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">3. Accuracy of Scholar Application Information</h4>
                <p>
                  Scholars and encoders must provide true, complete, and updated information. Submitting fraudulent civil status, forged certificates of indigency, falsified grades, or false special circumstances (e.g. counterfeit PWD or solo parent documents) shall result in automatic disqualification from the scholarship program and may subject the applicant to administrative and legal sanctions under applicable Philippine laws.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">4. Youth Governance Document Submission</h4>
                <p>
                  SK officials and designated representatives are mandated to upload accurate and authenticated copies of official youth governance records (Minutes of Meeting, CBYDP, ABYIP, and Financial Reports). All uploaded documents are subjected to formal administrative review and verification by the LYDO before final approval.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">5. Prohibited Activities</h4>
                <p>Users are strictly prohibited from:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-white/70">
                  <li>Attempting to bypass authentication mechanisms, inject malicious scripts, or tamper with application numbers.</li>
                  <li>Accessing or attempting to access other users' personal profiles without explicit administrative authorization.</li>
                  <li>Downloading or disseminating private scholar records outside official local government functions.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">6. System Availability and Modifications</h4>
                <p>
                  The City Government of Palayan strives to ensure continuous portal uptime but does not guarantee uninterrupted operation during scheduled maintenance, system upgrades, or technical emergencies. We reserve the right to modify or update these terms at any time with notice published on the portal.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-semibold text-white text-xs">7. Governing Law and Jurisdiction</h4>
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any legal disputes arising from portal use shall be settled in the competent courts of Palayan City, Nueva Ecija.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-white/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NPC Registration Seal: Valid until June 23, 2027</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gold-gradient text-forest-dark font-extrabold text-xs rounded-lg hover:shadow-lg transition-all cursor-pointer"
          >
            I Understand & Close
          </button>
        </div>

      </div>
    </div>
  );
}
