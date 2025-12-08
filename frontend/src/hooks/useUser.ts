import { useEffect, useState, useCallback } from 'react'
import { getUserById } from '@/services/userService'
import type { User } from '@/types/user'

interface UseUserResult {
  data: User | null
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

export function useUser(userId: number, authToken?: string | null): UseUserResult {
  const [data, setData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)

  // simple version; re-run when userId or authToken changes
  const load = useCallback(async () => {
    if (userId == null) return // defensive

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const team = await getUserById(userId, authToken)
      setData(team)
    } catch (err) {
      console.error('Failed to fetch team:', err)
      setIsError(true)
      setError(err)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [userId, authToken])

  useEffect(() => {
    load()
  }, [load])

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: load,
  }
}
