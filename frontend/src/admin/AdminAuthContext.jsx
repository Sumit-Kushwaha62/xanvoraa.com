import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { API_ENDPOINTS } from '../config/api'
const AdminAuthContext = createContext(null)
async function json(response) { const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message || 'Request failed'); return data }
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const checkSession = useCallback(async () => {
    setAuthLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.admin.me, { credentials: 'include' })
      if (response.status === 401) { setAdmin(null); return null }
      const data = await json(response); setAdmin(data); return data
    } catch (error) { console.error('Admin session check failed:', error); setAdmin(null); return null }
    finally { setAuthLoading(false) }
  }, [])
  useEffect(() => {
    const timer = window.setTimeout(() => { void checkSession() }, 0)
    return () => window.clearTimeout(timer)
  }, [checkSession])
  const login = useCallback(async (email, password) => {
    const response = await fetch(API_ENDPOINTS.admin.login, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await json(response); setAdmin(data.admin); return data.admin
  }, [])
  const logout = useCallback(async () => { try { await fetch(API_ENDPOINTS.admin.logout, { method: 'POST', credentials: 'include' }) } finally { setAdmin(null) } }, [])
  const value = useMemo(() => ({ admin, authLoading, checkSession, login, logout }), [admin, authLoading, checkSession, login, logout])
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth() { const value = useContext(AdminAuthContext); if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider'); return value }
