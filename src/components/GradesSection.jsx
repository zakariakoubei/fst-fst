import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, Save, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateModuleAverage, isModuleValidated } from '../utils/gradeCalculator';

function pickText(value, language = 'en', fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return (
      value[language] ||
      value.en ||
      value.fr ||
      value.ar ||
      Object.values(value).find((v) => typeof v === 'string') ||
      fallback
    );
  }
  return String(value);
}

export default function GradesSection() {
  const {
    language,
    t,
    siteConfig,
    currentUser,
    hasPermission,
    students = [],
    modules = [],
    grades = [],
    updateGradeEntry,
    setIsLoginModalOpen,
  } = useApp();

  const canEditGrades =
    currentUser?.role === 'prof' ||
    currentUser?.role === 'admin' ||
    (typeof hasPermission === 'function' && hasPermission('manage_assigned_grades'));

  const [selectedStudentId, setSelectedStudentId] = useState('ALL');
  const [drafts, setDrafts] = useState({});
  const [savedIds, setSavedIds] = useState({});

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

  const rowsToShow = canEditGrades
    ? selectedStudentId === 'ALL'
      ? grades
      : grades.filter((g) => String(g.studentId) === String(selectedStudentId))
    : grades.filter((g) => String(g.studentId) === String(currentUser.id));

  function getFieldValue(entry, field) {
    const draftRow = drafts[entry.id];
    if (draftRow && draftRow[field] !== undefined) {
      return draftRow[field];
    }
    return entry[field] ?? 0;
  }

  function handleFieldChange(entryId, field, rawVal) {
    setDrafts((prev) => ({
      ...prev,
      [entryId]: {
        ...(prev[entryId] || {}),
        [field]: rawVal,
      },
    }));
    setSavedIds((prev) => ({ ...prev, [entryId]: false }));
  }

  function buildEditableEntry(entry) {
    const draftRow = drafts[entry.id] || {};
    const parseNum = (field, fallback) => {
      if (draftRow[field] === undefined || draftRow[field] === '') return Number(fallback ?? 0);
      const n = Number(draftRow[field]);
      return Number.isNaN(n) ? Number(fallback ?? 0) : n;
    };

    return {
      ...entry,
      exam: parseNum('exam', entry.exam),
      td: parseNum('td', entry.td),
      tp: parseNum('tp', entry.tp),
      cc: parseNum('cc', entry.cc),
    };
  }

  async function handleSave(entry) {
    if (!canEditGrades || typeof updateGradeEntry !== 'function') return;
    const updated = buildEditableEntry(entry);
    await updateGradeEntry(entry.id, {
      exam: updated.exam,
      td: updated.td,
      tp: updated.tp,
      cc: updated.cc,
    });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[entry.id];
      return next;
    });
    setSavedIds((prev) => ({ ...prev, [entry.id]: true }));
    setTimeout(() => {
      setSavedIds((prev) => ({ ...prev, [entry.id]: false }));
    }, 2000);
  }

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

        {canEditGrades && students.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="grade-student-filter" className="text-xs font-semibold text-slate-600">
              Student:
            </label>
            <select
              id="grade-student-filter"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Students ({grades.length})</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.username})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {rowsToShow.map((entry) => {
          const mod = modules.find((m) => m.code === entry.moduleCode);
          const formula = mod?.formula || { exam: 50, td: 20, tp: 20, cc: 10 };
          const activeEntry = canEditGrades ? buildEditableEntry(entry) : entry;
          const avg = calculateModuleAverage(activeEntry, formula);
          const passed = isModuleValidated(avg, siteConfig.passingGrade);
          const studentObj = students.find((s) => String(s.id) === String(entry.studentId));
          const isSaved = Boolean(savedIds[entry.id]);

          const scoreBoxes = [
            {
              key: 'exam',
              label: `${t.examWeight} (${formula.exam}%)`,
              value: getFieldValue(entry, 'exam'),
            },
            {
              key: 'td',
              label: `${t.tdWeight} (${formula.td}%)`,
              value: getFieldValue(entry, 'td'),
            },
            {
              key: 'tp',
              label: `${t.tpWeight} (${formula.tp}%)`,
              value: getFieldValue(entry, 'tp'),
            },
            {
              key: 'cc',
              label: `${t.ccWeight} (${formula.cc}%)`,
              value: getFieldValue(entry, 'cc'),
            },
          ];

          return (
            <div
              key={entry.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                      {entry.moduleCode}
                    </span>
                    {canEditGrades && (
                      <span className="text-xs font-medium text-slate-500">
                        {studentObj?.fullName || entry.studentId}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-base font-bold text-slate-900">
                    {pickText(mod?.name, language, entry.moduleCode)}
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
                {scoreBoxes.map((box) => (
                  <div key={box.key} className="rounded-xl bg-slate-50 p-2.5">
                    <div className="text-[11px] font-medium text-slate-500">{box.label}</div>
                    {canEditGrades ? (
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="20"
                        value={box.value}
                        onChange={(e) => handleFieldChange(entry.id, box.key, e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-1.5 py-1 text-center text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    ) : (
                      <div className="mt-1 text-sm font-bold text-slate-900">{entry[box.key]}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-600">{t.finalAverage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-emerald-700">{avg} / 20</span>
                  {canEditGrades && (
                    <button
                      type="button"
                      onClick={() => handleSave(entry)}
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition ${
                        isSaved
                          ? 'bg-emerald-600'
                          : 'bg-emerald-700 hover:bg-emerald-800'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          {t.saveChanges || 'Save'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {formula.notes && (
                <p className="mt-2 text-xs text-slate-500">
                  {pickText(formula.notes, language, '')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}