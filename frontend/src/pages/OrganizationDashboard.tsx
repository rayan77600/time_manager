import { Navigate } from 'react-router-dom'
import OrganizationDashboardView from '@/components/OrganizationDashboard'
import { useAuth } from '@/hooks/useAuth'

export default function OrganizationDashboardPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      <OrganizationDashboardView user={user} onLogout={logout} />
    </div>
  )
}
