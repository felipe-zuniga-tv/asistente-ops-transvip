'use client'

import { useEffect, useState } from 'react'
import { getSession } from '@/lib/auth'

export function useAuth() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await getSession()
      setSession(sessionData)
    }

    loadSession()
  }, [])

  return { session }
} 