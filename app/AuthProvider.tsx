'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSession, supabase } from '@/lib/auth'

const AuthContext = createContext<{ user: any | null; loading: boolean }>({
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const setUpAuth = async () => {
      const session = await getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => {
        authListener.subscription.unsubscribe()
      }
    }

    setUpAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

