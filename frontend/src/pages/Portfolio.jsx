import Seo from '../components/Seo'
import PageHeroVideo from '../components/PageHeroVideo'
import pageHeroVideo from '../assets/bg_portfolio_page.mp4'
import pageHeroPoster from '../assets/bg_portfolio_page_poster.webp'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import healTrackImage from '../assets/portfolio/healtrack-hms.png'
import eduSphereImage from '../assets/portfolio/edusphere-school-erp.png'
import shopNovaImage from '../assets/portfolio/shopnova-ecommerce.png'
import spTravelsImage from '../assets/portfolio/sp-travels.png'
import carePointImage from '../assets/portfolio/carepoint-clinic-app.png'
import greenHopeImage from '../assets/portfolio/greenhope-ngo.png'
import voiceBotImage from '../assets/portfolio/voicebot-crm.png'
import realNestImage from '../assets/portfolio/realnest-property.png'

const projects = [
  {
    id: 1,
    title: 'HealTrack HMS',
    category: 'Custom Software',
    filter: 'software',
    desc: 'Complete Hospital Management System with OPD, IPD, billing, pharmacy, lab and doctor management modules. Built for a 50-bed hospital in Jabalpur.',
    features: ['OPD & IPD Management', 'Billing & Insurance', 'Pharmacy Module', 'Lab Reports', 'Doctor Dashboard'],
    tech: ['React', 'Node.js', 'MySQL', 'Razorpay'],
    image: healTrackImage,
    color: '#6C63FF',
    result: '3hrs saved daily',
    duration: '10 weeks',
    client: 'Hospital, Jabalpur',
  },
  {
    id: 2,
    title: 'EduSphere School ERP',
    category: 'Custom Software',
    filter: 'software',
    desc: 'Comprehensive school management platform covering admissions, attendance, fee collection, exam results and parent-teacher communication portal.',
    features: ['Student Admissions', 'Fee Collection & Receipts', 'Attendance System', 'Exam & Results', 'Parent App'],
    tech: ['React', 'PHP', 'Laravel', 'MySQL'],
    image: eduSphereImage,
    color: '#00D4AA',
    result: '100+ hrs saved/month',
    duration: '12 weeks',
    client: 'School, Bhopal',
  },
  {
    id: 3,
    title: 'ShopNova eCommerce',
    category: 'Web Development',
    filter: 'web',
    desc: 'Multi-vendor eCommerce platform with product management, cart, Razorpay payment integration, order tracking and vendor dashboard.',
    features: ['Multi-vendor Support', 'Razorpay Integration', 'Order Tracking', 'Inventory Mgmt', 'Admin Dashboard'],
    tech: ['React', 'Node.js', 'MongoDB', 'Razorpay'],
    image: shopNovaImage,
    color: '#FF6B6B',
    result: '₹2L+ monthly GMV',
    duration: '6 weeks',
    client: 'Startup, Indore',
  },
  {
    id: 4,
    title: 'SP Travels Website',
    category: 'Website Redesign',
    filter: 'web',
    desc: 'Complete redesign of an outdated travel agency website. Modern UI, fast loading, SEO-optimized with online enquiry and package booking forms.',
    features: ['Modern UI/UX', 'Package Listings', 'Enquiry Forms', 'SEO Optimized', 'Mobile First'],
    tech: ['React', 'Vite', 'CSS3', 'Node.js'],
    image: spTravelsImage,
    color: '#FFB347',
    result: '3x traffic increase',
    duration: '3 weeks',
    client: 'Travel Agency, Bhopal',
  },
  {
    id: 5,
    title: 'CarePoint Clinic App',
    category: 'Mobile App',
    filter: 'mobile',
    desc: 'Clinic appointment booking mobile app for iOS and Android. Patients can book, reschedule, view prescriptions and get reminders.',
    features: ['Appointment Booking', 'Doctor Profiles', 'Prescription View', 'Push Reminders', 'Video Consult'],
    tech: ['React Native', 'Firebase', 'Node.js'],
    image: carePointImage,
    color: '#A855F7',
    result: '200+ daily bookings',
    duration: '8 weeks',
    client: 'Clinic Chain, MP',
  },
  {
    id: 6,
    title: 'GreenHope NGO Portal',
    category: 'Web Development',
    filter: 'web',
    desc: 'Donation management and volunteer coordination portal for an NGO. Online donations via Razorpay, 80G certificate generation and impact reporting.',
    features: ['Online Donations', '80G Certificates', 'Volunteer Mgmt', 'Impact Reports', 'Campaign Pages'],
    tech: ['React', 'Node.js', 'Supabase', 'Razorpay'],
    image: greenHopeImage,
    color: '#00D4AA',
    result: '₹5L+ donations raised',
    duration: '5 weeks',
    client: 'NGO, Jabalpur',
  },
  {
    id: 7,
    title: 'VoiceBot CRM Integration',
    category: 'AI & Automation',
    filter: 'ai',
    desc: 'AI voice agent integrated with Zoho CRM for automated lead follow-up calls. Reduces manual calling effort by 80% with intelligent conversation flows.',
    features: ['Voice AI Calls', 'Zoho CRM Sync', 'Lead Scoring', 'Call Transcripts', 'Auto Follow-up'],
    tech: ['Bolna.ai', 'Node.js', 'Zoho CRM', 'Plivo'],
    image: voiceBotImage,
    color: '#6C63FF',
    result: '80% effort reduced',
    duration: '4 weeks',
    client: 'Sales Company, Delhi',
  },
  {
    id: 8,
    title: 'RealNest Property Portal',
    category: 'Web Development',
    filter: 'web',
    desc: 'Real estate listing portal with property search, filters, agent profiles, enquiry management and WhatsApp lead integration.',
    features: ['Property Listings', 'Advanced Search', 'Agent Dashboard', 'Lead Management', 'WhatsApp CTA'],
    tech: ['React', 'Node.js', 'MySQL', 'Cloudinary'],
    image: realNestImage,
    color: '#FF6B6B',
    result: '500+ listings live',
    duration: '7 weeks',
    client: 'Real Estate, Jabalpur',
  },
]

