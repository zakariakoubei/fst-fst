import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TimetableSection() {
  const { t, modules, timetable, hasPermission, addTimetableEntry } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('08:30 - 10:15');
  const [moduleCode, setModuleCode] = useState(modules[0]?.code || 'INF301');
  const [sessionType, setSessionType] = useState('Cours');
  const [room, setRoom] = useState('Amphi A');
  const [group, setGroup] = useState('All MIP');
  const [instructor, setInstructor] = useState('Pr. Karim Bennani');

  const canManage = hasPermission('manage_assigned_timetable');

  async function handleAdd(e) {
    e.preventDefault();
    await addTimetableEntry({
      day,
      time: time.trim(),
      moduleCode,
      sessionType,
      room: room.trim(),
      group: group.trim(),
      instructor: instructor.trim(),
    });
    setShowForm(false);
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
            <p className="text-xs text-slate-500">{timetable.length} slots</p>
          </div>
        </div>

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

      {showForm && canManage && (
        <form
          onSubmit={handleAdd}
          className="grid gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 sm:grid-cols-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700">Day</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
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
              {modules.map((m) => (
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {timetable.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-semibold text-slate-900">{row.day}</td>
                <td className="px-4 py-3 text-slate-700">{row.time}</td>
                <td className="px-4 py-3 font-bold text-emerald-700">{row.moduleCode}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                    {row.sessionType}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{row.room}</td>
                <td className="px-4 py-3 text-slate-700">{row.group}</td>
                <td className="px-4 py-3 text-slate-600">{row.instructor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}