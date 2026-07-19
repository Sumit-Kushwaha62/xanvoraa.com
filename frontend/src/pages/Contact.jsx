import Seo from '../components/Seo'
import PageHeroVideo from '../components/PageHeroVideo'
import pageHeroVideo from '../assets/bg_contact_page.mp4'
import pageHeroPoster from '../assets/bg_contact_page_poster.webp'
import { useState } from 'react'
import SiteIcon from '../components/SiteIcon'
import { API_ENDPOINTS, apiFetch } from '../config/api'
import {
  BUDGET_OPTIONS,
  COUNTRY_OPTIONS,
  SERVICE_OPTIONS,
} from '../config/contactFormOptions'

const contactMethods = [
  {
    icon: 'message',
    title: 'WhatsApp',
    desc: 'Fastest response — reply within 1 hour',
    action: 'Chat Now',
    href: 'https://wa.me/917067694391?text=Hi%20Xanvoraa%20Technologies!%20I%20want%20to%20discuss%20a%20project.',
    color: '#25D366',
  },
  {
    icon: 'email',
    title: 'Email',
    desc: 'info@xanvoraa.com',
    action: 'Send Email',
    href: 'mailto:info@xanvoraa.com',
    color: '#6C63FF',
  },
  {
    icon: 'phone',
    title: 'Phone',
    desc: '+91 70676 94391',
    action: 'Call Now',
    href: 'tel:+917067694391',
    color: '#00D4AA',
  },
  {
    icon: 'location',
    title: 'Location',
    desc: 'Right Town, Jabalpur, MP',
    action: 'Get Directions',
    href: 'https://www.google.com/maps/search/?api=1&query=Right+Town%2C+Jabalpur%2C+Madhya+Pradesh',
    color: '#FF6B6B',
  },
]

