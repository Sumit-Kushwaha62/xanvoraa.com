const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const API_BASE_URL = (
  configuredApiUrl ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '')
).replace(/\/+$/, '')

export const API_ENDPOINTS = {
  contact: API_BASE_URL + '/api/forms/contact',
  career: API_BASE_URL + '/api/forms/career',
  newsletter: API_BASE_URL + '/api/forms/newsletter',
  chat: API_BASE_URL + '/api/chat',
  health: API_BASE_URL + '/api/health',
  admin: {
    login: API_BASE_URL + '/api/admin/login',
    logout: API_BASE_URL + '/api/admin/logout',
    me: API_BASE_URL + '/api/admin/me',
    changePassword: API_BASE_URL + '/api/admin/change-password',
    stats: API_BASE_URL + '/api/admin/stats',
    contacts: API_BASE_URL + '/api/admin/contacts',
    careers: API_BASE_URL + '/api/admin/careers',
    resume: filename => API_BASE_URL + '/api/admin/resumes/' + encodeURIComponent(filename),
    newsletter: API_BASE_URL + '/api/admin/newsletter',
    conversations: API_BASE_URL + '/api/admin/conversations',
    conversation: sessionId => API_BASE_URL + '/api/admin/conversations/' + encodeURIComponent(sessionId),
  },
}

export { API_BASE_URL }