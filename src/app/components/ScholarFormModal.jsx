import React, { useState, useEffect } from 'react';
import { BARANGAYS } from '../api/_utils/constants';
import { parseFullName, formatFullName } from '../api/_utils/nameHelper';
import PrivacyTermsModal from './PrivacyTermsModal';

export default function ScholarFormModal({ isOpen, onClose, application = null, onSave, isPublicMode = false, onOpenPrivacyModal }) {
  const isEditMode = !!application;
  const [internalPrivacyTab, setInternalPrivacyTab] = useState(null);
  
  const handleOpenPrivacy = (tab) => {
    if (onOpenPrivacyModal) {
      onOpenPrivacyModal(tab);
    } else {
      setInternalPrivacyTab(tab);
    }
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    studentFullName: '',
    dateOfBirth: '',
    sex: 'Male',
    barangay: BARANGAYS[0],
    contactNumber: '',
    email: '',
    school: '',
    schoolYear: '2026-2027',
    isSoloParentBeneficiary: false,
    isOrphan: false,
    isPwd: false,
    isIp: false,
    isOutOfSchoolYouth: false,
    specialCircumstancesSpecify: '',
    status: 'Pending'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isBarangayDropdownOpen, setIsBarangayDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync data on open / mode change
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && application) {
        let firstName = application.first_name || '';
        let middleName = application.middle_name || '';
        let lastName = application.last_name || '';
        let suffix = application.suffix || '';

        // If editing a legacy record with only student_full_name, parse it automatically
        if (!firstName && !lastName && application.student_full_name) {
          const parsed = parseFullName(application.student_full_name);
          firstName = parsed.firstName;
          middleName = parsed.middleName;
          lastName = parsed.lastName;
          suffix = parsed.suffix;
        }

        const studentFullName = application.student_full_name || formatFullName({ firstName, middleName, lastName, suffix });

        setFormData({
          id: application.id,
          firstName,
          middleName,
          lastName,
          suffix,
          studentFullName,
          dateOfBirth: application.date_of_birth ? new Date(application.date_of_birth).toISOString().split('T')[0] : '',
          sex: application.sex || 'Male',
          barangay: application.barangay || BARANGAYS[0],
          contactNumber: application.contact_number || '',
          email: application.email || '',
          school: application.school || '',
          schoolYear: application.school_year || '2026-2027',
          isSoloParentBeneficiary: application.is_solo_parent_beneficiary || false,
          isOrphan: application.is_orphan || false,
          isPwd: application.is_pwd || false,
          isIp: application.is_ip || false,
          isOutOfSchoolYouth: application.is_out_of_school_youth || false,
          specialCircumstancesSpecify: application.special_circumstances_specify || '',
          status: application.status || 'Pending'
        });
        setSearchQuery(application.barangay || '');
      } else {
        // Reset
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          suffix: '',
          studentFullName: '',
          dateOfBirth: '',
          sex: 'Male',
          barangay: BARANGAYS[0],
          contactNumber: '',
          email: '',
          school: '',
          schoolYear: '2026-2027',
          isSoloParentBeneficiary: false,
          isOrphan: false,
          isPwd: false,
          isIp: false,
          isOutOfSchoolYouth: false,
          specialCircumstancesSpecify: '',
          status: 'Pending'
        });
        setSearchQuery(BARANGAYS[0]);
      }
      setError('');
    }
  }, [isOpen, isEditMode, application]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      // Keep studentFullName in sync whenever name fields change
      if (['firstName', 'middleName', 'lastName', 'suffix'].includes(name)) {
        updated.studentFullName = formatFullName(updated);
      }
      return updated;
    });
  };

  const handleBarangaySelect = (barangayName) => {
    setFormData(prev => ({ ...prev, barangay: barangayName }));
    setSearchQuery(barangayName);
    setIsBarangayDropdownOpen(false);
  };

  const filteredBarangays = BARANGAYS.filter(b => 
    b.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isPublicMode ? '/api/public/submitScholar' : (isEditMode ? '/api/admin/updateScholar' : '/api/admin/encodeScholar');
    
    // Ensure studentFullName is properly formatted from parts
    const studentFullName = formatFullName(formData) || formData.studentFullName;
    const payload = {
      ...formData,
      studentFullName
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save application');
      }

      onSave(data.applicationNo); // Pass back generated AFS if new
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-sans animate-in fade-in duration-200">
      <div className="glass-panel border border-gold/30 w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gold-gradient">
              {isEditMode ? 'Correct Scholar Profile' : 'Encode New Scholar'}
            </h2>
            <p className="text-xs text-white/50">
              {isEditMode ? `Editing ${application.application_no}` : 'System will auto-generate application number'}
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white rounded-full p-1 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          <form id="scholarForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Scholar Name Fields */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="input-label">First Name *</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    required 
                    placeholder="e.g. Juan" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="input-field" 
                    disabled={loading} 
                  />
                </div>

                <div className="flex flex-col">
                  <label className="input-label">Middle Name <span className="text-white/40 font-normal text-xs">(Optional)</span></label>
                  <input 
                    type="text" 
                    name="middleName" 
                    placeholder="e.g. Santos (or leave blank)" 
                    value={formData.middleName} 
                    onChange={handleChange} 
                    className="input-field" 
                    disabled={loading} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col">
                  <label className="input-label">Last Name (Surname) *</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    required 
                    placeholder="e.g. Dela Cruz" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="input-field" 
                    disabled={loading} 
                  />
                </div>

                <div className="flex flex-col">
                  <label className="input-label">Suffix <span className="text-white/40 font-normal text-xs">(Optional)</span></label>
                  <select 
                    name="suffix" 
                    value={formData.suffix} 
                    onChange={handleChange} 
                    className="input-field cursor-pointer" 
                    disabled={loading}
                  >
                    <option value="" className="bg-forest-dark text-white">None</option>
                    <option value="Jr." className="bg-forest-dark text-white">Jr.</option>
                    <option value="Sr." className="bg-forest-dark text-white">Sr.</option>
                    <option value="II" className="bg-forest-dark text-white">II</option>
                    <option value="III" className="bg-forest-dark text-white">III</option>
                    <option value="IV" className="bg-forest-dark text-white">IV</option>
                    <option value="V" className="bg-forest-dark text-white">V</option>
                  </select>
                </div>
              </div>

              {/* Full Name Preview if name entered */}
              {formData.studentFullName && (
                <div className="text-[11px] text-gold/80 px-1 flex items-center gap-1.5 font-mono">
                  <span className="text-white/40">Full Name Preview:</span>
                  <span className="font-semibold">{formData.studentFullName}</span>
                </div>
              )}
            </div>

            {/* Date of Birth & Sex */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="input-label">Date of Birth *</label>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  required 
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  className="input-field cursor-pointer" 
                  disabled={loading} 
                />
              </div>
              <div className="flex flex-col">
                <label className="input-label">Sex *</label>
                <select 
                  name="sex" 
                  value={formData.sex} 
                  onChange={handleChange} 
                  className="input-field cursor-pointer" 
                  disabled={loading}
                >
                  <option value="Male" className="bg-forest-dark text-white">Male</option>
                  <option value="Female" className="bg-forest-dark text-white">Female</option>
                </select>
              </div>
            </div>

            {/* Address (searchable dropdown) */}
            <div className="flex flex-col relative">
              <label className="input-label">Barangay Address *</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search and select barangay..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsBarangayDropdownOpen(true);
                  }}
                  onFocus={() => setIsBarangayDropdownOpen(true)}
                  className="input-field w-full"
                  disabled={loading}
                />
                {isBarangayDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-forest-dark border border-gold/25 rounded-lg shadow-xl z-50 divide-y divide-white/5">
                    {filteredBarangays.length > 0 ? (
                      filteredBarangays.map(b => (
                        <div 
                          key={b} 
                          onClick={() => handleBarangaySelect(b)}
                          className="px-4 py-2 hover:bg-gold/15 cursor-pointer text-white/80 hover:text-white transition-all text-sm"
                        >
                          {b}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-white/40 text-sm">No barangays found</div>
                    )}
                  </div>
                )}
              </div>
              {/* Backdrop-like closing click handler */}
              {isBarangayDropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsBarangayDropdownOpen(false)} />
              )}
            </div>

            {/* Contact & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="input-label">Contact Number *</label>
                <input 
                  type="tel" 
                  name="contactNumber" 
                  required 
                  placeholder="09XXXXXXXXX"
                  value={formData.contactNumber} 
                  onChange={handleChange} 
                  className="input-field" 
                  disabled={loading} 
                />
              </div>
              <div className="flex flex-col">
                <label className="input-label">Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="name@domain.com"
                  value={formData.email} 
                  onChange={handleChange} 
                  className="input-field" 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* School & School Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="input-label">School *</label>
                <input 
                  type="text" 
                  name="school" 
                  required 
                  placeholder="School Name"
                  value={formData.school} 
                  onChange={handleChange} 
                  className="input-field" 
                  disabled={loading} 
                />
              </div>
              <div className="flex flex-col">
                <label className="input-label">School Year *</label>
                <input 
                  type="text" 
                  name="schoolYear" 
                  required 
                  placeholder="e.g. 2026-2027"
                  value={formData.schoolYear} 
                  onChange={handleChange} 
                  className="input-field" 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* Special Circumstances */}
            <div className="flex flex-col gap-3">
              <label className="input-label">Special Circumstances</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer hover:text-white">
                  <input type="checkbox" name="isSoloParentBeneficiary" checked={formData.isSoloParentBeneficiary} onChange={handleChange} className="w-4 h-4 accent-gold" disabled={loading} />
                  Solo Parent Beneficiary
                </label>
                <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer hover:text-white">
                  <input type="checkbox" name="isOrphan" checked={formData.isOrphan} onChange={handleChange} className="w-4 h-4 accent-gold" disabled={loading} />
                  Orphan
                </label>
                <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer hover:text-white">
                  <input type="checkbox" name="isPwd" checked={formData.isPwd} onChange={handleChange} className="w-4 h-4 accent-gold" disabled={loading} />
                  Person with Disability (PWD)
                </label>
                <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer hover:text-white">
                  <input type="checkbox" name="isIp" checked={formData.isIp} onChange={handleChange} className="w-4 h-4 accent-gold" disabled={loading} />
                  Indigenous People (IP)
                </label>
                <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer hover:text-white sm:col-span-2">
                  <input type="checkbox" name="isOutOfSchoolYouth" checked={formData.isOutOfSchoolYouth} onChange={handleChange} className="w-4 h-4 accent-gold" disabled={loading} />
                  Out-of-School Youth Returnee
                </label>
              </div>
            </div>

            {/* Specify Why */}
            <div className="flex flex-col">
              <label className="input-label">If applicable, specify details/why:</label>
              <textarea 
                name="specialCircumstancesSpecify" 
                rows="2" 
                placeholder="Details of special circumstances..."
                value={formData.specialCircumstancesSpecify} 
                onChange={handleChange} 
                className="input-field resize-none" 
                disabled={loading} 
              />
            </div>

            {/* Status */}
            {!isPublicMode && (
              <div className="flex flex-col w-full max-w-xs">
                <label className="input-label">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="input-field font-bold cursor-pointer" 
                  disabled={loading}
                >
                  <option value="Pending" className="bg-forest-dark text-yellow-400">For Review</option>
                  <option value="Approved" className="bg-forest-dark text-green-400">Approve</option>
                  <option value="Rejected" className="bg-forest-dark text-red-400">Disapprove</option>
                </select>
              </div>
            )}
            {/* Data Privacy Consent Notice */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-2.5 text-[11px] text-white/60">
              <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="leading-normal">
                <span className="font-semibold text-white/80 block">Data Privacy Consent (R.A. 10173)</span>
                <span>
                  The personal information collected in this form is processed strictly by LGU Palayan City for evaluating scholarship eligibility. View our{' '}
                  <button
                    type="button"
                    onClick={() => handleOpenPrivacy('privacy')}
                    className="text-gold underline hover:text-gold-light cursor-pointer font-medium"
                  >
                    Privacy Policy
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => handleOpenPrivacy('terms')}
                    className="text-gold underline hover:text-gold-light cursor-pointer font-medium"
                  >
                    Terms & Conditions
                  </button>.
                </span>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-white/5 shrink-0">
          <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:bg-white/10 font-semibold text-sm transition-all cursor-pointer disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="scholarForm" disabled={loading} className="px-5 py-2.5 rounded-lg bg-gold-gradient text-forest-dark hover:shadow-lg font-bold text-sm transition-all cursor-pointer glow-btn disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-forest-dark" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : isEditMode ? 'Save Changes' : 'Encode Scholar'}
          </button>
        </div>
      </div>

      {/* Internal Privacy & Terms Modal Fallback */}
      {internalPrivacyTab && (
        <PrivacyTermsModal
          isOpen={!!internalPrivacyTab}
          initialTab={internalPrivacyTab}
          onClose={() => setInternalPrivacyTab(null)}
        />
      )}
    </div>
  );
}
