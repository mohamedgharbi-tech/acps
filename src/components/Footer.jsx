import React from 'react';
import logo from '../assets/logo.png';
import { translations } from '../services/translations';
import { Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer component.
 * Features the APCS branding, links to sections, and localized Tunisian contact info.
 */
export default function Footer({ lang }) {
  const t = translations[lang];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Association Brand & Arabic Name */}
          <div className="footer-info">
            <a href="#home" className="footer-logo">
              <img src={logo} alt="APCS Logo" className="footer-logo-img" />
              <span>{t.navBrand}</span>
            </a>
            {lang === 'ar' ? (
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', margin: '4px 0 8px 0' }}>
                جمعية البريد للمراكز المختصة
              </h3>
            ) : (
              <h3 style={{ fontSize: '0.95rem', color: 'var(--color-gold)', margin: '4px 0 8px 0' }}>
                Association de la Poste pour les Centres Spécialisés
              </h3>
            )}
            <p className="footer-desc">
              {t.footerDesc}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <a href="https://www.facebook.com/APCS.tnpost" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'var(--color-gold)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/apcs.tnpost?igsh=d2E1NWZxZWtweXhp" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--color-gold)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-links-col">
            <h4>{t.footerQuickLinks}</h4>
            <ul>
              <li><a href="#home">{t.navHome}</a></li>
              <li><a href="#activities">{t.navActivities}</a></li>
              <li><a href="#trips">{t.navExcursions}</a></li>
              <li><a href="#news">{t.navNews}</a></li>
              <li><a href="#gallery">{t.navGallery}</a></li>
            </ul>
          </div>

          {/* Column 3: Localized Tunisia Contact details */}
          <div className="footer-links-col">
            <h4>{t.footerContactTitle}</h4>
            <ul style={{ gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#94A3B8' }}>
                <MapPin size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                <span>{t.footerAddressTitle}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94A3B8' }}>
                <Phone size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span style={{ direction: 'ltr' }}>+216 94 615 344</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94A3B8' }}>
                <Mail size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span>apcs.postetn.2024@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Privacy */}
        <div className="footer-bottom">
          <p>{t.footerCopyright}</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#home" style={{ color: '#64748B', textDecoration: 'none' }}>
              <span>{t.footerPrivacy}</span>
            </a>
            <a href="#home" style={{ color: '#64748B', textDecoration: 'none' }}>
              <span>{t.footerTerms}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
