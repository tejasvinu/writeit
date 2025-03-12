'use client'

import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration issues
  if (!mounted) {
    return null
  }

  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch session when window is focused
    >
      {children}
    </SessionProvider>
  )
}