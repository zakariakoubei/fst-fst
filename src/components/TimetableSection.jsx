import React, { useEffect, useState } from 'react';
import { Calendar, Pencil, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableSection() {
  const {
    t,
    modules,
    timetable,
    currentUser,
    hasPermission,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
  } = useApp();

  const safeModules = Array.isArray(modules) ? modules : [];
  const safeTimetable = Array.isArray(timetable) ? timetable : [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('08:30 - 10:15');
  const [moduleCode, setModuleCode] = useState(safeModules[0]?.code || 'INF301');
  const [sessionType, setSessionType] = useState('Cours');
  const [room, setRoom] = useState('Amphi A');
  const [group, setGroup] = useState('All MIP');
  const [instructor, setInstructor] = useState(currentUser?.fullName || 'Pr. Karim Bennani');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editingId && !moduleCode && safeModules[0]?.code) {
      setModuleCode(safeModules[0].code);
    }
  }, [safeModules, moduleCode, editingId]);

  const canManage =
    currentUser?.role === 'prof' ||
    currentUser?.role === 'admin' ||
    (typeof hasPermission === 'function' && hasPermission('manage_assigned_timetable'));

  function resetForm() {
    setEditingId(null);
    setDay('Monday');
    setTime('08:30 - 10:15');
    setModuleCode(safeModules[0]?.code || 'INF301');
    setSessionType('Cours');
    setRoom('Amphi A');
    setGroup('All MIP');
    setInstructor(currentUser?.fullName || 'Pr. Karim Bennani');
  }

  function handleOpenCreate() {
    resetForm();
    setShowForm(true);
  }

  function handleOpenEdit(row) {
    setEditingId(row.id);
    setDay(row.day || 'Monday');
    setTime(row.time || '08:30 - 10:15');
    setModuleCode(row.moduleCode || row.module_code || safeModules[0]?.code || 'INF301');
    setSessionType(row.sessionType || row.session_type || 'Cours');
    setRoom(row.room || '');
    setGroup(row.group || row.group_name || '');
    setInstructor(row.instructor || currentUser?.fullName || '');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canManage || submitting) return;

    const payload = {
      day,
      time: time.trim(),
      moduleCode,
      module_code: moduleCode,
      sessionType,
      session_type: sessionType,
      room: room.trim(),
      group: group.trim(),
      group_name: group.trim(),
      instructor: instructor.trim(),
    };

    setSubmitting(true);
    try {
      if (editingId && typeof updateTimetableEntry === 'function') {
        await updateTimetableEntry(editingId, payload);
      } else if (typeof addTimetableEntry === 'function') {
        await addTimetableEntry(payload);
      }
      setShowForm(false);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(rowId) {
    if (!canManage || typeof deleteTimetableEntry !== 'function') return;
    await deleteTimetableEntry(rowId);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Calendar className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t.timetable}</h1>
            <p className="text-xs text-slate-500">{safeTimetable.length} slots</p>
          </div>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
          >
            <Plus className="h-4 w-4" />
            {t.addSession}
          </button>
        )}
      </div>

      {showForm && canManage && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 sm:grid-cols-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700">Day</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Time</label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Module</label>
            <select
              value={moduleCode}
              onChange={(e) => setModuleCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            >
              {safeModules.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Type</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            >
              <option value="Cours">Cours</option>
              <option value="TD">TD</option>
              <option value="TP">TP</option>
            </select>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700">Instructor</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div className="flex items-end justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {submitting ? '...' : t.saveChanges}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-start text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-start font-semibold">Day</th>
              <th className="px-4 py-3 text-start font-semibold">Time</th>
              <th className="px-4 py-3 text-start font-semibold">Module</th>
              <th className="px-4 py-3 text-start font-semibold">Type</th>
              <th className="px-4 py-3 text-start font-semibold">{t.room}</th>
              <th className="px-4 py-3 text-start font-semibold">{t.group}</th>
              <th className="px-4 py-3 text-start font-semibold">Instructor</th>
              {canManage && (
                <th className="px-4 py-3 text-end font-semibold">{t.actions || 'Actions'}</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {safeTimetable.map((row, idx) => (
              <tr key={row.id ?? idx} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{row.day}</td>
                <td className="px-4 py-3 text-slate-700">{row.time}</td>
                <td className="px-4 py-3 font-bold text-emerald-700">
                  {row.moduleCode || row.module_code}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                    {row.sessionType || row.session_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{row.room}</td>
                <td className="px-4 py-3 text-slate-700">{row.group || row.group_name}</td>
                <td className="px-4 py-3 text-slate-600">{row.instructor}</td>
                {canManage && (
                  <td className="px-4 py-3 text-end">
                    <div className="inline-flex items-center gap-1.5">
                      {typeof updateTimetableEntry === 'function' && (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {typeof deleteTimetableEntry === 'function' && (
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}