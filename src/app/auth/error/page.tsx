'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const errorMessage = searchParams?.get('error')
    if (errorMessage) {
      switch (errorMessage) {
        case 'Signin':
          setError('Try signing in with a different account.')
          break
        case 'OAuthSignin':
          setError('Try signing in with a different provider.')
          break
        case 'OAuthCallback':
          setError('Try signing in with a different account.')
          break
        case 'OAuthCreateAccount':
          setError('Try signing in with a different account.')
          break
        case 'EmailCreateAccount':
          setError('Try signing in with a different email address.')
          break
        case 'Callback':
          setError('Try signing in with a different account.')
          break
        case 'InvalidCredentials':
          setError('Invalid email or password.')
          break
        case 'default':
          setError('Unable to sign in.')
          break
        default:
          setError('An unexpected error occurred.')
          break
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background-soft px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-xl shadow-xl border border-accent-subtle">
        <div>
          <h2 className="text-2xl font-bold text-foreground text-center">Authentication Error</h2>
          <p className="mt-2 text-foreground-muted text-center">{error}</p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link 
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-accent-subtle rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-accent-subtle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )