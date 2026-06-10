import React from 'react';
import tunisiaNatureHero from '../assets/tunisia_nature_hero.png';
import { translations } from '../services/translations';
import { Compass, Calendar, ArrowRight } from 'lucide-react';

/**
 * Hero component for the APCS landing page.
 * Presents a captivating message about sports and excursions on the left,
 * and a premium, natural landscape visual with leaf micro-animations on the right.
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
                <span className="stat-num">+100</span>
                <span className="stat-lbl">{t.heroStatParticipants}</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">+12</span>
                <span className="stat-lbl">{t.heroStatCups}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Natural Visual Canvas & Floating Info Badge */}
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img 
                src={tunisiaNatureHero} 
                alt="Ain Draham Forest Tunisia" 
                className="hero-nature-image" 
              />
              
              {/* Subtle natural animations */}
              <span className="floating-leaf leaf-1">🍃</span>
              <span className="floating-leaf leaf-2">🌿</span>
              <span className="floating-leaf leaf-3">🍀</span>
            </div>
            
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
