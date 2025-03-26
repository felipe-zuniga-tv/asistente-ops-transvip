'use client'

import { useEffect, useState } from 'react'
import { getDriverSession } from '@/lib/driver/auth'
import { DriverSession } from '@/types'

export function useSession() {
  const [session, setSession] = useState<DriverSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getDriverSession()
        setSession(session)
      } catch (error) {
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  return {
    session,
    isLoading
  }
} 