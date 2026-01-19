import { useState } from 'react'
import { SideBar } from './SideBar'
import { IconHistory, IconChevronRight } from '@tabler/icons-react'

/**
 * FloatingRecentLogs Component
 * Collapsible drawer for SideBar content (Recent Logs, Categories, Tags)
 */
const FloatingRecentLogs = (props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      className="fixed z-50 hidden lg:block"
      style={{
        right: '2rem',
        top: '120px', // Position near top
      }}
    >
      {/* Floating Container */}
      <div 
        className={`transition-all duration-300 ease-out flex ${
          isExpanded 
            ? 'w-80' // Wider for sidebar content
            : 'w-11'
        }`}
      >
        {/* Toggle Button (Left of content when expanded, or standalone) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center transition-all duration-200 hover:bg-[var(--endspace-bg-secondary)] shadow-lg z-20 relative ${
            isExpanded 
              ? 'w-10 h-10 bg-[var(--endspace-bg-primary)]/95 backdrop-blur-sm border border-[var(--endspace-border-base)] border-r-0 rounded-l-sm' 
              : 'w-11 h-11 bg-[var(--endspace-bg-primary)]/95 backdrop-blur-sm border border-[var(--endspace-border-base)] rounded-sm'
          }`}
          title={isExpanded ? 'Collapse Sidebar' : 'Show Recent Logs'}
        >
          {isExpanded ? (
            <IconChevronRight size={18} stroke={1.5} className="text-[var(--endspace-accent-yellow)]" />
          ) : (
            <IconHistory size={18} stroke={1.5} className="text-[var(--endspace-accent-yellow)]" />
          )}
        </button>

        {/* Expanded Content Drawer */}
        <div 
            className={`transition-opacity duration-300 bg-[var(--endspace-bg-primary)]/95 backdrop-blur-sm border border-[var(--endspace-border-base)] shadow-2xl overflow-hidden ${
                isExpanded ? 'opacity-100 visible w-full' : 'opacity-0 invisible w-0 border-0'
            }`}
             style={{
                maxHeight: 'calc(100vh - 140px)'
            }}
        >
          {isExpanded && (
             <div className="p-4 overflow-y-auto h-full" style={{ scrollbarWidth: 'thin' }}>
                <SideBar {...props} />
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FloatingRecentLogs
