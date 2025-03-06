'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import DarkModeToggle from './DarkModeToggle'

export default function NavBar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-surface-elevated/95 backdrop-blur-md shadow-md border-b border-accent-subtle dark:border-gray-700' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/"
              className="flex items-center px-2 text-xl font-serif text-foreground group transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className="relative">
                <svg 
                  className={`h-8 w-8 mr-2 transition-all duration-500 ${hovered ? 'text-primary-light animate-float-slow' : 'text-primary'}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={hovered ? 2 : 1.5} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary via-primary-light to-primary transition-all duration-300 group-hover:w-full"></span>
              </div>
              <span className="relative overflow-hidden">
                <span className="transition-all duration-300 group-hover:text-primary">Write</span>
                <span className="transition-all duration-300 group-hover:text-primary-light">It</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-light to-transparent transform translate-y-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></span>
              </span>
            </Link>
            {session && (
              <div className="ml-6 flex space-x-4">
                <Link
                  href="/documents"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    pathname === '/documents'
                      ? 'text-primary-dark bg-primary-subtle dark:text-primary-light shadow-inner border border-primary-light/20 transform hover:scale-105'
                      : 'text-foreground-muted hover:text-primary-dark dark:hover:text-primary-light hover:bg-primary-subtle hover:shadow-sm hover:border hover:border-primary-light/20 hover:scale-105'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 transition-all duration-300 ${pathname === '/documents' ? 'text-primary' : 'text-foreground-muted group-hover:text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={pathname === '/documents' ? 2.5 : 2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Documents
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-primary font-medium bg-gradient-to-r from-primary-subtle to-accent-subtle dark:from-primary-subtle/30 dark:to-accent-subtle/30 px-3 py-1.5 rounded-lg border border-primary-light/20 shadow-sm animate-pulse-subtle">
                  <span className="relative group">
                    {session.user?.name || session.user?.email}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-light/50 to-transparent transform translate-y-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></span>
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:text-primary-dark dark:hover:text-primary-light hover:bg-primary-subtle transition-all duration-300 hover:shadow-sm hover:border hover:border-primary-light/20 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-primary-subtle to-accent-subtle dark:from-primary-subtle/30 dark:to-accent-subtle/30 transition-all duration-300 group-hover:w-full"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 relative transition-all duration-300 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-primary-dark dark:text-primary-light border border-primary-light/30 hover:border-primary-light/50 transition-all duration-300 relative overflow-hidden group hover:shadow-md"
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-primary-subtle to-accent-subtle dark:from-primary-subtle/30 dark:to-accent-subtle/30 transition-all duration-300 group-hover:w-full"></div>
                  <span className="relative">Sign Up</span>
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-3/4 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 relative animate-pulse-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative">Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}