import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { admin, authLoading } = useAdminAuth()

  if (authLoading) {
    return (
      <div className="admin-auth-loading">
        <div className="admin-spinner" />
        <p>Checking session...</p>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
