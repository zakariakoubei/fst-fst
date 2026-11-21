import React from 'react';
import { UserCircle, LogIn, LogOut, Shield, Mail, Hash, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AccountSection() {
  const { t, currentUser, setIsLoginModalOpen, logout } = useApp();

  if (!currentUser) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          <UserCircle className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">{t.personalAccount}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {t.authRequiredDesc}
        </p>
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <LogIn className="h-4 w-4" />
          {t.signInBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <UserCircle className="h-8 w-8" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.fullName}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <Shield className="h-3 w-3" />
                {currentUser.role}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">@{currentUser.username}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4" />
          {t.logout}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Mail className="h-4 w-4 text-emerald-700" />
            Email
          </div>
          <div className="mt-1.5 truncate text-sm font-bold text-slate-900">
            {currentUser.email || '—'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Hash className="h-4 w-4 text-emerald-700" />
            Apogee / ID
          </div>
          <div className="mt-1.5 text-sm font-bold text-slate-900">
            {currentUser.apogee || currentUser.id}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Layers className="h-4 w-4 text-emerald-700" />
            Filière / Group
          </div>
          <div className="mt-1.5 text-sm font-bold text-slate-900">
            {[currentUser.filiere, currentUser.groupName].filter(Boolean).join(' • ') || '—'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">{t.status}</div>
          <div className="mt-1.5 text-sm font-bold capitalize text-emerald-700">
            {currentUser.status || 'active'}
          </div>
        </div>
      </div>
    </div>
  );
}