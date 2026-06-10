import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { translations } from '../services/translations';
import { Menu, X, ShieldAlert } from 'lucide-react';

/**
 * Navbar component for the APCS website.
 * Integrates language translation (EN/AR), LTR/RTL support, 
 * scroll shrink effect, and an Admin Portal entry point.
 */
export default function Navbar({ lang, onLangToggle, onAdminClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar glass ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Brand logo & title */}
        <a href="#home" className="nav-brand" onClick={closeMobileMenu}>
          <img src={logo} alt="APCS Logo" className="nav-logo-img" />
          <span>{t.navBrand}</span>
        </a>

        {/* Desktop Links Grid */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="#home" onClick={closeMobileMenu}>{t.navHome}</a>
          </li>
          <li>
            <a href="#activities" onClick={closeMobileMenu}>{t.navActivities}</a>
          </li>
          <li>
            <a href="#trips" onClick={closeMobileMenu}>{t.navExcursions}</a>
          </li>
          <li>
            <a href="#news" onClick={closeMobileMenu}>{t.navNews}</a>
          </li>
          <li>
            <a href="#gallery" onClick={closeMobileMenu}>{t.navGallery}</a>
          </li>
          
          {/* Admin Dashboard Entry */}
          <li>
            <button 
              onClick={() => { closeMobileMenu(); onAdminClick(); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-navy)', fontWeight: '700', fontSize: '0.9rem' }}
            >
              <ShieldAlert size={16} />
              <span>{t.navAdmin}</span>
            </button>
          </li>

          {/* Language Switcher */}
          <li>
            <button className="lang-btn" onClick={() => { closeMobileMenu(); onLangToggle(); }}>
              {t.navLangToggle}
            </button>
          </li>

          <li>
            <a href="#trips" className="nav-btn" onClick={closeMobileMenu}>{t.navJoin}</a>
          </li>
        </ul>

        {/* Hamburger Toggle */}
        <button 
          className="menu-toggle" 
          onClick={toggleMobileMenu} 
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
}
