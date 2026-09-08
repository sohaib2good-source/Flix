import React, { useState, useEffect } from 'react';
import { Users, Type, Key, LogOut, MessageSquare, Anchor, Banknote, ArrowRight, Eye, EyeOff, Palette, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Logo from '../components/Logo';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Page Components
import CustomersPage from '../components/admin/CustomersPage';
import RegistrationsPage from '../components/admin/RegistrationsPage';
import RevenuePage from '../components/admin/RevenuePage';
import ReviewsPage from '../components/admin/ReviewsPage';
import FontSettingsPage from '../components/admin/FontSettingsPage';
import PasswordPage from '../components/admin/PasswordPage';

type AdminTab = 'customers' | 'registrations' | 'revenue' | 'font' | 'password' | 'reviews';

const NAV_ITEMS: { section: string; items: { id: AdminTab; label: string; icon: React.ElementType }[] }[] = [
  {
    section: 'Database',
    items: [
      { id: 'customers', label: 'Instant Quotes', icon: Users },
      { id: 'registrations', label: 'Registration Requests', icon: Anchor },
      { id: 'revenue', label: 'Revenue', icon: Banknote },
    ],
  },
  {
    section: 'Website CMS',
    items: [
      { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    ],
  },
  {
    section: 'System Control',
    items: [
      { id: 'font', label: 'Interface Font', icon: Type },
      { id: 'password', label: 'Auth Password', icon: Key },
    ],
  },
];

// Extract tab from URL path: /admin/registrations/abc123 → "registrations"
function getTabFromPath(pathname: string): AdminTab {
  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  const segment = parts[0] || '';
  const validTabs: AdminTab[] = ['customers', 'registrations', 'revenue', 'font', 'password', 'reviews'];
  if (validTabs.includes(segment as AdminTab)) return segment as AdminTab;
  return 'registrations'; // default
}

// Extract record ID from URL: /admin/registrations/abc123 → "abc123"
function getRecordIdFromPath(pathname: string): string | null {
  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  return parts[1] || null;
}

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('admin_session') === 'active');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derive active tab from URL
  const activeTab = getTabFromPath(location.pathname);

  const handleTabChange = (tab: AdminTab) => {
    setIsSidebarOpen(false);
    navigate(`/admin/${tab}`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fast-pass master access
    if (password === 'fuLL') {
      sessionStorage.setItem('admin_session', 'active');
      setIsAuthenticated(true);
      navigate('/admin/registrations');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, 'admin@felixyacht.com', password);
      sessionStorage.setItem('admin_session', 'active');
      setIsAuthenticated(true);
      navigate('/admin/registrations');
    } catch (err: any) {
      console.error('Login failed', err);
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Apply saved font preference
  useEffect(() => {
    const savedFont = localStorage.getItem('admin_font_preference');
    if (savedFont) {
      document.documentElement.style.setProperty('--font-sans', savedFont);
    }
  }, []);

  // Redirect bare /admin to /admin/registrations
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/admin' || location.pathname === '/admin/')) {
      navigate('/admin/registrations', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // ── Login Screen ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-luxury-gold)]/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-luxury-gold)]/10 rounded-full blur-3xl -ml-16 -mb-16" />

          <div className="flex justify-center mb-8 relative z-10">
            <Logo className="h-32 md:h-40 w-auto" />
          </div>

          <h2 className="text-3xl font-heading font-extrabold text-[#081C3A] mb-2 text-center">Felix Admin</h2>
          <p className="text-gray-500 text-center mb-8 text-sm uppercase tracking-widest font-bold opacity-60">System Controller</p>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-[#081C3A]/40 uppercase tracking-widest ml-1">Authentication Key</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-center text-2xl tracking-widest h-14 border-gray-100 bg-gray-50 focus:bg-white transition-all rounded-xl pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#081C3A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {loginError && <p className="text-red-500 text-xs text-center font-bold">{loginError}</p>}
            </div>

            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-14 bg-[#081C3A] hover:bg-[#081C3A]/90 text-white text-lg rounded-xl shadow-xl shadow-[#081C3A]/20 font-bold tracking-widest">
                UNLOCK SYSTEM
              </Button>
              <button type="button" className="text-sm font-bold text-gray-400 hover:text-[#081C3A] transition-colors flex items-center justify-center gap-2" onClick={() => navigate('/')}>
                <ArrowRight className="w-4 h-4 rotate-180" /> Return to Website
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard Shell ───────────────────────────────────────────────
  const recordId = getRecordIdFromPath(location.pathname);

  const renderPage = () => {
    switch (activeTab) {
      case 'customers': return <CustomersPage />;
      case 'registrations': return <RegistrationsPage recordId={recordId} />;
      case 'revenue': return <RevenuePage recordId={recordId} />;
      case 'reviews': return <ReviewsPage />;
      case 'font': return <FontSettingsPage />;
      case 'password': return <PasswordPage />;
      default: return <RegistrationsPage recordId={recordId} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col md:flex-row font-sans selection:bg-[var(--color-luxury-gold)]/30">
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#081C3A] text-white flex flex-col sticky top-0 z-[110] border-b border-white/10 shrink-0 w-full">
        <div className="h-11 flex items-center justify-between px-4 border-b border-white/5 bg-[#081C3A]/85">
          <div className="flex items-center gap-2">
            <Logo variant="white" className="h-6 w-auto" />
            <span className="text-[10px] font-bold font-heading text-white/50 tracking-wider">SYSTEM PANEL</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="h-14 flex items-center justify-around px-2 bg-[#081C3A]/95 backdrop-blur-md">
          {NAV_ITEMS.flatMap(g => g.items).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                title={item.label}
                className={`p-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[var(--color-luxury-gold)] text-[#081C3A] shadow-md scale-105 font-bold'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-48 bg-[#081C3A] text-white flex-col shadow-2xl border-r border-white/5 shrink-0">
        <div className="p-4 border-b border-white/10 flex flex-col items-center gap-2 bg-[#081C3A]/50 backdrop-blur-md">
          <Logo variant="white" className="h-10 w-auto" />
          <h2 className="text-sm font-bold font-heading text-white tracking-tight">System<span className="text-[var(--color-luxury-gold)]">X</span></h2>
        </div>

        <div className="flex-1 py-6 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map((group) => (
            <div key={group.section}>
              <div className="px-6 mb-2 mt-6 first:mt-0 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                {group.section}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all text-xs ${
                      isActive
                        ? 'bg-white/10 text-[var(--color-luxury-gold)] border-r-4 border-[var(--color-luxury-gold)] shadow-lg font-bold'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-[#081C3A]/80">
          <Button variant="ghost" className="w-full justify-start text-white/40 hover:text-white hover:bg-white/5 group h-10 px-4 text-xs" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </div>
    </div>
  );
}
