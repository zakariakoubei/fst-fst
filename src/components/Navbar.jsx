import React from 'react';
import { GraduationCap, LogIn, LogOut, Briefcase, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NAV_SECTIONS, ROLES } from '../config/siteConfig';

const LABEL_MAP = {
  home: 'home',
  grades: 'examGrades',
  td: 'td',
  tp: 'tp',
  timetable: 'timetable',
  news: 'universityNews',
  clubs: 'universityClubs',
  photos: 'universityPhotos',
  account: 'personalAccount',
};

export default function Navbar() {
  const {
    language,
    setLanguage,
    t,
    siteConfig,
    currentUser,
    activeView,
    navigateTo,
    setActiveView,
    setIsLoginModalOpen,
    logout,
  } = useApp();

  const canOpenWorkspace =
    currentUser &&
    [ROLES.ADMIN, ROLES.PROFESSOR, ROLES.CLUB_MANAGER].includes(currentUser.role);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 text-start"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-slate-900">
              {siteConfig.shortName[language] || siteConfig.shortName.en}
            </span>
            <span className="block text-xs text-slate-500">
              {siteConfig.academicYear}
            </span>
          </span>
        </button>

        <nav className="flex flex-wrap items-center gap-1">
          {NAV_SECTIONS.map((item) => {
            const labelKey = LABEL_MAP[item.id];
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t[labelKey]}
              </button>
            );
          })}

          {canOpenWorkspace && (
            <button
              type="button"
              onClick={() => setActiveView('workspace')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                activeView === 'workspace'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              {t.myWorkspace}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <Globe className="mx-1.5 h-3.5 w-3.5 text-slate-500" />
            {['en', 'fr', 'ar'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition ${
                  language === lang
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {currentUser ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t.logout}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              <LogIn className="h-3.5 w-3.5" />
              {t.login}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}