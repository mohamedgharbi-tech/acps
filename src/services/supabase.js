/**
 * APCS Association Website - Database Integration Layer (Phase 2)
 * 
 * LOCAL TESTING MODE (localStorage):
 * Simulates real Supabase queries for Trips, Registrations, and News.
 * Fully prepared for drop-in Supabase client config in production.
 */

// --- REAL SUPABASE CLIENT CONFIG (UNCOMMENT FOR PRODUCTION) ---
/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
*/

// --- LOCAL MOCK DATABASE SYSTEM WITH TUNISIAN SEEDING ---

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Default seeds if database is empty
const seedTrips = [
  {
    id: 'trip_1',
    titleEn: 'Ain Draham Forest Trail Hike',
    titleAr: 'مسار المشي واستكشاف غابات عين دراهم',
    category: 'hiking',
    imageKey: 'chrea_park',
    difficulty: 'moderate',
    dateEn: 'Sat, June 20, 2026',
    dateAr: 'السبت، 20 جوان 2026',
    durationEn: '1 Day',
    durationAr: 'يوم كامل',
    locationEn: 'Ain Draham, Jendouba',
    locationAr: 'عين دراهم، جندوبة',
    priceEn: '15 TND',
    priceAr: '15 د.ت',
    priceValue: 15,
    maxCapacity: 35,
    descriptionEn: 'Hike through the breathtaking cork oak forests of Ain Draham. Discover lush green mountains, fresh springs, and enjoy a group picnic in the wilderness.',
    descriptionAr: 'مسار مشي مميز وسط غابات الفلين الكثيفة في عين دراهم. استكشف الجبال الخضراء، العيون الطبيعية العذبة واستمتع بنزهة جماعية في الطبيعة الخلابة.'
  },
  {
    id: 'trip_2',
    titleEn: 'APCS Inter-Center Football Cup',
    titleAr: 'دورة كأس جمعية البريد لكرة القدم المصغرة',
    category: 'sports',
    imageKey: 'football_team', // Using the real team photo!
    difficulty: 'moderate',
    dateEn: 'Sat, July 04, 2026',
    dateAr: 'السبت، 04 جويلية 2026',
    durationEn: '1 Day',
    durationAr: 'يوم كامل',
    locationEn: 'Municipal Turf Pitch, Tunis',
    locationAr: 'الملعب البلدي المعشب، تونس',
    priceEn: 'Free',
    priceAr: 'مجاني',
    priceValue: 0,
    maxCapacity: 80,
    descriptionEn: 'The annual inter-center soccer tournament! Bring your team from the postal specialized centers, compete for the APCS cup, and enjoy food and music.',
    descriptionAr: 'البطولة السنوية لكرة القدم المصغرة للجمعية! شكل فريقاً مع زملائك في المراكز البريدية المختصة، ونافس على الكأس وسط أجواء تنشيطية ومأكولات.'
  },
  {
    id: 'trip_3',
    titleEn: 'Djebel Zaghouan Summit Hike',
    titleAr: 'مسار الصعود لقمة جبل زغوان',
    category: 'hiking',
    imageKey: 'chrea_park',
    difficulty: 'challenging',
    dateEn: 'Sat, Aug 01, 2026',
    dateAr: 'السبت، 01 أوت 2026',
    durationEn: '1 Day',
    durationAr: 'يوم كامل',
    locationEn: 'Zaghouan Mountain Ridge',
    locationAr: 'سلسلة جبال زغوان',
    priceEn: '20 TND',
    priceAr: '20 د.ت',
    priceValue: 20,
    maxCapacity: 25,
    descriptionEn: 'Scale the historic ridges of Zaghouan. Includes a visit to the ancient Roman Temple of Water before climbing towards the panoramic mountain summit.',
    descriptionAr: 'مسار تسلق صخري مثير في مرتفعات جبل زغوان. يشمل زيارة معبد المياه الروماني الأثري قبل الصعود نحو القمة البانورامية المشرفة على السهول.'
  },
  {
    id: 'trip_4',
    titleEn: 'Ichkeul National Park Family Outing',
    titleAr: 'رحلة عائلية استكشافية لمحمية إشكل',
    category: 'family',
    imageKey: 'group_hike', // Using the group photo!
    difficulty: 'easy',
    dateEn: 'Fri, Aug 14, 2026',
    dateAr: 'الجمعة، 14 أوت 2026',
    durationEn: '1 Day',
    durationAr: 'يوم كامل',
    locationEn: 'Ichkeul Reserve, Bizerte',
    locationAr: 'محمية إشكل، بنزرت',
    priceEn: '12 TND',
    priceAr: '12 د.ت',
    priceValue: 12,
    maxCapacity: 45,
    descriptionEn: 'A light family excursion to the UNESCO World Heritage lake and mountain. Ideal for bird watching, visiting the hot springs, and group bonding.',
    descriptionAr: 'رحلة عائلية خفيفة إلى بحيرة وجبل إشكل المدرجة عالمياً. مثالية لمراقبة الطيور المهاجرة، زيارة الحمام المعدني الطبيعي، والتقاط صور تذكارية.'
  }
];

