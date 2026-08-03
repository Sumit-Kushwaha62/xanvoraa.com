import useDeferredVideo from '../hooks/useDeferredVideo'

export default function PageHeroVideo({ src, poster }) {
  const loadVideo = useDeferredVideo()

  return (
    <div className="page-hero__media" aria-hidden="true">
      <video
        className="page-hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
      >
        {loadVideo && <source src={src} type="video/mp4" />}
      </video>
      <div className="page-hero__video-overlay" />
    </div>
  )
}
