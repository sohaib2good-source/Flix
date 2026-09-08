import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import BoatRegistration from './pages/BoatRegistration';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col font-sans">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/boat-registration" element={<BoatRegistration />} />
                  <Route path="/registries" element={<BoatRegistration />} />
                  <Route path="/form-submit" element={<BoatRegistration />} />
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
