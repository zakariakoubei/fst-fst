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
  INITIAL_MODULES,
  INITIAL_NEWS,
  INITIAL_CLUBS,
  INITIAL_PHOTOS,
} from '../data/database';
import { api } from '../services/api';
import { supabase } from '../services/supabaseClient';

const AppContext = createContext(null);

const FALLBACK_USERS = [
  {
    id: 'usr-adm-1',
    username: 'admin',
    password: 'password123',
    role: ROLES.ADMIN || 'admin',
    fullName: 'Admin FSTBM',
    email: 'admin@fstbm.ac.ma',
    apogee: 'ADM-001',
    filiere: 'Administration',
    groupName: 'Staff',
    managedClubId: '',
    assignedModules: [],
    status: 'active',
  },
  {
    id: 'usr-prf-1',
    username: 'prof',
    password: 'password123',
    role: ROLES.PROF || 'prof',
    fullName: 'Pr. Karim Bennani',
    email: 'k.bennani@fstbm.ac.ma',
    apogee: 'PRF-101',
    filiere: 'MIP',
    groupName: 'G1',
    managedClubId: '',
    assignedModules: [],
    status: 'active',
  },
  {
    id: 'usr-stu-1',
    username: 'youssef.mansouri',
    password: 'password123',
    role: ROLES.STUDENT || 'student',
    fullName: 'Youssef El Mansouri',
    email: 'youssef.mansouri@etu.fstbm.ac.ma',
    apogee: '22004819',
    filiere: 'MIP',
    groupName: 'G1',
    managedClubId: '',
    assignedModules: [],
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

function normalizeModulesList(raw) {
  if (Array.isArray(raw)) {
    return raw.map((m) => String(m).trim().toUpperCase()).filter(Boolean);
  }
  if (!raw) return [];
  return String(raw)
    .split(',')
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

function mapDbUser(row) {
  const assigned = normalizeModulesList(row.assigned_modules ?? row.assignedModules);
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    role: row.role,
    fullName: row.full_name || row.fullName || row.username,
    email: row.email || '',
    apogee: row.apogee || '',
    filiere: row.filiere || '',
    groupName: row.group_name || row.groupName || '',
    managedClubId: row.managed_club_id || row.managedClubId || '',
    assignedModules: assigned,
    status: row.status || 'active',
  };
}

function mapDbClub(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    leader: row.leader || 'Admin FSTBM',
    members: Array.isArray(row.members) ? row.members : [],
    events: Array.isArray(row.events) ? row.events : [],
    announcements: Array.isArray(row.announcements) ? row.announcements : [],
    photos: Array.isArray(row.photos) ? row.photos : [],
  };
}

function mapDbNews(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    date: row.date || new Date().toISOString().slice(0, 10),
    author: row.author || 'Admin FSTBM',
  };
}

function mapDbRequest(row) {
  return {
    id: row.id,
    clubId: row.club_id,
    clubName: row.club_name,
    requesterName: row.requester_name,
    requesterUsername: row.requester_username || '',
    requesterEmail: row.requester_email || '',
    requesterRole: row.requester_role || 'student',
    note: row.note || '',
    status: row.status || 'pending',
    createdAt: row.created_at,
  };
}

function mapDbTimetable(row) {
  return {
    id: row.id,
    day: row.day || 'Monday',
    time: row.time || '08:30 - 10:15',
    moduleCode: row.module_code || row.moduleCode || 'INF301',
    sessionType: row.session_type || row.sessionType || 'Cours',
    room: row.room || '',
    group: row.group_name || row.group || '',
    instructor: row.instructor || '',
  };
}

