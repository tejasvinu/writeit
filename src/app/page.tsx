'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
export default function Home() {
  // Animation for typewriter effects
  const [displayText, setDisplayText] = useState("");
  const [displayQuote, setDisplayQuote] = useState("");
  const [displayCaption, setDisplayCaption] = useState("");
  const fullText = "Bring your story to life.";
  const fullQuote = "The scariest moment is always just before you start.";
  const fullCaption = "A beautiful, distraction-free writing environment designed for novelists.";
  
  // Track if animations have completed
  const [textComplete, setTextComplete] = useState(false);
  const [quoteComplete, setQuoteComplete] = useState(false);
  const [captionComplete, setCaptionComplete] = useState(false);
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.substring(0, i));
        i++;
      } else {
        clearInterval(typing);
        setTextComplete(true);
      }
    }, 100);
    
    return () => clearInterval(typing);
  }, []);
  
  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      const typingQuote = setInterval(() => {
        if (i <= fullQuote.length) {
          setDisplayQuote(fullQuote.substring(0, i));
          i++;
        } else {
          clearInterval(typingQuote);
          setQuoteComplete(true);
        }
      }, 80);
      
      return () => clearInterval(typingQuote);
    }, 3000);
  }, []);
  
  useEffect(() => {
    if (textComplete) {
      let i = 0;
      const typingCaption = setInterval(() => {
        if (i <= fullCaption.length) {
          setDisplayCaption(fullCaption.substring(0, i));
          i++;
        } else {
          clearInterval(typingCaption);
          setCaptionComplete(true);
        }
      }, 40);
      
      return () => clearInterval(typingCaption);
    }
  }, [textComplete]);
  
  // Animated feature cards
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // Random number generator for floating element animations
  const getRandomPosition = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-white overflow-hidden">
      {/* Floating elements */}
      <div className="hidden md:block fixed z-0 w-full h-full overflow-hidden">
        <div className="animate-float absolute top-20 left-[10%] opacity-20">
          <svg className="w-16 h-16 text-amber-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-float-delayed absolute top-1/3 right-[15%] opacity-20">
          <svg className="w-20 h-20 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-float-slow absolute bottom-1/4 left-[20%] opacity-20">
          <svg className="w-24 h-24 text-amber-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-float-reverse absolute top-2/3 right-[25%] opacity-10">
          <svg className="w-32 h-32 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-paper-float absolute top-1/4 left-[30%]">
          <div className="w-16 h-20 bg-white shadow-md rounded-sm opacity-30 rotate-12"></div>
        </div>
        <div className="animate-paper-float-slow absolute bottom-1/3 right-[10%]">
          <div className="w-20 h-24 bg-white shadow-md rounded-sm opacity-20 -rotate-6"></div>
        </div>
        <div className="animate-paper-float-reverse absolute top-1/2 left-[5%]">
          <div className="w-24 h-32 bg-white shadow-md rounded-sm opacity-15 rotate-3"></div>
        </div>
        <div className="animate-paper-float-slow absolute top-[70%] right-[20%]">
          <div className="w-16 h-20 bg-white shadow-md rounded-sm opacity-20 rotate-45"></div>
        </div>
      </div>
      {/* Hero section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium animate-fade-in">
            Novel Writing Made Beautiful
          </div>
          <h1 className="text-4xl font-serif tracking-tight text-gray-900 sm:text-5xl md:text-6xl animate-title-reveal">
            Write Your Novel with <span className="text-amber-700">Passion</span>
          </h1>
          <div className="relative">
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl h-8">
              <span className="font-serif italic text-amber-800"> {displayText}</span>
              <span className={textComplete ? 'hidden' : 'animate-blink'}>|</span>
            </p>
            <p className="max-w-md mx-auto text-base text-gray-500 sm:text-lg md:text-xl md:max-w-3xl h-8 opacity-80">
              {displayCaption}
              <span className={captionComplete ? 'hidden' : 'animate-blink'}>|</span>
            </p>
          </div>
          <div className="mt-12 max-w-md mx-auto sm:flex sm:justify-center">
            <div className={`rounded-md shadow transition-all duration-700 transform ${textComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link
                href="/documents"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-amber-700 hover:bg-amber-800 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Begin Your Journey
              </Link>
            </div>
            <div className={`mt-3 rounded-md shadow sm:mt-0 sm:ml-3 transition-all duration-700 delay-300 transform ${textComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a
                href="#features"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-amber-700 bg-white hover:bg-amber-50 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:shadow-inner"
              >
                Discover Features
              </a>
            </div>
          </div>
        </div>
        {/* Interactive Book mockup */}
        <div className="mt-16 relative mx-auto max-w-4xl perspective-1000">
          <div className="relative z-10 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 book-hover">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-amber-800 p-6 text-white">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl mb-4">The Art of Fiction</h3>
                    <p className="text-amber-100 font-light">Chapter 1: Beginnings</p>
                  </div>
                  <div className="text-sm text-amber-200 mt-8">
                    <p>Word count: 1,842</p>
                    <div className="w-full bg-amber-900 rounded-full h-1.5 mt-2">
                      <div className="bg-amber-100 h-1.5 rounded-full w-3/4 animate-progress"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="prose prose-amber max-w-none">
                  <p className="first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-amber-800">
                    The morning light filtered through the dusty window, casting long shadows across the worn wooden floor. Sarah paused, pen hovering above the blank page, as if the perfect opening line might materialize from thin air...
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <span className="cursor-text text-amber-700 hover:text-amber-900 transition-colors duration-200">
                    <svg className="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-full h-full bg-amber-100 rounded-xl -z-10 book-shadow-1"></div>
          <div className="absolute -bottom-3 -right-3 w-full h-full bg-amber-300 rounded-xl -z-20 book-shadow-2"></div>
        </div>
        {/* Features section with animated cards */}
        <div className="mt-32" id="features">
          <div className="text-center mb-16 overflow-hidden">
            <h2 className="text-3xl font-serif text-gray-900 animate-title-slide-up">Crafted for Writers, by Writers</h2>
            <div className="mt-2 h-1 w-24 bg-amber-700 mx-auto rounded-full animate-line-expand"></div>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Chapter Organization",
                description: "Create your masterpiece chapter by chapter, with intuitive organization tools to structure your novel perfectly.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                details: "Organize chapters with drag-and-drop simplicity. Add notes, tag scenes, and track your narrative arcs throughout your manuscript."
              },
              {
                title: "Immersive Focus Mode",
                description: "Block out distractions with our beautiful focus mode that puts your words center stage and keeps inspiration flowing.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                details: "Customize your writing environment with font choices, color themes, and ambient sounds that help you get into the perfect creative state of mind."
              },
              {
                title: "Writer's Analytics",
                description: "Track your daily progress, set goals, and visualize your writing journey from first word to finished manuscript.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                details: "Set daily word count goals, visualize your writing streaks, and celebrate your milestones as you make progress toward completing your novel."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flip-card ${hoveredCard === index ? 'is-flipped' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                  <div className="flip-card-back bg-amber-50 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-amber-900 mb-3">{feature.title}</h3>
                    <p className="text-amber-800">{feature.details}</p>
                    <button className="mt-4 text-sm text-amber-700 font-medium hover:text-amber-900 transition-colors duration-200">
                      Learn more →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Writing Inspiration Section (replacing testimonials) */}
        <div className="mt-32 bg-amber-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-gray-900">A Writer's Inspiration</h2>
            <div className="mt-2 h-1 w-24 bg-amber-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="relative max-w-3xl mx-auto">
            <svg className="absolute text-amber-300 opacity-50 w-16 h-16 -top-6 -left-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            
            <blockquote className="relative z-10">
              <p className="text-2xl text-amber-900 font-serif italic text-center mb-6">
                {displayQuote}<span className={quoteComplete ? 'hidden' : 'animate-blink'}>|</span>
              </p>
              <p className="text-amber-800 text-center font-medium opacity-0 animate-fade-in-delay">— Stephen King</p>
            </blockquote>
            
            <svg className="absolute text-amber-300 opacity-50 w-16 h-16 -bottom-6 -right-4 transform rotate-180" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          <div className="mt-12">
            <div className="flex items-center justify-center space-x-3">
              <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse"></span>
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse-delay-1"></span>
              <span className="h-2 w-2 rounded-full bg-amber-700 animate-pulse-delay-2"></span>
            </div>
          </div>
        </div>
        {/* Writer Stats Section - NEW */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-gray-900 animate-title-slide-up">Join a Community of Writers</h2>
            <div className="mt-2 h-1 w-24 bg-amber-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { count: "2.4M+", label: "Words Written", icon: "📝" },
              { count: "12K+", label: "Chapters Created", icon: "📚" },
              { count: "842+", label: "Completed Novels", icon: "🏆" },
              { count: "94%", label: "Writer Satisfaction", icon: "❤️" }
            ].map((stat, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center transition-all duration-500 transform delay-${index * 150} hover:-translate-y-1 hover:shadow-md`}>
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-amber-800 counter">{stat.count}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Writing Tips Section - NEW */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-gray-900 animate-title-slide-up">Writing Tips & Resources</h2>
            <div className="mt-2 h-1 w-24 bg-amber-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Building Believable Characters",
                excerpt: "Learn how to develop multidimensional characters your readers will remember long after they finish your novel.",
                tag: "Character Development"
              },
              {
                title: "Crafting the Perfect Plot Twist",
                excerpt: "Discover techniques for creating unexpected yet satisfying plot twists that will keep your readers on the edge of their seats.",
                tag: "Plot & Structure"
              },
              {
                title: "Finding Your Writer's Voice",
                excerpt: "Explore methods to develop your unique writing style and voice that makes your storytelling distinctly yours.",
                tag: "Writing Style"
              }
            ].map((article, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md group">
                <div className="h-40 bg-gradient-to-r from-amber-700 to-amber-500 flex items-center justify-center p-6">
                  <h3 className="text-xl font-medium text-white text-center">{article.title}</h3>
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium mb-4">
                    {article.tag}
                  </div>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <a href="#" className="text-amber-700 font-medium group-hover:text-amber-600 transition-colors inline-flex items-center">
                    Read more
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Final CTA with animated elements */}
        <div className="mt-32 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-serif text-gray-900">Start Your Novel Today</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              Join thousands of writers who have found their creative home. Your story deserves to be written.
            </p>
          </div>
          <div className="mt-8 animate-fade-in-up-delay">
            <Link
              href="/documents"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-amber-700 hover:bg-amber-800 md:text-lg transition-all duration-200 transform hover:scale-105 animate-pulse-soft"
            >
              Begin Your Literary Journey
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
