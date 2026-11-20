import React, { useState } from 'react';
import { BookOpen, FlaskConical, Plus, Ban, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SessionsSection({ sessionType = 'TD' }) {
  const {
    t,
    modules,
    sessions,
    hasPermission,
    addSession,
    toggleSessionStatus,
  } = useApp();

  const [selectedModule, setSelectedModule] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [moduleCode, setModuleCode] = useState(modules[0]?.code || 'INF301');
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('10:30 - 12:00');
  const [room, setRoom] = useState(sessionType === 'TP' ? 'Labo Info 01' : 'Salle TD 02');
  const [group, setGroup] = useState('G1');
  const [instructor, setInstructor] = useState('Pr. Karim Bennani');

  const canManage = hasPermission('manage_assigned_sessions');
  const isTP = sessionType === 'TP';
  const Icon = isTP ? FlaskConical : BookOpen;
  const heading = isTP ? t.tp : t.td;

  const filtered = sessions.filter((s) => {
    const matchesType = s.type === sessionType;
    const matchesMod = selectedModule === 'ALL' || s.moduleCode === selectedModule;
    return matchesType && matchesMod;
  });

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await addSession({
      type: sessionType,
      moduleCode,
      title: title.trim(),
      day,
      time: time.trim(),
      room: room.trim(),
      group: group.trim(),
      instructor: instructor.trim(),
    });
    setTitle('');
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{heading}</h1>
            <p className="text-xs text-slate-500">
              {filtered.length} {heading}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-600 focus:outline-none"
          >
            <option value="ALL">All Modules</option>
            {modules.map((m) => (
              <option key={m.code} value={m.code}>
                {m.code}
              </option>
            ))}
          </select>

          {canManage && (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              <Plus className="h-4 w-4" />
              {t.addSession}
            </button>
          )}
        </div>
      </div>

      {showForm && canManage && (
        <form
          onSubmit={handleCreate}
          className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 sm:grid-cols-3"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700">Module</label>
            <select
              value={moduleCode}
              onChange={(e) => setModuleCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            >
              {modules.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.code}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Session topic"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Day</label>
            <input
              type="text"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">{t.room}</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">{t.group}</label>
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div className="sm:col-span-2 flex items-end justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((ses) => {
          const isCancelled = ses.status === 'cancelled';
          return (
            <div
              key={ses.id}
              className={`rounded-2xl border p-5 shadow-xs ${
                isCancelled
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {ses.moduleCode} • {ses.type}
                  </span>
                  <h2 className="mt-2 text-base font-bold text-slate-900">{ses.title}</h2>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isCancelled
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {isCancelled ? (
                    <Ban className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5" />
                  )}
                  {isCancelled ? t.cancelled : t.scheduled}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">{ses.day}</span> • {ses.time}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{t.room}:</span> {ses.room}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{t.group}:</span> {ses.group}
                </div>
                <div>{ses.instructor}</div>
              </div>

              {canManage && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => toggleSessionStatus(ses.id)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {t.toggleCancel}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}