const seedNews = [
  {
    id: 'news_1',
    date: '2026-06-08',
    titleAr: 'توقيع اتفاقية شراكة مع وكالة أسفار لتقديم تخفيضات في الرحلات العائلية لأعضاء الجمعية',
    titleEn: 'Signing a new convention with a travel agency to offer discounts for family outings',
    contentAr: 'يسر الهيئة المديرة لجمعية البريد للمراكز المختصة الإعلان عن توقيع اتفاقية شراكة رسمية مع وكالة أسفار تونسية رائدة. تمنح هذه الاتفاقية تخفيضات تصل إلى 20% لجميع منخرطي الجمعية وعائلاتهم في الرحلات الترفيهية والإقامات الفندقية داخل وخارج تونس.',
    contentEn: 'The board of directors of the APCS is pleased to announce the signing of an official convention with a leading Tunisian travel agency. This convention grants discounts of up to 20% to all association members and their families on tours, hotels, and travel services.'
  },
  {
    id: 'news_2',
    date: '2026-06-05',
    titleAr: 'استلام الأزياء الرياضية والمعدات الجديدة لفريق كرة القدم لجمعية البريد',
    titleEn: 'Receipt of new jerseys and training equipment for the APCS football team',
    contentAr: 'في إطار التحضير لدورة كأس البريد الصيفية، استلمت الهيئة الرياضية بالجمعية الدفعة الجديدة من الأزياء الرسمية التي تحمل شعار الجمعية والبريد التونسي، بالإضافة إلى معدات تدريبية متكاملة لضمان أفضل تحضيرات فنية للاعبينا.',
    contentEn: 'As part of preparing for the upcoming summer cup, the association’s sports department has received the new team jerseys featuring the APCS and Tunisian Post logos, along with training gear to support our players.'
  }
];

