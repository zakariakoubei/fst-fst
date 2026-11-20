import React from 'react';
import {
  Award,
  BookOpen,
  FlaskConical,
  Calendar,
  Newspaper,
  Users,
  Images,
  UserCircle,
  Wifi,
  WifiOff,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomeSection() {
  const {
    language,
    isRTL,
    t,
    siteConfig,
    navigateTo,
    news,
    clubs,
    modules,
    backendConnected,
    currentUser,
  } = useApp();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const quickCards = [
    { id: 'grades', title: t.examGrades, icon: Award, accent: 'bg-emerald-50 text-emerald-700' },
    { id: 'td', title: t.td, icon: BookOpen, accent: 'bg-sky-50 text-sky-700' },
    { id: 'tp', title: t.tp, icon: FlaskConical, accent: 'bg-indigo-50 text-indigo-700' },
    { id: 'timetable', title: t.timetable, icon: Calendar, accent: 'bg-amber-50 text-amber-700' },
    { id: 'news', title: t.universityNews, icon: Newspaper, accent: 'bg-rose-50 text-rose-700' },
    { id: 'clubs', title: t.universityClubs, icon: Users, accent: 'bg-purple-50 text-purple-700' },
    { id: 'photos', title: t.universityPhotos, icon: Images, accent: 'bg-teal-50 text-teal-700' },
    { id: 'account', title: t.personalAccount, icon: UserCircle, accent: 'bg-slate-100 text-slate-700' },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-emerald-100">
            {siteConfig.academicYear} • {siteConfig.semester}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              backendConnected
                ? 'bg-emerald-400/20 text-emerald-200'
                : 'bg-amber-400/20 text-amber-200'
            }`}
          >
            {backendConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {backendConnected ? 'PostgreSQL API Connected' : 'Local Demo Mode'}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {siteConfig.universityName[language] || siteConfig.universityName.en}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-emerald-100/90">
          {currentUser
            ? `${currentUser.fullName} (${currentUser.role})`
            : t.authRequiredDesc}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-lg">
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs">
            <div className="text-xl font-bold">{modules.length}</div>
            <div className="text-xs text-emerald-100/80">Modules</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs">
            <div className="text-xl font-bold">{clubs.length}</div>
            <div className="text-xs text-emerald-100/80">{t.universityClubs}</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs">
            <div className="text-xl font-bold">{siteConfig.passingGrade}/20</div>
            <div className="text-xs text-emerald-100/80">{t.validated}</div>
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => navigateTo(card.id)}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-start shadow-xs transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-slate-900">{card.title}</span>
                </div>
                <ArrowIcon className="h-4 w-4 text-slate-400 transition group-hover:text-emerald-700" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">{t.universityNews}</h2>
          <button
            type="button"
            onClick={() => navigateTo('news')}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            {t.universityNews}
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {news.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-700">{item.category}</span>
                <span>{item.date}</span>
              </div>
              <h3 className="mt-1.5 text-sm font-bold text-slate-900">
                {item.title[language] || item.title.en}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {item.summary[language] || item.summary.en}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}