import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  Anchor, 
  ShieldCheck, 
  Clock, 
  Compass, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { useSeoMetadata } from '../hooks/useSeoMetadata';

export default function AboutUs() {
  const { t } = useLanguage();

  useSeoMetadata({
    title: 'About Us | Felix Yacht - International Yacht Registration Specialists',
    description: 'Learn about Felix Yacht, the premier international authority for official flag state registration, legal maritime compliance, and global vessel documentation.',
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Felix Yacht",
      "description": "International Yacht Registration Specialists offering flag state compliance, expedited vessel registration, and maritime legal services.",
      "url": "https://felixyacht.com/about"
    }
  });

  const stats = [
    { value: '5,000+', label: 'Vessels Registered', desc: 'Sailing yachts, motorboats & commercial vessels worldwide' },
    { value: '30+', label: 'Flag Jurisdictions', desc: 'Direct partnerships with official government registries' },
    { value: '99.8%', label: 'Approval Rate', desc: 'Flawless compliance check with zero rejected applications' },
    { value: '48h', label: 'Expedited Issue', desc: 'Provisional navigation documents delivered within days' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Flag State Legal Certainty',
      desc: 'Our maritime legal specialists ensure your vessel strictly adheres to international IMO conventions, EU maritime directives, and bilateral flag treaties with zero legal ambiguity.',
      highlight: '100% Guaranteed Compliance'
    },
    {
      icon: Clock,
      title: 'Expedited 48-Hour Processing',
      desc: 'Through authorized direct electronic integration with government registries, we bypass bureaucratic delays and secure provisional navigation certificates in record time.',
      highlight: 'Fast-Track Registry Access'
    },
    {
      icon: Compass,
      title: 'White-Glove Maritime Concierge',
      desc: 'Each client is paired with an experienced case officer who oversees every detail—from certified translations and MMSI radio licensing to survey logistics and flag renewals.',
      highlight: 'Dedicated Case Specialist'
    },
    {
      icon: Award,
      title: 'Asset Protection & Discretion',
      desc: 'We assist international owners in establishing compliant ownership structures, Delaware LLCs, and European entities that ensure complete privacy and tax efficiency.',
      highlight: 'Global Privacy Framework'
    }
  ];

  const offices = [
    {
      city: 'Geneva, Switzerland',
      role: 'Global Headquarters & Private Wealth Maritime',
      address: '123 Marina Bay, Luxury Complex, 1204 Geneva',
      phone: '+41 22 123 4567'
    },
    {
      city: 'Warsaw, Poland',
      role: 'EU Flag State Registry Operations Bureau',
      address: 'Al. Jerozolimskie 96, 00-807 Warsaw',
      phone: '+48 22 987 6543'
    },
    {
      city: 'London, United Kingdom',
      role: 'Red Ensign & UK Part 1 Operations',
      address: '30 St Mary Axe, City of London, EC3A 8EP',
      phone: '+44 20 7946 0912'
    },
    {
      city: 'Limassol, Cyprus',
      role: 'Mediterranean Surveyor & Marine Inspection Hub',
      address: 'Limassol Marina Commercial Centre, 3601 Limassol',
      phone: '+357 25 123 789'
    }
  ];

  return (
    <div className="w-full bg-[#F5F7FA] text-[#081C3A]">
      {/* HERO SECTION */}
      <section className="relative min-h-[auto] md:min-h-[85vh] flex flex-col md:flex-row items-center pt-24 md:pt-40 pb-6 md:pb-20 text-white overflow-hidden bg-[#081C3A]">
        {/* Desktop Background Image - Full Bleed Cover */}
        <div className="hidden md:block absolute inset-0 z-0 overflow-hidden">
          <img
            src="/121.jpeg"
            alt="Felix Yacht International"
            className="w-full h-full object-cover object-center scale-105 transform-gpu brightness-115 contrast-105 transition-transform duration-1000"
          />
          {/* Subtle translucent gradient to keep image bright and vibrant while blending cleanly */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081C3A]/70 via-[#081C3A]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#081C3A] via-[#081C3A]/40 to-transparent" />
        </div>

        {/* Mobile Hero View: Full Image completely shown with ONLY the title written in the corner */}
        <div className="md:hidden w-full px-4 pt-1 pb-4 z-10">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#081C3A]">
            <img
              src="/121.jpeg"
              alt="Felix Yacht International"
              className="w-full h-auto block rounded-2xl brightness-105 contrast-105"
            />
            {/* Subtle luxury gradient in the bottom-left corner for maximum legibility */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#081C3A]/90 via-[#081C3A]/30 to-transparent pointer-events-none" />

            {/* Title written in the corner of the pic */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 pr-3">
              <h1 className="text-[19px] sm:text-2xl font-heading font-extrabold tracking-tight leading-[1.16] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-white">
                Empowering Global <br />
                <span className="text-[var(--color-luxury-gold)]">Maritime Sovereignty</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Desktop Hero Card Overlay */}
        <div className="hidden md:flex w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:pl-12 lg:pr-6 relative z-10 justify-start">
          <div className="w-full md:max-w-[355px] bg-[#081C3A]/90 md:bg-[#081C3A]/55 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/20 shadow-2xl mt-4 sm:mt-6 md:mt-48 lg:mt-56 xl:mt-60">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[var(--color-luxury-gold)] text-[9px] font-semibold tracking-wider uppercase mb-2.5"
            >
              <Anchor className="w-2.5 h-2.5" />
              <span>International Vessel Documentation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl lg:text-[26px] font-heading font-extrabold tracking-tight leading-[1.18] mb-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
            >
              Empowering Global <br />
              <span className="text-[var(--color-luxury-gold)]">Maritime Sovereignty</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[11px] md:text-xs text-white/90 leading-relaxed mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            >
              For over a decade, Felix Yacht has stood as the premier international authority in yacht registration, flag state compliance, and maritime legal advisory—enabling owners, brokers, and captains to sail worldwide with total legal security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/boat-registration"
                className="px-4 py-2 bg-[var(--color-luxury-gold)] hover:bg-[#b58f3c] text-[#081C3A] font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-xl hover:translate-y-[-1px] inline-flex items-center gap-2"
              >
                <span>Register Vessel Now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS STRIP - 2x2 on mobile, 4 cols on desktop */}
      <section className="relative z-20 -mt-6 md:-mt-10 max-w-7xl mx-auto px-4 md:px-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 divide-y-0 sm:divide-x divide-gray-100">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'pl-2 sm:pl-0' : ''} ${idx >= 2 ? 'pt-2 sm:pt-0' : ''} ${idx !== 0 ? 'sm:pl-8' : ''}`}
            >
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-[#081C3A] tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--color-luxury-gold)] uppercase tracking-wider mt-1 mb-1">
                {stat.label}
              </span>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-normal">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRAND HERITAGE & MISSION */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em] bg-[var(--color-luxury-gold)]/10 px-3.5 py-1.5 rounded-full inline-block">
              Our Heritage & Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#081C3A] leading-tight">
              Eliminating International Maritime Red Tape Since 2012
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Navigating cross-border maritime jurisdictions, tonnage rules, and flag state restrictions is traditionally one of the most stressful aspects of vessel ownership. At Felix Yacht, our foundation was built on one clear objective: creating an expedited, transparent, and legally rock-solid gateway to premier global boat registries.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Whether you are acquiring a brand-new superyacht in Cannes, a sport-cruiser in Miami, or re-flagging an existing fleet under the highly regarded Polish EU flag with lifetime validity, our certified maritime documentation specialists handle everything from title deeds and bill of sale verification to official sworn translations and MMSI radio licensing.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-luxury-gold)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] sm:text-xs font-bold text-[#081C3A] uppercase tracking-wider">Direct Government Liaison</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Official agent status with certified maritime ministries.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-luxury-gold)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] sm:text-xs font-bold text-[#081C3A] uppercase tracking-wider">Zero Hidden Surcharges</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">All government registry fees and notary costs disclosed upfront.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-br from-[#081C3A] to-[#0E4B82] p-8 md:p-10 rounded-3xl text-white shadow-2xl overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Anchor className="w-48 h-48 text-white" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-luxury-gold)]/20 border border-[var(--color-luxury-gold)]/40 flex items-center justify-center text-[var(--color-luxury-gold)]">
                  <Sparkles className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-heading font-bold text-white leading-snug">
                  The Felix Yacht Commitment to Excellence
                </h3>

                <p className="text-sm text-white/80 leading-relaxed">
                  "Every vessel we register carries our reputation across international waters. We treat your boat registration with the exact precision, legal rigor, and dedication we would demand for our own yachts."
                </p>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <h5 className="font-heading font-bold text-sm text-white">Alexander von Berg</h5>
                    <p className="text-xs text-white/60">Head of International Maritime Affairs</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-white/10 text-[var(--color-luxury-gold)] font-bold">
                    Geneva HQ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS SECTION - 2x2 Grid on Mobile (4 boxes) */}
      <section className="py-16 md:py-20 bg-white border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em] bg-[var(--color-luxury-gold)]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Why Discerning Owners Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#081C3A]">
              Built On Four Immutable Pillars
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-3 md:mt-4">
              We combine in-depth admiralty law proficiency with modern automated document verification to deliver an unparalleled registration service.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {pillars.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#F5F7FA] p-3.5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-200/70 hover:border-[var(--color-luxury-gold)]/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#081C3A] text-[var(--color-luxury-gold)] flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-xs sm:text-base md:text-lg font-heading font-bold text-[#081C3A] mb-1.5 sm:mb-3 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-3 sm:mb-6">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-2.5 sm:pt-4 border-t border-gray-200/60">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--color-luxury-gold)] flex items-center gap-1 sm:gap-1.5">
                      <FileCheck2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="truncate">{pillar.highlight}</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GLOBAL PRESENCE & OFFICES - 2x2 Grid on Mobile (4 boxes) */}
      <section className="py-16 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em] bg-[var(--color-luxury-gold)]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Worldwide Network
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#081C3A]">
            Global Operations Hubs
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-3 md:mt-4">
            With physical presences in key maritime jurisdictions, we interact directly with flag administrations to expedite applications on your behalf.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-luxury-gold)] shrink-0" />
                  <h3 className="font-heading font-bold text-[#081C3A] text-xs sm:text-base leading-snug">
                    {office.city}
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs font-semibold text-[#0E4B82] mb-2 sm:mb-4 leading-snug">
                  {office.role}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed mb-3 sm:mb-6">
                  {office.address}
                </p>
              </div>
              <div className="pt-2.5 sm:pt-4 border-t border-gray-100 text-[10px] sm:text-xs font-medium text-gray-700 truncate">
                {office.phone}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-[#081C3A] via-[#0E4B82] to-[#081C3A] text-white py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-luxury-gold)] bg-white/10 px-4 py-1.5 rounded-full inline-block">
            Start Your Registration Today
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-white">
            Ready to Fly Your Chosen Flag?
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Begin our streamlined digital application in minutes. Our maritime specialists review your documents free of charge before submission.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/boat-registration"
              className="px-8 py-4 bg-[var(--color-luxury-gold)] hover:bg-[#b58f3c] text-[#081C3A] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl hover:translate-y-[-1px] inline-flex items-center gap-2"
            >
              <span>Apply for Boat Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
