import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://xanvoraa.com'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE }) {
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`
  const isHomePage = path === '/' || path === ''

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Xanvoraa Technologies" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {isHomePage && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Xanvoraa Technologies",
            "url": SITE_URL,
            "logo": `${SITE_URL}/favicon-512.png`,
            "description": "Software and web development agency building custom software, websites and mobile apps for hospitals, schools, startups and enterprises.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Wright Town",
              "addressLocality": "Jabalpur",
              "addressRegion": "Madhya Pradesh",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-7067694391",
              "email": "info@xanvoraa.com",
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61591753907096",
              "https://www.instagram.com/xanvoraa_technologies/",
              "https://www.linkedin.com/company/133387539/",
              "https://x.com/xanvoraatech"
            ]
          })}
        </script>
      )}
    </Helmet>
  )
}