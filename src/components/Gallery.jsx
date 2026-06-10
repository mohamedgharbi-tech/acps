import React from 'react';
import { translations } from '../services/translations';
import chreaPark from '../assets/chrea_park.png';
import footballTeam from '../assets/football_team.jpg'; // Real team photo!
import groupHike from '../assets/group_hike.jpg';

/**
 * Gallery component.
 * Displays a grid of memorable past excursions and sports events.
 * It uses the group photo provided by the user alongside the official football team photo.
 */
export default function Gallery({ lang }) {
  const t = translations[lang];

  const galleryItems = [
    {
      image: groupHike,
      title: t.galleryItem1Title,
      subtitle: t.galleryItem1Desc
    },
    {
      image: chreaPark,
      title: t.galleryItem2Title,
      subtitle: t.galleryItem2Desc
    },
    {
      image: footballTeam, // Using the real football team photo!
      title: t.galleryItem3Title,
      subtitle: t.galleryItem3Desc
    },
    {
      image: groupHike,
      title: t.galleryItem4Title,
      subtitle: t.galleryItem4Desc
    }
  ];

  return (
    <section id="gallery" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">{t.galleryTag}</span>
          <h2 className="section-title">{t.galleryTitle}</h2>
          <p className="section-desc">{t.galleryDesc}</p>
        </div>

        {/* Responsive Hover Grid */}
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <div className="gallery-item" key={index}>
              <img src={item.image} alt={item.title} className="gallery-img" />
              <div className="gallery-overlay">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
