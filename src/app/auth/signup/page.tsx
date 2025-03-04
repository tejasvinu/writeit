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
  
  // Animation for typewriter effect
  const [displayText, setDisplayText] = useState("")
  const fullText = "Begin your storytelling adventure today."
  const [isFocused, setIsFocused] = useState<string | null>(null)
  
  // Writing prompt state
  const [currentPrompt, setCurrentPrompt] = useState<string>("")
  const writingPrompts = [
    "Begin your storytelling adventure today.",
    "Every great novel starts with a single word.",
    "Your characters are waiting for you to bring them to life.",
    "That story inside you deserves to be told.",
    "Turn your imagination into chapters and pages."
  ]
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [passwordFeedback, setPasswordFeedback] = useState<string>("")
  
  // Interactive background state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isGeneratingParticles, setIsGeneratingParticles] = useState(false)
  
  interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    rotation: number;
    velocity: {
      x: number;
      y: number;
    };
    rotationSpeed: number;
  }
  
  const symbols = ['⌨️', '📝', '✍️', '📖', '📚', '🖋️', '✒️', '📜'];
  
  // Add to existing useState declarations
  const [mouseTrail, setMouseTrail] = useState<{ x: number; y: number }[]>([]);
  const [paperDepth, setPaperDepth] = useState(0);
  
  // Replace multiple particle states with a single one
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle mouse movement for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      if (isGeneratingParticles) {
        const newParticle: Particle = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 15 + 5,
          opacity: 1,
          rotation: Math.random() * 360,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 4) * 4
          },
          rotationSpeed: (Math.random() - 0.5) * 4
        }
        
        setParticles(prev => [...prev.slice(-20), newParticle])
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isGeneratingParticles])
  
  // Particle fade out effect
  useEffect(() => {
    if (particles.length === 0) return
    
    const timer = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({...p, opacity: p.opacity > 0 ? p.opacity - 0.02 : 0}))
          .filter(p => p.opacity > 0)
      )
    }, 100)
    
    return () => clearInterval(timer)
  }, [particles])
  
  // Rotate through writing prompts
  useEffect(() => {
    let promptIndex = 0;
    const rotatePrompts = setInterval(() => {
      promptIndex = (promptIndex + 1) % writingPrompts.length;
      
      let i = 0;
      const typing = setInterval(() => {
        if (i <= writingPrompts[promptIndex].length) {
          setCurrentPrompt(writingPrompts[promptIndex].substring(0, i));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 50);
      
    }, 8000);
    
    // Start with first prompt
    let i = 0;
    const initialTyping = setInterval(() => {
      if (i <= writingPrompts[0].length) {
        setCurrentPrompt(writingPrompts[0].substring(0, i));
        i++;
      } else {
        clearInterval(initialTyping);
      }
    }, 50);
    
    return () => {
      clearInterval(rotatePrompts);
      clearInterval(initialTyping);
    };
  }, []);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }
    
    // Criteria checks
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    const score = [hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial]
      .filter(Boolean).length;
    
    setPasswordStrength(score);
    
    // Feedback messages
    if (score === 0) setPasswordFeedback("Add a password");
    else if (score === 1) setPasswordFeedback("Very weak");
    else if (score === 2) setPasswordFeedback("Weak");
    else if (score === 3) setPasswordFeedback("Moderate");
    else if (score === 4) setPasswordFeedback("Strong");
    else setPasswordFeedback("Very strong");
    
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

      // Redirect to signin page after successful signup
      router.push('/auth/signin')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    // This would typically integrate with your authentication provider
    console.log(`Logging in with ${provider}`);
    // Simulate loading for demo
    setTimeout(() => setIsLoading(false), 1500);
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrailPoint = { x: e.clientX, y: e.clientY };
      setMouseTrail(prev => [...prev.slice(-20), newTrailPoint]);

      if (isGeneratingParticles) {
        const newParticle: Particle = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 15 + 5,
          opacity: 1,
          rotation: Math.random() * 360,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 4) * 4
          },
          rotationSpeed: (Math.random() - 0.5) * 4
        };
        setParticles(prev => [...prev.slice(-20), newParticle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isGeneratingParticles]);

  // Add particle animation system
  useEffect(() => {
    if (particles.length === 0) return;
  
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.velocity.x,
          y: p.y + p.velocity.y,
          opacity: p.opacity > 0 ? p.opacity - 0.01 : 0,
          rotation: p.rotation + p.rotationSpeed,
          velocity: {
            x: p.velocity.x * 0.98,
            y: p.velocity.y * 0.98 + 0.1
          }
        })).filter(p => p.opacity > 0)
      );
    };
  
    const intervalId = setInterval(animateParticles, 1000 / 60);
    return () => clearInterval(intervalId);
  }, [particles]);
  
  // Add 3D effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxDepth = 20;
      setPaperDepth(Math.min(scrolled / 10, maxDepth));
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-stone-100 to-white overflow-hidden">
      {/* Mouse trail effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {mouseTrail.map((point, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full bg-amber-500"
            style={{
              left: point.x,
              top: point.y,
              opacity: index / mouseTrail.length,
              transform: `scale(${1 - index / mouseTrail.length})`
            }}
          />
        ))}
      </div>

      {/* Enhanced particle system */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-amber-800 pointer-events-none transition-all duration-300"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              fontSize: `${particle.size}px`,
            }}
          >
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* 3D paper effect */}
      <div 
        className="relative w-full"
        style={{
          transform: `perspective(1000px) rotateX(${paperDepth}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Interactive particles */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div 
              key={particle.id}
              className="absolute text-amber-800 pointer-events-none"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                opacity: particle.opacity,
                transform: `rotate(${particle.rotation}deg)`,
                fontSize: `${particle.size}px`,
              }}
            >
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
              </svg>
            </div>
          ))}
        </div>
        
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
            <p className="text-xl font-serif mb-8 text-amber-100 text-center">"There is no greater agony than bearing<br/>an untold story inside you."<br/>— Maya Angelou</p>
            
            <div className="mt-8 p-6 bg-amber-900/30 rounded-lg border border-amber-700/30 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-3">What You'll Get</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-300 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-100">Beautiful writing environment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-300 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-100">Daily writing goals & statistics</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-300 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-100">Innovative chapter organization</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-amber-300 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-100">Seamless cloud backups</span>
                </li>
              </ul>
            </div>
            <div className="mt-12">
              <button 
                onClick={() => setIsAnimating(!isAnimating)}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 transition-colors rounded-md text-sm"
              >
                {isAnimating ? "Disable" : "Enable"} Writing Effects
              </button>
              <p className="text-sm mt-2 text-amber-200 opacity-80">
                Move your mouse around the screen to create a trail of paper arrows
              </p>
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
              <h2 className="text-3xl font-serif tracking-tight text-gray-900">Create your account</h2>
              <p className="mt-3 text-gray-600 h-6">
                {currentPrompt}<span className="animate-blink">|</span>
              </p>
            </div>
            
            <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-100">
              {/* Social login options */}
              <div className="flex flex-col space-y-3 mb-6">
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>
              
              <div className="flex items-center justify-between my-6">
                <div className="h-px bg-gray-200 flex-grow"></div>
                <div className="mx-4 text-sm text-gray-500">or</div>
                <div className="h-px bg-gray-200 flex-grow"></div>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setIsFocused('name')}
                        onBlur={() => setIsFocused(null)}
                        className={`appearance-none block w-full px-3 py-2 border ${isFocused === 'name' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all duration-200`}
                        placeholder="Jane Austen"
                      />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isFocused === 'name' || name ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="animate-blink text-amber-600 font-mono">|</span>
                      </span>
                    </div>
                  </div>
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
                        minLength={6}
                      />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isFocused === 'password' || password ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="animate-blink text-amber-600 font-mono">|</span>
                      </span>
                    </div>
                    
                    {/* Password strength meter */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                passwordStrength === 0 ? 'w-0' :
                                passwordStrength === 1 ? 'w-1/5 bg-red-500' :
                                passwordStrength === 2 ? 'w-2/5 bg-orange-500' :
                                passwordStrength === 3 ? 'w-3/5 bg-yellow-500' :
                                passwordStrength === 4 ? 'w-4/5 bg-lime-500' :
                                'w-full bg-green-500'
                              }`}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordStrength <= 1 ? 'text-red-600' :
                            passwordStrength === 2 ? 'text-orange-600' :
                            passwordStrength === 3 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {passwordFeedback}
                          </span>
                        </div>
                        
                        {passwordStrength < 3 && (
                          <ul className="text-xs text-gray-500 pl-4 mt-1 list-disc space-y-0.5">
                            {password.length < 8 && <li>At least 8 characters</li>}
                            {!/[A-Z]/.test(password) && <li>At least one uppercase letter</li>}
                            {!/[a-z]/.test(password) && <li>At least one lowercase letter</li>}
                            {!/[0-9]/.test(password) && <li>At least one number</li>}
                            {!/[^A-Za-z0-9]/.test(password) && <li>At least one special character</li>}
                          </ul>
                        )}
                      </div>
                    )}
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
                    disabled={Boolean(isLoading || (password && passwordStrength < 3))}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                      <>
                        Create account <span className="animate-blink ml-1 font-mono">|</span>
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-center text-gray-500 mt-4">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-amber-700 hover:text-amber-600">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-amber-700 hover:text-amber-600">Privacy Policy</a>
                </p>
              </form>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-amber-700 hover:text-amber-500 transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}