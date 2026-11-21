import React, { useState } from 'react';
import {
  UserCircle,
  LogIn,
  LogOut,
  Shield,
  Mail,
  Hash,
  Layers,
  Newspaper,
  Users,
  UserCheck,
  KeyRound,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AccountSection() {
  const {
    t,
    currentUser,
    isAdmin,
    setIsLoginModalOpen,
    logout,
    users,
    news,
    clubs,
    clubRequests,
    addUserAccount,
    updateUserAccount,
    changeUserPassword,
    deleteUserAccount,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    addClubItem,
    updateClubItem,
    deleteClubItem,
    decideClubJoinRequest,
  } = useApp();

  const [adminTab, setAdminTab] = useState('news');

  // حالة نموذج الأخبار
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().slice(0, 10),
    author: 'Admin FSTBM',
  });

  // حالة نموذج الأندية
  const [editingClubId, setEditingClubId] = useState(null);
  const [clubForm, setClubForm] = useState({
    name: '',
    description: '',
    leader: 'Admin FSTBM',
  });

  // حالة نموذج إضافة مستخدم جديد
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    password: '',
    role: 'student',
    fullName: '',
    email: '',
    apogee: '',
    filiere: 'MIP',
    groupName: 'G1',
  });

  // حالة تعديل المستخدمين وكلمات المرور
  const [userDrafts, setUserDrafts] = useState({});

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

  function handleSaveNews(e) {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.content.trim()) return;
    if (editingNewsId) {
      updateNewsItem(editingNewsId, newsForm);
      setEditingNewsId(null);
    } else {
      addNewsItem(newsForm);
    }
    setNewsForm({
      title: '',
      content: '',
      date: new Date().toISOString().slice(0, 10),
      author: currentUser.fullName || 'Admin FSTBM',
    });
  }

  function startEditNews(item) {
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title || '',
      content: item.content || '',
      date: item.date || new Date().toISOString().slice(0, 10),
      author: item.author || 'Admin FSTBM',
    });
  }

  function handleSaveClub(e) {
    e.preventDefault();
    if (!clubForm.name.trim()) return;
    if (editingClubId) {
      updateClubItem(editingClubId, clubForm);
      setEditingClubId(null);
    } else {
      addClubItem(clubForm);
    }
    setClubForm({
      name: '',
      description: '',
      leader: currentUser.fullName || 'Admin FSTBM',
    });
  }

  function startEditClub(club) {
    setEditingClubId(club.id);
    setClubForm({
      name: club.name || '',
      description: club.description || '',
      leader: club.leader || 'Admin FSTBM',
    });
  }

  function getDraftForUser(u) {
    return (
      userDrafts[u.id] || {
        fullName: u.fullName || '',
        username: u.username || '',
        role: u.role || 'student',
        email: u.email || '',
        filiere: u.filiere || '',
        groupName: u.groupName || '',
        password: u.password || '',
      }
    );
  }

  function setDraftField(u, field, value) {
    const base = getDraftForUser(u);
    setUserDrafts((prev) => ({
      ...prev,
      [u.id]: {
        ...base,
        [field]: value,
      },
    }));
  }

  function handleSaveUser(u) {
    const draft = getDraftForUser(u);
    updateUserAccount(u.id, {
      fullName: draft.fullName,
      username: draft.username,
      role: draft.role,
      email: draft.email,
      filiere: draft.filiere,
      groupName: draft.groupName,
      password: draft.password,
    });
    if (draft.password) {
      changeUserPassword(u.id, draft.password);
    }
  }

  function handleCreateUser(e) {
    e.preventDefault();
    if (!newUserForm.username.trim() || !newUserForm.password.trim()) return;
    addUserAccount({
      ...newUserForm,
      fullName: newUserForm.fullName.trim() || newUserForm.username.trim(),
    });
    setNewUserForm({
      username: '',
      password: '',
      role: 'student',
      fullName: '',
      email: '',
      apogee: '',
      filiere: 'MIP',
      groupName: 'G1',
    });
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

      {isAdmin && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Admin Control Center</h2>
              <p className="text-xs text-slate-500">
                Manage news, club names & requests, and all accounts/passwords (admin, profs, students).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAdminTab('news')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold ${
                  adminTab === 'news'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Newspaper className="h-4 w-4" />
                News ({news.length})
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('clubs')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold ${
                  adminTab === 'clubs'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Users className="h-4 w-4" />
                Clubs ({clubs.length})
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('requests')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold ${
                  adminTab === 'requests'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                Club Requests ({clubRequests.length})
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('users')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold ${
                  adminTab === 'users'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <KeyRound className="h-4 w-4" />
                Users & Passwords ({users.length})
              </button>
            </div>
          </div>

          {adminTab === 'news' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveNews} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="News title"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm((p) => ({ ...p, title: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Date (YYYY-MM-DD)"
                  value={newsForm.date}
                  onChange={(e) => setNewsForm((p) => ({ ...p, date: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <textarea
                  placeholder="News content"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm((p) => ({ ...p, content: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm md:col-span-2"
                  rows={2}
                  required
                />
                <div className="flex items-center gap-2 md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    <Plus className="h-4 w-4" />
                    {editingNewsId ? 'Update News' : 'Add News'}
                  </button>
                  {editingNewsId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNewsId(null);
                        setNewsForm({
                          title: '',
                          content: '',
                          date: new Date().toISOString().slice(0, 10),
                          author: currentUser.fullName || 'Admin FSTBM',
                        });
                      }}
                      className="rounded-xl bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-2">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-600">{item.content}</div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {item.date} • {item.author}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditNews(item)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNewsItem(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'clubs' && (
            <div className="space-y-4">
              <form onSubmit={handleSaveClub} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Club name"
                  value={clubForm.name}
                  onChange={(e) => setClubForm((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Club leader"
                  value={clubForm.leader}
                  onChange={(e) => setClubForm((p) => ({ ...p, leader: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Club description"
                  value={clubForm.description}
                  onChange={(e) => setClubForm((p) => ({ ...p, description: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                />
                <div className="flex items-center gap-2 md:col-span-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    <Plus className="h-4 w-4" />
                    {editingClubId ? 'Update Club' : 'Add Club'}
                  </button>
                  {editingClubId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingClubId(null);
                        setClubForm({
                          name: '',
                          description: '',
                          leader: currentUser.fullName || 'Admin FSTBM',
                        });
                      }}
                      className="rounded-xl bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-2">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">{club.name}</div>
                      <div className="text-xs text-slate-600">{club.description}</div>
                      <div className="mt-1 text-[11px] text-slate-400">Leader: {club.leader}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditClub(club)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Name & Info
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteClubItem(club.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'requests' && (
            <div className="space-y-2.5">
              {clubRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                  No club join requests yet.
                </div>
              ) : (
                clubRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {req.requesterName} → {req.clubName}
                      </div>
                      <div className="text-xs text-slate-600">
                        {req.requesterEmail || req.requesterUsername || req.requesterRole}
                        {req.note ? ` • ${req.note}` : ''}
                      </div>
                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : req.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decideClubJoinRequest(req.id, 'approved')}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => decideClubJoinRequest(req.id, 'rejected')}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        <X className="h-3.5 w-3.5" />
                        Deny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {adminTab === 'users' && (
            <div className="space-y-4">
              <form onSubmit={handleCreateUser} className="grid gap-2.5 rounded-xl bg-slate-50 p-4 md:grid-cols-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm((p) => ({ ...p, username: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm((p) => ({ ...p, password: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  required
                />
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm((p) => ({ ...p, role: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                >
                  <option value="admin">admin</option>
                  <option value="prof">prof</option>
                  <option value="student">student</option>
                </select>
                <div className="md:col-span-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    <Plus className="h-4 w-4" />
                    Add Account
                  </button>
                </div>
              </form>

              <div className="space-y-2.5">
                {users.map((u) => {
                  const draft = getDraftForUser(u);
                  return (
                    <div
                      key={u.id}
                      className="grid gap-2 rounded-xl border border-slate-200 p-3.5 md:grid-cols-6 md:items-center"
                    >
                      <input
                        type="text"
                        value={draft.fullName}
                        onChange={(e) => setDraftField(u, 'fullName', e.target.value)}
                        placeholder="Name"
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        value={draft.username}
                        onChange={(e) => setDraftField(u, 'username', e.target.value)}
                        placeholder="Username"
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                      />
                      <select
                        value={draft.role}
                        onChange={(e) => setDraftField(u, 'role', e.target.value)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                      >
                        <option value="admin">admin</option>
                        <option value="prof">prof</option>
                        <option value="student">student</option>
                      </select>
                      <input
                        type="text"
                        value={draft.password}
                        onChange={(e) => setDraftField(u, 'password', e.target.value)}
                        placeholder="Password"
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveUser(u)}
                        className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                      >
                        Save User
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUserAccount(u.id)}
                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}