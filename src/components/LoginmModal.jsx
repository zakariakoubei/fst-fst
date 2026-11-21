import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginModal() {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    t,
    demoCredentials,
    siteConfig,
    language,
  } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await login(username.trim(), password);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || t.invalidCredentials);
    } else {
      setUsername('');
      setPassword('');
    }
  }

  function fillDemo(cred) {
    setUsername(cred.username);
    setPassword(cred.password);
    setError('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {siteConfig.shortName[language] || siteConfig.shortName.en}
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{t.login}</h2>
            <p className="mt-1 text-xs text-slate-500">{t.authRequiredDesc}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              {t.username}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="youssef.mansouri"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              {t.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {submitting ? '...' : t.signInBtn}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-500">{t.demoAccounts}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {demoCredentials.map((cred) => (
              <button
                key={cred.username}
                type="button"
                onClick={() => fillDemo(cred)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-start text-xs transition hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                <span className="truncate">
                  <span className="block font-semibold text-slate-800">
                    {cred.roleLabel}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {cred.username}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}