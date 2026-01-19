import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'
import { EndspacePlayer } from './EndspacePlayer'
import {
  IconMenu2,
  IconX,
  IconMail,
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandWeibo,
  IconBrandBilibili,
  IconBrandTelegram,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandWechat,
  IconPlanet
} from '@tabler/icons-react'
// Conceptual Navigation Icons (Solid, Angular)
import AppsFillIcon from 'remixicon-react/AppsFillIcon'
import BookMarkFillIcon from 'remixicon-react/BookMarkFillIcon'
import BarcodeFillIcon from 'remixicon-react/BarcodeFillIcon'
import StackFillIcon from 'remixicon-react/StackFillIcon'
import Compass3FillIcon from 'remixicon-react/Compass3FillIcon'
import EarthFillIcon from 'remixicon-react/EarthFillIcon'
import ProfileFillIcon from 'remixicon-react/ProfileFillIcon'

// Icon mapping (Conceptual Remix Icons)
const IconComponents = {
  'Home': AppsFillIcon,
  'Category': BookMarkFillIcon,
  'Tag': BarcodeFillIcon,
  'Archive': StackFillIcon,
  'Search': Compass3FillIcon,
  'Friends': EarthFillIcon,
  'Portfolio': ProfileFillIcon
}

// Social icon mapping
const SocialIconComponents = {
  'CONTACT_GITHUB': IconBrandGithub,
  'CONTACT_TWITTER': IconBrandTwitter,
  'CONTACT_WEIBO': IconBrandWeibo,
  'CONTACT_BILIBILI': IconBrandBilibili,
  'CONTACT_TELEGRAM': IconBrandTelegram,
  'CONTACT_INSTAGRAM': IconBrandInstagram,
  'CONTACT_YOUTUBE': IconBrandYoutube,
  'CONTACT_LINKEDIN': IconBrandLinkedin,
  'CONTACT_WEHCHAT_PUBLIC': IconBrandWechat,
  'CONTACT_ZHISHIXINGQIU': IconPlanet
}

