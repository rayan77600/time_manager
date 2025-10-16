import { useQuery } from '@tanstack/react-query'
import { getUser } from '@/api/users'
import type { User } from '@/types/user'

export function useUser(userId: number) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId, // Do not run until userId is valid
  })
}
