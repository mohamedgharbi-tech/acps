import React, { useEffect, useState } from 'react';
import { db } from '../services/supabase';
import { translations } from '../services/translations';
import { Users } from 'lucide-react';

export default function AboutUs({ lang }) {
  const t = translations[lang];
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    const { data, error } = await db.getMembers();
    if (!error && data) {
      setMembers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();

    // Listen to changes from Admin Dashboard
    window.addEventListener('apcs_db_update', fetchMembers);
    return () => {
      window.removeEventListener('apcs_db_update', fetchMembers);
    };
  }, []);

  const newMembers = members.filter(m => m.status === 'new');
  const oldMembers = members.filter(m => m.status === 'old');

  return (
    <section id="about" className="activities-section" style={{ backgroundColor: 'var(--color-bg-alt)', padding: '90px 0' }}>
      <div className="container">
        <div className="section-header">
          <span className="tag">{t.aboutTag}</span>
          <h2 className="title">{t.aboutTitle}</h2>
          <p className="subtitle">{t.aboutDesc}</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gold)' }}>
            {lang === 'ar' ? 'جاري تحميل الأعضاء...' : 'Loading members...'}
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            {lang === 'ar' ? 'لا يوجد أعضاء حالياً.' : 'No members found.'}
          </div>
        ) : (
          <div>
            {/* CURRENT MEMBERS (NEW) */}
            {newMembers.length > 0 && (
              <div className="about-members-group">
                <h3 className="about-group-title">{t.aboutNewMembersTitle}</h3>
                <div className="activities-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', justifyContent: 'center' }}>
                  {newMembers.map(member => (
                    <MemberCard key={member.id} member={member} lang={lang} t={t} />
                  ))}
                </div>
              </div>
            )}

            {/* DECORATIVE DIVIDER */}
            {newMembers.length > 0 && oldMembers.length > 0 && (
              <div className="member-divider">
                <span className="member-divider-badge">
                  <Users size={16} style={{ color: 'var(--color-navy)' }} />
                  <span>{lang === 'ar' ? 'الهيئة الإدارية السابقة' : 'Former Board Committee'}</span>
                </span>
              </div>
            )}

            {/* FORMER MEMBERS (OLD) */}
            {oldMembers.length > 0 && (
              <div className="about-members-group" style={{ marginTop: newMembers.length > 0 ? '0' : '40px' }}>
                <h3 className="about-group-title">{t.aboutOldMembersTitle}</h3>
                <div className="activities-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', justifyContent: 'center' }}>
                  {oldMembers.map(member => (
                    <MemberCard key={member.id} member={member} lang={lang} t={t} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function MemberCard({ member, lang, t }) {
  const initials = member.name
    ? member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AP';

  return (
    <div className="activity-card" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="member-avatar-container">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="member-avatar-img" />
        ) : (
          <span className="member-initials">{initials}</span>
        )}
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '8px' }}>
        {member.name}
      </h3>
      <p style={{ color: 'var(--color-text-muted)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '14px' }}>
        {lang === 'ar' && member.roleAr ? member.roleAr : member.roleEn || member.roleAr}
      </p>
      <span style={{
        display: 'inline-block',
        padding: '6px 16px',
        borderRadius: '999px',
        fontSize: '0.8rem',
        fontWeight: '700',
        backgroundColor: member.status === 'new' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.08)',
        color: member.status === 'new' ? '#16A34A' : '#64748B'
      }}>
        {member.status === 'new' ? t.adminMemberStatusNew : t.adminMemberStatusOld}
      </span>
    </div>
  );
}