export const MobileNav = (props) => {
  const router = useRouter()
  const { siteInfo } = useGlobal()
  const [activeTab, setActiveTab] = useState('Home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Get avatar from props or global context
  const avatarUrl = props?.siteInfo?.icon || siteInfo?.icon || siteConfig('AVATAR')

  // All navigation items
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Category', path: '/category', show: siteConfig('ENDSPACE_MENU_CATEGORY', null, CONFIG) },
    { name: 'Tag', path: '/tag', show: siteConfig('ENDSPACE_MENU_TAG', null, CONFIG) },
    { name: 'Archive', path: '/archive', show: siteConfig('ENDSPACE_MENU_ARCHIVE', null, CONFIG) },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Friends', path: '/friend' },
    { name: 'Search', path: '/search', show: siteConfig('ENDSPACE_MENU_SEARCH', null, CONFIG) }
  ].filter(item => item.show !== false)

  // Social icon config - using contact.config.js settings
  const socialLinks = [
    { key: 'CONTACT_GITHUB', label: 'GitHub' },
    { key: 'CONTACT_TWITTER', label: 'Twitter' },
    { key: 'CONTACT_WEIBO', label: 'Weibo' },
    { key: 'CONTACT_BILIBILI', label: 'Bilibili' },
    { key: 'CONTACT_TELEGRAM', label: 'Telegram' },
    { key: 'CONTACT_INSTAGRAM', label: 'Instagram' },
    { key: 'CONTACT_YOUTUBE', label: 'YouTube' },
    { key: 'CONTACT_XIAOHONGSHU', svg: '/svg/xiaohongshu.svg', label: 'Xiaohongshu' },
    { key: 'CONTACT_LINKEDIN', label: 'LinkedIn' },
    { key: 'CONTACT_ZHISHIXINGQIU', label: 'Zhishixingqiu' },
    { key: 'CONTACT_WEHCHAT_PUBLIC', label: 'WeChat' },
  ]

  // Email
  const email = siteConfig('CONTACT_EMAIL')

  useEffect(() => {
    const path = router.asPath
    if (path === '/') setActiveTab('Home')
    else if (path.includes('/category')) setActiveTab('Category')
    else if (path.includes('/tag')) setActiveTab('Tag')
    else if (path.includes('/archive')) setActiveTab('Archive')
    else if (path.includes('/search')) setActiveTab('Search')
    else if (path.includes('/friend')) setActiveTab('Friends')
    else if (path.includes('/portfolio')) setActiveTab('Portfolio')
  }, [router.asPath])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [router.asPath])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Render icon component
  const renderIcon = (name) => {
    const IconComponent = IconComponents[name]
    if (!IconComponent) return null
    return <IconComponent size={20} stroke={1.5} className="w-6 text-center" />
  }

  // Render social icon
  const renderSocialIcon = (key, svg, label) => {
    if (svg) {
      return <img src={svg} alt={label} className="w-4 h-4 opacity-60" />
    }
    const IconComponent = SocialIconComponents[key]
    if (IconComponent) {
      return <IconComponent size={16} stroke={1.5} />
    }
    return null
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-[var(--endspace-bg-primary)]/95 backdrop-blur-sm border-b border-[var(--endspace-border-base)] safe-area-top">
        <div className="flex items-center justify-between h-20 px-5">
          {/* Left: Avatar */}
          <SmartLink href="/cloud09" title="Profile" className="flex-shrink-0 flex items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden transition-colors">
              <img 
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </SmartLink>

          {/* Right: Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-14 h-14 flex items-center justify-center text-[var(--endspace-text-primary)] hover:text-[#d4d4d8] transition-colors"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <IconX size={28} stroke={1.5} />
            ) : (
              <IconMenu2 size={28} stroke={1.5} />
            )}
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Slide-in Menu Panel */}
      <div 
        className={`fixed top-20 right-0 bottom-0 w-72 max-w-[80vw] z-40 md:hidden bg-[var(--endspace-bg-primary)] border-l border-[var(--endspace-border-base)] transition-transform duration-300 ease-out overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <div className="py-3 pt-5">
          <p className="px-5 text-xs font-mono text-[var(--endspace-text-muted)] mb-2 uppercase tracking-wider">Navigation</p>
          {menuItems.map(item => (
            <SmartLink
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 transition-all ${
                activeTab === item.name
                  ? 'bg-[#d4d4d8] text-[var(--endspace-text-primary)]'
                  : 'text-[var(--endspace-text-secondary)] hover:bg-[#d4d4d8] hover:text-[var(--endspace-text-primary)]'
              }`}
            >
              {renderIcon(item.name)}
              <span className="text-base font-medium">{item.name}</span>
            </SmartLink>
          ))}
        </div>

        {/* Music Player */}
        <div className="p-5 border-t border-[var(--endspace-border-base)]">
          <p className="text-xs font-mono text-[var(--endspace-text-muted)] mb-3 uppercase tracking-wider">Music</p>
          <EndspacePlayer isExpanded={true} />
        </div>

        {/* Social Links */}
        <div className="p-5 border-t border-[var(--endspace-border-base)]">
          <p className="text-xs font-mono text-[var(--endspace-text-muted)] mb-3 uppercase tracking-wider">Contact</p>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Email */}
            {email && (
              <a
                href={`mailto:${email}`}
                title={email}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--endspace-bg-secondary)] text-[var(--endspace-text-muted)] hover:text-[var(--endspace-text-primary)] hover:bg-[#d4d4d8] transition-colors"
              >
                <IconMail size={16} stroke={1.5} />
              </a>
            )}
            {socialLinks.map(social => {
              const url = siteConfig(social.key)
              if (!url) return null
              return (
                <a
                  key={social.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--endspace-bg-secondary)] text-[var(--endspace-text-muted)] hover:text-[var(--endspace-text-primary)] hover:bg-[#d4d4d8] transition-colors"
                >
                  {renderSocialIcon(social.key, social.svg, social.label)}
                </a>
              )
            })}
          </div>
        </div>

        {/* Theme Toggle or other utilities could go here */}
        <div className="p-5 border-t border-[var(--endspace-border-base)] mt-auto">
          <div className="text-xs text-[var(--endspace-text-muted)] font-mono">
            © {new Date().getFullYear()} {siteConfig('AUTHOR') || 'Cloud'}
          </div>
        </div>
      </div>

      {/* Top spacer for content */}
      <div className="h-20 md:hidden" />
    </>
  )
}

export default MobileNav
