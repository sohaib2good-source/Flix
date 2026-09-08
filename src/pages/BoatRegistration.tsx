import React, { useState } from 'react';
import { useSeoMetadata } from '../hooks/useSeoMetadata';

export default function BoatRegistration() {
  useSeoMetadata({
    title: 'Boat & Yacht Registration | Felix Yacht',
    description: 'Complete our secure official international boat and yacht registration application online. Expedited processing for global flag jurisdictions.',
  });

  const [formData, setFormData] = useState({
    // Section 1: Address Information
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Registration form submitted successfully! Our team will contact you shortly.");
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
    <div className="pt-24 pb-12 px-6 md:px-12 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <span className="text-[10px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-widest bg-[var(--color-luxury-gold)]/10 px-3 py-1 rounded-full">
            Official Application
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#081C3A] mt-3 mb-2">
            Boat & Yacht Registration
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Please fill in the details below to initiate your official vessel registration.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Address Information */}
          <div className="bg-gray-50/60 p-6 md:p-8 rounded-xl border border-gray-200/80">
            <h2 className="text-xl font-semibold mb-4 text-[#081C3A] border-b border-gray-200 pb-2">1. Address Information</h2>
            
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
              className="w-full sm:w-1/2 max-w-sm bg-[#081C3A] text-white font-bold tracking-wider uppercase py-2.5 px-6 rounded-xl hover:bg-[#0E4B82] transition-colors shadow-md shadow-[#081C3A]/10 text-xs md:text-sm"
            >
              Submit Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
