import React, { useState } from 'react';

export default function FormSubmit() {
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
    alert("Form submitted successfully!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="pt-24 pb-12 px-6 md:px-12 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-[#081C3A] mb-8">Ocean Yacht Registration Form</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Address Information */}
          <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-[#081C3A]/80 border-b pb-2">1. Address Information</h2>
            
            <div className="mb-4">
              <label className="mr-4">
                <input type="radio" name="contactType" value="private" checked={formData.contactType === 'private'} onChange={handleChange} className="mr-2" /> Private
              </label>
              <label>
                <input type="radio" name="contactType" value="company" checked={formData.contactType === 'company'} onChange={handleChange} className="mr-2" /> Company
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              {formData.contactType === 'company' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nationality *</label>
                <input required type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Post Code *</label>
                <input required type="text" name="postCode" value={formData.postCode} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Town *</label>
                <input required type="text" name="town" value={formData.town} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Country *</label>
                <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>

              {/* DOB & Passport */}
              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">DOB Day *</label>
                  <input required type="text" name="dobDay" value={formData.dobDay} onChange={handleChange} className="w-full p-2 border rounded" placeholder="DD" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">DOB Month *</label>
                  <input required type="text" name="dobMonth" value={formData.dobMonth} onChange={handleChange} className="w-full p-2 border rounded" placeholder="MM" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">DOB Year *</label>
                  <input required type="text" name="dobYear" value={formData.dobYear} onChange={handleChange} className="w-full p-2 border rounded" placeholder="YYYY" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Place of Birth *</label>
                <input required type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Passport Number *</label>
                <input required type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Passport Issuing Country *</label>
                <input required type="text" name="passportIssuingCountry" value={formData.passportIssuingCountry} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-6 border-t pt-4">
              <label className="flex items-center gap-2 mb-4">
                <input type="checkbox" name="differentDelivery" checked={formData.differentDelivery === 'yes'} onChange={(e) => setFormData({...formData, differentDelivery: e.target.checked ? 'yes' : 'no'})} />
                Use Different Delivery Address
              </label>
              
              {formData.differentDelivery === 'yes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border rounded">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Delivery Address</label>
                    <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Post Code</label>
                    <input type="text" name="deliveryPostCode" value={formData.deliveryPostCode} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Town</label>
                    <input type="text" name="deliveryTown" value={formData.deliveryTown} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input type="text" name="deliveryCountry" value={formData.deliveryCountry} onChange={handleChange} className="w-full p-2 border rounded" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Owner 2 */}
          <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-200">
            <label className="flex items-center gap-2 text-xl font-semibold mb-4 text-[#081C3A]/80 border-b pb-2">
              <input type="checkbox" name="hasOwner2" checked={formData.hasOwner2 as boolean} onChange={handleChange} className="w-5 h-5" />
              2. Add Second Owner (Optional)
            </label>
            
            {formData.hasOwner2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input type="text" name="owner2FirstName" value={formData.owner2FirstName} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input type="text" name="owner2LastName" value={formData.owner2LastName} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" name="owner2Address" value={formData.owner2Address} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                {/* Simplified for Owner 2... */}
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" name="owner2Email" value={formData.owner2Email} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Passport Number</label>
                  <input type="text" name="owner2PassportNumber" value={formData.owner2PassportNumber} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Boat Operator */}
          <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-[#081C3A]/80 border-b pb-2">3. Boat Operator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Operator First Name</label>
                <input type="text" name="operatorFirstName" value={formData.operatorFirstName} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Operator Last Name</label>
                <input type="text" name="operatorLastName" value={formData.operatorLastName} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>

          {/* Section 4: Details of the Ship */}
          <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-[#081C3A]/80 border-b pb-2">4. Details of the Ship</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Boat Name *</label>
                <input required type="text" name="boatName" value={formData.boatName} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Boat Length (m)</label>
                <input type="text" name="boatLength" value={formData.boatLength} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Passengers</label>
                <input type="text" name="maxPassengers" value={formData.maxPassengers} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Port of Choice</label>
                <input type="text" name="portOfChoice" value={formData.portOfChoice} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Boat Category</label>
                <select name="boatCategory" value={formData.boatCategory} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                  <option value="none">Select...</option>
                  <option value="cat_a">Category A</option>
                  <option value="cat_b">Category B</option>
                  <option value="cat_c">Category C</option>
                  <option value="cat_d">Category D</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Comments</label>
                <textarea name="comments" value={formData.comments} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full bg-[#081C3A] text-white font-bold tracking-widest uppercase py-4 rounded hover:bg-[#081C3A]/90 transition-colors">
              Submit Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
