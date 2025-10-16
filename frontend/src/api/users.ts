import { api } from '@/lib/http'
import type { User } from '@/types/user'

export const getUser = (userId: number) => api<User>(`/users/${userId}`)