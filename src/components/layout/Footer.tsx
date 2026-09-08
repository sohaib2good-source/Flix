import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Anchor, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [clickCount, setClickCount] = useState(0);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 7) {
      setClickCount(0);
      navigate('/admin');
    }
  };

  return (
    <footer className="bg-[#081C3A] text-white/70 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-white">
              <Anchor className="w-8 h-8 text-[var(--color-luxury-gold)]" />
              <span className="font-heading font-bold text-2xl tracking-tight">FELIX YACHT</span>
            </Link>
            <p className="text-sm leading-relaxed">
              International Yacht Registration Specialists. Fast, secure, and legally compliant services for global yacht owners.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-heading mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-[var(--color-luxury-gold)] transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-[var(--color-luxury-gold)] transition-colors">Our Services</Link></li>
              <li><Link to="/pricing" className="hover:text-[var(--color-luxury-gold)] transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--color-luxury-gold)] transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-luxury-gold)] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Official Registry */}
          <div>
            <h4 className="text-white font-bold font-heading mb-6 text-lg">Official Registry</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/boat-registration" className="hover:text-[var(--color-luxury-gold)] transition-colors">Poland Boat Registration (EU)</Link></li>
              <li><Link to="/boat-registration" className="hover:text-[var(--color-luxury-gold)] transition-colors">Polish MMSI Radio License</Link></li>
              <li><Link to="/boat-registration" className="hover:text-[var(--color-luxury-gold)] transition-colors">Provisional Certificate (48h)</Link></li>
              <li><Link to="/boat-registration" className="hover:text-[var(--color-luxury-gold)] transition-colors">Commercial & Private Flag</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 
              onClick={handleSecretClick}
              className="text-white font-bold font-heading mb-6 text-lg cursor-default select-none"
            >
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-luxury-gold)] shrink-0" />
                <span>123 Marina Bay, Luxury Complex<br/>Geneva, Switzerland 1204</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--color-luxury-gold)] shrink-0" />
                <span>+41 22 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--color-luxury-gold)] shrink-0" />
                <span>info@felixyacht.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="h-12 border-t border-white/10 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-[10px] uppercase tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} Felix Yacht International. All Rights Reserved.</p>
          <div className="flex space-x-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
