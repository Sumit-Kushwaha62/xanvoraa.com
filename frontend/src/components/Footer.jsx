import { useState } from 'react';
import { Link } from 'react-router-dom';
import xanvoraaLogo from '../assets/xanvoraa-x-mark.png';
import { API_ENDPOINTS, apiFetch } from '../config/api';

const SHOW_SHARED_CTA = false;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    setNewsletterStatus('sending');
    setNewsletterMessage('');

    try {
      const response = await apiFetch(API_ENDPOINTS.newsletter, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to subscribe');
      }

      setEmail('');
      setNewsletterStatus('success');
      setNewsletterMessage('Thank you for subscribing!');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="footer">
      {/* TEMPORARILY DISABLED: SHARED READY TO SCALE CTA - remove false wrapper when needed */}
      {SHOW_SHARED_CTA && (
      <div className="footer__cta-band">
        <div className="container">
          <div className="footer__cta-inner">
            <div className="footer__cta-text">
              <h2 className="footer__cta-title">Ready to scale your business?</h2>
              <p className="footer__cta-sub">Join 100+ brands already growing with Xanvoraa Technologies.</p>
            </div>
            <div className="footer__cta-actions">
              <Link to="/contact" className="btn-primary">Start a Project</Link>
              <Link to="/portfolio" className="btn-outline">View Work</Link>
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <img
                  className="footer__logo-image"
                  src={xanvoraaLogo}
                  alt="Xanvoraa Technologies"
                />
                <span className="brand-wordmark brand-wordmark--footer">
                  <span className="brand-wordmark__name">Xanvoraa</span>
                  <span className="brand-wordmark__descriptor">Technologies</span>
                </span>
              </Link>
              <p className="footer__tagline">
                Turning ambitious ideas into digital reality. We build high-performance 
                websites and digital experiences.
              </p>
              <div className="footer__contact-info">
                <a href="mailto:info@xanvoraa.com" className="footer__contact-item">
                  <span>info@xanvoraa.com</span>
                </a>
              </div>
              <div className="footer__social" style={{ marginTop: '16px' }}>
                <a 
                  href="https://www.facebook.com/profile.php?id=61591753907096" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer__social-link" 
                  aria-label="Xanvoraa Technologies Facebook Page"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a 
                  href="https://www.instagram.com/xanvoraatechnology/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer__social-link" 
                  aria-label="Xanvoraa Technologies Instagram Page"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/133387539/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer__social-link" 
                  aria-label="Xanvoraa Technologies LinkedIn Page"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a 
                  href="https://x.com/home" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer__social-link" 
                  aria-label="Xanvoraa Technologies Twitter Profile"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              </div>
            </div>

            <div className="footer__links-col">
              <h4 className="footer__col-title">Services</h4>
              <ul className="footer__list">
                <li><Link to="/services" className="footer__list-link">Web Development</Link></li>
                <li><Link to="/services" className="footer__list-link">App Development</Link></li>
                <li><Link to="/services" className="footer__list-link">AI &amp; Automation</Link></li>
                <li><Link to="/services" className="footer__list-link">WordPress Development</Link></li>
                <li><Link to="/services" className="footer__list-link">Maintenance &amp; Support</Link></li>
                <li><Link to="/services" className="footer__list-link">Custom Software Solutions</Link></li>
              </ul>
            </div>

            <div className="footer__links-col">
              <h4 className="footer__col-title">Company</h4>
              <ul className="footer__list">
                <li><Link to="/about" className="footer__list-link">About Us</Link></li>
                <li><Link to="/portfolio" className="footer__list-link">Our Work</Link></li>
                <li><Link to="/career" className="footer__list-link">Careers</Link></li>
                <li><Link to="/contact" className="footer__list-link">Contact</Link></li>
              </ul>
            </div>

            <div className="footer__newsletter">
              <h4 className="footer__col-title">Newsletter</h4>
              <p className="footer__newsletter-text">Get digital insights delivered to your inbox.</p>
              <form className="footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  required
                />
                <button
                  type="submit"
                  className="footer__newsletter-btn"
                  disabled={newsletterStatus === 'sending'}
                >
                  <span>{newsletterStatus === 'sending' ? 'Subscribing...' : 'Subscribe'}</span>
                </button>
              </form>
              {newsletterMessage && (
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: newsletterStatus === 'success' ? 'var(--cyan)' : '#ff6b6b',
                  }}
                >
                  {newsletterMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copy">© {currentYear} Xanvoraa Technologies. All rights reserved.</p>
            <div className="footer__bottom-links">
              <Link to="/privacy-policy" className="footer__bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="footer__bottom-link">Terms of Service</Link>
              <Link to={'/admin/login'} className={'footer__bottom-link'}>Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
