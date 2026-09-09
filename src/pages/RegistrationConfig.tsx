import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeoMetadata } from '../hooks/useSeoMetadata';
import { ArrowRight, Check, Ship, ShieldCheck, Radio as RadioIcon, Clock, Truck, FileText } from 'lucide-react';

export interface RegistrationPackage {
  vesselClass: '0_to_7' | '7_to_12' | '12_to_24';
  serviceType: 'new_flag' | 'change_owner' | 'modification' | 'deletion' | 'duplicate';
  usageIntent: 'private' | 'commercial' | 'bareboat';
  mmsiConfig: 'none' | 'mmsi_full';
  speed: 'standard' | 'fast' | 'express';
  shippingMethod: 'standard' | 'dhl';
  totalPrice: number;
}

const VESSEL_SIZES = [
  { id: '0_to_7', label: '0 to 7 Meters', price: 350, priceStr: '350.00 EUR' },
  { id: '7_to_12', label: '7.1 to 12 Meters', price: 450, priceStr: '450.00 EUR' },
  { id: '12_to_24', label: '12.1 to 24 Meters', price: 550, priceStr: '550.00 EUR' },
] as const;

const SERVICE_TYPES = [
  { id: 'new_flag', label: 'New Flag Registration', price: 0, priceStr: '0.00 EUR' },
  { id: 'change_owner', label: 'Change of Ownership', price: 350, priceStr: '+350.00 EUR' },
  { id: 'modification', label: 'Modification Polish Reg', price: 249, priceStr: '+249.00 EUR' },
  { id: 'deletion', label: 'Polish Deletion Certificate', price: 249, priceStr: '+249.00 EUR' },
  { id: 'duplicate', label: 'Duplicate Polish Registration', price: 249, priceStr: '+249.00 EUR' },
] as const;

const USAGE_INTENTS = [
  { id: 'private', label: 'Private / Recreational', price: 0, priceStr: '0.00 EUR' },
  { id: 'commercial', label: 'Commercial / Passenger Charter', price: 250, priceStr: '+250.00 EUR' },
  { id: 'bareboat', label: 'Bareboat Charter', price: 250, priceStr: '+250.00 EUR' },
] as const;

const MMSI_OPTIONS = [
  { id: 'none', label: 'Without MMSI License', price: 0, priceStr: '0.00 EUR' },
  { id: 'mmsi_full', label: 'Polish MMSI Radio License (VHF, AIS, EPIRB, Radar)', price: 149, priceStr: '+149.00 EUR' },
] as const;

const SPEED_OPTIONS = [
  { id: 'standard', label: 'Standard (3 to 4 Weeks)', price: 0, priceStr: '0.00 EUR' },
  { id: 'fast', label: 'Fast (1 to 2 Weeks)', price: 50, priceStr: '+50.00 EUR' },
  { id: 'express', label: 'Express VIP (3 to 5 Days)', price: 90, priceStr: '+90.00 EUR' },
] as const;

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Registered Mail', price: 15, priceStr: '15.00 EUR' },
  { id: 'dhl', label: 'DHL Express International Courier', price: 50, priceStr: '50.00 EUR' },
] as const;

