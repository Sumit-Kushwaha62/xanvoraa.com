const API_BASE_URL = (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000').replace(/\/+$/, '')

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
export function getAdminHeaders() {
  const token = localStorage.getItem('xanvoraa_admin_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export async function viewResume(filename) {
  try {
    const headers = getAdminHeaders()
    const res = await fetch(API_ENDPOINTS.admin.resume(filename), {
      credentials: 'include',
      headers
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Unable to load resume')
    }
    const blob = await res.blob()
    const fileUrl = URL.createObjectURL(blob)
    window.open(fileUrl, '_blank')
  } catch (error) {
    alert(error.message)
  }
}

export async function apiFetch(url, options = {}, timeoutMs = 30_000) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The request timed out. Please try again or contact us on WhatsApp.', { cause: error })
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}
