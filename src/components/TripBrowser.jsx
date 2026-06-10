import React, { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { translations } from '../services/translations';
import chreaPark from '../assets/chrea_park.png';
import footballTeam from '../assets/football_team.jpg'; // Real team photo!
import groupHike from '../assets/group_hike.jpg'; // Group photo!
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

/**
 * TripBrowser component.
 * Displays scheduled nature outings, soccer matches, and visits.
 * Resolves database image identifiers to local high-res graphics.
 * Calculates seats remaining against max capacity and disables registrations for sold-out events.
 */
export default function TripBrowser({ lang, onRegisterClick }) {
  const t = translations[lang];
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Map database image string keys to imported React modules
  const imageMap = {
    chrea_park: chreaPark,
    football_team: footballTeam,
    group_hike: groupHike
  };

  const fetchData = async () => {
    const tripsRes = await db.getTrips();
    const regsRes = await db.getRegistrations();
    if (tripsRes.data) setTrips(tripsRes.data);
    if (regsRes.data) setBookings(regsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Listen for database changes to update seats in real-time
    const handleDbUpdate = () => {
      fetchData();
    };

    window.addEventListener('storage', handleDbUpdate);
    window.addEventListener('apcs_db_update', handleDbUpdate);

    return () => {
      window.removeEventListener('storage', handleDbUpdate);
      window.removeEventListener('apcs_db_update', handleDbUpdate);
    };
  }, []);

  const getBookedCount = (tripId) => {
    return bookings
      .filter(r => r.tripId === tripId)
      .reduce((sum, r) => sum + r.tickets, 0);
  };

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(trip => trip.category === filter);

  if (loading) {
    return (
      <section id="trips" className="section-padding trip-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>{lang === 'ar' ? 'جاري تحميل الرحلات والأنشطة...' : 'Loading activities...'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="trips" className="section-padding trip-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">{t.tripTag}</span>
          <h2 className="section-title">{t.tripTitle}</h2>
          <p className="section-desc">{t.tripDesc}</p>
        </div>

        {/* Filter Tab Buttons */}
        <div className="trip-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t.tripFilterAll}
          </button>
          <button 
            className={`filter-btn ${filter === 'hiking' ? 'active' : ''}`}
            onClick={() => setFilter('hiking')}
          >
            {t.tripFilterHiking}
          </button>
          <button 
            className={`filter-btn ${filter === 'sports' ? 'active' : ''}`}
            onClick={() => setFilter('sports')}
          >
            {t.tripFilterSports}
          </button>
          <button 
            className={`filter-btn ${filter === 'family' ? 'active' : ''}`}
            onClick={() => setFilter('family')}
          >
            {t.tripFilterFamily}
          </button>
        </div>

        {/* Dynamic Catalog Cards */}
        <div className="trips-grid">
          {filteredTrips.map(trip => {
            const title = lang === 'ar' ? trip.titleAr : trip.titleEn;
            const desc = lang === 'ar' ? trip.descriptionAr : trip.descriptionEn;
            const location = lang === 'ar' ? trip.locationAr : trip.locationEn;
            const date = lang === 'ar' ? trip.dateAr : trip.dateEn;
            const duration = lang === 'ar' ? trip.durationAr : trip.durationEn;
            const price = lang === 'ar' ? trip.priceAr : trip.priceEn;
            
            // Resolve image
            const imageFile = imageMap[trip.imageKey] || chreaPark;

            // Calculate capacity details
            const booked = getBookedCount(trip.id);
            const max = trip.maxCapacity || 25;
            const spotsLeft = max - booked;
            const fillPercent = Math.min((booked / max) * 100, 100);
            const isSoldOut = spotsLeft <= 0;

            // Display label details
            const categoryLabel = trip.category === 'hiking' ? (lang === 'ar' ? 'مغامرة ومشي' : 'Hiking & Nature') 
                                : trip.category === 'sports' ? (lang === 'ar' ? 'دورة رياضية' : 'Sports Cup') 
                                : (lang === 'ar' ? 'خرجة عائلية' : 'Family Visit');

            return (
              <article className="trip-card" key={trip.id}>
                <div className="trip-image-container">
                  <img src={imageFile} alt={title} className="trip-img" />
                  <span className="trip-badge-overlay">{categoryLabel}</span>
                  <span className={`trip-difficulty difficulty-${trip.difficulty || 'easy'}`}>
                    {trip.difficulty === 'easy' ? (lang === 'ar' ? 'سهل' : 'Easy') 
                     : trip.difficulty === 'moderate' ? (lang === 'ar' ? 'متوسط' : 'Moderate') 
                     : (lang === 'ar' ? 'صعب' : 'Challenging')}
                  </span>
                </div>

                <div className="trip-content">
                  <div className="trip-meta">
                    <div className="trip-meta-item">
                      <Calendar size={14} />
                      <span>{date}</span>
                    </div>
                    <div className="trip-meta-item">
                      <Clock size={14} />
                      <span>{duration}</span>
                    </div>
                  </div>

                  <h3>{title}</h3>
                  
                  <div className="trip-meta-item text-muted">
                    <MapPin size={14} />
                    <span style={{ fontSize: '0.85rem' }}>{location}</span>
                  </div>

                  <p>{desc}</p>

                  {/* Real-time Spots Remaining Counter */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                      <span>{t.tripMaxCapacity}: {max}</span>
                      {isSoldOut ? (
                        <span style={{ color: '#C62828' }}>{t.tripSoldOut}</span>
                      ) : (
                        <span>{spotsLeft} {t.tripSpotsLeft}</span>
                      )}
                    </div>
                    <div className="trip-capacity-bar">
                      <div 
                        className={`trip-capacity-fill ${fillPercent > 85 ? 'high' : ''}`} 
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="trip-footer" style={{ marginTop: '12px' }}>
                    <div className="trip-price">
                      <span className="label">{t.tripPrice}</span>
                      <span className="val">{price === 'Free' ? t.tripFree : price}</span>
                    </div>
                    {isSoldOut ? (
                      <button className="btn btn-primary btn-sm btn-soldout" disabled>
                        {t.tripSoldOut}
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onRegisterClick(trip)}
                      >
                        {t.tripBtnRegister}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