export default function RegistrationConfig() {
  const navigate = useNavigate();

  useSeoMetadata({
    title: 'Polish Boat Registration & Pricing | Felix Yacht',
    description: 'Configure your official Polish flag yacht registration. Lifetime validity, no survey under 15m, starting from 350 EUR.',
  });

  const [vesselClass, setVesselClass] = useState<'0_to_7' | '7_to_12' | '12_to_24'>('0_to_7');
  const [serviceType, setServiceType] = useState<'new_flag' | 'change_owner' | 'modification' | 'deletion' | 'duplicate'>('new_flag');
  const [usageIntent, setUsageIntent] = useState<'private' | 'commercial' | 'bareboat'>('private');
  const [mmsiConfig, setMmsiConfig] = useState<'none' | 'mmsi_full'>('none');
  const [speed, setSpeed] = useState<'standard' | 'fast' | 'express'>('standard');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'dhl'>('standard');

  const totalPrice = useMemo(() => {
    const sizePrice = VESSEL_SIZES.find(s => s.id === vesselClass)?.price || 0;
    const servicePrice = SERVICE_TYPES.find(s => s.id === serviceType)?.price || 0;
    const usagePrice = USAGE_INTENTS.find(u => u.id === usageIntent)?.price || 0;
    const mmsiPrice = MMSI_OPTIONS.find(m => m.id === mmsiConfig)?.price || 0;
    const speedPrice = SPEED_OPTIONS.find(s => s.id === speed)?.price || 0;
    const shipPrice = SHIPPING_OPTIONS.find(s => s.id === shippingMethod)?.price || 0;
    return sizePrice + servicePrice + usagePrice + mmsiPrice + speedPrice + shipPrice;
  }, [vesselClass, serviceType, usageIntent, mmsiConfig, speed, shippingMethod]);

  const handleProceed = () => {
    const pkg: RegistrationPackage = {
      vesselClass,
      serviceType,
      usageIntent,
      mmsiConfig,
      speed,
      shippingMethod,
      totalPrice
    };

    localStorage.setItem('felix_registration_package', JSON.stringify(pkg));
    navigate('/boat-documentation', { state: pkg });
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto mb-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#081C3A] text-white flex items-center justify-center font-bold text-sm shadow-md">
                1
              </span>
              <span className="text-xs md:text-sm font-bold text-[#081C3A]">
                Service & Options
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">
                2
              </span>
              <span className="text-xs md:text-sm font-medium text-gray-500">
                Documentation
              </span>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
            <span className="text-[10px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-widest bg-[var(--color-luxury-gold)]/10 px-3 py-1 rounded-full">
              Official Polish Flag Application (REJA24)
            </span>
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-[#081C3A] mt-3 mb-2">
              Polish Yacht Registration
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Select your vessel size tier and additional maritime services. Once configured, proceed to complete your official vessel documentation.
            </p>
          </div>
        </div>

        {/* Section 1: Vessel Length Tiers (Matching user reference) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Ship className="w-5 h-5 text-[var(--color-luxury-gold)]" />
            <h2 className="text-sm md:text-base font-bold text-[#081C3A]">
              1. Register a new vessel under the Polish flag. Base price depends on boat size selected
            </h2>
          </div>

          <div className="space-y-3">
            {VESSEL_SIZES.map((tier) => {
              const isSelected = vesselClass === tier.id;
              return (
                <label
                  key={tier.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#081C3A] bg-[#081C3A]/[0.02] ring-1 ring-[#081C3A] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="vesselClass"
                      value={tier.id}
                      checked={isSelected}
                      onChange={() => setVesselClass(tier.id)}
                      className="w-4 h-4 text-[#081C3A] focus:ring-[#081C3A] cursor-pointer"
                    />
                    <span className="font-bold text-sm md:text-base text-[#081C3A] min-w-[100px]">
                      {tier.priceStr}
                    </span>
                    <span className="text-gray-600 text-xs md:text-sm font-medium">
                      {tier.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 2: Service Type */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <FileText className="w-5 h-5 text-[var(--color-luxury-gold)]" />
            <h2 className="text-sm md:text-base font-bold text-[#081C3A]">
              2. Service Type
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {SERVICE_TYPES.map((service) => {
              const isSelected = serviceType === service.id;
              return (
                <label
                  key={service.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#081C3A] bg-[#081C3A]/[0.02] ring-1 ring-[#081C3A]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="serviceType"
                      value={service.id}
                      checked={isSelected}
                      onChange={() => setServiceType(service.id)}
                      className="w-4 h-4 text-[#081C3A] focus:ring-[#081C3A] cursor-pointer"
                    />
                    <span className="text-xs md:text-sm font-medium text-gray-800">
                      {service.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#081C3A]">
                    {service.price === 0 ? 'Included' : service.priceStr}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 3: Registration Type / Vessel Usage */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <ShieldCheck className="w-5 h-5 text-[var(--color-luxury-gold)]" />
            <h2 className="text-sm md:text-base font-bold text-[#081C3A]">
              3. Registration Type
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {USAGE_INTENTS.map((usage) => {
              const isSelected = usageIntent === usage.id;
              return (
                <label
                  key={usage.id}
                  className={`flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#081C3A] bg-[#081C3A]/[0.02] ring-1 ring-[#081C3A]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <input
                      type="radio"
                      name="usageIntent"
                      value={usage.id}
                      checked={isSelected}
                      onChange={() => setUsageIntent(usage.id)}
                      className="w-4 h-4 text-[#081C3A] focus:ring-[#081C3A] cursor-pointer"
                    />
                    <span className="text-xs md:text-sm font-semibold text-[#081C3A]">
                      {usage.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {usage.price === 0 ? 'Included' : usage.priceStr}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 4: Optional MMSI & Radio License */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <RadioIcon className="w-5 h-5 text-[var(--color-luxury-gold)]" />
            <h2 className="text-sm md:text-base font-bold text-[#081C3A]">
              4. Optional Marine Radio & MMSI License
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MMSI_OPTIONS.map((opt) => {
              const isSelected = mmsiConfig === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#081C3A] bg-[#081C3A]/[0.02] ring-1 ring-[#081C3A]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="mmsiConfig"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setMmsiConfig(opt.id)}
                      className="w-4 h-4 text-[#081C3A] focus:ring-[#081C3A] cursor-pointer"
                    />
                    <span className="text-xs md:text-sm font-medium text-gray-800">
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#081C3A]">
                    {opt.price === 0 ? 'No Cost' : opt.priceStr}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 5: Registration Time */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Clock className="w-5 h-5 text-[var(--color-luxury-gold)]" />
            <h2 className="text-sm md:text-base font-bold text-[#081C3A]">
              5. Registration Time
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SPEED_OPTIONS.map((sp) => {
              const isSelected = speed === sp.id;
              return (
                <label
                  key={sp.id}
                  className={`flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#081C3A] bg-[#081C3A]/[0.02] ring-1 ring-[#081C3A]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <input
                      type="radio"
                      name="speed"
                      value={sp.id}
                      checked={isSelected}
                      onChange={() => setSpeed(sp.id)}
                      className="w-4 h-4 text-[#081C3A] focus:ring-[#081C3A] cursor-pointer"
                    />
                    <span className="text-xs md:text-sm font-semibold text-[#081C3A]">
                      {sp.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {sp.price === 0 ? 'Standard (0 EUR)' : sp.priceStr}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 6: Delivery Method */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Truck className="w-5 h-5 text-[var(--color-luxury-gold)]" />
            <h2 className="text-sm md:text-base font-bold text-[#081C3A]">
              6. Delivery Info
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SHIPPING_OPTIONS.map((ship) => {
              const isSelected = shippingMethod === ship.id;
              return (
                <label
                  key={ship.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#081C3A] bg-[#081C3A]/[0.02] ring-1 ring-[#081C3A]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={ship.id}
                      checked={isSelected}
                      onChange={() => setShippingMethod(ship.id)}
                      className="w-4 h-4 text-[#081C3A] focus:ring-[#081C3A] cursor-pointer"
                    />
                    <span className="text-xs md:text-sm font-medium text-gray-800">
                      {ship.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#081C3A]">
                    {ship.priceStr}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* End of Form: Summary Bar with Dynamic Total & Proceed Button */}
        <div className="bg-[#081C3A] text-white rounded-2xl p-5 md:p-6 shadow-xl border border-white/10 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/15">
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-luxury-gold)] font-bold block">
                  Order Total
                </span>
                <span className="text-lg md:text-2xl font-bold tracking-tight text-white font-mono">
                  TOTAL: {totalPrice.toFixed(2)} EUR
                </span>
              </div>
              <div className="text-xs text-white/70">
                <span className="block font-semibold text-white/90">{VESSEL_SIZES.find(s => s.id === vesselClass)?.label}</span>
                <span className="text-[11px] text-white/60">Polish Flag Registry Package</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full sm:w-auto bg-[var(--color-luxury-gold)] hover:bg-[#b58f3c] text-[#081C3A] font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Documentation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
