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
    'nav.registries': 'Boat Registration',
    'nav.pricing': 'Pricing',
    'nav.services': 'Services',
    'nav.about': 'About Us',
    'hero.badge': 'Global Flag Specialists',
    'hero.title_lead': 'Register Your Yacht',
    'hero.title_highlight': 'Anywhere in the World',
    'hero.subtitle': 'Fast, secure and legally compliant international yacht registration services for private owners, companies and brokers.',
    'hero.trust': 'Trusted by 25,000+ Owners Worldwide',
    'btn.register': 'Register Now',
    'btn.quote': 'Get Free Quote',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.registries': 'Bootsregistrierung',
    'nav.pricing': 'Preise',
    'nav.services': 'Leistungen',
    'nav.about': 'Über uns',
    'hero.badge': 'Globale Flaggen-Experten',
    'hero.title_lead': 'Registrieren Sie Ihre Yacht',
    'hero.title_highlight': 'Weltweit & Rechtssicher',
    'hero.subtitle': 'Schnelle, sichere und rechtskonforme internationale Yachtregistrierungen für private Eigner, Firmen und Broker.',
    'hero.trust': 'Über 25.000 Eigner Weltweit Vertrauen Uns',
    'btn.register': 'Jetzt registrieren',
    'btn.quote': 'Angebot anfordern',
  },
  pl: {
    'nav.home': 'Strona Główna',
    'nav.registries': 'Rejestracja Łodzi',
    'nav.pricing': 'Cennik',
    'nav.services': 'Usługi',
    'nav.about': 'O nas',
    'hero.badge': 'Eksperci Rejestracji Bander',
    'hero.title_lead': 'Zarejestruj Swój Jacht',
    'hero.title_highlight': 'W Dowolnym Miejscu',
    'hero.subtitle': 'Szybkie, bezpieczne i zgodne z prawem usługi międzynarodowej rejestracji jachtów dla osób prywatnych i firm.',
    'hero.trust': 'Zaufało nam ponad 25 000 armatorów',
    'btn.register': 'Zarejestruj się',
    'btn.quote': 'Darmowa wycena',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.registries': 'Immatriculation',
    'nav.pricing': 'Tarifs',
    'nav.services': 'Services',
    'nav.about': 'À propos',
    'hero.badge': 'Spécialistes Pavillon Mondial',
    'hero.title_lead': 'Enregistrez Votre Yacht',
    'hero.title_highlight': 'Partout dans le Monde',
    'hero.subtitle': 'Services d\'enregistrement international de yachts rapides, sécurisés et conformes pour particuliers et sociétés.',
    'hero.trust': 'Plus de 25 000 propriétaires nous font confiance',
    'btn.register': 'S\'inscrire',
    'btn.quote': 'Devis gratuit',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.registries': 'Registro de Barcos',
    'nav.pricing': 'Precios',
    'nav.services': 'Servicios',
    'nav.about': 'Sobre nosotros',
    'hero.badge': 'Especialistas en Banderas',
    'hero.title_lead': 'Registre Su Yate',
    'hero.title_highlight': 'En Cualquier Parte',
    'hero.subtitle': 'Servicios de registro internacional de yates rápidos, seguros y legales para armadores privados y empresas.',
    'hero.trust': 'Más de 25.000 armadores confían en nosotros',
    'btn.register': 'Registrar ahora',
    'btn.quote': 'Cotización gratuita',
  },
  fi: {
    'nav.home': 'Etusivu',
    'nav.registries': 'Veneen Rekisteröinti',
    'nav.pricing': 'Hinnasto',
    'nav.services': 'Palvelut',
    'nav.about': 'Tietoa meistä',
    'hero.badge': 'Lippuasiantuntijat',
    'hero.title_lead': 'Rekisteröi Jahtisi',
    'hero.title_highlight': 'Kaikkialla Maailmassa',
    'hero.subtitle': 'Nopeat, turvalliset ja lainmukaiset kansainväliset jahtien rekisteröintipalvelut yksityisille ja yrityksille.',
    'hero.trust': 'Yli 25 000 tyytyväistä veneenomistajaa',
    'btn.register': 'Rekisteröidy',
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
