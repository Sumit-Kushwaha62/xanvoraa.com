import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <section className="legal-page">
      <div className="container legal-page__inner">
        <p className="legal-page__eyebrow">Legal</p>
        <h1>Privacy <span>Policy</span></h1>
        <p className="legal-page__updated">Last updated: 18 July 2026</p>
        <div className="legal-page__content">
          <p>This policy explains how Xanvoraa Technologies handles information submitted through this website.</p>
          <h2>Information we collect</h2>
          <p>We collect information you choose to provide through contact, career and newsletter forms. This can include your name, email, phone number, project details, portfolio link and resume. Chat interactions may include a session identifier, messages and basic request metadata used for security and service operation.</p>
          <h2>How we use information</h2>
          <p>We use this information to respond to enquiries, evaluate job applications, deliver requested updates, operate the chatbot, prevent abuse and improve our services. We do not sell personal information.</p>
          <h2>Storage and service providers</h2>
          <p>Information may be processed by service providers used for database hosting, private file storage, email notifications, spreadsheets and AI responses. Resumes uploaded through the career form are stored privately and are available only through the authenticated admin dashboard.</p>
          <h2>Retention and security</h2>
          <p>We retain information only as long as reasonably needed for business, legal and security purposes. We apply access controls and technical safeguards, but no internet service can guarantee absolute security.</p>
          <h2>Your choices</h2>
          <p>You may ask us to correct or delete your submitted information, subject to legal and operational requirements. Newsletter recipients can request removal at any time.</p>
          <h2>Contact</h2>
          <p>For privacy questions, email <a href="mailto:info@xanvoraa.com">info@xanvoraa.com</a> or call <a href="tel:+917067694391">+91 70676 94391</a>.</p>
          <Link className="legal-page__back" to="/contact">Contact us</Link>
        </div>
      </div>
    </section>
  )
}