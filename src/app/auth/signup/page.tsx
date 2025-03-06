'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isFocused, setIsFocused] = useState<string | null>(null)
  
  // Writing prompt state with simpler rotation
  const [currentPrompt, setCurrentPrompt] = useState<string>("")
  const writingPrompts = [
    "Unleash the stories within...",
    "Your characters are waiting...",
    "From thought to timeless tale.",
    "Craft worlds. Weave words."
  ]
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [passwordFeedback, setPasswordFeedback] = useState<string>("")

  // Rotate through writing prompts
  useEffect(() => {
    let promptIndex = 0;
    const interval = setInterval(() => {
      promptIndex = (promptIndex + 1) % writingPrompts.length;
      setCurrentPrompt(writingPrompts[promptIndex]);
    }, 5000);
    
    // Set initial prompt
    setCurrentPrompt(writingPrompts[0]);
    
    return () => clearInterval(interval);
  }, []);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    setPasswordStrength(score);
    const feedback = [
      "Begin...", "Weak", "Fair", "Good", "Strong", "Excellent"
    ][score];
    setPasswordFeedback(feedback);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
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
      router.push('/auth/signin')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-background-soft to-background dark:dark-particles">
      {/* Left panel - Clean and informative */}
      <div className="hidden md:flex md:w-1/2 bg-primary-light dark:bg-primary text-primary-foreground p-12 flex-col justify-center items-center relative">
        {/* Add subtle floating gradient circles */}
        <div className="absolute w-64 h-64 rounded-full bg-primary-light/20 blur-3xl -top-20 -left-20 animate-float-slow"></div>
        <div className="absolute w-96 h-96 rounded-full bg-primary-dark/20 blur-3xl bottom-10 -right-20 animate-float-delayed"></div>
        
        <div className="relative z-10 max-w-md">
          <div className="mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-serif mb-4 text-center text-primary-foreground">WriteIt</h2>
          <p className="text-xl font-serif text-primary-foreground text-center mb-8">
            "Fill your paper with the breathings of your heart."
          </p>
          <div className="p-6 bg-primary-dark/30 rounded-lg border border-primary-dark/30 shadow-lg dark:dark-glow dark:dark-animated-border">
            <h3 className="text-xl font-medium mb-3 text-primary-foreground">Your Writing Space</h3>
            <ul className="space-y-4">
              <li className="flex items-start text-primary-foreground">
                <svg className="w-5 h-5 text-primary-foreground mr-3 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">A distraction-free writing environment</span>
              </li>
              <li className="flex items-start text-primary-foreground">
                <svg className="w-5 h-5 text-primary-foreground mr-3 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Track progress and set writing goals</span>
              </li>
              <li className="flex items-start text-primary-foreground">
                <svg className="w-5 h-5 text-primary-foreground mr-3 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Cloud sync across all your devices</span>
              </li>
              <li className="flex items-start text-primary-foreground">
                <svg className="w-5 h-5 text-primary-foreground mr-3 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Simple, elegant writing experience</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right panel - Form focused */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background dark:dark-gradient-bg">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="md:hidden mb-6">
              <svg className="w-12 h-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-serif tracking-tight text-foreground mb-2">Start Your Journey</h2>
            <p className="mt-2 text-foreground-muted text-lg h-6 relative">
              {currentPrompt}<span className="animate-blink">|</span>
            </p>
          </div>
          
          <div className="bg-surface p-8 shadow-xl rounded-lg border border-secondary dark:dark-elevated dark:dark-card-glow transition-all duration-300 hover:shadow-lg relative">
            <div className="absolute inset-0 bg-paper-texture opacity-50 dark:opacity-20 z-0 pointer-events-none"></div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused(null)}
                    className={`appearance-none block w-full px-4 py-3 border ${isFocused === 'name' ? 'border-primary ring-2 ring-primary/20' : 'border-secondary-dark'} rounded-md shadow-sm bg-surface placeholder-foreground-muted/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200`}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused(null)}
                    className={`appearance-none block w-full px-4 py-3 border ${isFocused === 'email' ? 'border-primary ring-2 ring-primary/20' : 'border-secondary-dark'} rounded-md shadow-sm bg-surface placeholder-foreground-muted/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200`}
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused(null)}
                    className={`appearance-none block w-full px-4 py-3 border ${isFocused === 'password' ? 'border-primary ring-2 ring-primary/20' : 'border-secondary-dark'} rounded-md shadow-sm bg-surface placeholder-foreground-muted/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200`}
                    placeholder="••••••••"
                    minLength={6}
                  />
                  
                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="h-1.5 flex-1 bg-secondary-dark/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength === 0 ? 'w-0' :
                              passwordStrength === 1 ? 'w-1/5 bg-error' :
                              passwordStrength === 2 ? 'w-2/5 bg-orange-500' :
                              passwordStrength === 3 ? 'w-3/5 bg-yellow-500' :
                              passwordStrength === 4 ? 'w-4/5 bg-lime-500' :
                              'w-full bg-success'
                            }`}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${
                          passwordStrength <= 1 ? 'text-error' :
                          passwordStrength === 2 ? 'text-orange-500' :
                          passwordStrength === 3 ? 'text-yellow-500' :
                          'text-success'
                        }`}>
                          {passwordFeedback}
                        </span>
                      </div>
                      
                      {passwordStrength < 3 && (
                        <ul className="text-xs text-foreground-muted grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                          <li className={`flex items-center ${password.length >= 8 ? 'text-success' : ''}`}>
                            <svg className={`w-3.5 h-3.5 mr-1 ${password.length >= 8 ? 'text-success' : 'text-foreground-muted'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              {password.length >= 8 ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              )}
                            </svg>
                            8+ characters
                          </li>
                          <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-success' : ''}`}>
                            <svg className={`w-3.5 h-3.5 mr-1 ${/[A-Z]/.test(password) ? 'text-success' : 'text-foreground-muted'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              {/[A-Z]/.test(password) ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              )}
                            </svg>
                            Uppercase
                          </li>
                          <li className={`flex items-center ${/[a-z]/.test(password) ? 'text-success' : ''}`}>
                            <svg className={`w-3.5 h-3.5 mr-1 ${/[a-z]/.test(password) ? 'text-success' : 'text-foreground-muted'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              {/[a-z]/.test(password) ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              )}
                            </svg>
                            Lowercase
                          </li>
                          <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-success' : ''}`}>
                            <svg className={`w-3.5 h-3.5 mr-1 ${/[0-9]/.test(password) ? 'text-success' : 'text-foreground-muted'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              {/[0-9]/.test(password) ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              )}
                            </svg>
                            Number
                          </li>
                          <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-success' : ''}`}>
                            <svg className={`w-3.5 h-3.5 mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-success' : 'text-foreground-muted'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              {/[^A-Za-z0-9]/.test(password) ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              )}
                            </svg>
                            Special char
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-error-light/20 border-l-4 border-error rounded-r-md text-error text-sm">
                  <div className="flex">
                    <svg className="h-5 w-5 text-error mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading || (password && passwordStrength < 3)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg disabled:hover:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>
              
              <p className="text-xs text-center text-foreground-muted mt-4">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary hover:text-primary-light hover:underline">Terms</a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-primary-light hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-base text-foreground-muted">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-medium text-primary hover:text-primary-light hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}