import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { IconArrowRight } from '@tabler/icons-react'

/**
 * BlogPostCard Component - Minimalist Light Industrial
 * Post card with clean design
 */
export const BlogPostCard = ({ post, showSummary = true }) => {
  const showPreview = siteConfig('ENDSPACE_POST_LIST_PREVIEW', true, CONFIG)
  const showCover = siteConfig('ENDSPACE_POST_LIST_COVER', true, CONFIG)
  const hasCover = showCover && post.pageCoverThumbnail

  return (
    <SmartLink href={`/${post.slug}`}>
      <article className={`endspace-frame group mb-6 flex flex-col md:flex-row overflow-hidden hover:bg-black hover:border-[var(--endspace-border-active)] transition-all duration-300 ${hasCover ? '' : 'p-6 md:p-8'}`}>
        
        {/* Content - Left side with padding */}
        <div className={`flex-1 flex flex-col justify-center ${hasCover ? 'p-6 md:p-8' : ''}`}>
          
          {/* Top Meta */}
          <div className="flex items-center gap-3 text-xs font-mono text-[var(--endspace-text-muted)] mb-3 group-hover:text-gray-400 transition-colors">
             <span className="text-[var(--endspace-text-primary)] font-bold group-hover:text-[var(--endspace-accent-yellow)] transition-colors">
                 {post.publishDay}
             </span>
             <span className="w-px h-3 bg-[var(--endspace-border-base)] group-hover:bg-gray-600 transition-colors" />
             {post.category && (
                <span className="tracking-wider">{post.category.toUpperCase()}</span>
             )}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-black text-[var(--endspace-text-primary)] mb-4 leading-tight group-hover:text-[var(--endspace-accent-yellow)] transition-colors">
            {post.title}
          </h2>

          {/* Summary */}
          {showSummary && showPreview && post.summary && (
            <p className="text-[var(--endspace-text-secondary)] text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 font-medium group-hover:text-gray-300 transition-colors">
              {post.summary}
            </p>
          )}

          {/* Footer / Read More */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex gap-2">
                {post.tags?.slice(0,3).map(tag => (
                    <span key={tag} className="text-[10px] text-[var(--endspace-text-muted)] bg-[var(--endspace-bg-secondary)] px-1.5 py-0.5 rounded group-hover:text-gray-200 group-hover:bg-opacity-20 transition-colors">
                        #{tag}
                    </span>
                ))}
            </div>
            
            <div className="flex items-center gap-2 text-[var(--endspace-text-primary)] text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all group-hover:text-white">
                <span>Access</span>
                <IconArrowRight size={12} stroke={2} className="group-hover:translate-x-1 transition-transform group-hover:text-[var(--endspace-accent-yellow)]" />
            </div>
          </div>
        </div>

        {/* Cover Image - Fixed size, flush right, no frame */}
        {hasCover && (
          <div className="md:w-64 lg:w-80 h-48 md:h-auto flex-shrink-0 relative overflow-hidden order-first md:order-last">
            <img
              src={post.pageCoverThumbnail}
              alt={post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Minimalist marker overlay */}
            <div className="absolute top-3 right-3 w-2 h-2 bg-[var(--endspace-accent-yellow)] opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Corner decoration on hover */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[var(--endspace-accent-cyan)] opacity-0 group-hover:opacity-60 transition-opacity" />
          </div>
        )}
      </article>
    </SmartLink>
  )
}
