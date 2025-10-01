'use client'

import { createContext, useContext, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/axios'
import Cookies from 'js-cookie'

const AuthContext = createContext({} as ReturnType<typeof useAuth>)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`
    }
  }, [])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)