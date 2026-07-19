import Seo from '../components/Seo'
import PageHeroVideo from '../components/PageHeroVideo'
import pageHeroVideo from '../assets/bg_career_page.mp4'
import pageHeroPoster from '../assets/bg_career_page_poster.webp'
import { useState } from 'react'
import SiteIcon from '../components/SiteIcon'
import { API_ENDPOINTS, apiFetch } from '../config/api'

const openings = [
  {
    id: 1,
    title: 'WordPress Developer',
    type: 'Full-time',
    mode: 'On-site / Remote',
    location: 'Jabalpur, MP',
    experience: '1–3 years',
    color: '#6C63FF',
    desc: 'We are looking for a WordPress Developer who can build fast, secure and conversion-focused business websites and ecommerce stores.',
    responsibilities: [
      'Build and customize responsive WordPress websites',
      'Develop and configure themes, plugins and page builders',
      'Set up WooCommerce stores and third-party integrations',
      'Optimize websites for performance, security and SEO',
      'Maintain and troubleshoot existing client websites',
    ],
    requirements: [
      'Strong knowledge of WordPress, HTML, CSS and JavaScript',
      'Experience with Elementor, Gutenberg or custom themes',
      'Understanding of PHP, MySQL and WordPress hooks',
      'Experience with responsive design and speed optimization',
      'Ability to manage multiple client projects',
    ],
    niceToHave: ['WooCommerce', 'ACF', 'Custom plugins', 'Technical SEO'],
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    type: 'Full-time',
    mode: 'On-site / Remote',
    location: 'Jabalpur, MP',
    experience: '1–3 years',
    color: '#00D4AA',
    desc: 'Join us to build complete web products, from polished React interfaces to secure APIs, databases and production deployments.',
    responsibilities: [
      'Develop frontend interfaces and backend services',
      'Design REST APIs and scalable database structures',
      'Implement authentication, permissions and integrations',
      'Test, deploy and monitor production applications',
      'Collaborate across design, product and client teams',
    ],
    requirements: [
      'Proficiency in React and Node.js or PHP',
      'Strong JavaScript fundamentals and REST API knowledge',
      'Experience with SQL or NoSQL databases',
      'Familiarity with Git and cloud deployment workflows',
      'Strong debugging and problem-solving skills',
    ],
    niceToHave: ['TypeScript', 'Next.js', 'Docker', 'Supabase'],
  },
  {
    id: 3,
    title: 'Frontend Developer',
    type: 'Full-time',
    mode: 'On-site / Remote',
    location: 'Jabalpur, MP',
    experience: '1–3 years',
    color: '#FF6B6B',
    desc: 'We are looking for a Frontend Developer who loves creating accessible, responsive and high-performance web interfaces.',
    responsibilities: [
      'Build responsive interfaces using React',
      'Translate Figma designs into accurate reusable components',
      'Integrate REST APIs and manage application state',
      'Improve accessibility, performance and browser compatibility',
      'Participate in testing and code reviews',
    ],
    requirements: [
      'Strong React, JavaScript, HTML and CSS skills',
      'Good understanding of responsive design',
      'Experience with REST APIs and asynchronous JavaScript',
      'Familiarity with Git version control',
      'Attention to UI detail and code quality',
    ],
    niceToHave: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Animation libraries'],
  },
  {
    id: 4,
    title: 'Backend Developer',
    type: 'Full-time',
    mode: 'On-site / Remote',
    location: 'Jabalpur, MP',
    experience: '1–3 years',
    color: '#FFB347',
    desc: 'We need a Backend Developer to create reliable APIs, data models and integrations for custom software and mobile applications.',
    responsibilities: [
      'Design and develop secure REST APIs',
      'Create and optimize database schemas and queries',
      'Implement authentication and role-based access',
      'Integrate payments, messaging and third-party services',
      'Deploy, monitor and troubleshoot backend services',
    ],
    requirements: [
      'Proficiency in Node.js or PHP and a backend framework',
      'Strong knowledge of MySQL or PostgreSQL',
      'Understanding of API design and application security',
      'Experience with Git and deployment platforms',
      'Good debugging and communication skills',
    ],
    niceToHave: ['Redis', 'Docker', 'Supabase', 'Cloud platforms'],
  },
  {
    id: 5,
    title: 'Digital Marketing Intern',
    type: 'Internship',
    mode: 'On-site / Hybrid',
    location: 'Jabalpur, MP',
    experience: 'Fresher',
    color: '#06B6D4',
    desc: 'Learn and contribute across SEO, paid campaigns, content research and performance reporting for technology and local-business clients.',
    responsibilities: [
      'Support keyword research and on-page SEO tasks',
      'Assist with Google Ads and Meta Ads campaigns',
      'Research content ideas and competitor activity',
      'Update campaign trackers and performance reports',
      'Coordinate with design and content teams',
    ],
    requirements: [
      'Basic understanding of digital marketing',
      'Good written communication in Hindi and English',
      'Comfort with spreadsheets and online research',
      'Curiosity about SEO, analytics and advertising',
      'Willingness to learn and take ownership',
    ],
    niceToHave: ['Google Analytics', 'Search Console', 'Canva', 'WordPress'],
  },
  {
    id: 6,
    title: 'Social Media Intern',
    type: 'Internship',
    mode: 'On-site / Hybrid',
    location: 'Jabalpur, MP',
    experience: 'Fresher',
    color: '#EC4899',
    desc: 'Help plan, create and manage engaging social content for Xanvoraa Technologies and selected client brands.',
    responsibilities: [
      'Assist with monthly social media calendars',
      'Write captions and schedule approved posts',
      'Research trends, formats and audience interests',
      'Coordinate short-form creatives with the design team',
      'Track engagement and prepare simple reports',
    ],
    requirements: [
      'Strong interest in social media and content creation',
      'Clear written communication in Hindi and English',
      'Basic understanding of Instagram, LinkedIn and Facebook',
      'Consistency, creativity and attention to detail',
      'Ability to meet content deadlines',
    ],
    niceToHave: ['Canva', 'Video editing', 'Copywriting', 'Meta Business Suite'],
  },
]

