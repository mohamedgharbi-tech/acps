import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Activities from './components/Activities';
import TripBrowser from './components/TripBrowser';
import NewsSection from './components/NewsSection';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';
import AdminDashboard from './components/AdminDashboard';

/**
 * Main App component.
 * Manages states for:
 * 1. Selected language (English / Arabic) with RTL layout synchronization.
 * 2. Active trip selected for excursion registration.
 * 3. Administrative Control Dashboard visibility.
 */
export default function App() {
  const [lang, setLang] = useState('ar'); // Defaulting to Arabic
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Synchronize layout direction (LTR/RTL) with DOM body node
  useEffect(() => {
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleLangToggle = () => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <div className="app-root">
      {/* Bilingual Responsive Navigation */}
      <Navbar 
        lang={lang} 
        onLangToggle={handleLangToggle} 
        onAdminClick={() => setIsAdminOpen(true)} 
      />

      {/* Hero Header with SVG Animated Tree */}
      <Hero lang={lang} />

      {/* About Us: Administrative Members */}
      <AboutUs lang={lang} />

      {/* Pillars of work of the APCS Association */}
      <Activities lang={lang} />

      {/* Interactive Trip Catalogue & Capacity Manager */}
      <TripBrowser 
        lang={lang} 
        onRegisterClick={setSelectedTrip} 
      />

      {/* News & Announcements (Conventions, Sports equipment updates) */}
      <NewsSection lang={lang} />

      {/* Photo Wall featuring actual hike and football team pictures */}
      <Gallery lang={lang} />

      {/* Brand footer containing Tunisian contact details */}
      <Footer lang={lang} />

      {/* Multi-step Registration Modal */}
      {selectedTrip && (
        <RegistrationModal 
          lang={lang}
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
        />
      )}

      {/* Administrative Control Portal */}
      {isAdminOpen && (
        <AdminDashboard 
          lang={lang} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
    </div>
  );
}
