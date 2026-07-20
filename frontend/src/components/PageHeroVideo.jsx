import { useState, useEffect } from 'react'

export default function PageHeroVideo({ src, poster }) {
  const [loadVideo, setLoadVideo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadVideo(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="page-hero__media" aria-hidden="true">
      <video
        className="page-hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        {loadVideo && <source src={src} type="video/mp4" />}
      </video>
      <div className="page-hero__video-overlay" />
    </div>
  )
}