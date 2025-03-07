"use client"

import { motion } from "framer-motion"
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Create ink-flow paths that resemble handwriting or quill strokes
function InkFlowPaths() {
  // Generate elegant, flowing paths that look like cursive writing or ink
  const inkPaths = [
    "M10,100 C150,50 250,150 350,80 C450,10 550,120 650,90 C750,60 850,110 950,90",
    "M50,180 C120,140 220,200 320,160 C420,120 520,180 620,160 C720,140 820,200 920,180",
    "M30,250 C130,220 230,280 330,250 C430,220 530,280 630,250 C730,220 830,280 930,250",
    "M70,320 C170,290 270,350 370,320 C470,290 570,350 670,320 C770,290 870,350 970,320",
    "M20,50 C120,20 220,80 320,50 C420,20 520,80 620,50 C720,20 820,80 920,50"
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-70">
      <svg 
        className="w-full h-full text-amber-700/40 dark:text-amber-500/40" 
        viewBox="0 0 1000 400" 
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Flowing Ink</title>
        {inkPaths.map((path, i) => (
          <motion.path
            key={`ink-${i}`}
            d={path}
            stroke="currentColor"
            strokeWidth={2 + i * 0.5}
            strokeOpacity={0.3 + i * 0.05}
            strokeLinecap="round"
            strokeDasharray="1,0"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Create paths that resemble paper edges with fixed values to avoid hydration issues
function PaperEdgePaths() {
  // Pre-computed paper edge paths to ensure consistent rendering between server and client
  const paperPaths = [
    "M0,40 L40,42.3 L80,41.2 L120,39.8 L160,40.6 L200,42.1 L240,40.5 L280,39.8 L320,41.2 L360,42.5 L400,41.8 L440,40.3 L480,41.5 L520,42.8 L560,41.9 L600,40.4 L640,39.7 L680,41.2 L720,42.6 L760,41.1 L800,39.9 L840,40.7 L880,42.0 L920,41.3 L960,40.8 L1000,41.5",
    "M0,80 L40,82.8 L80,81.4 L120,79.6 L160,80.9 L200,83.2 L240,81.0 L280,79.2 L320,80.9 L360,83.1 L400,81.5 L440,79.7 L480,81.2 L520,83.5 L560,81.8 L600,79.9 L640,78.9 L680,81.1 L720,83.2 L760,81.6 L800,79.8 L840,81.4 L880,83.0 L920,81.7 L960,79.5 L1000,81.0",
    "M0,120 L40,122.7 L80,121.3 L120,119.8 L160,121.2 L200,123.6 L240,121.9 L280,119.5 L320,121.3 L360,123.7 L400,122.2 L440,119.9 L480,121.4 L520,123.9 L560,122.4 L600,119.6 L640,118.5 L680,121.0 L720,123.8 L760,122.2 L800,119.7 L840,121.5 L880,123.4 L920,122.1 L960,119.3 L1000,120.9",
    "M0,160 L40,162.6 L80,161.1 L120,159.7 L160,161.5 L200,164.0 L240,162.7 L280,159.9 L320,161.7 L360,164.3 L400,162.9 L440,160.2 L480,161.7 L520,164.3 L560,162.9 L600,160.0 L640,159.1 L680,161.4 L720,164.4 L760,162.8 L800,159.6 L840,161.7 L880,163.8 L920,162.5 L960,160.1 L1000,162.3",
    "M0,200 L40,202.5 L80,201.0 L120,199.5 L160,201.8 L200,204.4 L240,203.4 L280,200.3 L320,202.1 L360,204.9 L400,203.6 L440,200.8 L480,202.0 L520,204.7 L560,203.5 L600,200.4 L640,199.7 L680,201.8 L720,205.0 L760,203.4 L800,200.5 L840,201.9 L880,204.2 L920,203.0 L960,199.8 L1000,201.6",
    "M0,240 L40,242.4 L80,240.9 L120,239.3 L160,241.1 L200,243.8 L240,243.0 L280,240.7 L320,242.5 L360,245.5 L400,244.3 L440,241.2 L480,242.3 L520,245.1 L560,244.1 L600,240.8 L640,239.4 L680,241.2 L720,244.6 L760,244.0 L800,241.4 L840,242.1 L880,244.6 L920,243.5 L960,240.5 L1000,241.2",
    "M0,280 L40,282.3 L80,280.8 L120,279.1 L160,280.4 L200,283.2 L240,282.6 L280,280.1 L320,281.9 L360,285.1 L400,284.0 L440,280.9 L480,281.6 L520,284.5 L560,283.7 L600,280.2 L640,279.0 L680,281.5 L720,285.2 L760,283.6 L800,280.3 L840,281.3 L880,284.0 L920,283.1 L960,280.2 L1000,281.8",
    "M0,320 L40,322.2 L80,320.7 L120,318.9 L160,320.7 L200,323.6 L240,323.2 L280,319.5 L320,321.3 L360,324.7 L400,323.7 L440,320.6 L480,321.9 L520,324.9 L560,324.3 L600,320.6 L640,318.6 L680,320.9 L720,324.8 L760,324.2 L800,320.2 L840,321.5 L880,324.4 L920,323.7 L960,319.9 L1000,321.4",
    "M0,360 L40,362.1 L80,360.6 L120,358.8 L160,360.0 L200,363.0 L240,362.8 L280,358.9 L320,360.7 L360,364.3 L400,363.4 L440,360.3 L480,362.2 L520,365.3 L560,364.8 L600,361.0 L640,358.2 L680,360.3 L720,364.4 L760,363.8 L800,360.1 L840,361.7 L880,364.8 L920,364.3 L960,359.6 L1000,361.0",
    "M0,400 L40,401.9 L80,400.5 L120,398.6 L160,399.3 L200,402.4 L240,402.4 L280,399.3 L320,401.1 L360,403.9 L400,403.1 L440,400.0 L480,402.5 L520,405.7 L560,404.4 L600,400.4 L640,397.8 L680,400.7 L720,404.0 L760,403.4 L800,399.0 L840,400.9 L880,404.2 L920,403.9 L960,399.3 L1000,401.6",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-50">
      <svg 
        className="w-full h-full text-amber-600/20 dark:text-amber-500/20" 
        viewBox="0 0 1000 400" 
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Paper Edges</title>
        {paperPaths.map((path, i) => (
          <motion.path
            key={`paper-${i}`}
            d={path}
            stroke="currentColor"
            strokeWidth={0.5}
            strokeOpacity={0.1 + i * 0.02}
            fill="none"
            initial={{ x: -5 }}
            animate={{ x: 5 }}
            transition={{
              duration: 10 + i,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Create cursive letter-like paths
function CursiveLetterPaths() {
  // Paths that resemble cursive letters or writing elements
  const letterPaths = [
    // Resembles a cursive "w"
    "M50,100 C70,140 90,80 110,120 C130,160 150,100 170,120",
    // Resembles a cursive "r"
    "M200,120 C220,80 240,100 260,90",
    // Resembles a cursive "i"
    "M280,100 C290,90 295,110 300,100 M290,70 C295,65 300,70 295,75",
    // Resembles a cursive "t"
    "M320,70 C330,110 340,140 350,100 M315,100 C325,100 345,100 355,100",
    // Resembles a cursive "e"
    "M380,110 C400,90 420,90 430,110 C420,130 400,130 380,110"
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg 
        className="w-full h-full text-amber-800/30 dark:text-amber-400/30" 
        viewBox="0 0 500 200" 
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Cursive Elements</title>
        {letterPaths.map((path, i) => (
          <motion.path
            key={`letter-${i}`}
            d={path}
            stroke="currentColor"
            strokeWidth={2}
            strokeOpacity={0.6}
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ 
              opacity: 0.6,
              pathLength: 1
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 10,
              repeatType: "loop"
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Client-only wrapper for animated components to prevent hydration errors
function ClientAnimations({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null; // Return nothing during SSR
  }
  
  return <>{children}</>;
}

export default function AnimatedBackground({
  title = "Write Your Story",
  subtitle = "Bring your imagination to life",
  ctaText = "Begin Writing",
  ctaLink = "/documents",
  showContent = true
}: {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  showContent?: boolean
}) {
  const words = title.split(" ")

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-100 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Subtle paper texture overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-3 bg-paper-texture dark:bg-paper-texture-dark"></div>
      
      {/* Theme-oriented animated paths - Wrapped in client-only component */}
      <ClientAnimations>
        <InkFlowPaths />
        <PaperEdgePaths />
        <CursiveLetterPaths />

        {/* Floating paper elements */}
        <div className="hidden md:block absolute inset-0 z-0">
          <motion.div 
            className="absolute w-16 h-20 bg-white dark:bg-gray-800 rounded-sm shadow-md"
            style={{ top: '20%', right: '15%', rotate: '10deg' }}
            animate={{ 
              y: [0, -15, 0], 
              rotate: [10, 15, 10],
              boxShadow: ['0 4px 6px rgba(0,0,0,0.1)', '0 10px 15px rgba(0,0,0,0.15)', '0 4px 6px rgba(0,0,0,0.1)']
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute w-20 h-24 bg-white dark:bg-gray-800 rounded-sm shadow-md"
            style={{ bottom: '30%', left: '10%', rotate: '-5deg' }}
            animate={{ 
              y: [0, -20, 0], 
              rotate: [-5, -8, -5],
              boxShadow: ['0 4px 6px rgba(0,0,0,0.1)', '0 15px 20px rgba(0,0,0,0.2)', '0 4px 6px rgba(0,0,0,0.1)']
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div 
            className="absolute w-14 h-18 bg-white dark:bg-gray-800 rounded-sm shadow-md"
            style={{ top: '60%', right: '25%', rotate: '-12deg' }}
            animate={{ 
              y: [0, -10, 0], 
              rotate: [-12, -8, -12],
              boxShadow: ['0 4px 6px rgba(0,0,0,0.1)', '0 8px 12px rgba(0,0,0,0.12)', '0 4px 6px rgba(0,0,0,0.1)']
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>
      </ClientAnimations>

      {/* Content - Only show if showContent is true */}
      {showContent && (
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif mb-6 tracking-tight">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.04,
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                      }}
                      className="inline-block text-transparent bg-clip-text 
                        bg-gradient-to-r from-amber-800 to-amber-600
                        dark:from-amber-500 dark:to-amber-300"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="inline-block group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-500 dark:to-amber-700 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
              <Link
                href={ctaLink}
                className="relative flex items-center justify-center px-8 py-3 md:px-10 md:py-4 bg-white dark:bg-gray-800 rounded-lg font-medium text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all duration-300 group-hover:translate-y-[-2px]"
              >
                <span>{ctaText}</span>
                <motion.span 
                  className="ml-2 text-lg"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
