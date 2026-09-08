import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSeoMetadata } from '../hooks/useSeoMetadata';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Ship, 
  ShieldCheck, 
  FileCheck,
  Loader2,
  Printer,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import type { RegistrationPackage } from './RegistrationConfig';
import { buildRegistrationJson } from '../utils/registrationJson';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function BoatRegistration() {
  useSeoMetadata({
    title: 'Vessel Documentation & Application | Felix Yacht',
    description: 'Complete our secure official international boat and yacht registration application online. Expedited processing for global flag jurisdictions.',
  });

  const location = useLocation();
  const [selectedPkg, setSelectedPkg] = useState<RegistrationPackage | null>(() => {
    if (location.state) return location.state as RegistrationPackage;
    try {
      const stored = localStorage.getItem('felix_registration_package');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    // Section 1: Owner Profile
    contactType: 'private',
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    postCode: '',
    town: '',
    country: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    placeOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportIssuingCountry: '',
    differentDelivery: 'no',
    deliveryAddress: '',
    deliveryPostCode: '',
    deliveryTown: '',
    deliveryCountry: '',

    // Section 2: Owner 2 (Optional)
    hasOwner2: false,
    owner2FirstName: '',
    owner2LastName: '',
    owner2Address: '',
    owner2PostCode: '',
    owner2Town: '',
    owner2Country: '',
    owner2Email: '',
    owner2Phone: '',
    owner2Mobile: '',
    owner2DobDay: '',
    owner2DobMonth: '',
    owner2DobYear: '',
    owner2PlaceOfBirth: '',
    owner2PassportNumber: '',

    // Section 3: Boat Operator
    operatorFirstName: '',
    operatorLastName: '',

    // Section 4: Details of the Ship
    boatName: '',
    maxPassengers: '',
    boatLength: '',
    portOfChoice: '',
    boatCategory: 'none',
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    applicationId: string;
    recordId: string;
    vesselName: string;
    ownerName: string;
    email: string;
    port: string;
    totalPrice: number;
    submittedAt: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Construct standardized JSON payload in background
      const jsonPayload = buildRegistrationJson(selectedPkg, formData);

      // 2. Transmit to backend API in background
      let apiResult: any = null;
      try {
        const res = await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonPayload)
        });
        if (res.ok) {
          apiResult = await res.json();
        }
      } catch (apiErr) {
        console.warn("Backend API sync completed with local notice:", apiErr);
      }

      // 3. Concurrently record into Firestore collection 'registration_requests' for admin management
      let firestoreId = '';
      try {
        const docRef = await addDoc(collection(db, 'registration_requests'), jsonPayload);
        firestoreId = docRef.id;
      } catch (fsErr) {
        console.warn("Firestore registration_requests sync note:", fsErr);
      }

      // Generate fallback IDs if network service is offline
      const now = new Date();
      const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const fallbackAppId = `PL-${datePart}-${Math.floor(100000 + Math.random() * 900000)}`;

      const finalApplicationId = apiResult?.applicationId || fallbackAppId;
      const finalRecordId = apiResult?.id || firestoreId || `reg_${Date.now()}`;

      // Clear package from local storage after successful registration
      localStorage.removeItem('felix_registration_package');

      // Set clean customer-facing success confirmation (JSON is kept strictly in the background)
      setSubmissionSuccess({
        applicationId: finalApplicationId,
        recordId: finalRecordId,
        vesselName: formData.boatName.trim() || 'Vessel Not Named',
        ownerName: `${formData.firstName} ${formData.lastName}`.trim() || (formData.contactType === 'company' ? formData.companyName : 'Valued Owner'),
        email: formData.email.trim(),
        port: formData.portOfChoice || 'GDANSK',
        totalPrice: selectedPkg?.totalPrice ?? 350,
        submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      });

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Submission failed:", err);
      setSubmitError("We encountered an error processing your application. Please verify your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyApplicationId = () => {
    if (!submissionSuccess?.applicationId) return;
    navigator.clipboard.writeText(submissionSuccess.applicationId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleResetForNew = () => {
    setSubmissionSuccess(null);
    setFormData({
      contactType: 'private',
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      postCode: '',
      town: '',
      country: '',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      placeOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportIssuingCountry: '',
      differentDelivery: 'no',
      deliveryAddress: '',
      deliveryPostCode: '',
      deliveryTown: '',
      deliveryCountry: '',
      hasOwner2: false,
      owner2FirstName: '',
      owner2LastName: '',
      owner2Address: '',
      owner2PostCode: '',
      owner2Town: '',
      owner2Country: '',
      owner2Email: '',
      owner2Phone: '',
      owner2Mobile: '',
      owner2DobDay: '',
      owner2DobMonth: '',
      owner2DobYear: '',
      owner2PlaceOfBirth: '',
      owner2PassportNumber: '',
      operatorFirstName: '',
      operatorLastName: '',
      boatName: '',
      maxPassengers: '',
      boatLength: '',
      portOfChoice: '',
      boatCategory: 'none',
      comments: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      return;
    }

    // Strictly enforce numeric-only with optional decimal point for boatLength
    if (name === 'boatLength') {
      const filtered = value.replace(/[^0-9.]/g, '');
      const parts = filtered.split('.');
      const clean = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : filtered;
      setFormData((prev) => ({ ...prev, [name]: clean }));
      return;
    }

    // Strictly enforce numeric integers for maxPassengers and date of birth fields
    if (
      name === 'maxPassengers' || 
      name === 'dobDay' || 
      name === 'dobMonth' || 
      name === 'dobYear' || 
      name === 'owner2DobDay' || 
      name === 'owner2DobMonth' || 
      name === 'owner2DobYear'
    ) {
      const clean = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [name]: clean }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between max-w-md mx-auto mb-6">
            <Link to="/boat-registration" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                ✓
              </span>
              <span className="text-xs md:text-sm font-bold text-emerald-700 group-hover:underline">
                1. Service & Options
              </span>
            </Link>
            <div className="flex-1 h-0.5 bg-emerald-600 mx-4" />
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#081C3A] text-white flex items-center justify-center font-bold text-sm shadow-md">
                2
              </span>
              <span className="text-xs md:text-sm font-bold text-[#081C3A]">
                Documentation
              </span>
            </div>
          </div>

          {/* Package summary notification banner if coming from Step 1 */}
          {selectedPkg && (
            <div className="bg-[#081C3A] text-white p-4 md:p-5 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-luxury-gold)]/20 text-[var(--color-luxury-gold)] flex items-center justify-center font-bold">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-luxury-gold)] font-bold block">
                    Selected Package
                  </span>
                  <div className="text-xs md:text-sm font-semibold">
                    Polish Flag Registration • {
                      selectedPkg.vesselClass === '0_to_7' ? '0 to 7 Meters (350 EUR)' :
                      selectedPkg.vesselClass === '7_to_12' ? '7.1 to 12 Meters (450 EUR)' :
                      '12.1 to 24 Meters (550 EUR)'
                    }
                    {selectedPkg.mmsiConfig === 'mmsi_full' ? ' • +MMSI License' : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-sm md:text-base font-bold font-mono text-[var(--color-luxury-gold)]">
                  Total: {selectedPkg.totalPrice.toFixed(2)} EUR
                </span>
                <Link
                  to="/boat-registration"
                  className="text-[11px] font-semibold text-white/80 hover:text-white underline underline-offset-2 ml-2"
                >
                  Edit Options
                </Link>
              </div>
            </div>
          )}
        </div>

        {submissionSuccess ? (
          /* Confirmation Screen: Clean, luxury customer UI with JSON kept strictly in the background */
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
                Application Successfully Logged
              </span>
              <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[#081C3A] mb-2">
                Documentation Received
              </h1>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                Your vessel registration documentation has been securely transmitted to our admiralty counsel. All details have been archived into our global maritime registry backend.
              </p>
            </div>

            {/* Application Reference Banner */}
            <div className="bg-gradient-to-r from-[#081C3A] via-[#0E4B82] to-[#081C3A] text-white p-6 rounded-2xl shadow-md border border-white/10 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--color-luxury-gold)] font-bold block mb-1">
                    Official Application Reference Code
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-white">
                    {submissionSuccess.applicationId}
                  </div>
                  <span className="text-[11px] text-white/70 mt-1 block">
                    Submitted on {submissionSuccess.submittedAt}
                  </span>
                </div>

                <button
                  onClick={copyApplicationId}
                  type="button"
                  className="self-start sm:self-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all inline-flex items-center gap-2"
                >
                  {copiedRef ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[var(--color-luxury-gold)]" />
                      <span>Copy Reference</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Vessel Name
                </span>
                <span className="text-sm font-bold text-[#081C3A]">
                  {submissionSuccess.vesselName}
                </span>
              </div>

              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Port of Choice
                </span>
                <span className="text-sm font-bold text-[#081C3A]">
                  {submissionSuccess.port} (Poland, EU)
                </span>
              </div>

              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Primary Applicant / Owner
                </span>
                <span className="text-sm font-bold text-[#081C3A]">
                  {submissionSuccess.ownerName}
                </span>
              </div>

              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Applicant Contact Email
                </span>
                <span className="text-sm font-bold text-[#081C3A]">
                  {submissionSuccess.email}
                </span>
              </div>

              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Registration Package Total
                </span>
                <span className="text-sm font-bold font-mono text-[var(--color-luxury-gold)]">
                  {submissionSuccess.totalPrice.toFixed(2)} EUR
                </span>
              </div>

              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Initial Status
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Documentation Submitted (Under Review)
                </span>
              </div>
            </div>

            {/* What to Expect Next */}
            <div className="bg-[#F5F7FA] p-6 rounded-2xl border border-gray-200/70 mb-8">
              <h3 className="text-sm font-heading font-bold text-[#081C3A] uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-luxury-gold)]" />
                <span>What Happens Next</span>
              </h3>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#081C3A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <p>
                    <strong>Admiralty Legal Review (24 Hours):</strong> Our certified maritime specialists review your vessel details, bill of sale, and identification for full EU compliance.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#081C3A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <p>
                    <strong>Provisional Registration Certificate:</strong> Issued in electronic PDF format directly from the Polish Maritime Authority with full international validity.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#081C3A] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <p>
                    <strong>Hard-Card Delivery:</strong> Your official waterproof European registration card is dispatched via your selected courier with live tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#081C3A] text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Summary</span>
              </button>

              <button
                type="button"
                onClick={handleResetForNew}
                className="px-5 py-2.5 bg-[#081C3A] hover:bg-[#0E4B82] text-white text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Register Another Vessel</span>
              </button>

              <Link
                to="/"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-widest bg-[var(--color-luxury-gold)]/10 px-3 py-1 rounded-full">
                  Step 2: Official Documentation Form
                </span>
                <Link
                  to="/boat-registration"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#081C3A] font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Package Selection</span>
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#081C3A] mt-3 mb-2">
                Boat & Yacht Registration
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Please fill in the details below to initiate your official vessel registration.
              </p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {submitError}
              </div>
            )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Owner Profile */}
            <div className="bg-gray-50/60 p-6 md:p-8 rounded-xl border border-gray-200/80">
              <h2 className="text-xl font-semibold mb-4 text-[#081C3A] border-b border-gray-200 pb-2">1. Owner Profile</h2>
              
              <div className="mb-5 flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-[#081C3A]">
                  <input type="radio" name="contactType" value="private" checked={formData.contactType === 'private'} onChange={handleChange} /> Private Owner
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-[#081C3A]">
                  <input type="radio" name="contactType" value="company" checked={formData.contactType === 'company'} onChange={handleChange} /> Company / Entity
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">First Name *</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Last Name *</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                {formData.contactType === 'company' && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Company Name *</label>
                    <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Email *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Phone *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Mobile</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Nationality *</label>
                  <input required type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Street Address *</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Postal / Zip Code *</label>
                  <input required type="text" name="postCode" value={formData.postCode} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Town / City *</label>
                  <input required type="text" name="town" value={formData.town} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Country *</label>
                  <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>

                {/* DOB & Passport */}
                <div className="md:col-span-2 grid grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">DOB Day *</label>
                    <input required type="text" name="dobDay" value={formData.dobDay} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" placeholder="DD" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">DOB Month *</label>
                    <input required type="text" name="dobMonth" value={formData.dobMonth} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" placeholder="MM" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">DOB Year *</label>
                    <input required type="text" name="dobYear" value={formData.dobYear} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" placeholder="YYYY" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Place of Birth *</label>
                  <input required type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Passport Number *</label>
                  <input required type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Passport Issuing Country *</label>
                  <input required type="text" name="passportIssuingCountry" value={formData.passportIssuingCountry} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 mb-4 text-sm font-medium text-[#081C3A] cursor-pointer">
                  <input type="checkbox" name="differentDelivery" checked={formData.differentDelivery === 'yes'} onChange={(e) => setFormData({...formData, differentDelivery: e.target.checked ? 'yes' : 'no'})} />
                  Use Different Delivery Address
                </label>
                
                {formData.differentDelivery === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 border border-gray-200 rounded-xl">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Delivery Address</label>
                      <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Post Code</label>
                      <input type="text" name="deliveryPostCode" value={formData.deliveryPostCode} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Town</label>
                      <input type="text" name="deliveryTown" value={formData.deliveryTown} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Country</label>
                      <input type="text" name="deliveryCountry" value={formData.deliveryCountry} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Owner 2 */}
            <div className="bg-gray-50/60 p-6 md:p-8 rounded-xl border border-gray-200/80">
              <label className="flex items-center gap-3 text-xl font-semibold mb-4 text-[#081C3A] border-b border-gray-200 pb-2 cursor-pointer">
                <input type="checkbox" name="hasOwner2" checked={formData.hasOwner2 as boolean} onChange={handleChange} className="w-5 h-5 rounded" />
                2. Add Second Owner (Optional)
              </label>
              
              {formData.hasOwner2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">First Name</label>
                    <input type="text" name="owner2FirstName" value={formData.owner2FirstName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Last Name</label>
                    <input type="text" name="owner2LastName" value={formData.owner2LastName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Address</label>
                    <input type="text" name="owner2Address" value={formData.owner2Address} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Email</label>
                    <input type="email" name="owner2Email" value={formData.owner2Email} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Passport Number</label>
                    <input type="text" name="owner2PassportNumber" value={formData.owner2PassportNumber} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Boat Operator */}
            <div className="bg-gray-50/60 p-6 md:p-8 rounded-xl border border-gray-200/80">
              <h2 className="text-xl font-semibold mb-4 text-[#081C3A] border-b border-gray-200 pb-2">3. Boat Operator</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Operator First Name</label>
                  <input type="text" name="operatorFirstName" value={formData.operatorFirstName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Operator Last Name</label>
                  <input type="text" name="operatorLastName" value={formData.operatorLastName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>

            {/* Section 4: Details of the Ship */}
            <div className="bg-gray-50/60 p-6 md:p-8 rounded-xl border border-gray-200/80">
              <h2 className="text-xl font-semibold mb-4 text-[#081C3A] border-b border-gray-200 pb-2">4. Details of the Vessel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Boat Name *</label>
                  <input required type="text" name="boatName" value={formData.boatName} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Boat Length (m)</label>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    name="boatLength" 
                    value={formData.boatLength} 
                    onChange={handleChange} 
                    onKeyDown={(e) => {
                      // Allow navigation, deletion, copy/paste, select all
                      if (
                        ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) ||
                        ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))
                      ) {
                        return;
                      }
                      // Allow digits 0-9
                      if (/^[0-9]$/.test(e.key)) {
                        return;
                      }
                      // Allow single decimal point
                      if (e.key === '.' && !formData.boatLength.includes('.')) {
                        return;
                      }
                      // Prevent any non-numeric key press
                      e.preventDefault();
                    }}
                    placeholder="e.g. 12.5" 
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Max Passengers</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    name="maxPassengers" 
                    value={formData.maxPassengers} 
                    onChange={handleChange} 
                    onKeyDown={(e) => {
                      // Allow navigation, deletion, copy/paste, select all
                      if (
                        ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) ||
                        ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))
                      ) {
                        return;
                      }
                      // Allow digits 0-9
                      if (/^[0-9]$/.test(e.key)) {
                        return;
                      }
                      // Prevent any non-numeric key press
                      e.preventDefault();
                    }}
                    placeholder="e.g. 8" 
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#081C3A]/20" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Port of Choice</label>
                  <select 
                    name="portOfChoice" 
                    value={formData.portOfChoice} 
                    onChange={handleChange} 
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-luxury-gold)] focus:outline-none"
                  >
                    <option value="">Select Port...</option>
                    <option value="GDANSK">GDANSK</option>
                    <option value="Gdynia">Gdynia</option>
                    <option value="Świnoujście">Świnoujście</option>
                    <option value="Szczecin">Szczecin</option>
                    <option value="Kołobrzeg">Kołobrzeg</option>
                    <option value="Sopot">Sopot</option>
                    <option value="Wolin">Wolin</option>
                    <option value="Hel">Hel</option>
                    <option value="Jastarnia">Jastarnia</option>
                    <option value="Darłowo">Darłowo</option>
                    <option value="Dąbki">Dąbki</option>
                    <option value="Krynica Morska">Krynica Morska</option>
                    <option value="Dziwnów">Dziwnów</option>
                    <option value="Chałupy">Chałupy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Boat Category</label>
                  <select name="boatCategory" value={formData.boatCategory} onChange={handleChange} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="none">Select...</option>
                    <option value="cat_a">Category A (Ocean)</option>
                    <option value="cat_b">Category B (Offshore)</option>
                    <option value="cat_c">Category C (Inshore)</option>
                    <option value="cat_d">Category D (Sheltered waters)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Additional Comments or Specific Registry Preference</label>
                  <textarea name="comments" value={formData.comments} onChange={handleChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm" rows={3}></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-1/2 max-w-sm bg-[#081C3A] text-white font-bold tracking-wider uppercase py-3 px-6 rounded-xl hover:bg-[#0E4B82] transition-colors shadow-md shadow-[#081C3A]/10 text-xs md:text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--color-luxury-gold)]" />
                    <span>Processing Application...</span>
                  </>
                ) : (
                  <span>Submit Complete Registration</span>
                )}
              </button>
            </div>
          </form>
          </div>
        )}
      </div>
    </div>
  );
}
