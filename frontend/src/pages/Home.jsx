import Seo from '../components/Seo'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteIcon from '../components/SiteIcon'
import sumitImage from '../assets/somya shukla.png'
import riyaImage from '../assets/riya jyotishi.jpeg'
import kashishImage from '../assets/kashish sahu.jpeg'
import somyaImage from '../assets/somya shukla.jpeg'
import heroVideo2 from '../assets/bg_video02.mp4'

const SHOW_ARCHIVED_HOME_SECTIONS = false
import heroPoster from '../assets/hero.png'

// ─── DATA ────────────────────────────────────────────────────────────────────

const stats = [
  { value: 139, suffix: '+', label: 'Projects Delivered' },
  { value: 100, suffix: '%', label: 'Happy Clients' },
  { value: 7, suffix: '+', label: 'Years Experience' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
]

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Web Development',
    desc: 'Fast, responsive and scalable websites and web applications built to generate leads and support business growth.',
    tags: ['React', 'Node.js', 'PHP', 'Laravel'],
    color: '--primary',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'App Development',
    desc: 'High-quality Android and iOS applications with intuitive interfaces, reliable performance and scalable architecture.',
    tags: ['React Native', 'Flutter', 'Android', 'iOS'],
    color: '--accent',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9.5 4.5h5M12 2v5"/><rect x="4" y="7" width="16" height="13" rx="3"/>
        <circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9 17h6"/>
      </svg>
    ),
    title: 'AI & Automation',
    desc: 'AI chatbots, voice agents and workflow automation that reduce manual work and improve operational efficiency.',
    tags: ['Chatbots', 'Voice AI', 'n8n', 'LLM'],
    color: '--primary',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9"/><path d="M7.5 8.5l2.2 7 2.3-5 2.3 5 2.2-7"/>
      </svg>
    ),
    title: 'WordPress Development',
    desc: 'Professional WordPress websites, WooCommerce stores and custom themes that are easy to manage and optimize.',
    tags: ['WordPress', 'WooCommerce', 'Elementor', 'SEO'],
    color: '--accent',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14.7 6.3a1 1 0 001.4 1.4l1.6 1.6a1 1 0 001.4 0l2.4-2.4a6 6 0 01-7.8 7.8l-6.4 6.4a2.1 2.1 0 01-3-3l6.4-6.4a6 6 0 017.8-7.8z"/>
      </svg>
    ),
    title: 'Maintenance & Support',
    desc: 'Proactive monitoring, updates, backups, security fixes and dependable technical support for your digital products.',
    tags: ['Monitoring', 'Backups', 'Security', 'Support'],
    color: '--primary',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        <path d="M7 8h4v4H7zM14 8h3M14 12h3"/>
      </svg>
    ),
    title: 'Custom Software Solutions',
    desc: 'Purpose-built ERP, CRM, HMS and management platforms designed around your exact workflows and business goals.',
    tags: ['ERP', 'CRM', 'HMS', 'Automation'],
    color: '--accent',
  },
]
const process = [
  {
    step: '01',
    title: 'Discovery Call',
    desc: 'Free 30-min consultation to understand your requirements, budget and timeline.',
    icon: 'phone',
  },
  {
    step: '02',
    title: 'Proposal & Planning',
    desc: 'Detailed project scope, wireframes, tech stack recommendation and transparent pricing.',
    icon: 'planning',
  },
  {
    step: '03',
    title: 'Design & Development',
    desc: 'Agile sprints with weekly updates. You stay in loop at every stage.',
    icon: 'settings',
  },
  {
    step: '04',
    title: 'Launch & Support',
    desc: 'Thorough testing, deployment and post-launch support. We don\'t disappear after delivery.',
    icon: 'rocket',
  },
]

