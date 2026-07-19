import Seo from '../components/Seo'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <section className="legal-page">
      <Seo
        title="Terms of Service | Xanvoraa Technologies"
        description="Xanvoraa Technologies Terms of Service govern the use of our website and outline our project agreements."
        path="/terms"
      />
      <div className="container legal-page__inner">
        <p className="legal-page__eyebrow">Legal</p>
        <h1>Terms of <span>Service</span></h1>
        <p className="legal-page__updated">Last updated: 18 July 2026</p>
        <div className="legal-page__content">
          <p>These terms govern use of the Xanvoraa Technologies website. Project-specific work is governed by the written proposal or agreement accepted by the client.</p>
          <h2>Website use</h2>
          <p>You may use this website for lawful enquiries and genuine applications. You must not attempt unauthorized access, disrupt the service, upload malicious files, scrape protected areas or submit misleading information.</p>
          <h2>Project information and pricing</h2>
          <p>Website pricing and timelines are indicative starting points, not binding quotations. Final scope, milestones, fees, ownership, support and delivery dates are confirmed in a written project agreement.</p>
          <h2>Intellectual property</h2>
          <p>Website content, branding and design remain the property of Xanvoraa Technologies or their respective owners. Client deliverables and usage rights are defined in the applicable project agreement.</p>
          <h2>Third-party services</h2>
          <p>The website may rely on or link to third-party platforms. Their availability, terms and privacy practices are outside our control.</p>
          <h2>Disclaimer and liability</h2>
          <p>The website is provided on an as-available basis. To the extent permitted by law, Xanvoraa Technologies is not liable for indirect or consequential losses arising solely from website use.</p>
          <h2>Changes</h2>
          <p>We may update these terms when the website or applicable requirements change. Continued use after an update means you accept the revised terms.</p>
          <h2>Contact</h2>
          <p>Questions can be sent to <a href="mailto:info@xanvoraa.com">info@xanvoraa.com</a>.</p>
          <Link className="legal-page__back" to="/contact">Discuss a project</Link>
        </div>
      </div>
    </section>
  )
}