export const API_BASE_URL = 'http://localhost:4000/api';

export const STORAGE_KEYS = {
  LANG: 'uni_portal_lang_v3',
  USER: 'uni_portal_user_v3',
};

export const ROLES = {
  STUDENT: 'student',
  PROFESSOR: 'professor',
  CLUB_MANAGER: 'club_manager',
  ADMIN: 'admin',
};

export const INITIAL_SITE_CONFIG = {
  universityName: {
    en: 'Faculty of Sciences & Techniques — Beni Mellal',
    fr: 'Faculté des Sciences et Techniques — Béni Mellal',
    ar: 'كلية العلوم والتقنيات — بني ملال',
  },
  shortName: {
    en: 'FSTBM Portal',
    fr: 'Portail FSTBM',
    ar: 'بوابة FSTBM',
  },
  academicYear: '2026–2027',
  semester: 'Autumn / Automne / الخريف',
  passingGrade: 12,
  defaultLanguage: 'en',
};

export const RBAC_PERMISSIONS = {
  [ROLES.STUDENT]: [
    'view_own_grades',
    'view_sessions',
    'view_timetable',
    'view_news',
    'view_clubs',
    'view_photos',
  ],
  [ROLES.PROFESSOR]: [
    'view_sessions',
    'manage_assigned_sessions',
    'manage_assigned_grades',
    'manage_assigned_formulas',
    'manage_assigned_timetable',
    'view_news',
    'view_clubs',
    'view_photos',
  ],
  [ROLES.CLUB_MANAGER]: [
    'view_sessions',
    'view_timetable',
    'view_news',
    'view_clubs',
    'manage_assigned_club',
    'view_photos',
  ],
  [ROLES.ADMIN]: [
    'view_own_grades',
    'view_sessions',
    'manage_assigned_sessions',
    'manage_assigned_grades',
    'manage_assigned_formulas',
    'manage_assigned_timetable',
    'view_news',
    'view_clubs',
    'view_photos',
    'manage_student_accounts',
    'change_student_passwords',
    'reset_student_passwords',
  ],
};

export const NAV_SECTIONS = [
  { id: 'home', requiresAuth: false },
  { id: 'grades', requiresAuth: true },
  { id: 'td', requiresAuth: false },
  { id: 'tp', requiresAuth: false },
  { id: 'timetable', requiresAuth: false },
  { id: 'news', requiresAuth: false },
  { id: 'clubs', requiresAuth: false },
  { id: 'photos', requiresAuth: false },
  { id: 'account', requiresAuth: false },
];