'use client'

import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDocuments } from '@/context/DocumentContext'
import { useEffect, useCallback, useState, useRef } from 'react'
import { DocumentStatus } from '@/types/Document'

const MenuBar = ({ 
  editor, 
  onSave,
  isFullscreen,
  toggleFullscreen
}: { 
  editor: TiptapEditor | null; 
  onSave: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}) => {
  if (!editor) {
    return null
  }

  const buttonBaseClass = "p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-colors duration-150 ease-in-out"
  const activeClass = "bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/60"

  return (
    <div className="flex gap-1 p-2 items-center">
      <button
        onClick={onSave}
        className="px-4 py-2 bg-amber-700 text-white dark:bg-amber-600 dark:text-gray-50 rounded-lg hover:bg-amber-800 dark:hover:bg-amber-700 transition-all duration-150 ease-in-out font-medium shadow-sm hover:shadow transform hover:scale-105"
        aria-label="Save document"
      >
        Save
      </button>
      <div className="w-px bg-amber-100 dark:bg-amber-700/70 mx-2 self-stretch" />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonBaseClass} ${editor.isActive('bold') ? activeClass : ''}`}
        title="Bold (Ctrl+B)"
        aria-label="Bold"
        aria-pressed={editor.isActive('bold')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 0 0 0-8H6v8zm0 0h8a4 4 0 1 1 0 8H6v-8z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonBaseClass} ${editor.isActive('italic') ? activeClass : ''}`}
        title="Italic (Ctrl+I)"
        aria-label="Italic"
        aria-pressed={editor.isActive('italic')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h4m-2 0v12m-6-4h8" />
        </svg>
      </button>

      <div className="w-px bg-amber-100 dark:bg-amber-700/70 mx-2 self-stretch" />
      
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${buttonBaseClass} ${editor.isActive('paragraph') ? activeClass : ''}`}
        title="Paragraph"
        aria-label="Paragraph"
        aria-pressed={editor.isActive('paragraph')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonBaseClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''} font-serif`}
        title="Heading 1"
        aria-label="Heading 1"
        aria-pressed={editor.isActive('heading', { level: 1 })}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonBaseClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''} font-serif`}
        title="Heading 2"
        aria-label="Heading 2"
        aria-pressed={editor.isActive('heading', { level: 2 })}
      >
        H2
      </button>
      
      <div className="w-px bg-amber-100 dark:bg-amber-700/70 mx-2 self-stretch" />
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonBaseClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
        title="Bullet List"
        aria-label="Bullet List"
        aria-pressed={editor.isActive('bulletList')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      <div className="flex-grow"></div>
      
      {/* Full-screen toggle */}
      <button
        onClick={toggleFullscreen}
        className={`${buttonBaseClass} text-amber-700 dark:text-amber-300`}
        title={isFullscreen ? "Exit full-screen (F11)" : "Full-screen (F11)"}
        aria-label={isFullscreen ? "Exit full-screen" : "Full-screen"}
        aria-pressed={isFullscreen}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0m-5 0l0 5M9 15l-5 5m0 0l0 -5m0 5l5 0M15 9l5 -5m0 0l-5 0m5 0l0 5M15 15l5 5m0 0l0 -5m0 5l-5 0" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>
      
      <span className="text-xs text-amber-600 dark:text-amber-300 italic animate-pulse ml-4">
        {Math.random() > 0.7 ? "Writing with passion..." : "Creating your story..."}
      </span>
    </div>
  )
}

interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
  className?: string;
  onExit?: () => void;
}

export default function Editor({ content, onChange, className, onExit }: EditorProps) {
  const { currentDocument, updateDocument, saveDocument } = useDocuments()
  const [wordCount, setWordCount] = useState(0)
  const [localTitle, setLocalTitle] = useState(currentDocument?.title || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSynopsis, setShowSynopsis] = useState(false)
  const [localSynopsis, setLocalSynopsis] = useState(currentDocument?.metadata?.synopsis || '')
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<string | null>(null)
  const synopsisTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update local title and synopsis when document changes
  useEffect(() => {
    if (currentDocument?.title) {
      setLocalTitle(currentDocument.title)
    }
    if (currentDocument?.metadata?.synopsis !== undefined) {
      setLocalSynopsis(currentDocument.metadata.synopsis)
    }
  }, [currentDocument?.title, currentDocument?.metadata?.synopsis])

  // Debounced title update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentDocument && localTitle !== currentDocument.title) {
        updateDocument(currentDocument._id, { title: localTitle })
      }
    }, 500) // Wait 500ms after last change before updating

    return () => clearTimeout(timer)
  }, [localTitle, currentDocument, updateDocument])

  // Debounced synopsis update
  useEffect(() => {
    // Clear any existing timeout
    if (synopsisTimeoutRef.current) {
      clearTimeout(synopsisTimeoutRef.current)
    }

    // Only save if document exists and synopsis has changed
    if (currentDocument && currentDocument.metadata?.synopsis !== localSynopsis) {
      synopsisTimeoutRef.current = setTimeout(() => {
        const updatedDoc = {
          ...currentDocument,
          metadata: {
            ...currentDocument.metadata,
            type: currentDocument.metadata?.type || 'chapter',
            status: currentDocument.metadata?.status || 'draft',
            wordCount: currentDocument.metadata?.wordCount || 0,
            synopsis: localSynopsis
          }
        }
        saveDocument(updatedDoc)
      }, 1000) // 1 second debounce
    }

    return () => {
      if (synopsisTimeoutRef.current) {
        clearTimeout(synopsisTimeoutRef.current)
      }
    }
  }, [localSynopsis, currentDocument, saveDocument])

  // Store current content for comparison
  useEffect(() => {
    if (currentDocument?.content) {
      contentRef.current = currentDocument.content
    }
  }, [currentDocument?.content])

  // Set up fullscreen event handlers
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!window.document.fullscreenElement)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // F11 key for fullscreen toggle
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      }
      
      // Escape key to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen()
      }
    }

    window.document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  const toggleFullscreen = () => {
    if (!window.document.fullscreenElement && editorContainerRef.current) {
      editorContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (window.document.exitFullscreen) {
      window.document.exitFullscreen();
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
    ],
    content: content || currentDocument?.content || '<p>Start writing here...</p>',
    editorProps: {
      attributes: {
        class: `prose prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[calc(100vh-16rem)] w-full max-w-none prose-headings:font-serif prose-h1:text-4xl dark:prose-h1:text-amber-300 prose-h1:text-amber-900 prose-h2:text-3xl prose-h2:text-amber-800 dark:prose-h2:text-amber-400 prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-p:leading-relaxed prose-a:text-amber-600 dark:prose-a:text-amber-300 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-amber-200 dark:prose-blockquote:border-amber-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-amber-700 dark:prose-blockquote:text-amber-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-50 prose-em:text-gray-900 dark:prose-em:text-gray-50 prose-ul:my-6 prose-li:my-2 prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-img:rounded-lg first-letter:text-5xl first-letter:font-serif first-letter:text-amber-800 dark:first-letter:text-amber-300 first-letter:mr-1 first-letter:float-left dark:prose-invert ${isFullscreen ? 'fullscreen-editor' : ''} ${className || ''}`,
      },
    },
    onUpdate: ({ editor }) => {
      // Calculate word count
      const text = editor.getText()
      const count = text.split(/\s+/).filter(word => word.length > 0).length
      setWordCount(count)

      // Call onChange prop if provided
      if (onChange) {
        onChange(editor.getHTML())
      }

      // Clear any existing save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }

      // Set new debounced save timeout
      saveTimeoutRef.current = setTimeout(() => {
        const html = editor.getHTML()
        
        // Only save if content actually changed and we're not using external onChange
        if (currentDocument && html !== contentRef.current && !onChange) {
          contentRef.current = html  // Update ref to avoid redundant saves
          handleSaveContent(html, count)
        }
      }, 1000) // 1 second debounce
    }
  })

  // Clean up save timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (synopsisTimeoutRef.current) {
        clearTimeout(synopsisTimeoutRef.current)
      }
    }
  }, [])

  // Update editor content when document changes
  useEffect(() => {
    if (editor && currentDocument?.content && !editor.isFocused) {
      contentRef.current = currentDocument.content
      editor.commands.setContent(currentDocument.content)
    }
  }, [currentDocument, editor])

  const handleSaveContent = async (content: string, count: number) => {
    if (!currentDocument || isSaving) return
    
    try {
      console.log('Saving content, length:', content.length)
      setIsSaving(true)
      setSaveError(null)
      
      const updatedDoc = {
        ...currentDocument,
        content: content,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...currentDocument.metadata,
          type: currentDocument.metadata?.type || 'chapter',
          status: currentDocument.metadata?.status || 'draft',
          wordCount: count
        }
      }
      
      await saveDocument(updatedDoc)
    } catch (error) {
      console.error('Failed to save:', error)
      setSaveError('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = useCallback(async () => {
    if (!currentDocument || !editor || isSaving) return
    
    try {
      setIsSaving(true)
      setSaveError(null)
      const html = editor.getHTML()
      contentRef.current = html // Update ref to avoid redundant saves
      
      const updatedDoc = {
        ...currentDocument,
        content: html,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...currentDocument.metadata,
          type: currentDocument.metadata?.type || 'chapter',
          status: currentDocument.metadata?.status || 'draft',
          wordCount
        }
      }
      
      await saveDocument(updatedDoc)
    } catch (error) {
      console.error('Failed to save:', error)
      setSaveError('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }, [currentDocument, editor, saveDocument, wordCount, isSaving])

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      
      // Toggle synopsis with Alt+S
      if (e.altKey && e.key === 's') {
        e.preventDefault()
        setShowSynopsis(prev => !prev)
      }
    }
    
    window.document.addEventListener('keydown', handleKeyboard)
    return () => window.document.removeEventListener('keydown', handleKeyboard)
  }, [handleSave])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value)
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'draft': 
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/60'
      case 'revision': 
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50'
      case 'final': 
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/60'
      default: 
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/60'
    }
  }

  const exitEditor = () => {
    if (isFullscreen && window.document.exitFullscreen) {
      window.document.exitFullscreen();
    }
    if (onExit) {
      onExit();
    }
  }

  return (
    <div 
      ref={editorContainerRef} 
      className={`editor-wrapper h-full flex flex-col bg-white dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''} ${className || ''}`}
    >
      {/* Exit button - only visible in fullscreen mode */}
      {isFullscreen && (
        <button 
          onClick={exitEditor}
          className="absolute top-4 right-4 z-50 bg-amber-700 dark:bg-amber-600 text-white p-2 rounded-full hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors"
          aria-label="Exit full-screen editor"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      {/* Floating book papers animation - subtle background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        <div className="animate-paper-float-slow absolute top-1/4 left-[10%]">
          <div className="w-24 h-32 bg-amber-900 dark:bg-amber-600 rounded-sm rotate-6"></div>
        </div>
        <div className="animate-paper-float absolute bottom-1/3 right-[15%]">
          <div className="w-16 h-24 bg-amber-700 dark:bg-amber-500 rounded-sm -rotate-12"></div>
        </div>
      </div>
      
      {/* Header with title input */}
      <div className={`editor-toolbar p-4 border-b bg-gradient-to-r from-stone-50 to-white dark:from-gray-900 dark:to-gray-800 flex justify-between items-center relative z-10 ${isFullscreen ? 'shadow-md' : 'border-amber-100/30 dark:border-amber-800/30'}`}>
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          className="editor-title-input text-2xl font-serif bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 rounded px-2 py-1 flex-grow text-amber-900 dark:text-amber-300 placeholder-amber-400 dark:placeholder-amber-700"
          placeholder="Chapter Title"
          aria-label="Document title"
        />
        <div className="flex items-center space-x-4 text-sm">
          {saveError && (
            <span className="text-red-500 dark:text-red-400" role="alert">{saveError}</span>
          )}
          {isSaving && (
            <span className="text-amber-600 dark:text-amber-400 animate-pulse" aria-live="polite">Saving...</span>
          )}
          <span className="bg-amber-50 dark:bg-amber-900/40 px-3 py-1 rounded-full text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-700/60">
            {wordCount} words
          </span>
          <select 
            value={currentDocument?.metadata?.status || 'draft'}
            onChange={(e) => {
              if (currentDocument && editor) {
                const updatedDoc = {
                  ...currentDocument,
                  metadata: {
                    ...currentDocument.metadata,
                    type: currentDocument.metadata?.type || 'chapter',
                    status: e.target.value as DocumentStatus,
                    wordCount: currentDocument.metadata?.wordCount || 0
                  }
                }
                saveDocument(updatedDoc)
              }
            }}
            className={`border rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-amber-500 dark:focus:border-amber-700 ${getStatusColor(currentDocument?.metadata?.status)}`}
            aria-label="Document status"
          >
            <option value="draft" className="bg-white dark:bg-gray-800">Draft</option>
            <option value="revision" className="bg-white dark:bg-gray-800">Revision</option>
            <option value="final" className="bg-white dark:bg-gray-800">Final</option>
          </select>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className={`editor-toolbar border-b bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm ${isFullscreen ? 'sticky top-0 z-20 shadow-sm' : 'border-amber-100/30 dark:border-amber-800/30'}`}>
        <MenuBar
          editor={editor}
          onSave={handleSave}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </div>
      
      {/* Editor content area */}
      <div className={`editor-content-area editor-container flex-grow overflow-y-auto bg-white/80 dark:bg-gray-900/90 relative z-10 ${isFullscreen ? 'px-4 py-10' : 'p-4'}`}>
        <div className={`mx-auto ${isFullscreen ? 'max-w-[90%]' : 'max-w-[95%]'} w-full`}>
          <EditorContent editor={editor} className="editor-content" />
        </div>
      </div>
      
      {/* Synopsis area - toggleable in fullscreen mode */}
      {(!isFullscreen || showSynopsis) && (
        <div className={`editor-synopsis border-t bg-gradient-to-b from-white to-stone-50 dark:from-gray-900 dark:to-gray-800 p-4 relative z-10 ${isFullscreen ? 'absolute bottom-0 left-0 right-0 border shadow-inner' : 'border-amber-100/30 dark:border-amber-800/30'}`}>
          <div className={`mx-auto ${isFullscreen ? 'max-w-[90%]' : 'max-w-[95%]'}`}>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-serif text-amber-800 dark:text-amber-400">Synopsis</label>
              {isFullscreen && (
                <button 
                  onClick={() => setShowSynopsis(false)} 
                  className="text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                  aria-label="Hide synopsis"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            <textarea
              placeholder="Write a brief summary of this chapter..."
              value={localSynopsis}
              onChange={(e) => setLocalSynopsis(e.target.value)}
              className="synopsis-textarea w-full h-24 p-3 border border-amber-100 dark:border-amber-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-amber-500 dark:focus:border-amber-700 text-gray-700 dark:text-gray-200 placeholder-amber-300 dark:placeholder-amber-700 bg-transparent resize-none"
              aria-label="Chapter synopsis"
            />
          </div>
        </div>
      )}

      {/* Floating action button to show synopsis in fullscreen mode */}
      {isFullscreen && !showSynopsis && (
        <button
          onClick={() => setShowSynopsis(true)}
          className="fixed bottom-6 right-6 p-3 bg-amber-700 dark:bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-800 dark:hover:bg-amber-700 transition-colors z-30"
          aria-label="Show synopsis"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-10 4h10" />
          </svg>
        </button>
      )}

      {/* Accessibility keyboard shortcuts info */}
      <div className="sr-only" aria-live="polite">
        Press F11 to toggle fullscreen mode. Press Escape to exit fullscreen. Alt+S to toggle synopsis. Ctrl+S to save.
      </div>
    </div>
  )
}