import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import UserDashboard from '@/pages/UserDashboard'
import ManagerDashboard from '@/pages/ManagerDashboard'
import OrganizationDashboard from '@/pages/OrganizationDashboard'
import { useAuth } from '@/hooks/useAuth'

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

export const AppRoutes = () => {
  const { login } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage onLogin={login} />} />

      {/* Protected routes by role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organization"
        element={
          <ProtectedRoute allowedRoles={['organization']}>
            <OrganizationDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<div>Access Denied</div>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
