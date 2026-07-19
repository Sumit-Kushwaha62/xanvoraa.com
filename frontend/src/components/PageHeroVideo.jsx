export default function PageHeroVideo({ src, poster }) {
  return (
    <div className="page-hero__media" aria-hidden="true">
      <video
        className="page-hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="page-hero__video-overlay" />
    </div>
  )
}