const filters = ['All', 'Web', 'Mobile', 'Software', 'AI']
const filterMap = { Web: 'web', Mobile: 'mobile', Software: 'software', AI: 'ai' }

export default function Portfolio() {
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.filter === filterMap[active])

  const opened = projects.find(p => p.id === selected)

  return (
    <div className="portfolio-page">
      <Seo
        title="Software & Web Development Portfolio | Xanvoraa"
        description="See custom software, hospital systems, school ERP, mobile app and website projects delivered by Xanvoraa Technologies."
        path="/portfolio"
      />

      {/* ── HERO ── */}
      <section className="page-hero portfolio-hero">
        <PageHeroVideo src={pageHeroVideo} poster={pageHeroPoster} />
        <div className="page-hero__orb page-hero__orb--1" />
        <div className="page-hero__orb page-hero__orb--2" />
        <div className="container">
          <span className="section-tag">Our Work</span>
          <h1 className="page-hero__title">
            Projects That<br />
            <span className="gradient-text">Speak for Themselves</span>
          </h1>
          <p className="page-hero__sub">
            Real solutions. Real clients. Real results. Here's what we've built.
          </p>
          <div className="page-hero__actions" data-hero-actions="portfolio">
            <a href="/contact" className="btn-primary">Get Free Consultation</a>
            <a href="#portfolio-projects" className="btn-outline">View Projects →</a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="portfolio-stats">
        <div className="container">
          <div className="portfolio-stats__grid">
            {[
              { v: '139+', l: 'Projects Delivered' },
              { v: '100%', l: 'Happy Clients' },
              { v: '8+', l: 'Industries Served' },
              { v: '100%', l: 'On-time Delivery' },
            ].map((s, i) => (
              <div key={i} className="portfolio-stat">
                <span className="portfolio-stat__val gradient-text">{s.v}</span>
                <span className="portfolio-stat__label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <section className="section" id="portfolio-projects">
        <div className="container">
          {/* Filters */}
          <div className="services-filter__tabs">
            {filters.map(f => (
              <button
                key={f}
                className={`services-filter__tab ${active === f ? 'services-filter__tab--active' : ''}`}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="portfolio-grid">
            {filtered.map(p => (
              <div
                key={p.id}
                className="port-card"
                onClick={() => setSelected(p.id)}
                style={{ '--card-color': p.color }}
              >
                <div className="port-card__mockup">
                  <img
                    className="port-card__image"
                    src={p.image}
                    alt={`${p.title} product preview`}
                    loading="lazy"
                  />
                  <div className="port-card__image-shade" />
                  <span className="port-card__result">{p.result}</span>
                </div>
                <div className="port-card__body">
                  <div className="port-card__top">
                    <span className="port-card__cat">{p.category}</span>
                    <span className="port-card__duration">⏱ {p.duration}</span>
                  </div>
                  <h3 className="port-card__title">{p.title}</h3>
                  <p className="port-card__desc">{p.desc}</p>
                  <div className="port-card__tech">
                    {p.tech.map(t => (
                      <span key={t} className="portfolio-card__tag">{t}</span>
                    ))}
                  </div>
                  <button className="port-card__btn">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {selected && opened && (
        <div className="port-modal" onClick={() => setSelected(null)}>
          <div className="port-modal__box" onClick={e => e.stopPropagation()}>
            <button className="port-modal__close" onClick={() => setSelected(null)}>✕</button>
            <div className="port-modal__top">
              <img
                className="port-modal__image"
                src={opened.image}
                alt={`${opened.title} product preview`}
              />
            </div>
            <div className="port-modal__body">
              <span className="port-card__cat">{opened.category}</span>
              <h2 className="port-modal__title">{opened.title}</h2>
              <p className="port-modal__desc">{opened.desc}</p>
              <div className="port-modal__meta">
                <div className="port-modal__meta-item">
                  <span className="port-modal__meta-label">Client</span>
                  <span className="port-modal__meta-val">{opened.client}</span>
                </div>
                <div className="port-modal__meta-item">
                  <span className="port-modal__meta-label">Duration</span>
                  <span className="port-modal__meta-val">{opened.duration}</span>
                </div>
                <div className="port-modal__meta-item">
                  <span className="port-modal__meta-label">Result</span>
                  <span className="port-modal__meta-val" style={{ color: opened.color }}>{opened.result}</span>
                </div>
              </div>
              <h4 className="port-modal__sub">Key Features</h4>
              <ul className="port-modal__features">
                {opened.features.map(f => (
                  <li key={f}>
                    <span style={{ color: opened.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <h4 className="port-modal__sub">Tech Stack</h4>
              <div className="service-detail-card__tech">
                {opened.tech.map(t => (
                  <span key={t} className="service-detail-card__tech-tag">{t}</span>
                ))}
              </div>
              <a
                href={`https://wa.me/917067694391?text=Hi! I saw your ${opened.title} project and want something similar.`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ marginTop: 24, display: 'inline-flex' }}
              >
                Build Something Similar →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <section className="section portfolio-cta-section" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="portfolio-cta__inner">
            <h2 className="portfolio-cta__title">
              Want to be our next<br />
              <span className="gradient-text">success story?</span>
            </h2>
            <p className="portfolio-cta__sub">Free consultation · Quick turnaround · Quality guaranteed</p>
            <div className="portfolio-cta__actions">
              <Link to="/contact" className="btn-primary">Start Your Project</Link>
              <Link to="/pricing" className="btn-outline">View Pricing →</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}