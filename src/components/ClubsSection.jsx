import React, { useState } from 'react';
import {
  Users,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Megaphone,
  Images,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function resolveLocalizedText(val, language, fallback = '') {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  return val[language] || val.en || val.fr || val.ar || Object.values(val)[0] || fallback;
}

export default function ClubsSection() {
  const { language, isRTL, t, clubs, clubRequests, submitClubJoinRequest, currentUser } = useApp();
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [submittingClubId, setSubmittingClubId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const selectedClub = clubs.find((c) => c.id === selectedClubId) || null;

  function getClubDisplayName(club) {
    return resolveLocalizedText(club?.name, language, 'Club');
  }

  function getClubDisplayDescription(club) {
    return resolveLocalizedText(club?.description, language, '');
  }

  function getLatestRequestForClub(clubId) {
    const matches = (clubRequests || []).filter((r) => String(r.clubId) === String(clubId));
    if (currentUser) {
      const userMatches = matches.filter(
        (r) =>
          (r.requesterUsername && r.requesterUsername === currentUser.username) ||
          (r.requesterEmail && r.requesterEmail === currentUser.email) ||
          r.requesterName === currentUser.fullName
      );
      if (userMatches.length > 0) return userMatches[0];
    }
    return matches[0] || null;
  }

  async function handleJoinClick(e, club) {
    e.stopPropagation();
    if (!club) return;

    const existingReq = getLatestRequestForClub(club.id);
    if (existingReq?.status === 'pending' || existingReq?.status === 'approved') {
      return;
    }

    setSubmittingClubId(club.id);
    setFeedbackMsg('');
    await submitClubJoinRequest(
      {
        id: club.id,
        name: getClubDisplayName(club),
      },
      noteInput.trim()
    );
    setSubmittingClubId(null);
    setNoteInput('');
    setFeedbackMsg(getClubDisplayName(club));
  }

  function renderRequestBadge(clubId) {
    const req = getLatestRequestForClub(clubId);
    if (!req) return null;

    if (req.status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approved
        </span>
      );
    }

    if (req.status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
          <XCircle className="h-3.5 w-3.5" />
          Denied
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
        <Clock className="h-3.5 w-3.5" />
        Pending Admin Approval
      </span>
    );
  }

  function renderJoinButton(e, club) {
    const req = getLatestRequestForClub(club.id);
    const isApproved = req?.status === 'approved';
    const isPending = req?.status === 'pending';
    const isBusy = submittingClubId === club.id;

    return (
      <button
        type="button"
        disabled={isApproved || isPending || isBusy}
        onClick={(ev) => handleJoinClick(e || ev, club)}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
          isApproved
            ? 'cursor-default bg-emerald-100 text-emerald-800'
            : isPending
            ? 'cursor-default bg-amber-100 text-amber-800'
            : 'bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-60'
        }`}
      >
        <UserPlus className="h-3.5 w-3.5" />
        {isApproved
          ? 'Joined'
          : isPending
          ? 'Request Sent'
          : isBusy
          ? 'Sending...'
          : 'Request to Join'}
      </button>
    );
  }

  if (selectedClub) {
    const membersList = Array.isArray(selectedClub.members) ? [...selectedClub.members] : [];
    const approvedMembers = (clubRequests || [])
      .filter((r) => String(r.clubId) === String(selectedClub.id) && r.status === 'approved')
      .map((r) => r.requesterName);
    approvedMembers.forEach((name) => {
      if (name && !membersList.includes(name)) membersList.push(name);
    });

    const eventsList = Array.isArray(selectedClub.events) ? selectedClub.events : [];
    const announcementsList = Array.isArray(selectedClub.announcements)
      ? selectedClub.announcements
      : [];

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedClubId(null);
                setFeedbackMsg('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <BackIcon className="h-3.5 w-3.5" />
              {t.backToClubs}
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {renderRequestBadge(selectedClub.id)}
              {renderJoinButton(null, selectedClub)}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              {selectedClub.tag && (
                <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                  {selectedClub.tag}
                </span>
              )}
              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                {getClubDisplayName(selectedClub)}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
                {getClubDisplayDescription(selectedClub)}
              </p>
              {selectedClub.leader && (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Leader: <span className="font-semibold text-slate-700">{selectedClub.leader}</span>
                </p>
              )}
            </div>

            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-3">
              <label className="block text-[11px] font-semibold text-slate-600">
                Optional note for Admin
              </label>
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Why do you want to join?"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {feedbackMsg && (
            <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
              Join request submitted for {feedbackMsg}. Waiting for Admin approval.
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Users className="h-4 w-4 text-purple-700" />
              {t.members}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              {membersList.length > 0 ? (
                membersList.map((member, idx) => (
                  <li key={idx} className="rounded-lg bg-slate-50 px-3 py-2">
                    {member}
                  </li>
                ))
              ) : (
                <li className="rounded-lg bg-slate-50 px-3 py-2 text-slate-400">No members listed yet</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Calendar className="h-4 w-4 text-emerald-700" />
              {t.events}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              {eventsList.length > 0 ? (
                eventsList.map((ev, idx) => (
                  <li key={idx} className="rounded-lg bg-emerald-50/50 px-3 py-2">
                    {ev}
                  </li>
                ))
              ) : (
                <li className="rounded-lg bg-emerald-50/50 px-3 py-2 text-slate-400">No events listed yet</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Megaphone className="h-4 w-4 text-amber-700" />
              {t.announcements}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              {announcementsList.length > 0 ? (
                announcementsList.map((ann, idx) => (
                  <li key={idx} className="rounded-lg bg-amber-50/50 px-3 py-2">
                    {ann}
                  </li>
                ))
              ) : (
                <li className="rounded-lg bg-amber-50/50 px-3 py-2 text-slate-400">No announcements yet</li>
              )}
            </ul>
          </div>
        </div>

        {Array.isArray(selectedClub.photos) && selectedClub.photos.length > 0 && (
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
                  alt={getClubDisplayName(selectedClub)}
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

      {feedbackMsg && (
        <div className="rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
          Join request submitted for {feedbackMsg}. Waiting for Admin approval.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {clubs.map((club) => {
          const membersCount = Array.isArray(club.members) ? club.members.length : 0;
          const eventsCount = Array.isArray(club.events) ? club.events.length : 0;

          return (
            <div
              key={club.id}
              onClick={() => setSelectedClubId(club.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedClubId(club.id);
              }}
              className="flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  {club.tag ? (
                    <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                      {club.tag}
                    </span>
                  ) : (
                    <span />
                  )}
                  {renderRequestBadge(club.id)}
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {getClubDisplayName(club)}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {getClubDisplayDescription(club)}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span>
                    {membersCount} {t.members}
                  </span>
                  <span>•</span>
                  <span>
                    {eventsCount} {t.events}
                  </span>
                </div>

                {renderJoinButton(null, club)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}