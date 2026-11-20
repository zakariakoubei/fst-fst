import React, { useState } from 'react';
import { Briefcase, UserPlus, KeyRound, RotateCcw, Trash2, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLES } from '../config/siteConfig';

export default function WorkspaceSection() {
  const {
    language,
    t,
    currentUser,
    hasPermission,
    students,
    addStudent,
    changeStudentPassword,
    resetStudentPassword,
    updateStudentAccount,
    deleteStudentAccount,
    modules,
    updateModuleFormula,
    grades,
    updateGradeEntry,
  } = useApp();

  const canManageStudents = hasPermission('manage_student_accounts');
  const canManageGrades = hasPermission('manage_assigned_grades');
  const canManageFormulas = hasPermission('manage_assigned_formulas');

  const [activeTab, setActiveTab] = useState(
    canManageStudents ? 'students' : 'grades'
  );

  // New student form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [email, setEmail] = useState('');
  const [apogee, setApogee] = useState('');
  const [filiere, setFiliere] = useState('MIP');
  const [groupName, setGroupName] = useState('G1');
  const [statusMessage, setStatusMessage] = useState('');

  // Formula editor state
  const [selectedModCode, setSelectedModCode] = useState(modules[0]?.code || 'INF301');
  const currentMod = modules.find((m) => m.code === selectedModCode) || modules[0];
  const [examWeight, setExamWeight] = useState(currentMod?.formula?.exam ?? 50);
  const [tdWeight, setTdWeight] = useState(currentMod?.formula?.td ?? 20);
  const [tpWeight, setTpWeight] = useState(currentMod?.formula?.tp ?? 20);
  const [ccWeight, setCcWeight] = useState(currentMod?.formula?.cc ?? 10);

  if (!currentUser || (!canManageStudents && !canManageGrades)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <h2 className="text-lg font-bold text-amber-900">{t.myWorkspace}</h2>
        <p className="mt-2 text-sm text-amber-800">{t.adminOnlyWarning}</p>
      </div>
    );
  }

  function handleSelectModule(code) {
    setSelectedModCode(code);
    const mod = modules.find((m) => m.code === code);
    if (mod?.formula) {
      setExamWeight(mod.formula.exam);
      setTdWeight(mod.formula.td);
      setTpWeight(mod.formula.tp);
      setCcWeight(mod.formula.cc);
    }
  }

  function handleSaveFormula(e) {
    e.preventDefault();
    if (!canManageFormulas) return;
    updateModuleFormula(selectedModCode, {
      exam: Number(examWeight),
      td: Number(tdWeight),
      tp: Number(tpWeight),
      cc: Number(ccWeight),
    });
    setStatusMessage(`${selectedModCode}: ${t.saveChanges}`);
  }

  async function handleCreateStudent(e) {
    e.preventDefault();
    if (!canManageStudents) return;
    await addStudent({
      fullName: fullName.trim(),
      username: username.trim(),
      password,
      email: email.trim(),
      apogee: apogee.trim(),
      filiere: filiere.trim(),
      groupName: groupName.trim(),
      role: ROLES.STUDENT,
      status: 'active',
    });
    setFullName('');
    setUsername('');
    setEmail('');
    setApogee('');
    setStatusMessage(`${t.addStudent}: ${t.saveChanges}`);
  }

  async function handleChangePass(student) {
    const nextPass = window.prompt(`${t.changePassword} (${student.username}):`, 'password123');
    if (!nextPass) return;
    await changeStudentPassword(student.id, nextPass);
    setStatusMessage(`${t.changePassword} (${student.username})`);
  }

  async function handleResetPass(student) {
    const tempPass = await resetStudentPassword(student.id);
    setStatusMessage(`${t.resetPassword} (${student.username}) -> ${tempPass}`);
  }

  async function handleToggleStatus(student) {
    const nextStatus = student.status === 'suspended' ? 'active' : 'suspended';
    await updateStudentAccount(student.id, { status: nextStatus });
  }

  async function handleGradeBlur(gradeId, field, value) {
    if (!canManageGrades) return;
    const num = Number(value);
    if (Number.isNaN(num)) return;
    await updateGradeEntry(gradeId, { [field]: num });
    setStatusMessage(t.saveChanges);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Briefcase className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t.myWorkspace}</h1>
            <p className="text-xs text-slate-500">
              {currentUser.fullName} • {currentUser.role}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {canManageStudents && (
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold ${
                activeTab === 'students'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.studentAccountsTab}
            </button>
          )}
          {canManageGrades && (
            <button
              type="button"
              onClick={() => setActiveTab('grades')}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold ${
                activeTab === 'grades'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.professorWorkspaceTab}
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
          {statusMessage}
        </div>
      )}

      {activeTab === 'students' && canManageStudents && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateStudent}
            className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:grid-cols-4"
          >
            <h2 className="sm:col-span-4 flex items-center gap-2 text-sm font-bold text-slate-900">
              <UserPlus className="h-4 w-4 text-emerald-700" />
              {t.addStudent}
            </h2>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.username}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={apogee}
              onChange={(e) => setApogee(e.target.value)}
              placeholder="Apogee"
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={filiere}
              onChange={(e) => setFiliere(e.target.value)}
              placeholder="Filière"
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t.group}
              className="rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              {t.addStudent}
            </button>
          </form>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-start text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">Student</th>
                  <th className="px-4 py-3 text-start font-semibold">{t.username}</th>
                  <th className="px-4 py-3 text-start font-semibold">Apogee</th>
                  <th className="px-4 py-3 text-start font-semibold">{t.status}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => (
                  <tr key={stu.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{stu.fullName}</td>
                    <td className="px-4 py-3 text-slate-600">{stu.username}</td>
                    <td className="px-4 py-3 text-slate-600">{stu.apogee || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(stu)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          stu.status === 'suspended'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {stu.status === 'suspended' ? t.suspended : t.active}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleChangePass(stu)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <KeyRound className="h-3 w-3" />
                          {t.changePassword}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPass(stu)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <RotateCcw className="h-3 w-3" />
                          {t.resetPassword}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteStudentAccount(stu.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 font-medium text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'grades' && canManageGrades && (
        <div className="space-y-6">
          {canManageFormulas && (
            <form
              onSubmit={handleSaveFormula}
              className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:grid-cols-6"
            >
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">Module</label>
                <select
                  value={selectedModCode}
                  onChange={(e) => handleSelectModule(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                >
                  {modules.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.code} — {m.name?.[language] || m.name?.en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">{t.examWeight} %</label>
                <input
                  type="number"
                  value={examWeight}
                  onChange={(e) => setExamWeight(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">{t.tdWeight} %</label>
                <input
                  type="number"
                  value={tdWeight}
                  onChange={(e) => setTdWeight(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">{t.tpWeight} %</label>
                <input
                  type="number"
                  value={tpWeight}
                  onChange={(e) => setTpWeight(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="w-full">
                  <label className="block text-xs font-semibold text-slate-700">{t.ccWeight} %</label>
                  <input
                    type="number"
                    value={ccWeight}
                    onChange={(e) => setCcWeight(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                >
                  <Save className="h-3.5 w-3.5" />
                  {t.saveChanges}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-start text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">Student ID</th>
                  <th className="px-4 py-3 text-start font-semibold">Module</th>
                  <th className="px-4 py-3 text-start font-semibold">{t.examWeight}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t.tdWeight}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t.tpWeight}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t.ccWeight}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((g) => (
                  <tr key={g.id}>
                    <td className="px-4 py-3 font-medium text-slate-800">{g.studentId}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{g.moduleCode}</td>
                    {['exam', 'td', 'tp', 'cc'].map((field) => (
                      <td key={field} className="px-4 py-3">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="20"
                          defaultValue={g[field]}
                          onBlur={(e) => handleGradeBlur(g.id, field, e.target.value)}
                          className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}