const seedMembers = [
  {
    id: 'member_1',
    name: 'Mohamed Gharbi',
    roleEn: 'President',
    roleAr: 'رئيس الجمعية',
    status: 'old',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'member_2',
    name: 'Ahmed Ben Ali',
    roleEn: 'Secretary',
    roleAr: 'الكاتب العام',
    status: 'new',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

// Initialize Local Database tables if not present
if (!localStorage.getItem('apcs_trips')) {
  localStorage.setItem('apcs_trips', JSON.stringify(seedTrips));
}
if (!localStorage.getItem('apcs_news')) {
  localStorage.setItem('apcs_news', JSON.stringify(seedNews));
}
if (!localStorage.getItem('apcs_registrations')) {
  localStorage.setItem('apcs_registrations', JSON.stringify([]));
}
if (!localStorage.getItem('apcs_members')) {
  localStorage.setItem('apcs_members', JSON.stringify(seedMembers));
} else {
  // If apcs_members exists, verify it contains the photo attribute. If not, reseed to ensure correct structure.
  try {
    const existing = JSON.parse(localStorage.getItem('apcs_members'));
    if (existing.length > 0 && existing[0].photo === undefined) {
      localStorage.setItem('apcs_members', JSON.stringify(seedMembers));
    }
  } catch (e) {
    localStorage.setItem('apcs_members', JSON.stringify(seedMembers));
  }
}

export const db = {
  // --- TRIPS API ---
  async getTrips() {
    await delay(300);
    try {
      const trips = JSON.parse(localStorage.getItem('apcs_trips') || '[]');
      return { data: trips, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async createTrip(tripData) {
    await delay(800);
    try {
      const trips = JSON.parse(localStorage.getItem('apcs_trips') || '[]');
      const newTrip = {
        id: 'trip_' + Date.now().toString(36),
        ...tripData,
        priceValue: parseFloat(tripData.priceEn) || 0
      };
      trips.push(newTrip);
      localStorage.setItem('apcs_trips', JSON.stringify(trips));
      return { data: newTrip, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteTrip(tripId) {
    await delay(400);
    try {
      let trips = JSON.parse(localStorage.getItem('apcs_trips') || '[]');
      trips = trips.filter(t => t.id !== tripId);
      localStorage.setItem('apcs_trips', JSON.stringify(trips));
      return { data: true, error: null };
    } catch (err) {
      return { data: false, error: err };
    }
  },

  // --- NEWS / ACTUALITY API ---
  async getNews() {
    await delay(300);
    try {
      const news = JSON.parse(localStorage.getItem('apcs_news') || '[]');
      // Sort news by date descending
      news.sort((a, b) => new Date(b.date) - new Date(a.date));
      return { data: news, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async createNews(newsData) {
    await delay(700);
    try {
      const news = JSON.parse(localStorage.getItem('apcs_news') || '[]');
      const newActuality = {
        id: 'news_' + Date.now().toString(36),
        date: new Date().toISOString().split('T')[0],
        ...newsData
      };
      news.push(newActuality);
      localStorage.setItem('apcs_news', JSON.stringify(news));
      return { data: newActuality, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // --- REGISTRATIONS API ---
  async getRegistrations() {
    await delay(400);
    try {
      const regs = JSON.parse(localStorage.getItem('apcs_registrations') || '[]');
      return { data: regs, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async registerForTrip(registrationData) {
    await delay(800);
    try {
      const regs = JSON.parse(localStorage.getItem('apcs_registrations') || '[]');
      const trips = JSON.parse(localStorage.getItem('apcs_trips') || '[]');
      
      const trip = trips.find(t => t.id === registrationData.tripId);
      if (!trip) throw new Error("Trip not found");

      // Calculate current bookings for this trip
      const ticketsCount = parseInt(registrationData.tickets, 10) || 1;
      const bookedTickets = regs
        .filter(r => r.tripId === registrationData.tripId)
        .reduce((sum, r) => sum + r.tickets, 0);

      // Verify capacity limits
      if (bookedTickets + ticketsCount > trip.maxCapacity) {
        return { data: null, error: { message: "limit_reached" } };
      }

      const newReg = {
        id: 'reg_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        tickets: ticketsCount,
        tripId: registrationData.tripId,
        tripTitle: trip.titleEn,
        tripTitleAr: trip.titleAr,
        notes: registrationData.notes || ''
      };

      regs.push(newReg);
      localStorage.setItem('apcs_registrations', JSON.stringify(regs));
      return { data: newReg, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // --- MEMBERS API ---
  async getMembers() {
    await delay(300);
    try {
      const members = JSON.parse(localStorage.getItem('apcs_members') || '[]');
      return { data: members, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async createMember(memberData) {
    await delay(500);
    try {
      const members = JSON.parse(localStorage.getItem('apcs_members') || '[]');
      const newMember = {
        id: 'member_' + Date.now().toString(36),
        ...memberData
      };
      members.push(newMember);
      localStorage.setItem('apcs_members', JSON.stringify(members));
      return { data: newMember, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteMember(memberId) {
    await delay(400);
    try {
      let members = JSON.parse(localStorage.getItem('apcs_members') || '[]');
      members = members.filter(m => m.id !== memberId);
      localStorage.setItem('apcs_members', JSON.stringify(members));
      return { data: true, error: null };
    } catch (err) {
      return { data: false, error: err };
    }
  }
};