function mapDbGrade(row) {
  return {
    id: row.id,
    studentId: String(row.student_id ?? row.studentId ?? ''),
    moduleCode: String(row.module_code ?? row.moduleCode ?? '').toUpperCase(),
    exam: Number(row.exam ?? 0),
    td: Number(row.td ?? 0),
    tp: Number(row.tp ?? 0),
    cc: Number(row.cc ?? 0),
  };
}

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
  const [users, setUsers] = useState(FALLBACK_USERS);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [grades, setGrades] = useState(FALLBACK_GRADES);
  const [sessions, setSessions] = useState(FALLBACK_SESSIONS);
  const [timetable, setTimetable] = useState(FALLBACK_TIMETABLE);
  const [news, setNews] = useState(INITIAL_NEWS);
  const [clubs, setClubs] = useState(INITIAL_CLUBS);
  const [clubRequests, setClubRequests] = useState([]);
  const [photos] = useState(INITIAL_PHOTOS);
  const [backendConnected, setBackendConnected] = useState(false);

  const students = users.filter((u) => u.role === 'student');

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

  async function refreshSupabasePortalData() {
    try {
      const [usersRes, newsRes, clubsRes, reqRes, ttRes, grRes] = await Promise.all([
        supabase.from('portal_users').select('*'),
        supabase.from('portal_news').select('*'),
        supabase.from('portal_clubs').select('*'),
        supabase.from('portal_club_requests').select('*'),
        supabase.from('portal_timetable').select('*'),
        supabase.from('portal_grades').select('*'),
      ]);

      if (!usersRes.error && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
        setUsers(usersRes.data.map(mapDbUser));
        setBackendConnected(true);
      }

      if (!newsRes.error && Array.isArray(newsRes.data) && newsRes.data.length > 0) {
        setNews(newsRes.data.map(mapDbNews));
      }

      if (!clubsRes.error && Array.isArray(clubsRes.data) && clubsRes.data.length > 0) {
        setClubs(clubsRes.data.map(mapDbClub));
      }

      if (!reqRes.error && Array.isArray(reqRes.data)) {
        setClubRequests(reqRes.data.map(mapDbRequest));
      }

      if (!ttRes.error && Array.isArray(ttRes.data) && ttRes.data.length > 0) {
        setTimetable(ttRes.data.map(mapDbTimetable));
        setBackendConnected(true);
      }

      if (!grRes.error && Array.isArray(grRes.data) && grRes.data.length > 0) {
        setGrades(grRes.data.map(mapDbGrade));
      }
    } catch {
      // الاحتفاظ بالبيانات الحالية عند عدم توفر الاتصال
    }
  }

  async function refreshBackendData() {
    await refreshSupabasePortalData();
    try {
      const [grList, sesList] = await Promise.all([
        api.getGrades ? api.getGrades() : Promise.resolve(null),
        api.getSessions ? api.getSessions() : Promise.resolve(null),
      ]);
      if (Array.isArray(grList) && grList.length > 0) setGrades(grList);
      if (Array.isArray(sesList) && sesList.length > 0) setSessions(sesList);
    } catch {
      // يُبقي الحالة الحالية إذا لم يكن api الخارجي متاحاً
    }
  }

  useEffect(() => {
    refreshBackendData();
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isRTL = language === 'ar';
  const isAdmin = currentUser?.role === 'admin';
  const isProf = currentUser?.role === 'prof';
  const isClubAdmin = currentUser?.role === 'club_admin';

  function hasPermission(permission) {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;

    if (
      currentUser.role === 'prof' &&
      [
        'manage_assigned_grades',
        'manage_assigned_formulas',
        'manage_assigned_sessions',
        'manage_assigned_timetable',
      ].includes(permission)
    ) {
      return true;
    }

    const perms = RBAC_PERMISSIONS[currentUser.role] || [];
    return perms.includes(permission);
  }

  function getAccessibleModules(user = currentUser) {
    if (!user) return [];
    if (user.role === 'admin') return modules;
    if (user.role === 'prof') {
      const assigned = normalizeModulesList(user.assignedModules ?? user.assigned_modules);
      if (assigned.length === 0) return modules;
      return modules.filter((m) => assigned.includes(String(m.code || '').toUpperCase()));
    }
    return modules;
  }

  function canManageClub(clubId) {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'club_admin') {
      const managedId = currentUser.managedClubId ?? currentUser.managed_club_id;
      if (!managedId) return true;
      return String(managedId) === String(clubId);
    }
    return false;
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
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '');

    try {
      const { data, error } = await supabase
        .from('portal_users')
        .select('*')
        .ilike('username', cleanUser)
        .maybeSingle();

      if (!error && data) {
        if (data.password !== cleanPass) {
          return { ok: false, error: t.invalidCredentials || 'Invalid credentials' };
        }
        const mapped = mapDbUser(data);
        setCurrentUser(mapped);
        setIsLoginModalOpen(false);
        await refreshBackendData();
        if (pendingViewAfterLogin) {
          setActiveView(pendingViewAfterLogin);
          setPendingViewAfterLogin(null);
        }
        return { ok: true };
      }
    } catch {
      // متابعة التحقق المحلي عند تعذر الاتصال
    }

    const localMatch = users.find(
      (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
    );
    if (localMatch) {
      setCurrentUser(localMatch);
      setIsLoginModalOpen(false);
      if (pendingViewAfterLogin) {
        setActiveView(pendingViewAfterLogin);
        setPendingViewAfterLogin(null);
      }
      return { ok: true };
    }

    try {
      if (typeof api.login === 'function') {
        const res = await api.login(username, password);
        setCurrentUser(res.user);
        setIsLoginModalOpen(false);
        await refreshBackendData();
        if (pendingViewAfterLogin) {
          setActiveView(pendingViewAfterLogin);
          setPendingViewAfterLogin(null);
        }
        return { ok: true };
      }
    } catch (err) {
      return { ok: false, error: err.message || t.invalidCredentials || 'Invalid credentials' };
    }

    return { ok: false, error: t.invalidCredentials || 'Invalid credentials' };
  }

  function logout() {
    setCurrentUser(null);
    if (activeView === 'grades' || activeView === 'workspace') {
      setActiveView('home');
    }
  }

  // إدارة جميع المستخدمين (Admin, Club Admin, Prof, Student)
  async function addUserAccount(payload) {
    if (!isAdmin && !hasPermission('manage_student_accounts')) return;
    const assignedModules = normalizeModulesList(
      payload.assignedModules ?? payload.assigned_modules
    );

    const newUser = {
      id: `usr-${Date.now()}`,
      username: String(payload.username || '').trim(),
      password: payload.password || 'password123',
      role: payload.role || 'student',
      fullName: payload.fullName || payload.username,
      email: payload.email || '',
      apogee: payload.apogee || '',
      filiere: payload.filiere || '',
      groupName: payload.groupName || '',
      managedClubId: payload.managedClubId ?? payload.managed_club_id ?? '',
      assignedModules,
      status: payload.status || 'active',
    };

    try {
      const { data, error } = await supabase
        .from('portal_users')
        .insert([
          {
            username: newUser.username,
            password: newUser.password,
            role: newUser.role,
            full_name: newUser.fullName,
            email: newUser.email,
            apogee: newUser.apogee,
            filiere: newUser.filiere,
            group_name: newUser.groupName,
            managed_club_id: newUser.managedClubId || null,
            assigned_modules: assignedModules.join(','),
            status: newUser.status,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setUsers((prev) => [...prev, mapDbUser(data)]);
        return;
      }
    } catch {
      // fallback للحالة المحلية
    }

    setUsers((prev) => [...prev, newUser]);
  }

  async function updateUserAccount(userId, updates) {
    if (!isAdmin && !hasPermission('manage_student_accounts')) return;

    const hasAssignedUpdate =
      updates.assignedModules !== undefined || updates.assigned_modules !== undefined;
    const parsedAssigned = hasAssignedUpdate
      ? normalizeModulesList(updates.assignedModules ?? updates.assigned_modules)
      : undefined;

    const dbPayload = {};
    if (updates.username !== undefined) dbPayload.username = updates.username;
    if (updates.password !== undefined && updates.password !== '') dbPayload.password = updates.password;
    if (updates.role !== undefined) dbPayload.role = updates.role;
    if (updates.fullName !== undefined) dbPayload.full_name = updates.fullName;
    if (updates.email !== undefined) dbPayload.email = updates.email;
    if (updates.apogee !== undefined) dbPayload.apogee = updates.apogee;
    if (updates.filiere !== undefined) dbPayload.filiere = updates.filiere;
    if (updates.groupName !== undefined) dbPayload.group_name = updates.groupName;
    if (updates.managedClubId !== undefined || updates.managed_club_id !== undefined) {
      dbPayload.managed_club_id = (updates.managedClubId ?? updates.managed_club_id) || null;
    }
    if (hasAssignedUpdate) {
      dbPayload.assigned_modules = parsedAssigned.join(',');
    }
    if (updates.status !== undefined) dbPayload.status = updates.status;

    try {
      await supabase.from('portal_users').update(dbPayload).eq('id', userId);
    } catch {
      // fallback للحالة المحلية
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (String(u.id) !== String(userId)) return u;
        const nextPassword =
          updates.password !== undefined && updates.password !== ''
            ? updates.password
            : u.password;
        const nextClubId =
          updates.managedClubId !== undefined || updates.managed_club_id !== undefined
            ? updates.managedClubId ?? updates.managed_club_id ?? ''
            : u.managedClubId;
        return {
          ...u,
          ...updates,
          password: nextPassword,
          managedClubId: nextClubId,
          assignedModules: hasAssignedUpdate ? parsedAssigned : u.assignedModules || [],
        };
      })
    );

    if (currentUser && String(currentUser.id) === String(userId)) {
      setCurrentUser((prev) => ({
        ...prev,
        ...updates,
        password:
          updates.password !== undefined && updates.password !== ''
            ? updates.password
            : prev.password,
        managedClubId:
          updates.managedClubId !== undefined || updates.managed_club_id !== undefined
            ? updates.managedClubId ?? updates.managed_club_id ?? ''
            : prev.managedClubId,
        assignedModules: hasAssignedUpdate ? parsedAssigned : prev.assignedModules || [],
      }));
    }
  }

  async function changeUserPassword(userId, newPassword) {
    if (!isAdmin && !hasPermission('change_student_passwords')) return;
    if (!newPassword) return;
    await updateUserAccount(userId, { password: newPassword });
  }

  async function resetUserPassword(userId) {
    if (!isAdmin && !hasPermission('reset_student_passwords')) return 'password123';
    const tempPass = 'password123';
    await updateUserAccount(userId, { password: tempPass });
    return tempPass;
  }

  async function deleteUserAccount(userId) {
    if (!isAdmin && !hasPermission('manage_student_accounts')) return;
    try {
      await supabase.from('portal_users').delete().eq('id', userId);
    } catch {
      // fallback للحالة المحلية
    }
    setUsers((prev) => prev.filter((u) => String(u.id) !== String(userId)));
  }

  async function addStudent(payload) {
    await addUserAccount({ ...payload, role: 'student' });
  }

  async function changeStudentPassword(studentId, newPassword) {
    await changeUserPassword(studentId, newPassword);
  }

  async function resetStudentPassword(studentId) {
    return await resetUserPassword(studentId);
  }

  async function updateStudentAccount(studentId, updates) {
    await updateUserAccount(studentId, updates);
  }

  async function deleteStudentAccount(studentId) {
    await deleteUserAccount(studentId);
  }

  // إدارة الأخبار (إضافة - تعديل - حذف)
  async function addNewsItem(item) {
    if (!isAdmin) return;
    const entry = {
      id: `news-${Date.now()}`,
      title: item.title,
      content: item.content,
      date: item.date || new Date().toISOString().slice(0, 10),
      author: item.author || currentUser?.fullName || 'Admin FSTBM',
    };

    try {
      const { data, error } = await supabase
        .from('portal_news')
        .insert([
          {
            title: entry.title,
            content: entry.content,
            date: entry.date,
            author: entry.author,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setNews((prev) => [mapDbNews(data), ...prev]);
        return;
      }
    } catch {
      // fallback للحالة المحلية
    }

    setNews((prev) => [entry, ...prev]);
  }

  async function updateNewsItem(newsId, updates) {
    if (!isAdmin) return;
    try {
      await supabase
        .from('portal_news')
        .update({
          title: updates.title,
          content: updates.content,
          date: updates.date,
          author: updates.author,
        })
        .eq('id', newsId);
    } catch {
      // fallback للحالة المحلية
    }

    setNews((prev) =>
      prev.map((item) => (item.id === newsId ? { ...item, ...updates } : item))
    );
  }

  async function deleteNewsItem(newsId) {
    if (!isAdmin) return;
    try {
      await supabase.from('portal_news').delete().eq('id', newsId);
    } catch {
      // fallback للحالة المحلية
    }
    setNews((prev) => prev.filter((item) => item.id !== newsId));
  }

  // إدارة الأندية (إضافة للأدمن + تعديل شامل للنادي للأدمن ومسؤول النادي)
  async function addClubItem(club) {
    if (!isAdmin) return;
    const entry = {
      id: `club-${Date.now()}`,
      name: club.name,
      description: club.description || '',
      leader: club.leader || currentUser?.fullName || 'Admin FSTBM',
      members: Array.isArray(club.members) ? club.members : [],
      events: Array.isArray(club.events) ? club.events : [],
      announcements: Array.isArray(club.announcements) ? club.announcements : [],
      photos: Array.isArray(club.photos) ? club.photos : [],
    };

    try {
      const { data, error } = await supabase
        .from('portal_clubs')
        .insert([
          {
            name: entry.name,
            description: entry.description,
            leader: entry.leader,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setClubs((prev) => [...prev, { ...mapDbClub(data), ...entry, id: data.id }]);
        return;
      }
    } catch {
      // fallback للحالة المحلية
    }

    setClubs((prev) => [...prev, entry]);
  }

  async function updateClubItem(clubId, updates) {
    if (!canManageClub(clubId)) return;
    try {
      await supabase
        .from('portal_clubs')
        .update({
          name: updates.name,
          description: updates.description,
          leader: updates.leader,
        })
        .eq('id', clubId);
    } catch {
      // fallback للحالة المحلية
    }

    setClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, ...updates } : c))
    );
  }

  async function deleteClubItem(clubId) {
    if (!isAdmin) return;
    try {
      await supabase.from('portal_clubs').delete().eq('id', clubId);
    } catch {
      // fallback للحالة المحلية
    }
    setClubs((prev) => prev.filter((c) => c.id !== clubId));
  }

  // طلبات الانضمام للأندية
  async function submitClubJoinRequest(club, note = '') {
    const targetClub = typeof club === 'string' ? clubs.find((c) => c.id === club) : club;
    if (!targetClub) return;

    const reqItem = {
      id: `req-${Date.now()}`,
      clubId: targetClub.id,
      clubName: targetClub.name,
      requesterName: currentUser?.fullName || 'Student Visitor',
      requesterUsername: currentUser?.username || '',
      requesterEmail: currentUser?.email || '',
      requesterRole: currentUser?.role || 'student',
      note,
      status: 'pending',
    };

    try {
      const { data, error } = await supabase
        .from('portal_club_requests')
        .insert([
          {
            club_id: String(reqItem.clubId),
            club_name: reqItem.clubName,
            requester_name: reqItem.requesterName,
            requester_username: reqItem.requesterUsername,
            requester_email: reqItem.requesterEmail,
            requester_role: reqItem.requesterRole,
            note: reqItem.note,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setClubRequests((prev) => [mapDbRequest(data), ...prev]);
        return;
      }
    } catch {
      // fallback للحالة المحلية
    }

    setClubRequests((prev) => [reqItem, ...prev]);
  }

  async function decideClubJoinRequest(requestId, decision) {
    const targetReq = clubRequests.find((r) => r.id === requestId);
    const targetClubId = targetReq?.clubId ?? targetReq?.club_id;
    if (!isAdmin && !canManageClub(targetClubId)) return;

    const nextStatus = decision === 'approved' ? 'approved' : 'rejected';
    try {
      await supabase
        .from('portal_club_requests')
        .update({ status: nextStatus })
        .eq('id', requestId);
    } catch {
      // fallback للحالة المحلية
    }

    setClubRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: nextStatus } : r))
    );
  }

  // إدارة وتوليد نقط الامتحانات للأستاذ والأدمن
  async function updateGradeEntry(gradeId, updatedFields) {
    if (!hasPermission('manage_assigned_grades')) return;

    const exists = grades.some((g) => String(g.id) === String(gradeId));
    const newRecordId = exists ? gradeId : `gr-${Date.now()}`;

    if (exists && typeof api.updateGrade === 'function') {
      try {
        await api.updateGrade(gradeId, updatedFields);
      } catch {
        // متابعة التحديث المحلي
      }
    }

    setGrades((prev) => {
      const found = prev.some((g) => String(g.id) === String(gradeId));
      if (found) {
        return prev.map((g) =>
          String(g.id) === String(gradeId) ? { ...g, ...updatedFields } : g
        );
      }
      return [
        ...prev,
        {
          id: newRecordId,
          studentId: String(updatedFields.studentId ?? ''),
          moduleCode: String(updatedFields.moduleCode ?? '').toUpperCase(),
          exam: Number(updatedFields.exam ?? 0),
          td: Number(updatedFields.td ?? 0),
          tp: Number(updatedFields.tp ?? 0),
          cc: Number(updatedFields.cc ?? 0),
        },
      ];
    });
  }

  function updateModuleFormula(moduleCode, nextFormula) {
    if (!hasPermission('manage_assigned_formulas')) return;
    setModules((prev) =>
      prev.map((m) =>
        m.code === moduleCode ? { ...m, formula: { ...m.formula, ...nextFormula } } : m
      )
    );
  }

  // إدارة الحصص (TD / TP) للأستاذ والأدمن
  async function addSession(newSession) {
    if (!hasPermission('manage_assigned_sessions')) return;
    const created = {
      id: `ses-${Date.now()}`,
      status: 'scheduled',
      ...newSession,
    };

    if (typeof api.createSession === 'function') {
      try {
        await api.createSession(created);
      } catch {
        // متابعة التحديث المحلي
      }
    }

    setSessions((prev) => [created, ...prev]);
  }

  async function toggleSessionStatus(sessionId) {
    if (!hasPermission('manage_assigned_sessions')) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const nextStatus = s.status === 'scheduled' ? 'completed' : 'scheduled';
        return { ...s, status: nextStatus };
      })
    );

    if (typeof api.toggleSession === 'function') {
      try {
        await api.toggleSession(sessionId);
      } catch {
        // متابعة التحديث المحلي
      }
    }
  }

  // إدارة جدول الحصص (emploi du temps) للأستاذ والأدمن: إضافة - تعديل - حذف
  async function addTimetableEntry(entry) {
    if (!hasPermission('manage_assigned_timetable')) return;

    const normalized = {
      id: `tt-${Date.now()}`,
      day: entry.day || 'Monday',
      time: entry.time || '08:30 - 10:15',
      moduleCode: entry.moduleCode || entry.module_code || 'INF301',
      sessionType: entry.sessionType || entry.session_type || 'Cours',
      room: entry.room || '',
      group: entry.group || entry.group_name || '',
      instructor: entry.instructor || currentUser?.fullName || '',
    };

    try {
      const { data, error } = await supabase
        .from('portal_timetable')
        .insert([
          {
            day: normalized.day,
            time: normalized.time,
            module_code: normalized.moduleCode,
            session_type: normalized.sessionType,
            room: normalized.room,
            group_name: normalized.group,
            instructor: normalized.instructor,
            updated_by: currentUser?.username || '',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setTimetable((prev) => [...prev, mapDbTimetable(data)]);
        return;
      }
    } catch {
      // fallback للحالة المحلية
    }

    if (typeof api.createTimetableEntry === 'function') {
      try {
        await api.createTimetableEntry(normalized);
      } catch {
        // متابعة التحديث المحلي
      }
    }

    setTimetable((prev) => [...prev, normalized]);
  }

  async function updateTimetableEntry(entryId, updates) {
    if (!hasPermission('manage_assigned_timetable')) return;

    const nextModule = updates.moduleCode ?? updates.module_code;
    const nextType = updates.sessionType ?? updates.session_type;
    const nextGroup = updates.group ?? updates.group_name;

    const dbUpdates = {};
    if (updates.day !== undefined) dbUpdates.day = updates.day;
    if (updates.time !== undefined) dbUpdates.time = updates.time;
    if (nextModule !== undefined) dbUpdates.module_code = nextModule;
    if (nextType !== undefined) dbUpdates.session_type = nextType;
    if (updates.room !== undefined) dbUpdates.room = updates.room;
    if (nextGroup !== undefined) dbUpdates.group_name = nextGroup;
    if (updates.instructor !== undefined) dbUpdates.instructor = updates.instructor;
    dbUpdates.updated_by = currentUser?.username || '';

    try {
      await supabase.from('portal_timetable').update(dbUpdates).eq('id', entryId);
    } catch {
      // fallback للحالة المحلية
    }

    setTimetable((prev) =>
      prev.map((row) => {
        if (row.id !== entryId) return row;
        return {
          ...row,
          ...updates,
          moduleCode: nextModule !== undefined ? nextModule : row.moduleCode,
          sessionType: nextType !== undefined ? nextType : row.sessionType,
          group: nextGroup !== undefined ? nextGroup : row.group,
        };
      })
    );
  }

  async function deleteTimetableEntry(entryId) {
    if (!hasPermission('manage_assigned_timetable')) return;

    try {
      await supabase.from('portal_timetable').delete().eq('id', entryId);
    } catch {
      // fallback للحالة المحلية
    }

    setTimetable((prev) => prev.filter((row) => row.id !== entryId));
  }

  const value = {
    language,
    setLanguage,
    isRTL,
    t,
    siteConfig,
    currentUser,
    isAdmin,
    isProf,
    isClubAdmin,
    activeView,
    setActiveView,
    navigateTo,
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    logout,
    hasPermission,
    getAccessibleModules,
    canManageClub,
    users,
    students,
    modules,
    grades,
    sessions,
    timetable,
    news,
    clubs,
    clubRequests,
    photos,
    backendConnected,
    addUserAccount,
    updateUserAccount,
    changeUserPassword,
    resetUserPassword,
    deleteUserAccount,
    addStudent,
    changeStudentPassword,
    resetStudentPassword,
    updateStudentAccount,
    deleteStudentAccount,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    addClubItem,
    updateClubItem,
    deleteClubItem,
    submitClubJoinRequest,
    decideClubJoinRequest,
    updateGradeEntry,
    updateModuleFormula,
    addSession,
    toggleSessionStatus,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}