const industries = [
  { icon: 'healthcare', name: 'Hospital & Clinics', desc: 'OPD, IPD, Billing, Lab, Pharmacy' },
  { icon: 'education', name: 'School & College', desc: 'ERP, LMS, Fee Management' },
  { icon: 'ngo', name: 'NGO & Trusts', desc: 'Donation Portal, Member Mgmt' },
  { icon: 'ecommerce', name: 'eCommerce', desc: 'Full Store, Payment, Delivery' },
  { icon: 'hospitality', name: 'Hotel & Travel', desc: 'Booking, PMS, Channel Manager' },
  { icon: 'briefcase', name: 'Startups & SMEs', desc: 'MVP to Enterprise Scale' },
  { icon: 'legal', name: 'Legal & CA Firms', desc: 'Case Mgmt, Client Portal' },
  { icon: 'realestate', name: 'Real Estate', desc: 'Property Listing, CRM, Leads' },
]

const portfolio = [
  {
    title: 'HealTrack HMS',
    category: 'Hospital Management',
    desc: 'Complete hospital management system with OPD, IPD, billing, pharmacy and lab modules.',
    tags: ['React', 'Node.js', 'MySQL'],
    color: '#6C63FF',
    mockup: 'healthcare',
  },
  {
    title: 'EduSphere LMS',
    category: 'School ERP',
    desc: 'Comprehensive school management with attendance, fees, exams and parent portal.',
    tags: ['React', 'PHP', 'Laravel'],
    color: '#00D4AA',
    mockup: 'education',
  },
  {
    title: 'ShopNova Store',
    category: 'eCommerce Platform',
    desc: 'Multi-vendor eCommerce platform with Razorpay integration, inventory and delivery tracking.',
    tags: ['React', 'Node.js', 'MongoDB'],
    color: '#FF6B6B',
    mockup: 'ecommerce',
  },
]

const testimonials = [
  {
    name: 'Dr. Ramesh Sharma',
    role: 'Director, Sharma Hospital, Jabalpur',
    text: 'Xanvoraa Technologies built our HMS from scratch. The OPD and billing system saved us 3 hours daily. Excellent team, always available on WhatsApp.',
    rating: 5,
    avatar: 'RS',
    color: '#6C63FF',
  },
  {
    name: 'Priya Verma',
    role: 'Principal, Sunrise Academy',
    text: 'Our school ERP is working flawlessly. Fee collection is now fully automated and parents love the app. Highly recommend Xanvoraa Technologies!',
    rating: 5,
    avatar: 'PV',
    color: '#00D4AA',
  },
  {
    name: 'Ankit Jain',
    role: 'Founder, QuickMart',
    text: 'They delivered our eCommerce platform in just 3 weeks. Clean code, great design, and zero bugs at launch. Best decision we made!',
    rating: 5,
    avatar: 'AJ',
    color: '#FF6B6B',
  },
  {
    name: 'Sunita Patel',
    role: 'CEO, SP Travels, Bhopal',
    text: 'Website redesign was exactly what we needed. Traffic increased 3x after launch. SEO results are amazing. Very professional team.',
    rating: 5,
    avatar: 'SP',
    color: '#FFB347',
  },
]

const team = [
  {
    name: 'Sumit Kushwaha',
    role: 'Tech Lead & Full Stack Developer',
    skills: 'React · Node.js · DevOps',
    image: sumitImage,
    color: '#6C63FF',
    founder: true,
  },
  {
    name: 'Riya Jyotishi',
    role: 'UI/UX & Frontend Devloper',
    skills: 'Figma · React · CSS',
    image: riyaImage,
    color: '#00D4AA',
    founder: false,
  },
  {
    name: 'Kashish Sahu',
    role: 'Backend Developer',
    skills: 'Node.js · PHP · MySQL',
    image: kashishImage,
    color: '#FFB347',
    founder: false,
  },
  {
    name: 'Somya Shukla',
    role: 'Digital Marketing & SEO Head',
    skills: 'SEO · Google Ads · Content',
    image: somyaImage,
    color: '#FF6B6B',
    founder: false,
  },
]

