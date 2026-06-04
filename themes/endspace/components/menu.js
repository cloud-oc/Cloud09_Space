import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const isClassIcon = icon =>
  typeof icon === 'string' &&
  /(^|\s)(fa[srldb]?|fa-|iconfont|ri-|remixicon)/.test(icon.trim())

const normalizeIcon = link => {
  const iconField = link?.icon || ''
  const rawIcon =
    iconField ||
    link?.pageIcon ||
    link?.rawPageIcon ||
    link?.raw_page_icon ||
    link?.page_icon ||
    link?.format?.page_icon ||
    link?.notionIcon ||
    link?.notion_icon ||
    link?.iconUrl ||
    link?.iconURL ||
    link?.icon_url ||
    link?.emoji ||
    ''
  return {
    pageIcon: isClassIcon(rawIcon) ? '' : rawIcon,
    customIcon: isClassIcon(rawIcon) ? rawIcon : link?.customIcon || null
  }
}

const normalizeHref = link => {
  const value = link?.href || link?.path || link?.url || link?.to || link?.slug || ''
  if (!value) return ''
  if (value.startsWith('/') || value.startsWith('http') || value.startsWith('#')) {
    return value
  }
  return `/${value}`
}

const normalizeMenuItem = (link, index) => {
  if (!link || link.show === false) return null
  const name = link.name || link.title || link.label || ''
  const path = normalizeHref(link)
  if (!name || !path) return null
  const icons = normalizeIcon(link)
  const subMenus = normalizeMenu(link.subMenus)

  return {
    ...link,
    id: link.id || `endspace-menu-${index}`,
    name,
    path,
    href: path,
    target: link.target,
    pageIcon: icons.pageIcon,
    customIcon: icons.customIcon,
    subMenus
  }
}

const normalizeMenu = links =>
  (Array.isArray(links) ? links : [])
    .map(normalizeMenuItem)
    .filter(Boolean)

export const getEndspaceMenuItems = ({ customNav, customMenu } = {}) => {
  const defaultLinks = [
    { name: 'Home', path: '/' },
    { name: 'Category', path: '/category', show: siteConfig('ENDSPACE_MENU_CATEGORY', null, CONFIG) },
    { name: 'Tag', path: '/tag', show: siteConfig('ENDSPACE_MENU_TAG', null, CONFIG) },
    { name: 'Archive', path: '/archive', show: siteConfig('ENDSPACE_MENU_ARCHIVE', null, CONFIG) },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Friends', path: '/friends' },
    { name: 'Search', path: '/search', show: siteConfig('ENDSPACE_MENU_SEARCH', null, CONFIG) }
  ]

  let links = defaultLinks
  if (Array.isArray(customNav) && customNav.length > 0) {
    links = links.concat(customNav)
  }
  if (siteConfig('CUSTOM_MENU') && Array.isArray(customMenu)) {
    links = customMenu
  }

  return normalizeMenu(links)
}

export const getEndspaceActiveMenuName = (menuItems, asPath = '/') => {
  const cleanPath = asPath.split(/[?#]/)[0] || '/'
  const activeItem = menuItems
    .filter(item => item.path && !item.path.startsWith('http') && !item.path.startsWith('#'))
    .find(item => isEndspaceMenuItemActive(item, cleanPath))

  return activeItem?.name || menuItems[0]?.name || ''
}

export const isEndspaceMenuItemActive = (item, asPath = '/') => {
  if (!item?.path) return false

  const cleanPath = asPath.split(/[?#]/)[0] || '/'
  const selfActive =
    item.path === '/'
      ? cleanPath === '/'
      : !item.path.startsWith('http') &&
        !item.path.startsWith('#') &&
        (cleanPath === item.path || cleanPath.startsWith(`${item.path}/`))

  if (selfActive) return true

  return item.subMenus?.some(subMenu => isEndspaceMenuItemActive(subMenu, cleanPath)) || false
}
