'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  // Animation for typewriter effects
  const [displayText, setDisplayText] = useState("");
  const [displayQuote, setDisplayQuote] = useState("");
  const [displayCaption, setDisplayCaption] = useState("");
  const fullText = "Bring your story to life. Unleash your imagination.";
  const fullQuote = "The scariest moment is always just before you start.  Embrace the blank page.";
  const fullCaption = "A beautiful, distraction-free writing environment designed for novelists.  Craft your world.";

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
    }, 70); // Slightly faster typing

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
      }, 60); // Faster quote typing

      return () => clearInterval(typingQuote);
    }, 2000); // Shorter delay before quote
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
      }, 50); // Faster caption typing

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
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Background Texture - Subtle Paper */}
      <div className="absolute inset-0 opacity-5 bg-paper-texture dark:bg-paper-texture-dark"></div>

      {/* Floating elements - More and varied */}
      <div className="hidden md:block fixed z-0 w-full h-full overflow-hidden">
        {/* More elements, different sizes, and animations */}
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
        <div className="animate-float-slow absolute bottom-1/4 left-[20%] opacity-20">
          <svg className="w-20 h-20 text-amber-900 dark:text-amber-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-paper-float absolute top-2/3 right-[25%] opacity-10">
          <div className="w-16 h-20 bg-white dark:bg-gray-700 shadow-md rounded-sm rotate-12"></div>
        </div>
        <div className="animate-paper-float-slow absolute bottom-1/3 left-[10%]">
          <div className="w-20 h-24 bg-white dark:bg-gray-700 shadow-md rounded-sm -rotate-6"></div>
        </div>
        <div className="animate-paper-float-reverse absolute top-1/2 left-[5%]">
          <div className="w-24 h-32 bg-white dark:bg-gray-700 shadow-md rounded-sm rotate-3"></div>
        </div>
        <div className="animate-paper-float-slow absolute top-[70%] right-[20%]">
          <div className="w-16 h-20 bg-white dark:bg-gray-700 shadow-md rounded-sm rotate-45"></div>
        </div>
        {/* Add more floating elements here */}
      </div>

      {/* Hero section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        <div className="text-center">
          <div className="inline-block mb-4 px-6 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium animate-fade-in">
            Unlock Your Literary Potential
          </div>
          <h1 className="text-5xl font-serif tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl md:text-7xl animate-title-reveal">
            Write Your Novel with <span className="text-amber-700 dark:text-amber-500">Passion</span> and <span className="text-rose-600 dark:text-rose-400">Grace</span>
          </h1>
          <div className="relative">
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl h-8">
              <span className="font-serif italic text-amber-800 dark:text-amber-300">{displayText}</span>
              <span className={textComplete ? 'hidden' : 'animate-blink'}>|</span>
            </p>
            <p className="max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:text-xl md:max-w-3xl h-8 opacity-80">
              {displayCaption}
              <span className={captionComplete ? 'hidden' : 'animate-blink'}>|</span>
            </p>
          </div>
          <div className="mt-12 max-w-md mx-auto sm:flex sm:justify-center">
            <div className="rounded-md shadow transition-all duration-700 transform opacity-0 translate-y-4 animate-fade-in-delay-1">
              <Link
                href="/documents"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-amber-700 hover:bg-amber-800 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Begin Your Journey
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 transition-all duration-700 transform opacity-0 translate-y-4 animate-fade-in-delay-2">
              <a
                href="#features"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-amber-700 dark:text-amber-300 bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:shadow-inner"
              >
                Discover Features
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Book mockup - More detailed */}
        <div className="mt-16 relative mx-auto max-w-4xl perspective-1000">
          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 book-hover">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-gradient-to-br from-amber-800 to-amber-600 dark:from-amber-700 dark:to-amber-900 p-6 text-white">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl mb-4">The Obsidian Mirror</h3>
                    <p className="text-amber-100 font-light">Chapter 3: The Hidden Chamber</p>
                  </div>
                  <div className="text-sm text-amber-200 mt-8">
                    <p>Word count: 2,187</p>
                    <div className="w-full bg-amber-900 dark:bg-amber-950 rounded-full h-1.5 mt-2">
                      <div className="bg-amber-100 h-1.5 rounded-full w-4/5 animate-progress"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-6 dark:bg-gray-800">
                <div className="prose prose-amber dark:prose-invert max-w-none">
                  <p className="first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-amber-800 dark:first-letter:text-amber-400">
                    The air hung heavy with the scent of dust and forgotten magic.  Elara traced the intricate carvings on the stone wall, a shiver running down her spine as she sensed a presence watching her from the shadows...
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <span className="cursor-text text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors duration-200">
                    <svg className="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-full h-full bg-amber-100 dark:bg-amber-950/30 rounded-xl -z-10 book-shadow-1"></div>
          <div className="absolute -bottom-3 -right-3 w-full h-full bg-amber-300 dark:bg-amber-800/30 rounded-xl -z-20 book-shadow-2"></div>
        </div>

        {/* Features section with animated cards - More cards, more detail */}
        <div className="mt-32" id="features">
          <div className="text-center mb-16 overflow-hidden">
            <h2 className="text-3xl font-serif text-gray-900 dark:text-gray-100 animate-title-slide-up">Crafted for Writers, by Writers</h2>
            <div className="mt-2 h-1 w-32 bg-amber-700 dark:bg-amber-500 mx-auto rounded-full animate-line-expand"></div>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* More feature cards */}
            {[
              {
                title: "Chapter Organization",
                description: "Create your masterpiece chapter by chapter, with intuitive organization tools to structure your novel perfectly.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                details: "Organize chapters with drag-and-drop simplicity. Add notes, tag scenes, and track your narrative arcs throughout your manuscript."
              },
              {
                title: "Immersive Focus Mode",
                description: "Block out distractions with our beautiful focus mode that puts your words center stage and keeps inspiration flowing.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                details: "Set daily word count goals, visualize your writing streaks, and celebrate your milestones as you make progress toward completing your novel."
              },
              {
                title: "Cloud Sync & Backup",
                description: "Never lose your work.  Automatic cloud sync and backup ensure your novel is always safe and accessible.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10c0 3-2 6-5 6-3 0-6-3-6-6 0-3 2-6 5-6 3 0 6 3 6 6zM12 16v-4a2 2 0 00-2-2 2 2 0 00-2 2v4" />
                  </svg>
                ),
                details: "Your manuscript is automatically synced to our secure servers, protecting it from data loss and allowing you to access it from any device."
              },
              {
                title: "Distraction-Free Writing",
                description: "Focus on your story, not the interface.  A minimalist design and customizable settings help you eliminate distractions.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 100 6 3 3 0 100-6zM12 19a3 3 0 100-6 3 3 0 100 6z" />
                  </svg>
                ),
                details: "Hide unnecessary toolbars, customize fonts and colors, and create a writing environment that promotes deep focus and creativity."
              },
              {
                title: "Export Options",
                description: "Export your novel in a variety of formats, including DOCX, PDF, and EPUB, for easy sharing and publishing.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v2a2 2 0 01-2 2H2c-1.103 0-2-.897-2-2V7a2 2 0 012-2h2a2 2 0 012 2v10c0 1.103.897 2 2 2zM8 11a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                ),
                details: "Prepare your manuscript for submission to agents, publishers, or self-publishing platforms with our flexible export options."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flip-card ${hoveredCard === index ? 'is-flipped' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                  <div className="flip-card-back bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-amber-900 dark:text-amber-300 mb-3">{feature.title}</h3>
                    <p className="text-amber-800 dark:text-amber-200">{feature.details}</p>
                    <button className="mt-4 text-sm text-amber-700 dark:text-amber-400 font-medium hover:text-amber-900 dark:hover:text-amber-300 transition-colors duration-200">
                      Learn more →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Writing Inspiration Section */}
        <div className="mt-32 bg-amber-50 dark:bg-gray-800/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-gray-900 dark:text-gray-100">A Writer's Inspiration</h2>
            <div className="mt-2 h-1 w-32 bg-amber-700 dark:bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <svg className="absolute text-amber-300 dark:text-amber-700 opacity-50 w-20 h-20 -top-8 -left-8" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <blockquote className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <p className="text-2xl text-amber-900 dark:text-amber-300 font-serif italic text-center mb-6">
                {displayQuote}<span className={quoteComplete ? 'hidden' : 'animate-blink'}>|</span>
              </p>
              <p className="text-amber-800 dark:text-amber-400 text-center font-medium opacity-0 animate-fade-in-delay">— Stephen King</p>
            </blockquote>

            <svg className="absolute text-amber-300 dark:text-amber-700 opacity-50 w-20 h-20 -bottom-8 -right-8 transform rotate-180" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-center space-x-3">
              <span className="h-2 w-2 rounded-full bg-amber-300 dark:bg-amber-600 animate-pulse"></span>
              <span className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-500 animate-pulse-delay-1"></span>
              <span className="h-2 w-2 rounded-full bg-amber-700 dark:bg-amber-400 animate-pulse-delay-2"></span>
            </div>
          </div>
        </div>

        {/* Final CTA with animated elements */}
        <div className="mt-32 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-serif text-gray-900 dark:text-gray-100">Start Your Novel Today</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Join thousands of writers who have found their creative home. Your story deserves to be written.
            </p>
          </div>
          <div className="mt-8 animate-fade-in-up-delay">
            <Link
              href="/documents"
              className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-amber-700 hover:bg-amber-800 md:text-lg transition-all duration-200 transform hover:scale-105 animate-pulse-soft"
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