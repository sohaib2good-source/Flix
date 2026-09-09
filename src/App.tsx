import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import RegistrationConfig from './pages/RegistrationConfig';
import BoatRegistration from './pages/BoatRegistration';
import AboutUs from './pages/AboutUs';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';
import ScrollToTop from './components/common/ScrollToTop';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col font-sans">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin/*" element={<Admin />} />
                  {/* Step 1: Vessel & Service Configuration */}
                  <Route path="/boat-registration" element={<RegistrationConfig />} />
                  <Route path="/registries" element={<RegistrationConfig />} />
                  <Route path="/register" element={<RegistrationConfig />} />
                  <Route path="/quote" element={<RegistrationConfig />} />
                  {/* Step 2: Documentation Form */}
                  <Route path="/boat-documentation" element={<BoatRegistration />} />
                  <Route path="/boat-registration/documentation" element={<BoatRegistration />} />
                  <Route path="/form-submit" element={<BoatRegistration />} />
                  <Route path="/about" element={<AboutUs />} />
                </Routes>
              </main>
              <Footer />
              <CookieConsent />
            </div>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
