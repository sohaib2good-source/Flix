import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const languages = [
  { code: 'en', label: 'English', flagCode: 'gb' },
  { code: 'de', label: 'Deutsch', flagCode: 'de' },
  { code: 'pl', label: 'Polski', flagCode: 'pl' },
  { code: 'fr', label: 'Français', flagCode: 'fr' },
  { code: 'es', label: 'Español', flagCode: 'es' },
  { code: 'fi', label: 'Suomi', flagCode: 'fi' },
] as const;

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 select-none',
      scrolled || mobileMenu ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm' : 'bg-transparent'
    )}>
      <div className={clsx(
        'w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between transition-all duration-300',
        scrolled ? 'h-14' : 'h-16'
      )}>
        {/* Left: Brand Logo & Nav Links */}
        <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 text-[#081C3A] group shrink-0">
            <img 
              src="/logo.png" 
              alt="Felix Yacht" 
              className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0" 
            />
            <div className="flex flex-col shrink-0">
              <span className="font-heading font-bold text-lg sm:text-xl md:text-2xl tracking-tighter leading-none whitespace-nowrap">FELIX YACHT</span>
              <span className="text-[7.5px] sm:text-[8px] md:text-[9px] tracking-[0.26em] uppercase opacity-60 ml-0.5 whitespace-nowrap">International Registrations</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 text-[11px] xl:text-[12px] font-bold uppercase tracking-wider text-[#081C3A] whitespace-nowrap">
            <Link to="/" className="hover:text-[var(--color-ocean-blue)] transition-colors whitespace-nowrap py-1">{t('nav.home')}</Link>
            <Link to="/boat-registration" className="hover:text-[var(--color-ocean-blue)] transition-colors whitespace-nowrap py-1">{t('nav.registries')}</Link>
            <Link to="/pricing" className="hover:text-[var(--color-ocean-blue)] transition-colors whitespace-nowrap py-1">{t('nav.pricing')}</Link>
            <Link to="/services" className="hover:text-[var(--color-ocean-blue)] transition-colors whitespace-nowrap py-1">{t('nav.services')}</Link>
            <Link to="/about" className="hover:text-[var(--color-ocean-blue)] transition-colors whitespace-nowrap py-1">{t('nav.about')}</Link>
          </nav>
        </div>

        {/* Right: Actions, Language, and Mobile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 shrink-0">
          <div className="hidden lg:flex items-center shrink-0">
            <Link 
              to="/contact" 
              className="px-3.5 py-2 xl:px-5 xl:py-2 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider border border-[#081C3A] hover:bg-[#081C3A] hover:text-white transition-all text-[#081C3A] rounded-lg whitespace-nowrap inline-flex items-center justify-center h-9"
            >
              {t('btn.quote')}
            </Link>
          </div>

          <div className="relative shrink-0" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 sm:gap-2 text-[#081C3A]/90 hover:text-[#081C3A] transition-colors text-[10px] font-semibold tracking-wider uppercase border border-[#081C3A]/20 rounded-lg px-2.5 py-1.5 bg-[#081C3A]/5 backdrop-blur-sm shrink-0 whitespace-nowrap h-9"
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="hidden sm:flex items-center gap-1.5 font-medium whitespace-nowrap">
                <img src={`https://flagcdn.com/w20/${selectedLang.flagCode}.png`} srcSet={`https://flagcdn.com/w40/${selectedLang.flagCode}.png 2x`} width="16" alt="" className="rounded-sm shrink-0" />
                {selectedLang.label}
              </span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[160px] z-50"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-[#081C3A] hover:text-white flex items-center gap-3 text-[#081C3A] transition-colors whitespace-nowrap"
                    >
                      <img src={`https://flagcdn.com/w20/${lang.flagCode}.png`} srcSet={`https://flagcdn.com/w40/${lang.flagCode}.png 2x`} width="20" alt="" className="rounded-sm shadow-sm shrink-0" />
                      <span className="font-medium">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-[#081C3A] p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0" 
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-b border-gray-200 px-6 py-5 flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-[#081C3A]"
          >
            <Link 
              to="/" 
              onClick={() => setMobileMenu(false)} 
              className="py-2 hover:text-[var(--color-luxury-gold)] transition-colors border-b border-gray-100"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/boat-registration" 
              onClick={() => setMobileMenu(false)} 
              className="py-2 hover:text-[var(--color-luxury-gold)] transition-colors border-b border-gray-100"
            >
              {t('nav.registries')}
            </Link>
            <Link 
              to="/pricing" 
              onClick={() => setMobileMenu(false)} 
              className="py-2 hover:text-[var(--color-luxury-gold)] transition-colors border-b border-gray-100"
            >
              {t('nav.pricing')}
            </Link>
            <Link 
              to="/services" 
              onClick={() => setMobileMenu(false)} 
              className="py-2 hover:text-[var(--color-luxury-gold)] transition-colors border-b border-gray-100"
            >
              {t('nav.services')}
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenu(false)} 
              className="py-2 hover:text-[var(--color-luxury-gold)] transition-colors border-b border-gray-100"
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenu(false)} 
              className="w-full text-center py-3 border border-[#081C3A] rounded-xl text-[#081C3A] hover:bg-[#081C3A] hover:text-white transition-all mt-2"
            >
              {t('btn.quote')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
