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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-[#081C3A] via-[#0E4B82] to-[#081C3A] text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-luxury-gold)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0E4B82]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[var(--color-luxury-gold)] text-xs font-semibold tracking-wider uppercase mb-6"
            >
              <Anchor className="w-3.5 h-3.5" />
              <span>International Vessel Documentation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.15] mb-6"
            >
              Empowering Global <br />
              <span className="text-[var(--color-luxury-gold)]">Maritime Sovereignty</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mb-10"
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
                className="px-8 py-4 bg-[var(--color-luxury-gold)] hover:bg-[#b58f3c] text-[#081C3A] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl hover:translate-y-[-1px] inline-flex items-center gap-2"
              >
                <span>Register Vessel Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-white/20 transition-all backdrop-blur-sm inline-flex items-center gap-2"
              >
                <span>Compare Registries</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col ${idx !== 0 ? 'pt-6 sm:pt-0 sm:pl-8' : ''}`}
            >
              <span className="text-3xl md:text-4xl font-extrabold font-heading text-[#081C3A] tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-bold text-[var(--color-luxury-gold)] uppercase tracking-wider mt-1 mb-2">
                {stat.label}
              </span>
              <p className="text-xs text-gray-500 leading-normal">
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
              Whether you are acquiring a brand-new superyacht in Cannes, a sport-cruiser in Miami, or re-flagging an existing fleet under the highly regarded Polish EU flag or UK Part 1 register, our certified maritime documentation specialists handle everything from title deeds and bill of sale verification to official sworn translations and MMSI radio licensing.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-luxury-gold)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#081C3A] uppercase tracking-wider">Direct Government Liaison</h4>
                  <p className="text-xs text-gray-500 mt-1">Official agent status with certified maritime ministries.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-luxury-gold)] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#081C3A] uppercase tracking-wider">Zero Hidden Surcharges</h4>
                  <p className="text-xs text-gray-500 mt-1">All government registry fees and notary costs disclosed upfront.</p>
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

      {/* CORE PILLARS SECTION */}
      <section className="py-20 bg-white border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em] bg-[var(--color-luxury-gold)]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Why Discerning Owners Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#081C3A]">
              Built On Four Immutable Pillars
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-4">
              We combine in-depth admiralty law proficiency with modern automated document verification to deliver an unparalleled registration service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#F5F7FA] p-8 rounded-2xl border border-gray-200/70 hover:border-[var(--color-luxury-gold)]/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#081C3A] text-[var(--color-luxury-gold)] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-[#081C3A] mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-6">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-luxury-gold)] flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      {pillar.highlight}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GLOBAL PRESENCE & OFFICES */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold text-[var(--color-luxury-gold)] uppercase tracking-[0.25em] bg-[var(--color-luxury-gold)]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Worldwide Network
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#081C3A]">
            Global Operations Hubs
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-4">
            With physical presences in key maritime jurisdictions, we interact directly with flag administrations to expedite applications on your behalf.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[var(--color-luxury-gold)]" />
                  <h3 className="font-heading font-bold text-[#081C3A] text-base">
                    {office.city}
                  </h3>
                </div>
                <p className="text-xs font-semibold text-[#0E4B82] mb-4">
                  {office.role}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  {office.address}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 text-xs font-medium text-gray-700">
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
            <Link
              to="/pricing"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <span>View Registry Comparison</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
