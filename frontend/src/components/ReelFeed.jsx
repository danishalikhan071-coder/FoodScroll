import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Reusable feed for vertical reels
// Props:
// - items: Array of video items { _id, video, description, likeCount, savesCount, commentsCount, comments, foodPartner }
// - onLike: (item) => void | Promise<void>
// - onSave: (item) => void | Promise<void>
// - emptyMessage: string
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map())
  const [mutedStates, setMutedStates] = useState(new Map())
  const [showMuteIcon, setShowMuteIcon] = useState(new Map())
  const muteIconTimeoutRef = useRef(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { /* ignore autoplay errors */ })
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  // Initialize muted state for new items (default: unmuted)
  useEffect(() => {
    setMutedStates((prev) => {
      const next = new Map(prev)
      items.forEach((item) => {
        if (!next.has(item._id)) {
          next.set(item._id, false) // false = unmuted
        }
      })
      return next
    })
  }, [items])

  const toggleMute = (itemId) => {
    const video = videoRefs.current.get(itemId)
    if (!video) return

    const currentMuted = mutedStates.get(itemId) ?? false
    const newMuted = !currentMuted
    
    video.muted = newMuted
    
    setMutedStates((prev) => {
      const next = new Map(prev)
      next.set(itemId, newMuted)
      return next
    })

    // Show icon overlay
    setShowMuteIcon((prev) => {
      const next = new Map(prev)
      next.set(itemId, true)
      return next
    })

    // Clear existing timeout for this video
    const existingTimeout = muteIconTimeoutRef.current.get(itemId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Hide icon after 2 seconds
    const timeout = setTimeout(() => {
      setShowMuteIcon((prev) => {
        const next = new Map(prev)
        next.set(itemId, false)
        return next
      })
      muteIconTimeoutRef.current.delete(itemId)
    }, 2000)

    muteIconTimeoutRef.current.set(itemId, timeout)
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      muteIconTimeoutRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => {
          const isMuted = mutedStates.get(item._id) ?? false
          const showIcon = showMuteIcon.get(item._id) ?? false
          
          return (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              muted={isMuted}
              playsInline
              loop
              preload="metadata"
              style={{ cursor: 'pointer' }}
            />
            
            {showIcon && (
              <div className="reel-mute-icon-overlay">
                {isMuted ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 17.5L2.5 2.5"/>
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                )}
              </div>
            )}

            <div 
              className="reel-overlay"
              onClick={(e) => {
                // Only toggle mute if clicking on the overlay itself, not on buttons
                if (e.target === e.currentTarget || e.target.closest('.reel-overlay-gradient')) {
                  toggleMute(item._id)
                }
              }}
            >
              <div className="reel-overlay-gradient" aria-hidden="true" />
              <div className="reel-actions" onClick={(e) => e.stopPropagation()}>
                <div className="reel-action-group">
                  <button
                    onClick={onLike ? () => onLike(item) : undefined}
                    className="reel-action"
                    aria-label="Like"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button
                    className="reel-action"
                    onClick={onSave ? () => onSave(item) : undefined}
                    aria-label="Bookmark"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button className="reel-action" aria-label="Comments">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
                </div>
              </div>

              <div className="reel-content" onClick={(e) => e.stopPropagation()}>
                <p className="reel-description" title={item.description}>{item.description}</p>
                {item.foodPartner && (
                  <Link className="reel-btn" to={"/food-partner/" + item.foodPartner} aria-label="Visit store">Visit store</Link>
                )}
              </div>
            </div>
          </section>
          )
        })}
      </div>
    </div>
  )
}

export default ReelFeed
