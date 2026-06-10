import React, { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { translations } from '../services/translations';
import { X, LogOut, PlusCircle, Calendar, Users, DollarSign, Megaphone, Trash2 } from 'lucide-react';

/**
 * AdminDashboard component.
 * Allows the association admin to login (mock admin/admin),
 * create excursions, post news announcements (Arabic/English),
 * set maximum capacities, and view registrations rosters.
 */
export default function AdminDashboard({ lang, onClose }) {
  const t = translations[lang];
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Dashboard Tabs: 'trips' | 'news' | 'bookings' | 'members'
  const [activeTab, setActiveTab] = useState('trips');

  // Forms States
  const [tripForm, setTripForm] = useState({
    titleEn: '', titleAr: '',
    descriptionEn: '', descriptionAr: '',
    category: 'hiking',
    locationEn: '', locationAr: '',
    dateEn: '', dateAr: '',
    durationEn: '1 Day', durationAr: 'يوم كامل',
    priceEn: '15 TND', priceAr: '15 د.ت',
    maxCapacity: '25',
    imageKey: 'chrea_park'
  });

  const [newsForm, setNewsForm] = useState({
    titleEn: '', titleAr: '',
    contentEn: '', contentAr: ''
  });

  const [memberForm, setMemberForm] = useState({
    name: '', roleEn: '', roleAr: '', status: 'new', photo: ''
  });

  // DB Data States
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    // Check if already logged in for this session
    if (sessionStorage.getItem('apcs_admin_auth') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  const fetchDashboardData = async () => {
    const tripsRes = await db.getTrips();
    const regsRes = await db.getRegistrations();
    const membersRes = await db.getMembers();
    if (tripsRes.data) setTrips(tripsRes.data);
    if (regsRes.data) setBookings(regsRes.data);
    if (membersRes.data) setMembers(membersRes.data);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      setIsLoggedIn(true);
      setLoginError(false);
      sessionStorage.setItem('apcs_admin_auth', 'true');
    } else {
      setLoginError(true);
    }
  };

  const handleLoginChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('apcs_admin_auth');
  };

  const handleTripChange = (e) => {
    setTripForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNewsChange = (e) => {
    setNewsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMemberChange = (e) => {
    setMemberForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(lang === 'ar' ? 'حجم الصورة كبير جداً، يرجى اختيار ملف أصغر من 8 ميجابايت' : 'Image is too large. Please select a file under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256; // High quality square crop avatar
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        // Center-crop logic
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        
        // Convert to compressed jpeg to conserve localStorage space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setMemberForm(prev => ({ ...prev, photo: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const capacityNum = parseInt(tripForm.maxCapacity, 10) || 20;

    const payload = {
      ...tripForm,
      maxCapacity: capacityNum
    };

    const { error } = await db.createTrip(payload);
    setSubmitting(false);

    if (!error) {
      setSuccessMsg(true);
      // Reset form
      setTripForm({
        titleEn: '', titleAr: '',
        descriptionEn: '', descriptionAr: '',
        category: 'hiking',
        locationEn: '', locationAr: '',
        dateEn: '', dateAr: '',
        durationEn: '1 Day', durationAr: 'يوم كامل',
        priceEn: '15 TND', priceAr: '15 د.ت',
        maxCapacity: '25',
        imageKey: 'chrea_park'
      });
      fetchDashboardData();
      triggerGlobalUpdate();
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await db.createNews(newsForm);
    setSubmitting(false);

    if (!error) {
      setSuccessMsg(true);
      setNewsForm({ titleEn: '', titleAr: '', contentEn: '', contentAr: '' });
      triggerGlobalUpdate();
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الرحلة؟' : 'Are you sure you want to delete this outing?')) {
      await db.deleteTrip(id);
      fetchDashboardData();
      triggerGlobalUpdate();
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await db.createMember(memberForm);
    setSubmitting(false);

    if (!error) {
      setSuccessMsg(true);
      setMemberForm({ name: '', roleEn: '', roleAr: '', status: 'new', photo: '' });
      fetchDashboardData();
      triggerGlobalUpdate();
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Are you sure you want to delete this member?')) {
      await db.deleteMember(id);
      fetchDashboardData();
      triggerGlobalUpdate();
    }
  };

  const triggerGlobalUpdate = () => {
    // Notify other components on the page to fetch fresh data
    const event = new Event('apcs_db_update');
    window.dispatchEvent(event);
  };

  // Helper to calculate bookings count for a trip
  const getBookedCount = (tripId) => {
    return bookings
      .filter(r => r.tripId === tripId)
      .reduce((sum, r) => sum + r.tickets, 0);
  };

  // Statistics summaries
  const totalBookingsCount = bookings.reduce((sum, r) => sum + r.tickets, 0);
  
  // Calculate total income based on trip priceValues
  const totalRevenue = bookings.reduce((sum, r) => {
    const trip = trips.find(t => t.id === r.tripId);
    const priceVal = trip ? trip.priceValue : 0;
    return sum + (priceVal * r.tickets);
  }, 0);

  return (
    <div className="admin-overlay">
      {/* Top Header Bar */}
      <div className="admin-header-bar">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '1.4rem' }}>{isLoggedIn ? t.adminDashboardTitle : t.adminLoginTitle}</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {isLoggedIn && (
              <button onClick={handleLogout} className="lang-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF6C00', borderColor: '#EF6C00' }}>
                <LogOut size={16} />
                <span>{t.adminBtnLogout}</span>
              </button>
            )}
            <button onClick={onClose} className="lang-btn" style={{ background: 'var(--color-gold)', color: 'var(--color-navy)', border: 'none' }}>
              {t.adminBtnCancel}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* LOGIN SCREEN */}
        {!isLoggedIn ? (
          <div style={{ maxWidth: '400px', width: '100%', margin: '60px auto', background: 'var(--color-card-light)', padding: '32px', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-lg)' }}>
            <p className="text-muted" style={{ marginBottom: '24px', textAlign: 'center' }}>{t.adminLoginDesc}</p>
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">{t.adminUser}</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={credentials.username}
                  onChange={handleLoginChange}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">{t.adminPass}</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={credentials.password}
                  onChange={handleLoginChange}
                  className="form-input" 
                  required 
                />
              </div>

              {loginError && (
                <div style={{ color: '#C62828', backgroundColor: '#FFEBEE', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
                  {t.adminAlertError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {t.adminBtnLogin}
              </button>
            </form>
          </div>
        ) : (
          
          /* ADMIN PORTAL PANEL */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: 1 }}>
            
            {/* Top Navigation Tabs */}
            <div className="admin-tabs">
              <button 
                className={`admin-tab ${activeTab === 'trips' ? 'active' : ''}`}
                onClick={() => setActiveTab('trips')}
              >
                {t.adminDashboardTabTrips}
              </button>
              <button 
                className={`admin-tab ${activeTab === 'news' ? 'active' : ''}`}
                onClick={() => setActiveTab('news')}
              >
                {t.adminDashboardTabNews}
              </button>
              <button 
                className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                {t.adminDashboardTabBookings}
              </button>
              <button 
                className={`admin-tab ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                {t.adminDashboardTabMembers}
              </button>
            </div>

            {/* Alert Banner */}
            {successMsg && (
              <div style={{ color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '16px', borderRadius: '8px', fontWeight: '700', textAlign: 'center' }}>
                {t.adminAlertSuccess}
              </div>
            )}

            {/* TAB 1: MANAGE TRIPS */}
            {activeTab === 'trips' && (
              <div className="admin-grid">
                {/* Form column */}
                <div style={{ background: 'var(--color-card-light)', padding: '32px', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '20px', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={20} />
                    <span>{t.adminAddTripTitle}</span>
                  </h3>
                  
                  <form onSubmit={handleTripSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Titles */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t.adminTripTitleInput} (EN)</label>
                        <input type="text" name="titleEn" value={tripForm.titleEn} onChange={handleTripChange} className="form-input" required />
                      </div>
                      <div className="form-group" style={{ textAlign: 'right' }}>
                        <label className="form-label">{t.adminTripTitleInput} (AR)</label>
                        <input type="text" name="titleAr" value={tripForm.titleAr} onChange={handleTripChange} className="form-input" style={{ textAlign: 'right' }} required />
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="form-group">
                      <label className="form-label">{t.adminTripDescInput} (EN)</label>
                      <textarea name="descriptionEn" value={tripForm.descriptionEn} onChange={handleTripChange} className="form-input" rows="2" required />
                    </div>
                    <div className="form-group" style={{ textAlign: 'right' }}>
                      <label className="form-label">{t.adminTripDescInput} (AR)</label>
                      <textarea name="descriptionAr" value={tripForm.descriptionAr} onChange={handleTripChange} className="form-input" style={{ textAlign: 'right' }} rows="2" required />
                    </div>

                    {/* Category & Image template */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t.adminTripCategoryInput}</label>
                        <select name="category" value={tripForm.category} onChange={handleTripChange} className="form-input">
                          <option value="hiking">Hiking & Nature</option>
                          <option value="sports">Sports Tournament</option>
                          <option value="family">Family Trip</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t.adminTripImageInput}</label>
                        <select name="imageKey" value={tripForm.imageKey} onChange={handleTripChange} className="form-input">
                          <option value="chrea_park">Ain Draham Scenic Forest</option>
                          <option value="football_team">La Poste Football Team Photo</option>
                          <option value="group_hike">APCS Hiking Group Photo</option>
                        </select>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t.adminTripLocationInput} (EN)</label>
                        <input type="text" name="locationEn" value={tripForm.locationEn} onChange={handleTripChange} className="form-input" placeholder="e.g. Ain Draham" required />
                      </div>
                      <div className="form-group" style={{ textAlign: 'right' }}>
                        <label className="form-label">{t.adminTripLocationInput} (AR)</label>
                        <input type="text" name="locationAr" value={tripForm.locationAr} onChange={handleTripChange} className="form-input" style={{ textAlign: 'right' }} placeholder="مثال: عين دراهم" required />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t.adminTripDateInput} (EN)</label>
                        <input type="text" name="dateEn" value={tripForm.dateEn} onChange={handleTripChange} className="form-input" placeholder="e.g. Sat, June 20" required />
                      </div>
                      <div className="form-group" style={{ textAlign: 'right' }}>
                        <label className="form-label">{t.adminTripDateInput} (AR)</label>
                        <input type="text" name="dateAr" value={tripForm.dateAr} onChange={handleTripChange} className="form-input" style={{ textAlign: 'right' }} placeholder="مثال: السبت، 20 جوان" required />
                      </div>
                    </div>

                    {/* Duration, Price, Max Capacity */}
                    <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1.2fr' }}>
                      <div className="form-group">
                        <label className="form-label">{t.adminTripDurationInput}</label>
                        <input type="text" name="durationEn" value={tripForm.durationEn} onChange={handleTripChange} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t.adminTripPriceInput}</label>
                        <input type="text" name="priceEn" value={tripForm.priceEn} onChange={handleTripChange} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t.adminTripCapacityInput}</label>
                        <input type="number" name="maxCapacity" value={tripForm.maxCapacity} onChange={handleTripChange} className="form-input" min="1" required />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={submitting}>
                      {t.adminBtnSubmit}
                    </button>
                  </form>
                </div>

                {/* List column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ color: 'var(--color-navy)' }}>{t.adminTripsList}</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{lang === 'ar' ? 'النشاط' : 'Event'}</th>
                          <th>{lang === 'ar' ? 'السعة الحالية' : 'Capacity'}</th>
                          <th style={{ width: '80px', textAlign: 'center' }}>{t.adminTripsDelete}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trips.map(trip => {
                          const title = lang === 'ar' ? trip.titleAr : trip.titleEn;
                          const booked = getBookedCount(trip.id);
                          const isFull = booked >= trip.maxCapacity;
                          return (
                            <tr key={trip.id}>
                              <td>
                                <strong>{title}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                  {lang === 'ar' ? trip.locationAr : trip.locationEn}
                                </div>
                              </td>
                              <td>
                                <span className={`admin-badge ${isFull ? 'admin-badge-warn' : 'admin-badge-success'}`}>
                                  {booked} / {trip.maxCapacity}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button 
                                  onClick={() => handleDeleteTrip(trip.id)} 
                                  style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer' }}
                                  aria-label="Delete Trip"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: POST NEWS */}
            {activeTab === 'news' && (
              <div style={{ maxWidth: '650px', width: '100%', margin: '0 auto', background: 'var(--color-card-light)', padding: '32px', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '24px', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Megaphone size={20} />
                  <span>{t.adminAddNewsTitle}</span>
                </h3>

                <form onSubmit={handleNewsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">{t.adminNewsTitleInput} (EN)</label>
                    <input type="text" name="titleEn" value={newsForm.titleEn} onChange={handleNewsChange} className="form-input" placeholder="e.g. Signed convention with travel agency..." required />
                  </div>
                  <div className="form-group" style={{ textAlign: 'right' }}>
                    <label className="form-label">{t.adminNewsTitleInput} (AR)</label>
                    <input type="text" name="titleAr" value={newsForm.titleAr} onChange={handleNewsChange} className="form-input" style={{ textAlign: 'right' }} placeholder="مثال: توقيع اتفاقية مع وكالة أسفار..." required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.adminNewsContentInput} (EN)</label>
                    <textarea name="contentEn" value={newsForm.contentEn} onChange={handleNewsChange} className="form-input" rows="4" placeholder="Detailed announcement in English..." required />
                  </div>
                  <div className="form-group" style={{ textAlign: 'right' }}>
                    <label className="form-label">{t.adminNewsContentInput} (AR)</label>
                    <textarea name="contentAr" value={newsForm.contentAr} onChange={handleNewsChange} className="form-input" style={{ textAlign: 'right' }} rows="4" placeholder="تفاصيل الإعلان باللغة العربية..." required />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {t.adminBtnSubmit}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: BOOKINGS ROSTER */}
            {activeTab === 'bookings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div style={{ background: 'var(--color-card-light)', padding: '24px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ color: 'var(--color-navy)', background: 'rgba(11, 45, 100, 0.08)', padding: '12px', borderRadius: '50%' }}>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Active Outings</h4>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--color-navy)' }}>{trips.length}</strong>
                    </div>
                  </div>
                  <div style={{ background: 'var(--color-card-light)', padding: '24px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ color: 'var(--color-green)', background: 'var(--color-green-light)', padding: '12px', borderRadius: '50%' }}>
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Tickets Booked</h4>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--color-green)' }}>{totalBookingsCount}</strong>
                    </div>
                  </div>
                  <div style={{ background: 'var(--color-card-light)', padding: '24px', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ color: 'var(--color-gold)', background: 'var(--color-gold-light)', padding: '12px', borderRadius: '50%' }}>
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Total Contributions</h4>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--color-navy)' }}>{totalRevenue} TND</strong>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t.adminBookingsName}</th>
                        <th>{t.adminBookingsContact}</th>
                        <th>{t.adminBookingsTrip}</th>
                        <th>{t.adminBookingsSeats}</th>
                        <th>{t.adminBookingsDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                            {lang === 'ar' ? 'لا توجد حجوزات مسجلة حالياً.' : 'No registrations found.'}
                          </td>
                        </tr>
                      ) : (
                        bookings.map(reg => (
                           <tr key={reg.id}>
                            <td><strong>{reg.fullName}</strong></td>
                            <td>
                              <div>{reg.phone}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{reg.email}</div>
                            </td>
                            <td>{lang === 'ar' ? (reg.tripTitleAr || reg.tripTitle) : reg.tripTitle}</td>
                            <td><strong>{reg.tickets}</strong></td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              {new Date(reg.created_at).toLocaleDateString(lang === 'ar' ? 'ar-TN' : 'en-US')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: MANAGE MEMBERS */}
            {activeTab === 'members' && (
              <div className="admin-grid">
                {/* Form column */}
                <div style={{ background: 'var(--color-card-light)', padding: '32px', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginBottom: '20px', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} />
                    <span>{t.adminAddMemberTitle}</span>
                  </h3>
                  
                  <form onSubmit={handleMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">{t.adminMemberNameInput}</label>
                      <input type="text" name="name" value={memberForm.name} onChange={handleMemberChange} className="form-input" required />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t.adminMemberRoleInput} (EN)</label>
                        <input type="text" name="roleEn" value={memberForm.roleEn} onChange={handleMemberChange} className="form-input" />
                      </div>
                      <div className="form-group" style={{ textAlign: 'right' }}>
                        <label className="form-label">{t.adminMemberRoleInput} (AR)</label>
                        <input type="text" name="roleAr" value={memberForm.roleAr} onChange={handleMemberChange} className="form-input" style={{ textAlign: 'right' }} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.adminMemberStatusInput}</label>
                      <select name="status" value={memberForm.status} onChange={handleMemberChange} className="form-input">
                        <option value="new">{t.adminMemberStatusNew}</option>
                        <option value="old">{t.adminMemberStatusOld}</option>
                      </select>
                    </div>

                    {/* Photo Upload Section */}
                    <div className="form-group">
                      <label className="form-label">{t.adminMemberPhotoInput}</label>
                      <div 
                        className="photo-upload-container" 
                        onClick={() => document.getElementById('photo-file-input').click()}
                        style={{
                          border: '2px dashed rgba(11, 45, 100, 0.2)',
                          padding: '16px',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backgroundColor: 'rgba(11, 45, 100, 0.02)',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        {memberForm.photo ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <img 
                              src={memberForm.photo} 
                              alt="Preview" 
                              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} 
                            />
                            <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 'bold' }}>✓ {t.adminMemberPhotoPreview}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-navy-light)' }}>
                            <PlusCircle size={24} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{t.adminMemberPhotoSelect}</span>
                          </div>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '8px', textAlign: 'center' }}>
                          {t.adminMemberPhotoHelp}
                        </span>
                        <input 
                          type="file" 
                          id="photo-file-input" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          style={{ display: 'none' }} 
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={submitting}>
                      {t.adminBtnSubmit}
                    </button>
                  </form>
                </div>

                {/* List column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ color: 'var(--color-navy)' }}>{t.adminMembersList}</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t.adminMemberNameInput}</th>
                          <th>{t.adminMemberRoleInput}</th>
                          <th>{t.adminMembersStatus}</th>
                          <th style={{ width: '80px', textAlign: 'center' }}>{t.adminTripsDelete}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map(member => (
                          <tr key={member.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {member.photo ? (
                                  <img 
                                    src={member.photo} 
                                    alt={member.name} 
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} 
                                  />
                                ) : (
                                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(239, 184, 56, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-navy)', fontSize: '0.85rem' }}>
                                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <strong>{member.name}</strong>
                              </div>
                            </td>
                            <td>{lang === 'ar' && member.roleAr ? member.roleAr : member.roleEn || member.roleAr}</td>
                            <td>
                              <span style={{
                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                backgroundColor: member.status === 'new' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                color: member.status === 'new' ? '#16A34A' : '#64748B'
                              }}>
                                {member.status === 'new' ? t.adminMemberStatusNew : t.adminMemberStatusOld}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                onClick={() => handleDeleteMember(member.id)} 
                                style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer' }}
                                aria-label="Delete Member"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
