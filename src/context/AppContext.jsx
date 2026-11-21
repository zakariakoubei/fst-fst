import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SITE_CONFIG,
  STORAGE_KEYS,
  NAV_SECTIONS,
  ROLES,
  RBAC_PERMISSIONS,
} from '../config/siteConfig';
import { TRANSLATIONS } from '../i18n/translations';
import {
  DEMO_CREDENTIALS,
  INITIAL_MODULES,
  INITIAL_NEWS,
  INITIAL_CLUBS,
  INITIAL_PHOTOS,
} from '../data/database';
import { api } from '../services/api';

const AppContext = createContext(null);

const FALLBACK_STUDENTS = [
  {
    id: 'usr-stu-1',
    username: 'youssef.mansouri',
    role: ROLES.STUDENT,
    fullName: 'Youssef El Mansouri',
    email: 'youssef.mansouri@etu.fstbm.ac.ma',
    apogee: '22004819',
    filiere: 'MIP',
    groupName: 'G1',
    status: 'active',
  },
];

const FALLBACK_GRADES = [
  { id: 'gr-1', studentId: 'usr-stu-1', moduleCode: 'INF301', exam: 14.5, td: 15, tp: 16, cc: 15.5 },
  { id: 'gr-2', studentId: 'usr-stu-1', moduleCode: 'INF302', exam: 11, td: 13, tp: 14, cc: 12.5 },
];

const FALLBACK_SESSIONS = [
  {
    id: 'ses-1',
    type: 'TD',
    moduleCode: 'INF301',
    title: 'Trees & Graph Traversal Exercises',
    day: 'Tuesday',
    time: '10:30 - 12:00',
    room: 'Salle TD 04',
    group: 'G1',
    instructor: 'Pr. Karim Bennani',
    status: 'scheduled',
  },
  {
    id: 'ses-2',
    type: 'TP',
    moduleCode: 'INF302',
    title: 'SQL Joins, Views & Indexing Lab',
    day: 'Wednesday',
    time: '14:30 - 16:30',
    room: 'Labo Info 02',
    group: 'G1',
    instructor: 'Pr. Karim Bennani',
    status: 'scheduled',
  },
];