const EMPTY_FORM = {
  name: '',
  email: '',
  country: '',
  service: '',
  budget: '',
  mobile: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = ['name', 'email', 'country', 'service', 'budget', 'mobile']
    const hasMissingField = requiredFields.some(field => !form[field].trim())

    if (hasMissingField) {
      setStatus('error')
      setErrorMessage('Please complete all required fields before submitting.')
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await apiFetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          country: form.country,
          service: form.service,
          budget: form.budget,
          message: form.message.trim(),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        const missingFields = Array.isArray(data.fields) && data.fields.length > 0
          ? `: ${data.fields.join(', ')}`
          : ''

        throw new Error(`${data.message || 'Unable to submit your request'}${missingFields}`)
      }

      setStatus('sent')
      setForm(EMPTY_FORM)
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error.message || 'Something went wrong. Please try again or contact us directly on WhatsApp.',
      )
    }
  }

  return (
    <div className="contact-page">
      <Seo
        title="Contact Xanvoraa Technologies | Jabalpur"
        description="Contact Xanvoraa Technologies in Jabalpur for custom software, web development, mobile apps, AI automation and support."
        path="/contact"
      />

      {/* ── HERO ── */}
      <section className="page-hero">
        <PageHeroVideo src={pageHeroVideo} poster={pageHeroPoster} />
        <div className="page-hero__orb page-hero__orb--1" />
        <div className="page-hero__orb page-hero__orb--2" />
        <div className="container">
          <span className="section-tag">Get In Touch</span>
          <h1 className="page-hero__title">
            Let's Talk About<br />
            <span className="gradient-text">Your Project</span>
          </h1>
          <p className="page-hero__sub">
            Free consultation · No obligation · Reply within 2 hours
          </p>
          <div className="page-hero__actions" data-hero-actions="contact">
            <a href="https://wa.me/917067694391?text=Hi! I want to discuss a project." target="_blank" rel="noreferrer" className="btn-primary">Chat on WhatsApp</a>
            <a href="#contact-form" className="btn-outline">Send a Message →</a>
          </div>
        </div>
      </section>

      {/* ── CONTACT METHODS ── */}
      <section className="section">
        <div className="container">
          <div className="contact-methods">
            {contactMethods.map((m, i) => (
              <a
                key={i}
                href={m.href}
                target="_blank"
                rel="noreferrer"
                className="contact-method"
                style={{ '--card-color': m.color }}
              >
                <span className="contact-method__icon"><SiteIcon name={m.icon} size={30} /></span>
                <div>
                  <h3 className="contact-method__title">{m.title}</h3>
                  <p className="contact-method__desc">{m.desc}</p>
                </div>
                <span className="contact-method__action">{m.action} →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + INFO ── */}
      <section className="section" id="contact-form" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-layout">

            {/* Form */}
            <div className="contact-form-wrap">
              <h2 className="contact-form-wrap__title">
                Send Us a <span className="gradient-text">Message</span>
              </h2>
              <p className="contact-form-wrap__sub">
                Fill in the details below — we'll get back to you within 2 hours on WhatsApp or email.
              </p>

              {status === 'sent' ? (
                <div className="contact-success">
                  <span className="contact-success__icon"><SiteIcon name="check" size={52} /></span>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you! Your request has been received. Our team will contact you within 24 hours.</p>
                  <button
                    className="btn-primary"
                    onClick={() => setStatus(null)}
                    style={{ marginTop: 20 }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="contact-form__row">
                    <div className="contact-form__field">
                      <label className="contact-form__label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ramesh Sharma"
                        required
                      />
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form__field">
                    <label className="contact-form__label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ramesh@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="contact-form__row">
                    <div className="contact-form__field">
                      <label className="contact-form__label">Country *</label>
                      <select name="country" value={form.country} onChange={handleChange} required>
                        <option value="">Select country...</option>
                        {COUNTRY_OPTIONS.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label">Service Interested *</label>
                      <select name="service" value={form.service} onChange={handleChange} required>
                        <option value="">Select a service...</option>
                        {SERVICE_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="contact-form__field">
                    <label className="contact-form__label">Budget *</label>
                    <select name="budget" value={form.budget} onChange={handleChange} required>
                      <option value="">Select budget...</option>
                      {BUDGET_OPTIONS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-form__field">
                    <label className="contact-form__label">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project — what do you want to build, who is it for, any special requirements..."
                      rows={5}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="contact-form__error">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn-primary contact-form__submit"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="contact-form__spinner" />
                        Sending...
                      </>
                    ) : (
                      <>Send Message →</>
                    )}
                  </button>

                  <p className="contact-form__note">
                    🔒 Your information is 100% confidential. We sign NDA on request.
                  </p>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="contact-info">
              <div className="contact-info__card">
                <h3 className="contact-info__title">Why Contact Us?</h3>
                <ul className="contact-info__list">
                  {[
                    'Free 30-min project consultation',
                    'Honest advice — even if we\'re not the right fit',
                    'Detailed proposal within 24 hours',
                    'Fixed quote, no hidden charges',
                    'NDA signed before project starts',
                    'Local team in Jabalpur, MP',
                  ].map((item, i) => (
                    <li key={i} className="contact-info__item">
                      <span className="contact-info__check"><SiteIcon name="check" size={15} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="contact-info__card">
                <h3 className="contact-info__title">Working Hours</h3>
                <div className="contact-hours">
                  <div className="contact-hours__row">
                    <span>Monday – Saturday</span>
                    <span className="contact-hours__time">9 AM – 7 PM</span>
                  </div>
                  <div className="contact-hours__row">
                    <span>Sunday</span>
                    <span className="contact-hours__time">10 AM – 4 PM</span>
                  </div>
                  <div className="contact-hours__row">
                    <span>WhatsApp Support</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>24/7</span>
                  </div>
                </div>
              </div>

              <div className="contact-info__card">
                <h3 className="contact-info__title">Response Time</h3>
                <div className="contact-response">
                  <div className="contact-response__item">

                    <span className="contact-response__icon"><SiteIcon name="message" size={22} /></span>
                    <div>
                      <p className="contact-response__channel">WhatsApp</p>
                      <p className="contact-response__time">Within 1 hour</p>
                    </div>
                  </div>
                  <div className="contact-response__item">
                    <span className="contact-response__icon"><SiteIcon name="email" size={22} /></span>
                    <div>
                      <p className="contact-response__channel">Email</p>
                      <p className="contact-response__time">Within 4 hours</p>
                    </div>
                  </div>
                  <div className="contact-response__item">
                    <span className="contact-response__icon"><SiteIcon name="clipboard" size={22} /></span>
                    <div>
                      <p className="contact-response__channel">Project Proposal</p>
                      <p className="contact-response__time">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="contact-map">
            <div className="contact-map__header">
              <div>
                <h2 className="contact-map__title">Visit Our Office</h2>
                <p className="contact-map__address">Right Town, Jabalpur, Madhya Pradesh</p>
              </div>
              <a
                className="contact-map__directions"
                href="https://www.google.com/maps/search/?api=1&query=Right+Town%2C+Jabalpur%2C+Madhya+Pradesh"
                target="_blank"
                rel="noreferrer"
              >
                Get Directions →
              </a>
            </div>
            <iframe
              className="contact-map__frame"
              title="Xanvoraa office location in Right Town, Jabalpur"
              src="https://www.google.com/maps?q=Right%20Town%2C%20Jabalpur%2C%20Madhya%20Pradesh&t=k&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

    </div>
  )
}














