import React, { useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { translations } from '../services/translations';
import { X, CheckCircle, Loader2 } from 'lucide-react';

/**
 * RegistrationModal component.
 * Validates Tunisian phone numbers (8 digits).
 * Dynamically limits ticket selection options based on the remaining seats left for the event.
 */
export default function RegistrationModal({ lang, trip, onClose }) {
  const t = translations[lang];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tickets: '1',
    notes: ''
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [spotsLeft, setSpotsLeft] = useState(5);

  useEffect(() => {
    const calculateCapacity = async () => {
      const { data } = await db.getRegistrations();
      if (data) {
        const booked = data
          .filter(r => r.tripId === trip.id)
          .reduce((sum, r) => sum + r.tickets, 0);
        
        const remaining = (trip.maxCapacity || 25) - booked;
        setSpotsLeft(remaining);
        
        // If remaining is 0, close or alert
        if (remaining <= 0) {
          setStatus('error');
          setErrorMessage(lang === 'ar' ? 'عذراً، هذا النشاط ممتلئ بالكامل.' : 'Sorry, this activity is fully booked.');
        }
      }
    };
    calculateCapacity();
  }, [trip, lang]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Tunisian phone validation: should be 8 digits (excluding country code)
    // E.g. 94615344 (8 digits)
    const cleanedPhone = formData.phone.replace(/\s+/g, '');
    const phoneRegex = /^[0-9]{8}$/;
    
    if (!phoneRegex.test(cleanedPhone) && !cleanedPhone.startsWith('+')) {
      setStatus('error');
      setErrorMessage(
        lang === 'ar' 
          ? 'رقم الهاتف غير صالح. يرجى إدخال 8 أرقام (مثال: 94615344).' 
          : 'Invalid phone number. Please enter a valid 8-digit Tunisian number (e.g., 94615344).'
      );
      return;
    }

    const ticketsCount = parseInt(formData.tickets, 10);
    if (ticketsCount > spotsLeft) {
      setStatus('error');
      setErrorMessage(t.regLimitReached);
      return;
    }

    setStatus('loading');
    
    const payload = {
      ...formData,
      phone: cleanedPhone,
      tripId: trip.id
    };

    const { data, error } = await db.registerForTrip(payload);
    
    if (error) {
      setStatus('error');
      if (error.message === 'limit_reached') {
        setErrorMessage(t.regLimitReached);
      } else {
        setErrorMessage(lang === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم. حاول مجدداً.' : 'An error occurred. Please try again.');
      }
    } else {
      setStatus('success');
      // Trigger update event to refresh capacity counts on home
      const event = new Event('apcs_db_update');
      window.dispatchEvent(event);
    }
  };

  // Helper to format success message
  const getSuccessMessage = () => {
    const tripTitle = lang === 'ar' ? trip.titleAr : trip.titleEn;
    return t.regSuccessDesc
      .replace('{name}', formData.fullName)
      .replace('{trip}', tripTitle)
      .replace('{tickets}', formData.tickets);
  };

  const getSuccessContact = () => {
    return t.regSuccessContact
      .replace('{phone}', formData.phone)
      .replace('{email}', formData.email);
  };

  const tripTitle = lang === 'ar' ? trip.titleAr : trip.titleEn;
  const tripLocation = lang === 'ar' ? trip.locationAr : trip.locationEn;
  const tripDate = lang === 'ar' ? trip.dateAr : trip.dateEn;
  const tripPrice = lang === 'ar' ? trip.priceAr : trip.priceEn;

  // Render options list up to spots remaining (capped at 5)
  const maxSelectableTickets = Math.min(5, spotsLeft);
  const selectOptions = [];
  for (let i = 1; i <= maxSelectableTickets; i++) {
    selectOptions.push(i);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close" onClick={onClose} aria-label="Close Modal">
          <X size={20} />
        </button>

        {status === 'success' ? (
          /* Success Screen */
          <div className="success-card">
            <div className="success-icon-container">
              <CheckCircle size={48} />
            </div>
            <h2>{t.regSuccessTitle}</h2>
            <p style={{ fontSize: '1.05rem', margin: '8px 0' }}>
              {getSuccessMessage()}
            </p>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              {getSuccessContact()}
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '12px' }}>
              {t.regBtnDone}
            </button>
          </div>
        ) : (
          /* Form Content */
          <>
            {/* Modal Banner */}
            <div style={{ height: '8px', backgroundColor: 'var(--color-navy)' }} />

            <div className="modal-body">
              <div className="modal-header">
                <h2>{t.regTitle}</h2>
                <p className="text-muted">{t.regDesc}</p>
                
                <div className="modal-meta-grid">
                  <div className="modal-meta-item">
                    <span>{lang === 'ar' ? 'النشاط' : 'Event'}</span>
                    <strong style={{ fontSize: '0.85rem' }}>{tripTitle}</strong>
                  </div>
                  <div className="modal-meta-item">
                    <span>{lang === 'ar' ? 'الوجهة' : 'Destination'}</span>
                    <strong>{tripLocation}</strong>
                  </div>
                  <div className="modal-meta-item">
                    <span>{lang === 'ar' ? 'المساهمة' : 'Fee'}</span>
                    <strong>{tripPrice === 'Free' ? t.tripFree : tripPrice}</strong>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">{t.regFormName}</label>
                  <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t.regFormNamePlaceholder} 
                    className="form-input"
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Email and Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">{t.regFormEmail}</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.regFormEmailPlaceholder} 
                      className="form-input"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">{t.regFormPhone}</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.regFormPhonePlaceholder} 
                      className="form-input"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                {/* Tickets/Seats Count */}
                <div className="form-group">
                  <label className="form-label" htmlFor="tickets">{t.regFormTickets}</label>
                  {maxSelectableTickets <= 0 ? (
                    <div style={{ color: '#C62828', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {t.tripSoldOut}
                    </div>
                  ) : (
                    <select 
                      id="tickets"
                      name="tickets"
                      value={formData.tickets}
                      onChange={handleChange}
                      className="form-input"
                      disabled={status === 'loading'}
                    >
                      {selectOptions.map(num => (
                        <option value={num} key={num}>
                          {num} {t.regFormTicketsOption}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Special Notes */}
                <div className="form-group">
                  <label className="form-label" htmlFor="notes">{t.regFormNotes}</label>
                  <textarea 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={t.regFormNotesPlaceholder} 
                    className="form-input"
                    rows="2"
                    style={{ resize: 'none' }}
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Error Alert */}
                {errorMessage && (
                  <div style={{ color: '#C62828', backgroundColor: '#FFEBEE', padding: '12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Submit Action */}
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', gap: '8px' }}
                  disabled={status === 'loading' || maxSelectableTickets <= 0}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="spinner" size={18} style={{ animation: 'spin 1.5s linear infinite' }} />
                      <span>{t.regFormLoading}</span>
                    </>
                  ) : (
                    <span>{t.regFormSubmit}</span>
                  )}
                </button>

              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
