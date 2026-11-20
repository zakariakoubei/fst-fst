export const DEMO_CREDENTIALS = [
  { username: 'admin.chraibi', password: 'password123', roleLabel: 'Administrator' },
  { username: 'prof.bennani', password: 'password123', roleLabel: 'Professor' },
  { username: 'club.idrissi', password: 'password123', roleLabel: 'Club Manager' },
  { username: 'youssef.mansouri', password: 'password123', roleLabel: 'Student' },
];

export const INITIAL_MODULES = [
  {
    code: 'INF301',
    name: {
      en: 'Algorithms & Data Structures',
      fr: 'Algorithmique & Structures de Données',
      ar: 'الخوارزميات وهياكل البيانات',
    },
    formula: {
      exam: 50,
      td: 20,
      tp: 20,
      cc: 10,
      notes: {
        en: 'Final = 0.50*Exam + 0.20*TD + 0.20*TP + 0.10*CC. Minimum 12/20 required.',
        fr: 'Note Finale = 0,50*Examen + 0,20*TD + 0,20*TP + 0,10*CC. Validation à 12/20.',
        ar: 'المعدل النهائي = 0.50×الامتحان + 0.20×TD + 0.20×TP + 0.10×المراقبة المستمرة.',
      },
    },
  },
  {
    code: 'INF302',
    name: {
      en: 'Relational Databases & SQL',
      fr: 'Bases de Données Relationnelles & SQL',
      ar: 'قواعد البيانات العلائقية و SQL',
    },
    formula: {
      exam: 45,
      td: 15,
      tp: 30,
      cc: 10,
      notes: {
        en: 'Final = 0.45*Exam + 0.15*TD + 0.30*TP + 0.10*CC. Practical SQL lab included.',
        fr: 'Note Finale = 0,45*Examen + 0,15*TD + 0,30*TP + 0,10*CC. TP SQL inclus.',
        ar: 'المعدل النهائي = 0.45×الامتحان + 0.15×TD + 0.30×TP + 0.10×المراقبة المستمرة.',
      },
    },
  },
];

export const INITIAL_NEWS = [
  {
    id: 'news-1',
    date: '2026-11-18',
    category: 'Exams',
    title: {
      en: 'Mid-Semester Assessment Schedule Published',
      fr: 'Calendrier des contrôles de mi-semestre publié',
      ar: 'الإعلان عن جدول فروض المراقبة المستمرة لنصف الفصل',
    },
    summary: {
      en: 'Exam rooms and seating assignments for Autumn semester modules are now available.',
      fr: 'Les salles et affectations d’examen pour les modules d’automne sont disponibles.',
      ar: 'أصبحت قاعات الامتحانات وتوزيع الطلبة للفصل الخريفي متاحة الآن.',
    },
  },
  {
    id: 'news-2',
    date: '2026-11-12',
    category: 'Academic',
    title: {
      en: 'Research & Innovation Symposium Call for Posters',
      fr: 'Appel à posters pour le Symposium Recherche & Innovation',
      ar: 'دعوة للمشاركة بملصقات بحثية في ملتقى البحث والابتكار',
    },
    summary: {
      en: 'Undergraduate and master students may submit project abstracts until December 5.',
      fr: 'Les étudiants peuvent soumettre leurs résumés de projet jusqu’au 5 décembre.',
      ar: 'يمكن للطلبة تقديم ملخصات مشاريعهم البحثية لغاية 5 دجنبر.',
    },
  },
];

export const INITIAL_CLUBS = [
  {
    id: 'club-robotics',
    name: {
      en: 'Robotics & AI Club',
      fr: 'Club Robotique & IA',
      ar: 'نادي الروبوتيك والذكاء الاصطناعي',
    },
    tag: 'ROBO-FST',
    description: {
      en: 'Hands-on autonomous robotics, embedded systems, and applied machine learning.',
      fr: 'Robotique autonome, systèmes embarqués et apprentissage automatique appliqué.',
      ar: 'تطوير الروبوتات الذكية والأنظمة المدمجة وتطبيقات الذكاء الاصطناعي.',
    },
    members: ['Salma Idrissi (President)', 'Youssef El Mansouri (Hardware)'],
    events: ['Autonomous Rover Workshop — Nov 28'],
    announcements: ['Lab key pickup every Wednesday at 16:00 in Robotics Room 03.'],
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'club-enactus',
    name: {
      en: 'Social Entrepreneurship & Sustainability Club',
      fr: 'Club Entrepreneuriat & Durabilité',
      ar: 'نادي ريادة الأعمال الاجتماعية والاستدامة',
    },
    tag: 'ECO-IMPACT',
    description: {
      en: 'Student-led community initiatives focused on water efficiency and recycling.',
      fr: 'Initiatives étudiantes axées sur l’économie d’eau et le recyclage.',
      ar: 'مبادرات طلابية تركز على ترشيد المياه وإعادة التدوير.',
    },
    members: ['Mehdi Benali (Lead)', 'Hiba Sqalli (Projects)'],
    events: ['Campus Solar & Water Audit — Dec 02'],
    announcements: ['New project pitches open for first-year students.'],
    photos: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const INITIAL_PHOTOS = [
  {
    id: 'ph-1',
    title: {
      en: 'Main Campus Courtyard',
      fr: 'Cour Principale du Campus',
      ar: 'ساحة الحرم الجامعي الرئيسية',
    },
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ph-2',
    title: {
      en: 'Computer Science Laboratory',
      fr: 'Laboratoire d’Informatique',
      ar: 'مختبر الإعلاميات والبرمجة',
    },
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
  },
];