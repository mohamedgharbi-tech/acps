import React, { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { translations } from '../services/translations';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';

/**
 * NewsSection component.
 * Displays dynamic actuality announcements (like signed conventions with travel agencies).
 * Automatically updates when the admin publishes new entries.
 */
export default function NewsSection({ lang }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await db.getNews();
      if (data) {
        setNewsList(data);
      }
      setLoading(false);
    };
    
    fetchNews();

    // Set up a listener for local changes (since we use localStorage mock)
    const handleStorageChange = () => {
      fetchNews();
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event to update in same tab
    window.addEventListener('apcs_db_update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apcs_db_update', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <section id="news" className="section-padding news-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>{lang === 'ar' ? 'جاري تحميل الأخبار...' : 'Loading announcements...'}</p>
        </div>
      </section>
    );
  }

  if (newsList.length === 0) return null;

  return (
    <section id="news" className="section-padding news-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">{t.newsTag}</span>
          <h2 className="section-title">{t.newsTitle}</h2>
          <p className="section-desc">{t.newsDesc}</p>
        </div>

        {/* News Cards Grid */}
        <div className="news-grid">
          {newsList.map((item) => {
            const title = lang === 'ar' ? item.titleAr : item.titleEn;
            const content = lang === 'ar' ? item.contentAr : item.contentEn;

            return (
              <article className="news-card" key={item.id}>
                {/* News Icon Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="news-date">
                    <Calendar size={14} style={{ verticalAlign: 'middle', marginInlineEnd: '6px' }} />
                    <span>{item.date}</span>
                  </div>
                  <div style={{ color: 'var(--color-navy)', background: 'rgba(11, 45, 100, 0.08)', padding: '6px', borderRadius: '50%' }}>
                    <Megaphone size={16} />
                  </div>
                </div>

                <h3>{title}</h3>
                <p>{content}</p>

                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <a href="#news" className="activity-link" style={{ fontSize: '0.85rem' }}>
                    <span>{t.newsReadMore}</span>
                    <ArrowRight size={14} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
