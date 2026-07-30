import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Menu, X, Anchor } from 'lucide-react';
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
      'fixed top-0 w-full z-50 transition-all duration-300',
      scrolled ? 'h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 py-0 flex items-center' : 'h-16 bg-transparent py-0 flex items-center'
    )}>
      <div className="w-full px-6 md:px-12 flex items-center justify-between">


        {/* Center: Logo & Nav Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex flex-col text-[#081C3A]">
            <span className="font-heading font-bold text-2xl tracking-tighter leading-none">FELIX YACHT</span>
            <span className="text-[9px] tracking-[0.3em] uppercase opacity-60 ml-0.5">International Registrations</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-[10px] font-bold uppercase tracking-wider text-[#081C3A]/90">
            <Link to="/" className="hover:text-[#081C3A] transition-colors">{t('nav.home')}</Link>
            <Link to="/registries" className="hover:text-[#081C3A] transition-colors">{t('nav.registries')}</Link>
            <Link to="/services" className="hover:text-[#081C3A] transition-colors">{t('nav.services')}</Link>
            <Link to="/pricing" className="hover:text-[#081C3A] transition-colors">{t('nav.pricing')}</Link>
            <Link to="/form-submit" className="hover:text-[#081C3A] transition-colors">Form Submit</Link>
            <Link to="/ai-tools" className="hover:text-[var(--color-luxury-gold)] transition-colors text-[var(--color-luxury-gold)]/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-luxury-gold)] animate-pulse" />
              AI Tools
            </Link>
          </nav>
        </div>

        {/* Right: Actions, Language, and Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/contact" className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest border border-[#081C3A] hover:bg-[#081C3A] hover:text-white transition-all text-[#081C3A]">
              {t('btn.quote')}
            </Link>
          </div>

          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 text-[#081C3A]/90 hover:text-[#081C3A] transition-colors text-[10px] font-semibold tracking-widest uppercase border border-[#081C3A]/20 rounded px-2 py-1 bg-[#081C3A]/5 backdrop-blur-sm"
            >
              <Globe className="w-5 h-5" />
              <span className="hidden md:flex items-center gap-1.5 font-medium">
                <img src={`https://flagcdn.com/w20/${selectedLang.flagCode}.png`} srcSet={`https://flagcdn.com/w40/${selectedLang.flagCode}.png 2x`} width="16" alt="" className="rounded-sm" />
                {selectedLang.label}
              </span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[160px]"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-[#081C3A] hover:text-white flex items-center gap-3 text-[#081C3A] transition-colors"
                    >
                      <img src={`https://flagcdn.com/w20/${lang.flagCode}.png`} srcSet={`https://flagcdn.com/w40/${lang.flagCode}.png 2x`} width="20" alt="" className="rounded-sm shadow-sm" />
                      <span className="font-medium">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-[#081C3A]" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}
