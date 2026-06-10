import React from 'react';
import { translations } from '../services/translations';
import { Shield, Trees, Users, ArrowRight } from 'lucide-react';

/**
 * Activities component.
 * Displays three feature cards representing the association's activities:
 * Sports & Soccer Tournaments, Nature Excursions & Hikes, and Community Outings.
 */
export default function Activities({ lang }) {
  const t = translations[lang];

  const activitiesData = [
    {
      icon: <Shield size={32} />,
      title: t.actCard1Title,
      description: t.actCard1Desc,
      link: "#trips"
    },
    {
      icon: <Trees size={32} />,
      title: t.actCard2Title,
      description: t.actCard2Desc,
      link: "#trips"
    },
    {
      icon: <Users size={32} />,
      title: t.actCard3Title,
      description: t.actCard3Desc,
      link: "#trips"
    }
  ];

  return (
    <section id="activities" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">{t.actTag}</span>
          <h2 className="section-title">{t.actTitle}</h2>
          <p className="section-desc">
            {t.actDesc}
          </p>
        </div>

        {/* Pillar Cards Grid */}
        <div className="activities-grid">
          {activitiesData.map((activity, idx) => (
            <div className="activity-card" key={idx}>
              <div className="activity-icon">
                {activity.icon}
              </div>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <a href={activity.link} className="activity-link">
                <span>{t.actCardBtn}</span>
                <ArrowRight size={16} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
