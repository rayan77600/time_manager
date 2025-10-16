import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserRole = 'user' | 'manager' | 'organization'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - replace with real API call
        let role: UserRole = 'user'

        if (email.includes('manager')) {
          role = 'manager'
        } else if (email.includes('admin') || email.includes('org')) {
          role = 'organization'
        }

        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email,
          role,
          department:
            role === 'organization'
              ? 'All Departments'
              : role === 'manager'
                ? 'Operations'
                : 'Retail Banking',
        }

        set({ user, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)