const FALLBACK_TIMETABLE = [
  {
    id: 'tt-1',
    day: 'Monday',
    time: '08:30 - 10:15',
    moduleCode: 'INF301',
    sessionType: 'Cours',
    room: 'Amphi A',
    group: 'All MIP',
    instructor: 'Pr. Karim Bennani',
  },
  {
    id: 'tt-2',
    day: 'Tuesday',
    time: '10:30 - 12:00',
    moduleCode: 'INF301',
    sessionType: 'TD',
    room: 'Salle TD 04',
    group: 'G1',
    instructor: 'Pr. Karim Bennani',
  },
  {
    id: 'tt-3',
    day: 'Wednesday',
    time: '14:30 - 16:30',
    moduleCode: 'INF302',
    sessionType: 'TP',
    room: 'Labo Info 02',
    group: 'G1',
    instructor: 'Pr. Karim Bennani',
  },
];

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANG) || INITIAL_SITE_CONFIG.defaultLanguage;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState('home');
  const [pendingViewAfterLogin, setPendingViewAfterLogin] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [siteConfig] = useState(INITIAL_SITE_CONFIG);
  const [students, setStudents] = useState(FALLBACK_STUDENTS);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [grades, setGrades] = useState(FALLBACK_GRADES);
  const [sessions, setSessions] = useState(FALLBACK_SESSIONS);
  const [timetable, setTimetable] = useState(FALLBACK_TIMETABLE);
  const [news] = useState(INITIAL_NEWS);
  const [clubs] = useState(INITIAL_CLUBS);
  const [photos] = useState(INITIAL_PHOTOS);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  async function refreshBackendData() {
    try {
      const [stuList, grList, sesList, ttList] = await Promise.all([
        api.getStudents(),
        api.getGrades(),
        api.getSessions(),
        api.getTimetable(),
      ]);
      setStudents(stuList);
      setGrades(grList);
      setSessions(sesList);
      setTimetable(ttList);
      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
    }
  }

  useEffect(() => {
    refreshBackendData();
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isRTL = language === 'ar';

  function hasPermission(permission) {
    if (!currentUser) return false;
    const perms = RBAC_PERMISSIONS[currentUser.role] || [];
    return perms.includes(permission);
  }

  function navigateTo(viewId) {
    const navItem = NAV_SECTIONS.find((n) => n.id === viewId);
    if (navItem?.requiresAuth && !currentUser) {
      setPendingViewAfterLogin(viewId);
      setIsLoginModalOpen(true);
      return;
    }
    setActiveView(viewId);
  }

  async function login(username, password) {
    try {
      const res = await api.login(username, password);
      setCurrentUser(res.user);
      setIsLoginModalOpen(false);
      await refreshBackendData();
      if (pendingViewAfterLogin) {
        setActiveView(pendingViewAfterLogin);
        setPendingViewAfterLogin(null);
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || t.invalidCredentials };
    }
  }

  function logout() {
    setCurrentUser(null);
    if (activeView === 'grades' || activeView === 'workspace') {
      setActiveView('home');
    }
  }

  async function addStudent(payload) {
    if (!hasPermission('manage_student_accounts')) return;
    const created = await api.createStudent(payload);
    setStudents((prev) => [...prev, created]);
    await refreshBackendData();
  }

  async function changeStudentPassword(studentId, newPassword) {
    if (!hasPermission('change_student_passwords')) return;
    await api.updateStudentPassword(studentId, newPassword);
  }

  async function resetStudentPassword(studentId) {
    if (!hasPermission('reset_student_passwords')) return 'password123';
    const tempPass = 'password123';
    await api.updateStudentPassword(studentId, tempPass);
    return tempPass;
  }

  async function updateStudentAccount(studentId, updates) {
    if (!hasPermission('manage_student_accounts')) return;
    await api.updateStudent(studentId, updates);
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
  }

  async function deleteStudentAccount(studentId) {
    if (!hasPermission('manage_student_accounts')) return;
    await api.deleteStudent(studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  }

  async function updateGradeEntry(gradeId, updatedFields) {
    if (!hasPermission('manage_assigned_grades')) return;
    await api.updateGrade(gradeId, updatedFields);
    setGrades((prev) =>
      prev.map((g) => (g.id === gradeId ? { ...g, ...updatedFields } : g))
    );
  }

  function updateModuleFormula(moduleCode, nextFormula) {
    if (!hasPermission('manage_assigned_formulas')) return;
    setModules((prev) =>
      prev.map((m) =>
        m.code === moduleCode ? { ...m, formula: { ...m.formula, ...nextFormula } } : m
      )
    );
  }

  async function addSession(newSession) {
    if (!hasPermission('manage_assigned_sessions')) return;
    await api.createSession(newSession);
    await refreshBackendData();
  }

  async function toggleSessionStatus(sessionId) {
    if (!hasPermission('manage_assigned_sessions')) return;
    const res = await api.toggleSession(sessionId);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: res.status } : s))
    );
  }

  async function addTimetableEntry(entry) {
    if (!hasPermission('manage_assigned_timetable')) return;
    await api.createTimetableEntry(entry);
    await refreshBackendData();
  }

  const value = {
    language,
    setLanguage,
    isRTL,
    t,
    siteConfig,
    currentUser,
    activeView,
    setActiveView,
    navigateTo,
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    logout,
    hasPermission,
    demoCredentials: DEMO_CREDENTIALS,
    students,
    modules,
    grades,
    sessions,
    timetable,
    news,
    clubs,
    photos,
    backendConnected,
    addStudent,
    changeStudentPassword,
    resetStudentPassword,
    updateStudentAccount,
    deleteStudentAccount,
    updateGradeEntry,
    updateModuleFormula,
    addSession,
    toggleSessionStatus,
    addTimetableEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}