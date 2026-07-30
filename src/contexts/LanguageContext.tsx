import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';

type Language = 'en' | 'de' | 'pl' | 'fr' | 'es' | 'fi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.registries': 'Registries',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'hero.title': 'Register Your Yacht Anywhere in the World',
    'hero.subtitle': 'Fast, secure and legally compliant international yacht registration services for private owners, companies and brokers.',
    'btn.register': 'Register Now',
    'btn.quote': 'Get Free Quote',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.registries': 'Register',
    'nav.services': 'Dienstleistungen',
    'nav.pricing': 'Preise',
    'hero.title': 'Registrieren Sie Ihre Yacht weltweit',
    'hero.subtitle': 'Schnelle, sichere und rechtskonforme internationale Yachtregistrierung.',
    'btn.register': 'Jetzt registrieren',
    'btn.quote': 'Kostenloses Angebot',
  },
  pl: {
    'nav.home': 'Strona Główna',
    'nav.registries': 'Rejestry',
    'nav.services': 'Usługi',
    'nav.pricing': 'Cennik',
    'hero.title': 'Zarejestruj swój jacht w dowolnym miejscu na świecie',
    'hero.subtitle': 'Szybkie, bezpieczne i zgodne z prawem usługi międzynarodowej rejestracji jachtów.',
    'btn.register': 'Zarejestruj się',
    'btn.quote': 'Darmowa wycena',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.registries': 'Registres',
    'nav.services': 'Services',
    'nav.pricing': 'Tarifs',
    'hero.title': 'Enregistrez votre yacht partout dans le monde',
    'hero.subtitle': 'Services d\'enregistrement de yachts internationaux rapides, sécurisés et conformes.',
    'btn.register': 'S\'inscrire maintenant',
    'btn.quote': 'Devis gratuit',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.registries': 'Registros',
    'nav.services': 'Servicios',
    'nav.pricing': 'Precios',
    'hero.title': 'Registre su yate en cualquier parte del mundo',
    'hero.subtitle': 'Servicios de registro de yates internacionales rápidos, seguros y legales.',
    'btn.register': 'Regístrese ahora',
    'btn.quote': 'Cotización gratuita',
  },
  fi: {
    'nav.home': 'Koti',
    'nav.registries': 'Rekisterit',
    'nav.services': 'Palvelut',
    'nav.pricing': 'Hinnasto',
    'hero.title': 'Rekisteröi jahtisi missä tahansa maailmassa',
    'hero.subtitle': 'Nopeat, turvalliset ja lainmukaiset kansainväliset jahtien rekisteröintipalvelut.',
    'btn.register': 'Rekisteröidy nyt',
    'btn.quote': 'Ilmainen tarjous',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = getCookie('felix_lang') as Language;
    if (saved && Object.keys(translations).includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setCookie('felix_lang', lang, 365); // Save preference in cookie for 1 year
  };

  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
