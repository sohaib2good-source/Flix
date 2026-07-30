import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../../utils/cookies';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getCookie('felix_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    setCookie('felix_cookie_consent', 'true', 365);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-gray-600 max-w-3xl">
          <span className="font-bold text-[#081C3A]">We value your privacy.</span> We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. Your language preferences and settings are saved locally to improve your visit. By clicking "Accept All", you consent to our use of cookies.
        </div>
        <div className="flex gap-4 shrink-0">
          <button 
            onClick={acceptCookies}
            className="px-6 py-2.5 bg-[#081C3A] text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-[#CDA349] transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
