'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Literary quotes that will rotate randomly for a surprise element
const LITERARY_QUOTES = [
  { text: "The first draft is just you telling yourself the story.", author: "Terry Pratchett" },
  { text: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour" },
  { text: "You can always edit a bad page. You can't edit a blank page.", author: "Jodi Picoult" },
  { text: "If there's a book that you want to read, but it hasn't been written yet, then you must write it.", author: "Toni Morrison" },
  { text: "Writing is an exploration. You start from nothing and learn as you go.", author: "E. L. Doctorow" },
  { text: "Every secret of a writer's soul, every experience of his life, every quality of his mind, is written large in his works.", author: "Virginia Woolf" },
  { text: "A word after a word after a word is power.", author: "Margaret Atwood" },
  { text: "To write is to take notes on your life.", author: "Anne Sexton" }
]

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Animation states
  const [displayTitle, setDisplayTitle] = useState("")
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [randomQuote, setRandomQuote] = useState({ text: "", author: "" })
  const [showQuote, setShowQuote] = useState(false)
  const [pageFlip, setPageFlip] = useState(false)

  useEffect(() => {
    // Typewriter effect for title
    const fullTitle = "Begin Your Writing Journey"
    let i = 0
    const typing = setInterval(() => {
      if (i <= fullTitle.length) {
        setDisplayTitle(fullTitle.substring(0, i))
        i++
      } else {
        clearInterval(typing)
        // Show quote after title finishes typing
        setRandomQuote(LITERARY_QUOTES[Math.floor(Math.random() * LITERARY_QUOTES.length)])
        setTimeout(() => setShowQuote(true), 500)
      }
    }, 80)
    
    return () => clearInterval(typing)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setPageFlip(true) // Trigger page flip animation
    
    // Add a small delay to show the page flip animation before submission
    setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
        
        setIsBookOpen(true) // Trigger book opening animation
        setTimeout(() => {
          router.push('/auth/signin')
        }, 1000) // Delay navigation to show animation
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
        setPageFlip(false) // Reset animation on error
      } finally {
        if (!isBookOpen) {
          setIsLoading(false)
        }
      }
    }, 400)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-100 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden relative flex items-center justify-center">
      {/* Background Texture - Subtle Paper */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
      
      {/* Floating elements */}
      <div className="fixed z-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="animate-float absolute top-10 left-[5%] opacity-20">
          <svg className="w-12 h-12 text-amber-700 dark:text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-float-delayed absolute top-1/3 right-[15%] opacity-20">
          <svg className="w-16 h-16 text-blue-800 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-paper-float absolute top-2/3 right-[25%] opacity-10">
          <div className="w-16 h-20 bg-white dark:bg-gray-700 shadow-md rounded-sm rotate-12"></div>
        </div>
        <div className="animate-float-slow absolute bottom-1/3 left-[10%] opacity-20">
          <div className="w-20 h-24 bg-white dark:bg-gray-700 shadow-md rounded-sm -rotate-6"></div>
        </div>
        <div className="animate-float absolute top-[20%] left-[80%] opacity-10">
          <svg className="w-10 h-10 text-amber-600 dark:text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
        </div>
        <div className="animate-paper-float-slow absolute top-[70%] right-[5%] opacity-15">
          <div className="w-14 h-18 bg-white dark:bg-gray-700 shadow-md rounded-sm rotate-45"></div>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left side - Book cover with inspiration */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 px-4">
          <div className="relative mx-auto max-w-lg">
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 dark:from-amber-600 dark:to-amber-800 p-8 rounded-lg shadow-2xl">
              <h1 className="font-serif text-4xl text-amber-100 mb-4">{displayTitle}<span className={displayTitle.length < 17 ? 'animate-blink' : 'hidden'}>|</span></h1>
              
              <div className="w-24 h-1 bg-amber-300 rounded-full my-6"></div>
              
              {/* Literary quote */}
              <div className={`transition-opacity duration-700 ${showQuote ? 'opacity-100' : 'opacity-0'}`}>
                {randomQuote.text && (
                  <div className="mt-6 p-6 bg-amber-800/30 rounded-lg border border-amber-700/30">
                    <p className="text-xl italic text-amber-100">"{randomQuote.text}"</p>
                    <p className="text-amber-200 text-sm mt-3 text-right">— {randomQuote.author}</p>
                  </div>
                )}
              </div>
              
              {/* Book binding details */}
              <div className="absolute top-0 bottom-0 right-0 w-6 bg-amber-900 dark:bg-amber-800 rounded-r-lg"></div>
              <div className="absolute top-0 left-6 right-6 h-1 bg-amber-500/30"></div>
              <div className="absolute bottom-0 left-6 right-6 h-2 bg-amber-900/50 dark:bg-amber-800/50"></div>
            </div>
            
            {/* Book shadows */}
            <div className="absolute -bottom-3 -right-3 left-3 top-3 bg-amber-900/20 dark:bg-amber-700/20 rounded-lg -z-10"></div>
            <div className="absolute -bottom-6 -right-6 left-6 top-6 bg-amber-900/10 dark:bg-amber-700/10 rounded-lg -z-20"></div>
          </div>
        </div>
        
        {/* Right side - Sign-up form */}
        <div className="w-full md:w-1/2 px-4">
          <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-amber-100/50 dark:border-amber-700/20 transition-all duration-500 transform ${pageFlip ? 'scale-95' : ''} ${isBookOpen ? 'opacity-0' : ''}`}>
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif text-amber-800 dark:text-amber-200">Create Your Account</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Start your writing journey today</p>
              </div>
              
              {/* Form with improved interaction */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md
                    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="••••••••••"
                    required
                  />
                </div>
                
                {error && (
                  <div className="px-4 py-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-medium rounded-md 
                  hover:from-amber-600 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 
                  transition-all disabled:opacity-70 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                        <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      <span>Create Your Account</span>
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                <Link href="/auth/signin" className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium">
                  Sign in to continue
                </Link>
              </div>
              
              <div className="relative mt-8 text-center">
                <hr className="border-t border-gray-200 dark:border-gray-700" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 text-xs text-gray-500 dark:text-gray-400">
                  OR CONTINUE WITH
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button 
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                  shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 
                  transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Google
                </button>
                <button 
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                  shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 
                  transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
            
            {/* Page turning effect */}
            <div className={`absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm pointer-events-none transition-opacity duration-500 ${pageFlip ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-amber-800 dark:text-amber-300 animate-pulse font-serif text-xl">Creating your account...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Book opening animation container - appears after successful signup */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${isBookOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-80 h-96 perspective-1000">
          <div className="absolute inset-0 bg-amber-700 rounded-lg transform origin-left animate-book-open-left"></div>
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg transform origin-right animate-book-open-right flex items-center justify-center">
            <div className="text-amber-800 dark:text-amber-300 font-serif text-2xl animate-fade-in-delayed text-center px-8">
              Account created successfully!
              <div className="mt-4 w-8 h-8 mx-auto border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}