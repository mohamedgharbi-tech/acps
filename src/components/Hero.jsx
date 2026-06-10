import React from 'react';
import AnimatedTree from './AnimatedTree';
import { translations } from '../services/translations';
import { Compass, Calendar, ArrowRight } from 'lucide-react';

/**
 * Hero component for the APCS landing page.
 * Uses a grid layout to present a captivating message about sports and excursions on the left,
 * and the CSS-animated SVG tree on the right.
 */
export default function Hero({ lang }) {
  const t = translations[lang];

  return (
    <header id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Heading and Action Items */}
          <div className="hero-content">
            <div className="hero-tag">
              <Compass size={16} />
              <span>{t.heroTag}</span>
            </div>
            
            <h1 className="hero-title">
              {t.heroTitlePart1} <br />
              <span>{t.heroTitlePart2}</span>
            </h1>
            
            <p className="hero-desc">
              {t.heroDesc}
            </p>
            
            <div className="hero-actions">
              <a href="#trips" className="btn btn-primary">
                <span>{t.heroBtnBook}</span>
                <ArrowRight size={18} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
              </a>
              <a href="#activities" className="btn btn-secondary">
                {t.heroBtnActivities}
              </a>
            </div>

            {/* Quick Stats Banner */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">{lang === 'ar' ? '٣٠+' : '30+'}</span>
                <span className="stat-lbl">{t.heroStatTrips}</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{lang === 'ar' ? '١.٥ألف+' : '1.5k+'}</span>
                <span className="stat-lbl">{t.heroStatParticipants}</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{lang === 'ar' ? '١٢+' : '12+'}</span>
                <span className="stat-lbl">{t.heroStatCups}</span>
              </div>
            </div>
          </div>

          {/* Right Column: SVG Tree Canvas & Floating Info Badge */}
          <div className="hero-visual">
            <AnimatedTree />
            
            {/* Floating Upcoming Outing Badge */}
            <div className="tree-badge">
              <div className="tree-badge-icon">
                <Calendar size={20} />
              </div>
              <div className="tree-badge-text">
                <h4>{t.heroNextOuting}</h4>
                <p>{t.heroNextDetails}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
