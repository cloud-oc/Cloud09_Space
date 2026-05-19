const EMOJI_PATTERN =
  /[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/u

const isUrlIcon = icon =>
  typeof icon === 'string' &&
  (icon.startsWith('http') || icon.startsWith('data:') || icon.startsWith('/'))

const isEmojiIcon = icon => typeof icon === 'string' && EMOJI_PATTERN.test(icon)

const isNotionBuiltinIcon = icon => {
  if (typeof icon !== 'string') return false
  return (
    icon.includes('/icons/') ||
    icon.includes('notion.so/icons/') ||
    icon.includes('notion.site/icons/')
  )
}

export default function NotionMenuIcon({ icon, className = '' }) {
  if (!icon) return null

  if (isNotionBuiltinIcon(icon) && !isEmojiIcon(icon)) {
    return (
      <span
        className={`endspace-notion-menu-icon endspace-notion-menu-icon-mask ${className}`}
        style={{
          WebkitMaskImage: `url("${icon}")`,
          maskImage: `url("${icon}")`
        }}
      />
    )
  }

  if (isUrlIcon(icon) && !isEmojiIcon(icon)) {
    return (
      <img
        src={icon}
        alt=""
        className={`endspace-notion-menu-image ${className}`}
        aria-hidden="true"
      />
    )
  }

  return (
    <span className={`endspace-notion-menu-emoji ${className}`}>
      {icon}
    </span>
  )
}
