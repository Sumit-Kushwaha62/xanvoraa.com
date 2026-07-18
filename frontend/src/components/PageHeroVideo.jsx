export default function PageHeroVideo({ src }) {
  return (
    <div className="page-hero__media" aria-hidden="true">
      <video
        className="page-hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="page-hero__video-overlay" />
    </div>
  )
}