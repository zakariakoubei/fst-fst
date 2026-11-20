import React, { useState } from 'react';
import { Users, ArrowLeft, ArrowRight, Calendar, Megaphone, Images } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ClubsSection() {
  const { language, isRTL, t, clubs } = useApp();
  const [selectedClubId, setSelectedClubId] = useState(null);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const selectedClub = clubs.find((c) => c.id === selectedClubId) || null;

  if (selectedClub) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <button
            type="button"
            onClick={() => setSelectedClubId(null)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <BackIcon className="h-3.5 w-3.5" />
            {t.backToClubs}
          </button>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                {selectedClub.tag}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                {selectedClub.name[language] || selectedClub.name.en}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
                {selectedClub.description[language] || selectedClub.description.en}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Users className="h-4 w-4 text-purple-700" />
              {t.members}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              {selectedClub.members.map((member, idx) => (
                <li key={idx} className="rounded-lg bg-slate-50 px-3 py-2">
                  {member}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Calendar className="h-4 w-4 text-emerald-700" />
              {t.events}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              {selectedClub.events.map((ev, idx) => (
                <li key={idx} className="rounded-lg bg-emerald-50/50 px-3 py-2">
                  {ev}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Megaphone className="h-4 w-4 text-amber-700" />
              {t.announcements}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              {selectedClub.announcements.map((ann, idx) => (
                <li key={idx} className="rounded-lg bg-amber-50/50 px-3 py-2">
                  {ann}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selectedClub.photos?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Images className="h-4 w-4 text-teal-700" />
              {t.clubGallery}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedClub.photos.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={selectedClub.name[language] || selectedClub.name.en}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
          <Users className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t.universityClubs}</h1>
          <p className="text-xs text-slate-500">{clubs.length} active clubs</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {clubs.map((club) => (
          <div
            key={club.id}
            onClick={() => setSelectedClubId(club.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedClubId(club.id);
            }}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
          >
            <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
              {club.tag}
            </span>
            <h2 className="mt-3 text-lg font-bold text-slate-900">
              {club.name[language] || club.name.en}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              {club.description[language] || club.description.en}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
              <span>{club.members.length} {t.members}</span>
              <span>•</span>
              <span>{club.events.length} {t.events}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}