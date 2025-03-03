'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// A client component that safely uses useSearchParams
function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/documents'
  
  // Animation for typewriter effect
  const [displayText, setDisplayText] = useState("")
  const fullText = "Welcome back to your writing journey."
  const [isFocused, setIsFocused] = useState<string | null>(null)
  
  // Immediate redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      window.location.href = '/documents'
    }
  }, [status])
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return <SignInSkeleton />
  }
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.substring(0, i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 90);
    
    return () => clearInterval(typing);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      } else if (result?.ok) {
        // Use a timeout to ensure the session is properly established
        setTimeout(() => {
          window.location.href = '/documents'
        }, 100)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-stone-100 to-white overflow-hidden">
      {/* Floating paper elements */}
      <div className="hidden md:block fixed z-0 w-full h-full overflow-hidden">
        <div className="animate-paper-float absolute top-1/4 left-[30%]">
          <div className="w-16 h-20 bg-white shadow-md rounded-sm opacity-30 rotate-12"></div>
        </div>
        <div className="animate-paper-float-slow absolute bottom-1/3 right-[10%]">
          <div className="w-20 h-24 bg-white shadow-md rounded-sm opacity-20 -rotate-6"></div>
        </div>
        <div className="animate-float-delayed absolute top-1/3 right-[15%] opacity-20">
          <svg className="w-20 h-20 text-amber-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
      </div>
      
      {/* Left panel - Only visible on md+ screens */}
      <div className="hidden md:flex md:w-1/2 bg-amber-800 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/paper.svg')] bg-repeat"></div>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="mb-8 flex items-center justify-center">
            <svg className="w-12 h-12 text-amber-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-serif mb-6 text-center">WriteIt</h2>
          <p className="text-xl font-serif mb-8 text-amber-100 text-center">"Words are a lens to focus one's mind."<br/>— Ayn Rand</p>
          
          <div className="mt-12 p-6 bg-amber-900/30 rounded-lg border border-amber-700/30 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-3">Why Writers Choose Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-300 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-100">Beautiful, distraction-free writing environment</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-300 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-100">Seamless chapter organization & tracking</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-amber-300 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-100">Automatic cloud backups of your work</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right panel / Main content on mobile */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/paper.svg')] bg-repeat"></div>
        </div>
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center">
            <div className="md:hidden mb-8">
              <svg className="w-12 h-12 text-amber-800 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-serif tracking-tight text-gray-900">Sign in</h2>
            <p className="mt-3 text-gray-600 h-6">
              {displayText}<span className={displayText.length === fullText.length ? 'hidden' : 'animate-blink'}>|</span>
            </p>
          </div>
          
          <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused('email')}
                      onBlur={() => setIsFocused(null)}
                      className={`appearance-none block w-full px-3 py-2 border ${isFocused === 'email' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all duration-200`}
                      placeholder="you@example.com"
                    />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isFocused === 'email' || email ? 'opacity-100' : 'opacity-0'}`}>
                      <span className="animate-blink text-amber-600 font-mono">|</span>
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocused('password')}
                      onBlur={() => setIsFocused(null)}
                      className={`appearance-none block w-full px-3 py-2 border ${isFocused === 'password' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all duration-200`}
                      placeholder="••••••••"
                    />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isFocused === 'password' || password ? 'opacity-100' : 'opacity-0'}`}>
                      <span className="animate-blink text-amber-600 font-mono">|</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-700 hover:text-amber-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in <span className="animate-blink ml-1 font-mono">|</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-amber-700 hover:text-amber-500 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading fallback
function SignInSkeleton() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-stone-100 to-white">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-amber-700 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading sign-in page...</p>
      </div>
    </div>
  )
}

// This is the main component that gets exported from the page
export default function SignIn() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInForm />
    </Suspense>
  )
}