import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import { Helmet } from 'react-helmet-async'


export default function AdminLogin() {
  const { admin, authLoading, login } = useAdminAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!authLoading && admin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1 className="admin-login__title">Xanvoraa Admin</h1>
        <p className="admin-login__sub">Sign in to access the dashboard</p>

        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            autoComplete="username"
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="admin-btn admin-btn--primary" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
