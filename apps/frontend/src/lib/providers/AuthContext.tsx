import type { User } from '@/router'
import { createContext } from 'react'
import { useContext } from 'react'
const AuthContext = createContext<User | null>(null)

export const AuthProvider = ({ children, user }: { children: React.ReactNode; user: User }) => (
  <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
)

export const useCurrentUser = () => useContext(AuthContext)!
