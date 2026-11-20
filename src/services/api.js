import { API_BASE_URL } from '../config/siteConfig';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export const api = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getStudents: () => request('/students'),

  createStudent: (payload) =>
    request('/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateStudentPassword: (studentId, password) =>
    request(`/students/${studentId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password }),
    }),

  updateStudent: (studentId, payload) =>
    request(`/students/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteStudent: (studentId) =>
    request(`/students/${studentId}`, {
      method: 'DELETE',
    }),

  getGrades: () => request('/grades'),

  updateGrade: (gradeId, payload) =>
    request(`/grades/${gradeId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getSessions: () => request('/sessions'),

  createSession: (payload) =>
    request('/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  toggleSession: (sessionId) =>
    request(`/sessions/${sessionId}/toggle`, {
      method: 'PATCH',
    }),

  getTimetable: () => request('/timetable'),

  createTimetableEntry: (payload) =>
    request('/timetable', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};