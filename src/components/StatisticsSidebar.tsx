'use client'

import React, { useEffect, useState } from 'react'

interface TextStatistics {
  words: number
  characters: number
  sentences: number
  paragraphs: number
  readingTime: number
  readability: {
    score: number
    level: 'easy' | 'medium' | 'complex'
  }
}

interface StatisticsSidebarProps {
  content: string
  isVisible: boolean
  onClose: () => void
}

export default function StatisticsSidebar({ content, isVisible, onClose }: StatisticsSidebarProps) {
  const [stats, setStats] = useState<TextStatistics>({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    readability: {
      score: 0,
      level: 'medium'
    }
  })
  const [animationComplete, setAnimationComplete] = useState(false)

  // Calculate statistics whenever content changes or sidebar becomes visible
  useEffect(() => {
    if (isVisible) {
      const textOnly = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      
      // Calculate words
      const words = textOnly.split(/\s+/).filter(word => word.length > 0).length
      
      // Calculate characters
      const characters = textOnly.length
      
      // Calculate sentences (basic approximation)
      const sentences = textOnly.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      
      // Calculate paragraphs (based on HTML structure, but fallback to text)
      const paragraphMatch = content.match(/<p>.*?<\/p>/g)
      const paragraphs = paragraphMatch ? paragraphMatch.length : Math.max(1, textOnly.split(/\n\s*\n/).length)
      
      // Calculate reading time (average reading speed: 200 words per minute)
      const readingTime = Math.max(1, Math.ceil(words / 200))
      
      // Calculate readability (very basic algorithm)
      let readabilityScore = 0
      if (words > 0 && sentences > 0) {
        const avgWordsPerSentence = words / sentences
        // Basic readability logic
        if (avgWordsPerSentence < 10) readabilityScore = 85
        else if (avgWordsPerSentence < 15) readabilityScore = 75
        else if (avgWordsPerSentence < 20) readabilityScore = 60
        else readabilityScore = 40
      }
      
      const readabilityLevel = 
        readabilityScore >= 80 ? 'easy' : 
        readabilityScore >= 60 ? 'medium' : 'complex'
        
      setStats({
        words,
        characters,
        sentences,
        paragraphs,
        readingTime,
        readability: {
          score: readabilityScore,
          level: readabilityLevel
        }
      })

      // Start animation after a short delay
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimationComplete(false)
    }
  }, [content, isVisible])

  if (!isVisible) {
    return null
  }

  const getReadabilityColor = () => {
    switch (stats.readability.level) {
      case 'easy': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-amber-600 dark:text-amber-400'
      case 'complex': return 'text-red-600 dark:text-red-400'
      default: return 'text-amber-600 dark:text-amber-400'
    }
  }

  const getMoodIcon = () => {
    const ratio = stats.readability.score / 100
    if (ratio > 0.75) return '😊' // Easy to read
    if (ratio > 0.5) return '🙂' // Moderately readable
    return '🤔' // Complex
  }

  return (
    <div className={`stats-sidebar fixed top-0 bottom-0 right-0 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border-l border-amber-100 dark:border-amber-800/30 z-30 overflow-y-auto transition-transform duration-300 ${animationComplete ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-xl text-amber-800 dark:text-amber-400">Statistics</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
            aria-label="Close statistics panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800/50 transform transition-all duration-300 hover:scale-105">
            <div className="text-amber-800 dark:text-amber-400 text-sm font-medium">Words</div>
            <div className="text-2xl font-serif text-gray-800 dark:text-gray-200 animate-fade-in">
              {stats.words.toLocaleString()}
            </div>
          </div>
          <div className="stat-card bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800/50 transform transition-all duration-300 hover:scale-105 delay-100">
            <div className="text-amber-800 dark:text-amber-400 text-sm font-medium">Characters</div>
            <div className="text-2xl font-serif text-gray-800 dark:text-gray-200 animate-fade-in">
              {stats.characters.toLocaleString()}
            </div>
          </div>
          <div className="stat-card bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800/50 transform transition-all duration-300 hover:scale-105 delay-200">
            <div className="text-amber-800 dark:text-amber-400 text-sm font-medium">Sentences</div>
            <div className="text-2xl font-serif text-gray-800 dark:text-gray-200 animate-fade-in">
              {stats.sentences.toLocaleString()}
            </div>
          </div>
          <div className="stat-card bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-100 dark:border-amber-800/50 transform transition-all duration-300 hover:scale-105 delay-300">
            <div className="text-amber-800 dark:text-amber-400 text-sm font-medium">Paragraphs</div>
            <div className="text-2xl font-serif text-gray-800 dark:text-gray-200 animate-fade-in">
              {stats.paragraphs.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Reading time */}
        <div className="bg-gradient-to-r from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 border border-amber-100 dark:border-amber-800/50 transform transition-all duration-300 hover:translate-y-[-2px] delay-400">
          <div className="flex items-center justify-between">
            <div className="text-amber-800 dark:text-amber-400 text-sm font-medium">Reading Time</div>
            <div className="text-xl font-serif text-gray-800 dark:text-gray-200">
              {stats.readingTime} min
            </div>
          </div>
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-amber-500 dark:bg-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, stats.readingTime * 5)}%` }}
            ></div>
          </div>
        </div>

        {/* Readability */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-800/50 transform transition-all duration-300 hover:translate-y-[-2px] delay-500">
          <div className="text-amber-800 dark:text-amber-400 text-sm font-medium mb-2">Readability</div>
          <div className="flex items-center justify-between">
            <div className={`text-lg font-serif capitalize ${getReadabilityColor()}`}>
              {stats.readability.level}
            </div>
            <div className="text-2xl" role="img" aria-label={`Readability: ${stats.readability.level}`}>
              {getMoodIcon()}
            </div>
          </div>
          <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                stats.readability.level === 'easy' ? 'bg-green-500 dark:bg-green-600' :
                stats.readability.level === 'medium' ? 'bg-amber-500 dark:bg-amber-600' :
                'bg-red-500 dark:bg-red-600'
              }`}
              style={{ width: `${stats.readability.score}%` }}
            ></div>
          </div>
        </div>

        {/* Additional stats */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-amber-100 dark:border-amber-800/50 shadow-sm transform transition-all duration-300 hover:shadow-md delay-600">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-gray-600 dark:text-gray-400">Avg. Words Per Sentence</div>
              <div className="text-gray-800 dark:text-gray-200 font-medium">
                {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '0'}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-600 dark:text-gray-400">Avg. Words Per Paragraph</div>
              <div className="text-gray-800 dark:text-gray-200 font-medium">
                {stats.paragraphs > 0 ? (stats.words / stats.paragraphs).toFixed(1) : '0'}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-600 dark:text-gray-400">Avg. Characters Per Word</div>
              <div className="text-gray-800 dark:text-gray-200 font-medium">
                {stats.words > 0 ? (stats.characters / stats.words).toFixed(1) : '0'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Writer's tip section */}
        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-100 dark:border-amber-800/30 transform transition-all duration-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 delay-700">
          <div className="text-amber-800 dark:text-amber-400 text-sm font-medium mb-2">Writer's Tip</div>
          <div className="text-gray-700 dark:text-gray-300 text-sm italic">
            {stats.readability.level === 'complex' 
              ? "Try shortening your sentences to improve readability. Aim for an average of 15-20 words per sentence."
              : stats.readability.level === 'medium'
              ? "Your text has good balance. Consider varying sentence length to create rhythm in your writing."
              : "Your text is very readable! Perfect for most audiences. Add some longer sentences if you want to convey more complex ideas."
            }
          </div>
        </div>

        {/* Animated paper background element */}
        <div className="absolute bottom-8 right-8 opacity-5 pointer-events-none">
          <div className="animate-paper-float-slow">
            <div className="w-20 h-28 bg-amber-900 dark:bg-amber-600 rounded-sm rotate-12"></div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcut info */}
      <div className="p-4 border-t border-amber-100 dark:border-amber-800/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-xs text-gray-500 dark:text-gray-400 sticky bottom-0">
        Press <kbd className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-300 text-xs">Alt+T</kbd> to toggle statistics
      </div>
    </div>
  )
}