const perks = [
  { icon: 'pricing', title: 'Competitive Salary', desc: 'Market-rate pay with performance bonuses' },
  { icon: 'home', title: 'Work From Home', desc: 'Flexible hybrid working options available' },
  { icon: 'learning', title: 'Learning Budget', desc: 'Paid courses, certifications and books' },
  { icon: 'growth', title: 'Fast Growth', desc: 'Small team = big responsibility = fast growth' },
  { icon: 'mentorship', title: 'Mentorship', desc: 'Direct mentorship from experienced founders' },
  { icon: 'sparkles', title: 'Fun Culture', desc: 'Young team, open culture, no corporate BS' },
]

const normalizePortfolioUrl = value => {
  const trimmed = value.trim()
  return /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed
}
const EMPTY_FORM = {
  name: '',
  email: '',
  mobile: '',
  position: '',
  experience: '',
  location: '',
  portfolio: '',
  resume: null,
  message: '',
}

export default function Career() {
  const [openJob, setOpenJob] = useState(null)
  const [applyJob, setApplyJob] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = e => {
    const { name, type, value, files } = e.target
    setForm(previous => ({
      ...previous,
      [name]: type === 'file' ? files[0] || null : value,
    }))
  }

  const openApplication = job => {
    setApplyJob(job)
    setForm({ ...EMPTY_FORM, position: job.title })
    setStatus(null)
    setErrorMessage('')
  }

  const handleApply = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const fd = new FormData()
    fd.append('name', form.name.trim())
    fd.append('email', form.email.trim())
    fd.append('mobile', form.mobile.trim())
    fd.append('position', form.position)
    fd.append('experience', form.experience.trim())
    fd.append('location', form.location.trim())
    fd.append('portfolio', normalizePortfolioUrl(form.portfolio))
    fd.append('message', form.message.trim())

    if (form.resume) {
      fd.append('resume', form.resume)
    }

    try {
      const response = await apiFetch(API_ENDPOINTS.career, {
        method: 'POST',
        body: fd,
      })
      const data = await response.json()

      if (!response.ok) {
        const missingFields = Array.isArray(data.fields) && data.fields.length > 0
          ? `: ${data.fields.join(', ')}`
          : ''

        throw new Error(`${data.message || 'Unable to submit your application'}${missingFields}`)
      }

      setStatus('sent')
      setForm(EMPTY_FORM)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="career-page">
      <Seo
        title="Careers at Xanvoraa Technologies | Software Development Jobs"
        description="Xanvoraa Technologies offers frontend, backend, design, and software development careers in Jabalpur and remote roles."
        path="/career"
      />

      {/* ── HERO ── */}
      <section className="page-hero">
        <PageHeroVideo src={pageHeroVideo} poster={pageHeroPoster} />
        <div className="page-hero__orb page-hero__orb--1" />
        <div className="page-hero__orb page-hero__orb--2" />
        <div className="container">
          <span className="section-tag">Join Our Team</span>
          <h1 className="page-hero__title">
            Build the Future<br />
            <span className="gradient-text">With Us</span>
          </h1>
          <p className="page-hero__sub">
            We're a small but mighty team building real products for real clients. If you love solving problems with code — you'll fit right in.
          </p>
          <div className="page-hero__actions" data-hero-actions="career">
            <a href="#open-positions" className="btn-primary">View Open Positions</a>
            <a href="https://wa.me/917067694391?text=Hi! I want to apply at Xanvoraa Technologies." target="_blank" rel="noreferrer" className="btn-outline">Send Your CV →</a>
          </div>
        </div>
      </section>

      {/* ── PERKS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Join Us</span>
            <h2 className="section-title">
              Life at <span className="gradient-text">Xanvoraa Technologies</span>
            </h2>
          </div>
          <div className="career-perks">
            {perks.map((p, i) => (
              <div key={i} className="career-perk">
                <span className="career-perk__icon"><SiteIcon name={p.icon} size={28} /></span>
                <h3 className="career-perk__title">{p.title}</h3>
                <p className="career-perk__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPENINGS ── */}
      <section className="section" id="open-positions" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Open Positions</span>
            <h2 className="section-title">
              Current <span className="gradient-text">Openings</span>
            </h2>
            <p className="section-subtitle">
              {openings.length} positions open · Jabalpur, MP
            </p>
          </div>

          <div className="career-jobs">
            {openings.map(job => (
              <div
                key={job.id}
                className={`career-job ${openJob === job.id ? 'career-job--open' : ''}`}
                style={{ '--card-color': job.color }}
              >
                {/* Header */}
                <div
                  className="career-job__header"
                  onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                >
                  <div className="career-job__left">
                    <h3 className="career-job__title">{job.title}</h3>
                    <div className="career-job__meta">
                      <span className="career-job__tag"><SiteIcon name="briefcase" size={14} /> {job.type}</span>
                      <span className="career-job__tag"><SiteIcon name="home" size={14} /> {job.mode}</span>
                      <span className="career-job__tag"><SiteIcon name="location" size={14} /> {job.location}</span>
                      <span className="career-job__tag"><SiteIcon name="timer" size={14} /> {job.experience}</span>
                    </div>
                  </div>
                  <div className="career-job__right">
                    <span className={`career-job__toggle ${openJob === job.id ? 'career-job__toggle--open' : ''}`}>↓</span>
                  </div>
                </div>

                {/* Body */}
                <div className="career-job__body">
                  <p className="career-job__desc">{job.desc}</p>
                  <div className="career-job__cols">
                    <div>
                      <h4 className="career-job__sub">Responsibilities</h4>
                      <ul className="career-job__list">
                        {job.responsibilities.map(r => (
                          <li key={r}><span style={{ color: job.color }}>→</span> {r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="career-job__sub">Requirements</h4>
                      <ul className="career-job__list">
                        {job.requirements.map(r => (
                          <li key={r}><span style={{ color: job.color }}>✓</span> {r}</li>
                        ))}
                      </ul>
                      <h4 className="career-job__sub" style={{ marginTop: 20 }}>Nice to Have</h4>
                      <div className="career-job__nice">
                        {job.niceToHave.map(n => (
                          <span key={n} className="career-job__nice-tag">{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ marginTop: 24 }}
                    onClick={() => openApplication(job)}
                  >
                    Apply for {job.title} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENERAL APPLICATION ── */}
      <section className="section">
        <div className="container">
          <div className="career-general">
            <div className="career-general__left">
              <span className="section-tag">Don't See Your Role?</span>
              <h2 className="section-title">
                Send a <span className="gradient-text">General Application</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7 }}>
                We're always looking for talented people. If you're passionate about tech and think you'd be a great fit — drop us your CV. We'll reach out when something opens up.
              </p>
              <div style={{ marginTop: 24 }}>
                <a
                  href="https://wa.me/917067694391?text=Hi! I want to apply at Xanvoraa Technologies."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  <span style={{display:'flex', alignItems:'center', gap:'4px'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style={{marginRight:'6px', verticalAlign:'middle', flexShrink:0}} fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.14 1.535 5.875L.057 23.943a.75.75 0 00.919.919l6.07-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.528-5.228-1.443l-.374-.223-3.875.943.962-3.742-.245-.389A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    WhatsApp Your CV
                  </span>
                </a>
              </div>
            </div>
            <div className="career-general__right">
              {[
                { icon: 'document', text: 'Send your resume/portfolio on WhatsApp' },
                { icon: 'phone', text: 'Quick 15-min intro call with our team' },
                { icon: 'laptop', text: 'Small practical task (paid if hired)' },
                { icon: 'handshake', text: 'Offer letter within 48 hours' },
              ].map((s, i) => (
                <div key={i} className="career-step">
                  <span className="career-step__num">{i + 1}</span>
                  <span className="career-step__icon"><SiteIcon name={s.icon} size={24} /></span>
                  <p className="career-step__text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── APPLY MODAL ── */}
      {applyJob && (
        <div className="port-modal" onClick={() => setApplyJob(null)}>
          <div className="port-modal__box" onClick={e => e.stopPropagation()}>
            <button className="port-modal__close" onClick={() => setApplyJob(null)}>✕</button>
            <div className="port-modal__body">
              {status === 'sent' ? (
                <div className="contact-success">
                  <span className="contact-success__icon">🎉</span>
                  <h3>Application Sent!</h3>
                  <p>We'll review your application and get back to you within 48 hours on WhatsApp or email.</p>
                  <button className="btn-primary" onClick={() => setApplyJob(null)} style={{ marginTop: 20 }}>
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="port-modal__title">Apply — {applyJob.title}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                    Fill in your details and we'll get back to you within 48 hours.
                  </p>
                  <form className="contact-form" onSubmit={handleApply}>
                    <div className="contact-form__row">
                      <div className="contact-form__field">
                        <label className="contact-form__label">Full Name *</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                      </div>
                      <div className="contact-form__field">
                        <label className="contact-form__label">Mobile *</label>
                        <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+91 98765 43210" required />
                      </div>
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div className="contact-form__row">
                      <div className="contact-form__field">
                        <label className="contact-form__label">Position *</label>
                        <input type="text" name="position" value={form.position} readOnly required />
                      </div>
                      <div className="contact-form__field">
                        <label className="contact-form__label">Experience *</label>
                        <input type="text" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 2 years" required />
                      </div>
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label">Location</label>
                      <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="City, State" />
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label">Portfolio / GitHub / LinkedIn URL</label>
                      <input type="text" inputMode="url" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://github.com/yourname or www.example.com" autoCapitalize="none" autoCorrect="off" />
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label">Resume PDF</label>
                      <input type="file" name="resume" accept="application/pdf" onChange={handleChange} />
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label">Why do you want to join Xanvoraa Technologies?</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about yourself, your experience and why you want to join..." />
                    </div>
                    {status === 'error' && (
                      <p className="contact-form__error">{errorMessage}</p>
                    )}
                    <button type="submit" className="btn-primary contact-form__submit" disabled={status === 'sending'}>
                      {status === 'sending' ? <><span className="contact-form__spinner" /> Sending...</> : 'Submit Application →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
