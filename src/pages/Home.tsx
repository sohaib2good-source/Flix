import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Clock, Globe2, FileCheck, CheckCircle2, Star, Anchor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeoMetadata } from '../hooks/useSeoMetadata';
import StackingFeatures from '../components/ui/StackingFeatures';

export default function Home() {
  const { t } = useLanguage();

  useSeoMetadata({
    title: 'Global Yacht Registration | Fast & Secure Services',
    description: 'Experience seamless international yacht registration with our premium services. Fast processing, worldwide registries, and expert legal compliance.',
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Global Yacht Registration",
      "description": "Experience seamless international yacht registration with our premium services.",
      "url": "https://globalyachtregistration.com/"
    }
  });

  return (
    <div className="w-full">
      {/* ANIMATED WAVES BANNER */}
      <div className="w-full h-[72px] mt-16 relative overflow-hidden bg-[#F5F7FA] border-b border-gray-200">
        <div
          className="absolute top-0 left-0 w-[200%] h-full animate-wave-slow z-0"
          style={{
            backgroundImage: "url('/wave1.png')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 58px",
            backgroundPosition: "bottom"
          }}
        />

        {/* Sailing Yacht - Running behind front wave (z-10) */}
        <div className="absolute bottom-1 left-0 z-10 animate-sail pointer-events-none">
          <img
            src="/yacht3.png"
            alt="Sailing Yacht"
            className="h-[54px] w-auto block animate-yacht-bob"
          />
        </div>

        {/* Front Wave (z-20) - overlaps the boat hull naturally */}
        <div
          className="absolute top-0 left-0 w-[200%] h-full animate-wave-fast z-20 pointer-events-none"
          style={{
            backgroundImage: "url('/wave2.png')",
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 45px",
            backgroundPosition: "bottom"
          }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative flex items-start overflow-hidden pb-12 pt-2 md:pb-16 md:pt-6 min-h-[580px] md:min-h-[560px]">
        {/* Bright Background Image - Main Boat */}
        <div className="absolute inset-0 z-0">
          <img
            src="/main-boat.png"
            alt="Felix Yacht - Luxury Yacht"
            className="w-full h-full object-cover object-[50%_8%] md:object-[60%_center] brightness-105 saturate-115"
          />
          {/* Subtle luminous overlay - keep top completely clear for boat on mobile, smooth soft dark fade at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#081C3A]/25 to-[#081C3A]/85 md:from-[#081C3A]/20 md:via-transparent md:to-[#F5F7FA]/70 pointer-events-none" />
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>

        <div className="relative z-10 w-full px-6 md:px-10 lg:px-12 flex flex-col items-center md:items-start justify-start pt-[220px] sm:pt-[240px] md:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-transparent border-0 shadow-none p-0 backdrop-blur-none md:bg-[#081C3A]/75 md:backdrop-blur-xl md:border md:border-white/20 md:p-6 md:rounded-2xl md:shadow-2xl max-w-[390px] text-center w-full mx-auto md:mx-0"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-luxury-gold)]/20 border border-[var(--color-luxury-gold)]/30 text-[var(--color-luxury-gold)] text-[9px] font-bold uppercase tracking-[0.2em] mb-2.5 md:mb-3 shadow-sm whitespace-nowrap">
              {t('hero.badge')}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-light text-white mb-2.5 md:mb-3 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] md:drop-shadow-none">
              {t('hero.title_lead')} <br /><span className="font-bold">{t('hero.title_highlight')}</span>
            </h1>
            <p className="text-white/90 md:text-white/80 text-xs md:text-sm font-light mb-4 md:mb-5 leading-relaxed max-w-sm mx-auto md:mx-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] md:drop-shadow-none min-h-[50px] md:min-h-[58px] flex items-center justify-center md:justify-start">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center justify-center w-full">
              <Link 
                to="/boat-registration" 
                className="w-auto px-6 py-2.5 text-[11px] md:px-9 md:py-3.5 md:text-xs bg-white text-[#081C3A] font-bold uppercase tracking-wider rounded-lg md:rounded-xl shadow-lg hover:bg-[#F5F7FA] hover:shadow-xl transition-all inline-flex items-center justify-center whitespace-nowrap text-center"
              >
                {t('btn.register')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-3.5 inline-flex items-center justify-center space-x-2 bg-[#081C3A]/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white/90 text-[9px] md:text-[10px] uppercase tracking-widest font-semibold shadow-lg mx-auto md:mx-0 whitespace-nowrap"
          >
            <span className="text-[var(--color-luxury-gold)] shrink-0">★★★★★</span>
            <span className="whitespace-nowrap">{t('hero.trust')}</span>
          </motion.div>
        </div>
      </section>

      {/* TRUST SECTION (Stats & Registries) */}
      <section className="bg-white z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] relative flex flex-col md:flex-row items-center justify-between min-h-[180px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 md:border-r border-[#081C3A]/5 py-10 px-6 md:px-12 md:pr-12 w-full md:w-auto">
          {[
            { label: 'Years Experience', value: '20+' },
            { label: 'Countries Served', value: '150+' },
            { label: 'Approval Rate', value: '98%' },
            { label: 'Support', value: '24/7' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-left"
            >
              <div className="text-3xl font-bold text-[#081C3A] mb-1">{stat.value}</div>
              <div className="text-[10px] uppercase font-bold text-[#CDA349] tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Registry Preview */}
        <div className="flex-1 py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="text-[10px] uppercase font-bold text-[#081C3A]/50 tracking-widest shrink-0">
              Official Flag Registry
            </div>
            <Link 
              to="/boat-registration" 
              className="px-6 py-3.5 bg-[#F5F7FA] border border-[#081C3A]/10 rounded-xl flex items-center gap-4 hover:border-[#CDA349] hover:bg-white transition-all group shadow-sm w-full sm:w-auto"
            >
              <span className="text-3xl">🇵🇱</span>
              <div className="text-left">
                <span className="text-xs font-bold uppercase tracking-tight block text-[#081C3A] group-hover:text-[#0E4B82]">
                  Poland Registration (EU)
                </span>
                <span className="text-[10px] text-[#CDA349] font-semibold block">
                  Lifetime Flag • No Renewal Needed • Valid Worldwide
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Link 
              to="/boat-registration" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#081C3A] hover:text-[#CDA349] transition-colors"
            >
              <span>Apply for Polish Flag</span>
              <span className="text-sm">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3D STACKING FEATURES (Replaces Why Choose Us) */}
      <StackingFeatures />

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[var(--color-primary-navy)] mb-3 md:mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">A streamlined, transparent process designed for your convenience.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 md:gap-12 text-center relative z-10">
              {[
                { step: '1', title: 'Choose Registry', desc: 'Select the best flag for your needs' },
                { step: '2', title: 'Upload Documents', desc: 'Securely submit required paperwork' },
                { step: '3', title: 'Government Review', desc: 'We handle the submission process' },
                { step: '4', title: 'Receive Certificate', desc: 'Get your digital & physical copies' }
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center p-3.5 sm:p-4 md:p-0 bg-gray-50/70 md:bg-transparent rounded-2xl md:rounded-none border border-gray-100 md:border-0 shadow-sm md:shadow-none">
                  {/* Flow arrow on mobile: Step 1 -> Step 2, Step 3 -> Step 4 */}
                  {(i === 0 || i === 2) && (
                    <div className="md:hidden absolute top-6 -right-3 z-20 w-6 h-6 rounded-full bg-white border border-gray-200 text-[#081C3A] text-xs font-bold flex items-center justify-center shadow-md">
                      →
                    </div>
                  )}
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--color-primary-navy)] text-[var(--color-luxury-gold)] text-lg md:text-2xl font-bold flex items-center justify-center mb-3 md:mb-6 shadow-md border-2 md:border-4 border-white">
                    {step.step}
                  </div>
                  <h4 className="text-xs sm:text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{step.title}</h4>
                  <p className="text-gray-500 text-[11px] sm:text-xs md:text-base leading-tight md:leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[var(--color-primary-navy)] mb-4">Client Testimonials</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">What yacht owners say about our services.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Alexander V.', country: '🇩🇪 Germany', text: 'Incredibly fast Polish registration for my sailing yacht. The entire process was handled professionally and I had my certificate within days.' },
              { name: 'Sarah M.', country: '🇬🇧 United Kingdom', text: 'Felix Yacht made registering my yacht under the Polish EU flag completely seamless. Fast provisional issue and outstanding communication.' },
              { name: 'Marco R.', country: '🇮🇹 Italy', text: 'The best registration service I have used in 20 years of yacht ownership. Clear communication and no hidden fees.' }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 text-[var(--color-luxury-gold)] mb-6">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                <div className="font-bold text-gray-900">{review.name}</div>
                <div className="text-sm text-gray-500">{review.country}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE ESTIMATOR */}
      <section className="py-16 md:py-24 bg-[var(--color-primary-navy)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-2 md:mb-4">Instant Quote Estimator</h2>
            <p className="text-white/80 max-w-2xl mx-auto text-xs sm:text-sm md:text-lg">Calculate an estimated cost for your yacht registration.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 sm:p-7 md:p-12 rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-8 mb-6 md:mb-8">
              <div>
                <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-white/80 mb-1.5 md:mb-2">Registry Flag</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg md:rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white appearance-none focus:ring-2 focus:ring-[var(--color-luxury-gold)] focus:outline-none">
                  <option value="poland" className="text-gray-900">Poland (EU) - Lifetime Flag</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-white/80 mb-1.5 md:mb-2">Vessel Type</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg md:rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white appearance-none focus:ring-2 focus:ring-[var(--color-luxury-gold)] focus:outline-none">
                  <option value="motor" className="text-gray-900">Motor Yacht</option>
                  <option value="sailing" className="text-gray-900">Sailing Yacht</option>
                  <option value="catamaran" className="text-gray-900">Catamaran</option>
                  <option value="jetski" className="text-gray-900">Personal Watercraft</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-white/80 mb-1.5 md:mb-2">Usage</label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg md:rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white appearance-none focus:ring-2 focus:ring-[var(--color-luxury-gold)] focus:outline-none">
                  <option value="private" className="text-gray-900">Private Use</option>
                  <option value="commercial" className="text-gray-900">Commercial / Charter</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-white/80 mb-1.5 md:mb-2">Length (Meters)</label>
                <input
                  type="number"
                  placeholder="e.g. 15.5"
                  className="w-full bg-white/5 border border-white/20 rounded-lg md:rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:ring-2 focus:ring-[var(--color-luxury-gold)] focus:outline-none placeholder-white/30"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-5 md:pt-8 border-t border-white/10 gap-4 md:gap-6">
              <div className="text-center md:text-left">
                <div className="text-white/60 text-xs md:text-sm mb-0.5 md:mb-1">Estimated Starting Price</div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-luxury-gold)] font-heading">€490</div>
                <div className="text-white/40 text-[10px] md:text-xs mt-0.5 md:mt-1">*Final price may vary based on specific requirements</div>
              </div>
              <Link to="/register" className="w-full md:w-auto bg-[var(--color-luxury-gold)] text-[var(--color-primary-navy)] px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg hover:bg-white transition-all text-center shadow-lg">
                Proceed to Registration
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[var(--color-primary-navy)] mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How long does yacht registration take?', a: 'Processing times vary by registry. Poland can take as little as 2-5 days, while UK Part 1 or Cayman Islands might take 2-4 weeks depending on documentation.' },
              { q: 'Do I need a survey for registration?', a: 'It depends on the flag state and vessel size/age. Poland generally does not require a survey for private yachts under 24m. We will guide you based on your specific case.' },
              { q: 'Can I register my yacht if I am not an EU citizen?', a: 'Yes. We can set up a dormant company (e.g., UK LTD or Delaware LLC) to hold the yacht, allowing non-EU citizens to register under EU flags.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-[var(--color-background)] rounded-2xl border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-lg text-[var(--color-primary-navy)]">
                  {faq.q}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-[var(--color-primary-navy)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Ready to Set Sail?</h2>
          <p className="text-xl text-white/80 mb-10 font-light">Join thousands of satisfied yacht owners who trust Felix Yacht for their international registration needs.</p>
          <Link to="/register" className="inline-block bg-[var(--color-luxury-gold)] text-[var(--color-primary-navy)] px-10 py-5 rounded-full font-bold text-xl hover:bg-white transition-all shadow-[0_8px_30px_rgb(205,163,73,0.3)]">
            Start Your Registration Today
          </Link>
        </div>
      </section>
    </div>
  );
}