const whyUs = [
  { icon: '⚡', title: 'Fast Delivery', desc: 'Agile process. MVP in 2–4 weeks, full projects on schedule.' },
  { icon: 'speed', title: 'Transparent Pricing', desc: 'No hidden costs. Fixed quotes upfront, starting ₹15,000.' },
  { icon: 'pricing', title: '24/7 Support', desc: 'WhatsApp, email and call support. We respond within 2 hours.' },
  { icon: 'message', title: 'Any Tech Stack', desc: 'PHP to Node.js, React to Flutter. Every technology covered.' },
  { icon: 'settings', title: '100% Code Ownership', desc: 'Full source code delivered to you. No lock-ins ever.' },
  { icon: 'document', title: 'NDA Protected', desc: 'Your idea stays yours. We sign NDA before project starts.' },
]

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ value, suffix, label, start }) {
  const count = useCountUp(value, 2000, start)
  return (
    <div className="home-stat">
      <span className="home-stat__value">
        {count}{suffix}
      </span>
      <span className="home-stat__label">{label}</span>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Home() {
  const [statsRef, statsInView] = useInView(0.3)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="home">
      <Seo
        title="Software & Web Development Company in Jabalpur"
        description="Xanvoraa builds custom software, websites and mobile apps for hospitals, schools, startups and enterprises in Jabalpur, India."
        path="/"
      />

      {/* ── HERO ── */}
      <section className="hero">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          aria-hidden="true"
        >
          <source src={heroVideo2} type="video/mp4" />
        </video>
        <div className="hero__video-overlay" />
        {/* Animated grid bg */}
        <div className="hero__grid" />
        {/* Glow orbs */}
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />

        <div className={`container hero__inner ${heroLoaded ? 'hero__inner--loaded' : ''}`}>
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Trusted by Clients Across the UK, USA, Canada, Australia & India 
          </div>

          <h1 className="hero__title">
            We Build Digital Products<br />
            <span className="gradient-text">That Drive Results</span>
          </h1>

          <p className="hero__subtitle">
            Custom software, web & mobile apps for hospitals, schools, startups and enterprises.
            From PHP to Node.js — we work on every stack.
          </p>

          <div className="hero__actions">
            <a
              href="https://wa.me/917067694391?text=Hi%20Xanvoraa%20Technologies!%20I%20need%20a%20free%20consultation."
              target="_blank"
              rel="noreferrer"
              className="btn-primary hero__btn-primary"
            >
              <span style={{display:'flex', alignItems:'center', gap:'4px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style={{marginRight:'6px', verticalAlign:'middle', flexShrink:0}} fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.14 1.535 5.875L.057 23.943a.75.75 0 00.919.919l6.07-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.528-5.228-1.443l-.374-.223-3.875.943.962-3.742-.245-.389A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Get Free Consultation
              </span>
            </a>
            <Link to="/portfolio" className="btn-outline">
              View Our Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          <div className="hero__trust">
            <span className="hero__trust-text">Trusted by businesses across MP & India -- </span>
            {/* <div className="hero__trust-avatars">
              {['Aradhya Group','Ayush Bharat','Shri Shri Tatva','Rajul Builders'].map((a, i) => (
                <div key={i} className="hero__trust-avatar" style={{ zIndex: 5 - i }}>
                  {a}
                </div>
              ))}
              <span className="hero__trust-count">50+ clients</span>
            </div> */}
            <span className="hero__trust-count">122+ clients</span>
          </div>


        </div>

        {/* Floating code card */}
        {/* TEMPORARILY DISABLED: HERO FLOATING CODE CARD - remove false wrapper when needed */}
        {SHOW_ARCHIVED_HOME_SECTIONS && (
        <div className={`hero__code-card ${heroLoaded ? 'hero__code-card--loaded' : ''}`}>
          <div className="hero__code-header">
            <span className="hero__code-dot" style={{ background: '#FF5F57' }} />
            <span className="hero__code-dot" style={{ background: '#FFBD2E' }} />
            <span className="hero__code-dot" style={{ background: '#28C840' }} />
            <span className="hero__code-filename">xanvoraa.js</span>
          </div>
          <pre className="hero__code-body">{`const agency = {
  name: "Xanvoraa Technologies",
  location: "Jabalpur, MP",
  expertise: [
    "Web Development",
    "Mobile Apps",
    "Custom Software",
    "AI Solutions",
  ],
  deliver: () => "🚀 On Time",
}`}</pre>
        </div>
        )}
      </section>

      {/* ── STATS ── */}
      <section className="home-stats section" ref={statsRef}>
        <div className="container">
          <div className="home-stats__grid">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} start={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="home-services section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Do</span>
            <h2 className="section-title">
              Services Built for <span className="gradient-text">Real Business</span>
            </h2>
            <p className="section-subtitle">
              From a simple landing page to a full enterprise ERP — we've got every digital need covered.
            </p>
          </div>
          <div className="home-services__grid">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-card__icon" style={{ color: `var(${s.color})` }}>
                  {s.icon}
                </div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <div className="service-card__tags">
                  {s.tags.map(t => (
                    <span key={t} className="service-card__tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/services" className="btn-outline">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="home-process section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How We Work</span>
            <h2 className="section-title">
              Simple <span className="gradient-text">4-Step Process</span>
            </h2>
          </div>
          <div className="home-process__grid">
            {process.map((p, i) => (
              <div key={i} className="process-card">
                <div className="process-card__step">{p.step}</div>
                <div className="process-card__icon"><SiteIcon name={p.icon} size={30} /></div>
                <h3 className="process-card__title">{p.title}</h3>
                <p className="process-card__desc">{p.desc}</p>
                {i < process.length - 1 && (
                  <div className="process-card__arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="home-industries section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Industries We Serve</span>
            <h2 className="section-title">
              Solutions for <span className="gradient-text">Every Sector</span>
            </h2>
          </div>
          <div className="home-industries__grid">
            {industries.map((ind, i) => (
              <div key={i} className="industry-card">
                <span className="industry-card__icon"><SiteIcon name={ind.icon} size={28} /></span>
                <div>
                  <h4 className="industry-card__name">{ind.name}</h4>
                  <p className="industry-card__desc">{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ── */}
      {/* TEMPORARILY DISABLED: RECENT PROJECTS - remove false wrapper when needed */}
      {SHOW_ARCHIVED_HOME_SECTIONS && (
      <section className="home-portfolio section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Work</span>
            <h2 className="section-title">
              Recent <span className="gradient-text">Projects</span>
            </h2>
            <p className="section-subtitle">
              Real solutions delivered to real clients.
            </p>
          </div>
          <div className="home-portfolio__grid">
            {portfolio.map((p, i) => (
              <div key={i} className="portfolio-card">
                <div className="portfolio-card__mockup" style={{ background: `${p.color}18` }}>
                  <span className="portfolio-card__emoji"><SiteIcon name={p.mockup} size={52} strokeWidth={1.5} /></span>
                  <div className="portfolio-card__glow" style={{ background: p.color }} />
                </div>
                <div className="portfolio-card__body">
                  <span className="portfolio-card__cat">{p.category}</span>
                  <h3 className="portfolio-card__title">{p.title}</h3>
                  <p className="portfolio-card__desc">{p.desc}</p>
                  <div className="portfolio-card__tags">
                    {p.tags.map(t => (
                      <span key={t} className="portfolio-card__tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/portfolio" className="btn-outline">View All Projects →</Link>
          </div>
        </div>
      </section>
      )}

      {/* ── WHY US ── */}
      <section className="home-why section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Xanvoraa Technologies</span>
            <h2 className="section-title">
              Why Clients <span className="gradient-text">Choose Us</span>
            </h2>
          </div>
          <div className="home-why__grid">
            {whyUs.map((w, i) => (
              <div key={i} className="why-card">
                <span className="why-card__icon"><SiteIcon name={w.icon} size={28} /></span>
                <h3 className="why-card__title">{w.title}</h3>
                <p className="why-card__desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="home-testimonials section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Client Reviews</span>
            <h2 className="section-title">
              What Clients <span className="gradient-text">Say About Us</span>
            </h2>
          </div>
          <div className="home-testimonials__grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div
                    className="testimonial-card__avatar"
                    style={{ background: `${t.color}22`, color: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="testimonial-card__name">{t.name}</p>
                    <p className="testimonial-card__role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      {/* TEMPORARILY DISABLED: TEAM / PEOPLE BEHIND XANVORAA - remove false wrapper when needed */}
      {SHOW_ARCHIVED_HOME_SECTIONS && (
      <section className="home-team section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Team</span>
            <h2 className="section-title">
              The People Behind <span className="gradient-text">Xanvoraa Technologies</span>
            </h2>
          </div>
          <div className="home-team__grid">
            {team.map((m, i) => (
              <div key={i} className="team-card">
                <div className="team-card__avatar">
                  <img src={m.image} alt={`${m.name} profile`} />
                  {m.founder && (
                    <span className="team-card__founder-badge">founder</span>
                  )}
                </div>
                <h3 className="team-card__name">{m.name}</h3>
                <p className="team-card__role">{m.role}</p>
                <p className="team-card__skills">{m.skills}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── TRAINING BANNER ── */}
      {/* TEMPORARILY DISABLED: COMING SOON / TRAINING CENTER - remove false wrapper when needed */}
      {SHOW_ARCHIVED_HOME_SECTIONS && (
      <section className="home-training section">
        <div className="container">
          <div className="home-training__card">
            <div className="home-training__badge">Coming Soon</div>
            <h2 className="home-training__title">
              🎓 Offline Training Center — <span className="gradient-text">Jabalpur</span>
            </h2>
            <p className="home-training__desc">
              Learn Web Development, Mobile Apps, and AI from industry experts. Practical, job-ready training programs starting soon.
            </p>
            <a
              href="https://wa.me/917067694391?text=Hi!%20I%20want%20to%20join%20the%20Xanvoraa%20Technologies%20training%20waitlist."
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <span style={{display:'flex', alignItems:'center', gap:'4px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style={{marginRight:'6px', verticalAlign:'middle', flexShrink:0}} fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.14 1.535 5.875L.057 23.943a.75.75 0 00.919.919l6.07-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.528-5.228-1.443l-.374-.223-3.875.943.962-3.742-.245-.389A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Join Waitlist →
              </span>
            </a>
          </div>
        </div>
      </section>
      )}

      {/* ── FINAL CTA ── */}
      {/* TEMPORARILY DISABLED: READY TO SCALE / FINAL CTA - remove false wrapper when needed */}
      {SHOW_ARCHIVED_HOME_SECTIONS && (
      <section className="home-cta section">
        <div className="container">
          <div className="home-cta__inner">
            <h2 className="home-cta__title">
              Got a project in mind?<br />
              <span className="gradient-text">Let's build it together.</span>
            </h2>
            <p className="home-cta__sub">
              Free consultation · No obligation · Reply within 2 hours
            </p>
            <div className="home-cta__actions">
              <Link to="/contact" className="btn-primary">Start Your Project</Link>
              <a
                href="https://wa.me/917067694391"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                <span style={{display:'flex', alignItems:'center', gap:'4px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style={{marginRight:'6px', verticalAlign:'middle', flexShrink:0}} fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.14 1.535 5.875L.057 23.943a.75.75 0 00.919.919l6.07-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.698-.528-5.228-1.443l-.374-.223-3.875.943.962-3.742-.245-.389A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  WhatsApp Us
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      )}

    </div>
  )
}
