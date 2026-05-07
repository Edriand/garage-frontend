'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth'
import { configureAmplify } from '@/lib/amplify'
import { useRouter } from 'next/navigation'

interface AuthUser {
  username: string
  userId: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_COOKIE = 'garage-auth-session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function setAuthCookie() {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${AUTH_COOKIE}=1; path=/; SameSite=Strict; max-age=${COOKIE_MAX_AGE}${secure}`
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    configureAmplify()
    try {
      const current = await getCurrentUser()
      setUser({ username: current.username, userId: current.userId })
      setAuthCookie()
    } catch {
      setUser(null)
      clearAuthCookie()
    } finally {
      setIsLoading(false)
    }
  }

  async function signOut() {
    try {
      await amplifySignOut()
    } finally {
      clearAuthCookie()
      setUser(null)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
