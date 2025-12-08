import { useState } from 'react'
import Login from './components/Login'
import DashboardLayout from './components/DashboardLayout'
import EmployeeDashboard from './components/EmployeeDashboard'
import ManagerDashboard from './components/ManagerDashboard'
import OrganizationDashboard from './components/OrganizationDashboard'
import type { User } from './types/user'
import { UserRole } from './types/user'
import { mockUsers } from './lib/mockData'
import { useUser } from './hooks/useUser'

export default function App() {
  const [userId] = useState<number>(1)
  const authToken = null

  const { data: user, isLoading, isError, error, refetch } = useUser(userId, authToken)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleLogin = (email: string, role: UserRole) => {
    // Find user by email or create a mock user
    const user = mockUsers.find((u) => u.email === email) || mockUsers.find((u) => u.role === role)

    if (user) {
      setCurrentUser(user)
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  if (!isLoggedIn || !currentUser) {
    return <Login onLogin={handleLogin} />
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case UserRole.ORGANIZATION:
        return <OrganizationDashboard user={currentUser} />
      case UserRole.MANAGER:
        return <ManagerDashboard user={currentUser} />
      case UserRole.EMPLOYEE:
        return user ? <EmployeeDashboard user={user} /> : <p>Loading...</p>
      default:
        return user ? <EmployeeDashboard user={user} /> : <p>Loading...</p>
    }
  }

  return (
    <DashboardLayout
      userRole={currentUser.role}
      userName={`${currentUser.first_name} ${currentUser.last_name}`}
      userEmail={currentUser.email}
      onLogout={handleLogout}
    >
      {renderDashboard()}
    </DashboardLayout>
  )
}
