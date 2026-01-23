'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * LoadingCover Component - Endfield Style
 * Full-screen loading animation with progress bar
 */
export const LoadingCover = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('init') // init -> loading -> complete -> sweeping -> fadeout
  const { onLoading } = useGlobal()
  const hasCompletedRef = useRef(false)

  // Configurable texts
  const siteName = siteConfig('ENDSPACE_LOADING_SITE_NAME', null, CONFIG) || siteConfig('TITLE') || 'CLOUD09_SPACE'
  const textInit = siteConfig('ENDSPACE_LOADING_TEXT_INIT', 'INITIALIZING', CONFIG)
  const textLoading = siteConfig('ENDSPACE_LOADING_TEXT_LOADING', 'LOADING', CONFIG)
  const textComplete = siteConfig('ENDSPACE_LOADING_TEXT_COMPLETE', 'READY', CONFIG)
  const textSweeping = siteConfig('ENDSPACE_LOADING_TEXT_SWEEPING', 'LAUNCHING', CONFIG)
  const textFadeout = siteConfig('ENDSPACE_LOADING_TEXT_FADEOUT', 'WELCOME', CONFIG)
  // New: Custom Loading Image
  const loadingImage = siteConfig('ENDSPACE_LOADING_IMAGE', null, CONFIG)

  // Resource loading tracking
  useEffect(() => {
    // Prevent body scroll during loading
    document.body.style.overflow = 'hidden'

    // Start loading phase after brief init
    const initTimer = setTimeout(() => {
      setPhase('loading')
    }, 100)

    // Track all resources using Performance API for accurate progress
    let totalResources = 0
    let loadedResources = 0
    let lastProgress = 0

    const updateProgress = () => {
      if (totalResources === 0) return
      const targetProgress = Math.floor((loadedResources / totalResources) * 100)
      // Smooth interpolation towards target
      if (targetProgress > lastProgress) {
        lastProgress = targetProgress
        setProgress(prev => Math.max(prev, targetProgress))
      }
    }

    // Use PerformanceObserver to track resource loading
    let observer = null
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            loadedResources++
            updateProgress()
          }
        })
        observer.observe({ entryTypes: ['resource'] })
      } catch (e) {
        // Fallback if PerformanceObserver not supported
      }
    }

    // Count initial resources (images, scripts, stylesheets)
    const countResources = () => {
      const images = document.images
      const scripts = document.getElementsByTagName('script')
      const links = document.querySelectorAll('link[rel="stylesheet"]')
      totalResources = images.length + scripts.length + links.length
      
      if (totalResources === 0) totalResources = 1 // Avoid division by zero
      
      // Count already loaded resources
      for (let i = 0; i < images.length; i++) {
        if (images[i].complete) loadedResources++
      }
      updateProgress()
    }
    countResources()

    // Smooth progress animation using requestAnimationFrame
    let animationProgress = 0
    let targetProgress = 0
    let rafId = null
    
    const animateProgress = () => {
      if (animationProgress < targetProgress) {
        // Smooth easing - move 10% of remaining distance each frame
        animationProgress += (targetProgress - animationProgress) * 0.1
        if (targetProgress - animationProgress < 0.5) {
          animationProgress = targetProgress
        }
        setProgress(Math.floor(animationProgress))
      }
      rafId = requestAnimationFrame(animateProgress)
    }
    rafId = requestAnimationFrame(animateProgress)

    // Update target progress periodically based on actual loading
    const progressInterval = setInterval(() => {
      // Calculate real progress from loaded resources
      const realProgress = totalResources > 0 
        ? Math.floor((loadedResources / totalResources) * 100) 
        : 0
      
      // Check if loading is complete from global state
      if (!onLoading) {
        targetProgress = 100
      } else {
        // Use real progress but cap at 95 until fully loaded
        targetProgress = Math.min(95, Math.max(targetProgress, realProgress))
      }
    }, 50)

    const maxWaitTimer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        setProgress(100)
      }
    }, 5000) // Increased timeout for heavy pages

    return () => {
      clearTimeout(initTimer)
      clearInterval(progressInterval)
      clearTimeout(maxWaitTimer)
      if (rafId) cancelAnimationFrame(rafId)
      if (observer) observer.disconnect()
      document.body.style.overflow = ''
    }
  }, [onLoading])

  // Complete loading sequence when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      
      const completeTimer = setTimeout(() => {
        setPhase('complete')
        
        setTimeout(() => {
          setPhase('sweeping')
          setTimeout(() => {
            setPhase('fadeout')
            setTimeout(() => setIsVisible(false), 400)
          }, 500)
        }, 150)
      }, 100)

      return () => clearTimeout(completeTimer)
    }
  }, [progress])

  if (!isVisible) return null

  return (
    <div className={`loading-cover ${phase}`} style={{ '--progress': `${progress}%`, '--progress-num': progress }}>
      {/* Left side - Vertical Progress Bar */}
      <div className="progress-container">
        <div className="progress-track">
          <div className="progress-fill" />
        </div>
      </div>

      {/* Right side - Vertical Text (rotated 90 degrees) */}
      <div className="site-name-container">
        <div className="site-name">
          {siteName}
        </div>
      </div>

      {/* Progress Info - follows progress bar */}
      <div className="progress-info">
        <div className="progress-percent">
          {Math.floor(progress)}%
        </div>
        <div className="status-line">
          <span className="status-dot" />
          <span className="status-text">
            {phase === 'init' && textInit}
            {phase === 'loading' && textLoading}
            {phase === 'complete' && textComplete}
            {phase === 'sweeping' && textSweeping}
            {phase === 'fadeout' && textFadeout}
          </span>
        </div>
      </div>

      {/* Sweep overlay - full screen cover from left to right */}
      <div className="sweep-overlay" />

      {/* Optional Loading Image */}
      {loadingImage && (
        <div className="loading-image-container">
          <img src={loadingImage} alt="Loading" className="loading-image" />
        </div>
      )}

      <style jsx>{`
        .loading-cover {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0f1419;
          z-index: 99999;
          overflow: hidden;
        }

        /* Loading Image */
        .loading-image-container {
          position: absolute;
          top: 50%;
          right: 15%; /* Desktop: Right Center */
          transform: translateY(-50%);
          z-index: 10;
          pointer-events: none;
        }
        
        .loading-image {
          max-width: 200px;
          max-height: 200px;
          opacity: 0.8;
          filter: drop-shadow(0 0 10px rgba(251, 251, 70, 0.3));
        }

        /* Progress Bar Container - Left Side */
        .progress-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 100%;
          background: rgba(251, 251, 70, 0.15);
        }

        .progress-track {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--progress); /* Vertical growth */
          background: #FBFB46;
          transition: height 0.08s linear;
          box-shadow: 0 0 10px rgba(251, 251, 70, 0.6);
        }

        /* Right side - Vertical Text */
        .site-name-container {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 50px;
        }

        .site-name {
          font-family: 'Orbitron', 'Rajdhani', 'Share Tech Mono', 'Consolas', monospace;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: transparent;
          letter-spacing: 0.4em;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          background: rgba(251, 251, 70, 0.85);
          -webkit-background-clip: text;
          background-clip: text;
          user-select: none;
          text-shadow: 0 0 40px rgba(251, 251, 70, 0.3);
        }

        /* Progress Info - follows progress bar */
        .progress-info {
          position: absolute;
          left: 20px;
          top: var(--progress); /* Follows vertically */
          transform: translateY(-100%);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          transition: top 0.08s linear, left 0.08s linear;
          padding-bottom: 10px;
        }

        .progress-percent {
          font-family: 'Orbitron', 'Rajdhani', 'Share Tech Mono', 'Consolas', monospace;
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 700;
          color: #FBFB46;
          letter-spacing: 2px;
          line-height: 1;
          text-shadow: 0 0 30px rgba(251, 251, 70, 0.5);
        }

        .status-line {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: #FBFB46;
          border-radius: 50%;
          animation: pulse 1s ease-in-out infinite;
          box-shadow: 0 0 10px #FBFB46;
        }

        .status-text {
          font-family: 'Orbitron', 'Rajdhani', 'Share Tech Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 500;
          color: rgba(251, 251, 70, 0.7);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Sweep Overlay - Full screen cover */
        .sweep-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #FBFB46;
          transform: scaleX(0);
          transform-origin: left;
          pointer-events: none;
          z-index: 50;
        }

        .loading-cover.sweeping .sweep-overlay {
          animation: sweepCover 0.5s ease-in-out forwards;
        }

        .loading-cover.fadeout {
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .loading-cover.fadeout .sweep-overlay {
          transform: scaleX(1);
        }

        /* Grid background pattern */
        .loading-cover::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(251, 251, 70, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 251, 70, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            box-shadow: 0 0 10px #FBFB46, 0 0 20px rgba(251, 251, 70, 0.4);
          }
          50% { 
            opacity: 0.6; 
            box-shadow: 0 0 15px #FBFB46, 0 0 30px rgba(251, 251, 70, 0.2);
          }
        }

        @keyframes sweepCover {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          100% {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          /* Reposition Loading Image */
          .loading-image-container {
             top: 100px; /* Mobile: Top Center (below site name roughly) */
             right: auto;
             left: 50%;
             transform: translateX(-50%);
          }
          
          .loading-image {
             max-width: 120px; /* Smaller on mobile */
             max-height: 120px;
          }

          /* Reposition Site Name to Top Center */
          .site-name-container {
            right: 0;
            top: 40px;
            left: 0;
            width: 100%;
            height: auto;
            align-items: flex-start;
            padding-right: 0;
          }

          .site-name {
            font-size: 1.5rem;
            letter-spacing: 0.3em;
            writing-mode: horizontal-tb; /* Horizontal text */
            text-orientation: mixed;
            transform: none;
            background: rgba(251, 251, 70, 0.85);
            -webkit-background-clip: text;
            background-clip: text;
          }

          /* Reposition Progress Bar to Bottom */
          .progress-container {
            width: calc(100% - 5.5rem); /* Leave space for text (approx 88px) */
            height: 4px; /* Thin horizontal line */
            top: auto;
            bottom: 30px; /* Moved up slightly */
            left: 0;
          }
          
          .progress-fill {
            width: var(--progress); /* Horizontal growth */
            height: 100%;
            background: #FBFB46;
            transition: width 0.08s linear;
          }

          /* Progress Info follows horizontal bar */
          .progress-info {
            top: auto;
            bottom: 22px; /* Align baseline with bar roughly */
            left: 0;
            /* Calculate position: Percentage of the BAR width, not screen width */
            transform: translateX(calc( (100vw - 5.5rem) * var(--progress-num) / 100 + 10px ));
            align-items: flex-start; 
            padding-bottom: 0;
            flex-direction: row; /* Horizontal text layout */
            gap: 6px;
          }

          .progress-percent {
            font-size: 16px; /* Smaller, cleaner font */
            line-height: 1;
          }

          .status-text {
            display: none; /* Hide status text on mobile to keep it clean, or keep it? User asked for percentage specifically */
          }
          
          .status-line {
             display: none;
          }
          
          /* Adjust corner decoration */
          .loading-cover::after {
             display: none; /* Remove corner decoration on mobile to avoid clutter */
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingCover
