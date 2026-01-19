import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IconListTree, IconChevronRight } from '@tabler/icons-react'

/**
 * FloatingToc Component - Endspace Theme Industrial Style
 * Floating TOC navigation component - right side floating panel
 * Tabler Icons for Futuristic Feel
 */
const FloatingToc = ({ toc }) => {
  const [activeSection, setActiveSection] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true) // Default expanded
  const tRef = useRef(null)
  const tocIds = useRef([])

  // Listen to scroll events
  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    window.addEventListener('scroll', updateProgress)
    actionSectionScrollSpy()
    updateProgress()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  // Update reading progress
  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
    setProgress(progress)
  }

  // Sync selected TOC item
  const throttleMs = 200
  const actionSectionScrollSpy = useCallback(
    throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = activeSection
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }
      setActiveSection(currentSectionId)
      // Auto scroll TOC
      const ids = tocIds.current
      if (tRef.current && ids.length > 0) {
        const index = ids.indexOf(currentSectionId) || 0
        tRef.current.scrollTo({ top: 32 * index - 60, behavior: 'smooth' })
      }
    }, throttleMs)
  )

  // Return null if no TOC
  if (!toc || toc.length < 1) {
    return null
  }

  // Build tocIds
  const ids = toc.map(item => uuidToId(item.id))
  tocIds.current = ids

  return (
    <div 
      className="fixed z-50 hidden lg:block"
      style={{
        right: '2rem',
        top: 'auto',
        bottom: '250px' // Position above scroll to top, below recent logs
      }}
    >
      {/* Floating Container */}
      <div 
        className={`transition-all duration-300 ease-out ${
          isExpanded 
            ? 'w-64 bg-[var(--endspace-bg-primary)]/95 backdrop-blur-sm border border-[var(--endspace-border-base)] shadow-lg' 
            : 'w-11'
        }`}
        style={{
          maxHeight: '70vh'
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center transition-all duration-200 hover:bg-[var(--endspace-bg-secondary)] ${
            isExpanded 
              ? 'absolute -left-11 top-0 w-10 h-10 bg-[var(--endspace-bg-primary)]/95 backdrop-blur-sm border border-[var(--endspace-border-base)] border-r-0' 
              : 'w-11 h-11 bg-[var(--endspace-bg-primary)]/95 backdrop-blur-sm border border-[var(--endspace-border-base)]'
          }`}
          title={isExpanded ? 'Collapse TOC' : 'Expand TOC'}
        >
          {isExpanded ? (
            <IconChevronRight size={16} stroke={1.5} className="text-blue-400" />
          ) : (
            <IconListTree size={16} stroke={1.5} className="text-blue-400" />
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--endspace-text-muted)] font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <IconListTree size={14} stroke={1.5} className="text-blue-400" />
                <span>TOC Index</span>
              </h3>
              <span className="text-[10px] font-mono text-blue-400">{Math.round(progress)}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-0.5 bg-[var(--endspace-bg-secondary)] mb-4">
              <div 
                className="h-full bg-blue-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* TOC Items */}
            <div 
              ref={tRef}
              className="overflow-y-auto overflow-x-hidden max-h-[50vh] scroll-smooth border-l border-[var(--endspace-border-base)] pl-4"
              style={{ scrollbarWidth: 'thin' }}
            >
              <nav className="space-y-2">
                {toc.map((tocItem) => {
                  const id = uuidToId(tocItem.id)
                  const isActive = activeSection === id
                  
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      className={`block py-1 text-xs transition-all duration-200 hover:translate-x-1 ${
                        isActive 
                          ? 'text-blue-400 font-medium' 
                          : 'text-[var(--endspace-text-secondary)] hover:text-[var(--endspace-text-primary)]'
                      }`}
                      style={{ 
                        paddingLeft: `${tocItem.indentLevel * 12}px`
                      }}
                    >
                      <span className="line-clamp-2 leading-relaxed break-words">
                        {tocItem.text}
                      </span>
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-2 border-t border-[var(--endspace-border-base)]">
              <div className="text-[10px] font-mono text-[var(--endspace-text-muted)]">
                {toc.length} SECTIONS
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Progress Indicator */}
        {!isExpanded && (
          <div 
            className="absolute left-0 bottom-0 w-full bg-blue-400/30"
            style={{ 
              height: `${progress}%`,
              transition: 'height 0.15s ease-out'
            }}
          />
        )}
      </div>
    </div>
  )
}

export default FloatingToc
