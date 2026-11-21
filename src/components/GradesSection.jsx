import React from 'react';
import { Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateModuleAverage, isModuleValidated } from '../utils/gradeCalculator';

export default function GradesSection() {
  const { language, t, siteConfig, currentUser, modules, grades, setIsLoginModalOpen } = useApp();

  if (!currentUser) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">{t.authRequiredTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{t.authRequiredDesc}</p>
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(true)}
          className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          {t.signInBtn}
        </button>
      </div>
    );
  }

  const visibleGrades = grades.filter((g) => g.studentId === currentUser.id);
  const rowsToShow = visibleGrades.length > 0 ? visibleGrades : grades;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Award className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t.examGrades}</h1>
            <p className="text-xs text-slate-500">
              {currentUser.fullName} • {t.validated} &ge; {siteConfig.passingGrade}/20
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {rowsToShow.map((entry) => {
          const mod = modules.find((m) => m.code === entry.moduleCode);
          const formula = mod?.formula || { exam: 50, td: 20, tp: 20, cc: 10 };
          const avg = calculateModuleAverage(entry, formula);
          const passed = isModuleValidated(avg, siteConfig.passingGrade);

          return (
            <div
              key={entry.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {entry.moduleCode}
                  </span>
                  <h2 className="mt-2 text-base font-bold text-slate-900">
                    {mod?.name?.[language] || mod?.name?.en || entry.moduleCode}
                  </h2>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    passed
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  {passed ? t.validated : t.rattrapage}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[11px] font-medium text-slate-500">
                    {t.examWeight} ({formula.exam}%)
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900">{entry.exam}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[11px] font-medium text-slate-500">
                    {t.tdWeight} ({formula.td}%)
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900">{entry.td}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[11px] font-medium text-slate-500">
                    {t.tpWeight} ({formula.tp}%)
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900">{entry.tp}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <div className="text-[11px] font-medium text-slate-500">
                    {t.ccWeight} ({formula.cc}%)
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-900">{entry.cc}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-600">{t.finalAverage}</span>
                <span className="text-xl font-extrabold text-emerald-700">{avg} / 20</span>
              </div>

              {formula.notes && (
                <p className="mt-2 text-xs text-slate-500">
                  {formula.notes[language] || formula.notes.en}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}