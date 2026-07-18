import PageHeroVideo from '../components/PageHeroVideo'
import pageHeroVideo from '../assets/bg_about_page.mp4'
import { Link } from 'react-router-dom'
import SiteIcon from '../components/SiteIcon'
import sumitImage from '../assets/somya shukla.png'
import riyaImage from '../assets/riya jyotishi.jpeg'
import kashishImage from '../assets/kashish sahu.jpeg'
import somyaImage from '../assets/somya shukla.jpeg'

const SHOW_TRAINING_CTA = false

const team = [
  {
    name: 'Sumit',
    role: 'Tech Lead & Full Stack Developer',
    bio: 'Full stack developer with expertise in React, Node.js, and cloud infrastructure. Handles architecture, backend, deployment and client-facing technical decisions.',
    skills: ['React', 'Node.js', 'DevOps', 'AWS', 'Supabase'],
    image: sumitImage,
    color: '#6C63FF',
    founder: true,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Riya',
    role: 'UI/UX Designer & Frontend Developer',
    bio: 'Creative designer who turns complex ideas into beautiful, intuitive interfaces. Expert in Figma, React and crafting pixel-perfect user experiences.',
    skills: ['Figma', 'React', 'CSS3', 'Framer', 'UI/UX'],
    image: riyaImage,
    color: '#00D4AA',
    founder: true,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Kashish',
    role: 'Backend Developer & API Expert',
    bio: 'Backend specialist focused on building scalable APIs, database architecture and server-side logic. Expert in Node.js, PHP and MySQL.',
    skills: ['Node.js', 'PHP', 'MySQL', 'REST API', 'Laravel'],
    image: kashishImage,
    color: '#FFB347',
    founder: false,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Somya',
    role: 'Digital Marketing & SEO Specialist',
    bio: 'Growth-focused marketer who drives organic traffic and paid campaigns. Specializes in local SEO for MP businesses and Google Ads management.',
    skills: ['SEO', 'Google Ads', 'Meta Ads', 'Content', 'GMB'],
    image: somyaImage,
    color: '#FF6B6B',
    founder: false,
    linkedin: '#',
    github: '#',
  },
]

const values = [
  { icon: 'target', title: 'Client First', desc: 'Your success is our success. We prioritize your business goals over everything else.' },
  { icon: 'transparency', title: 'Transparency', desc: 'No jargon, no hidden costs. Clear communication at every stage of the project.' },
  { icon: 'speed', title: 'Speed + Quality', desc: 'We move fast without cutting corners. Agile process, clean code, on-time delivery.' },
  { icon: 'handshake', title: 'Long-term Partner', desc: 'We don\'t disappear after launch. We\'re your tech partner for the long run.' },
  { icon: 'local', title: 'Local Roots', desc: 'Jabalpur-based team proud to serve businesses across MP and India.' },
  { icon: 'learning', title: 'Always Learning', desc: 'Tech evolves fast. We stay ahead so your products are always modern.' },
]

const milestones = [
  { year: '2021', title: 'Started as freelancers', desc: 'Sumit and Riya started taking freelance web projects while completing their education.' },
  { year: '2022', title: 'First big client', desc: 'Delivered a complete HMS for a hospital in Jabalpur. Turned client into a long-term partner.' },
  { year: '2023', title: 'Team of 4', desc: 'Kashish and Somya joined. Started handling 5+ projects simultaneously.' },
  { year: '2024', title: 'Agency formation', desc: 'Officially founded Xanvoraa Technologies. Expanded to mobile apps and AI solutions.' },
  { year: '2027', title: 'Training center', desc: 'Launching offline training center in Jabalpur to nurture local tech talent.' },
]

void team
void milestones

export default function About() {
  return (
    <div className="about-page">

      {/* ── HERO ── */}
      <section className="page-hero">
        <PageHeroVideo src={pageHeroVideo} />
        <div className="page-hero__orb page-hero__orb--1" />
        <div className="page-hero__orb page-hero__orb--2" />
        <div className="container">
          <span className="section-tag">Our Story</span>
          <h1 className="page-hero__title">
            Built in Jabalpur,<br />
            <span className="gradient-text">Trusted Across India</span>
          </h1>
          <p className="page-hero__sub">
            We're a passionate team of developers, designers and marketers on a mission to make quality software accessible to every business — big or small.
          </p>
          <div className="page-hero__actions" data-hero-actions="about">
            <a href="/contact" className="btn-primary">Start a Project</a>
            <a href="/services" className="btn-outline">Explore Services →</a>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="section">
        <div className="container">
          <div className="about-mission">
            <div className="about-mission__left">
              <span className="section-tag">Our Mission</span>
              <h2 className="section-title">
                We Believe Every Business Deserves
                <span className="gradient-text"> Great Software</span>
              </h2>
              <p className="about-mission__text">
                Too many small businesses in MP are stuck with outdated systems, overpriced agencies, or unreliable freelancers. We started Xanvoraa Technologies to change that.
              </p>
              <p className="about-mission__text">
                Our mission is simple: deliver enterprise-quality software at startup-friendly prices, with the reliability and support that local businesses deserve.
              </p>
              <p className="about-mission__text">
                From a hospital in Jabalpur to a startup in Bangalore — we treat every project like it's our own business.
              </p>
              <Link to="/contact" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
                Work With Us →
              </Link>
            </div>
            <div className="about-mission__right">
              <div className="about-stats-box">
                {[
                  { v: '139+', l: 'Projects Delivered' },
                  { v: '100%', l: 'Happy Clients' },
                  { v: '8+', l: 'Industries' },
                  { v: '19', l: 'Core Team Members' },
                  { v: '7+', l: 'Years Experience' },
                  { v: '100%', l: 'Source Code Ownership' },
                ].map((s, i) => (
                  <div key={i} className="about-stat">
                    <span className="about-stat__val gradient-text">{s.v}</span>
                    <span className="about-stat__label">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      {/* <section className="section" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Journey</span>
            <h2 className="section-title">
              How We <span className="gradient-text">Got Here</span>
            </h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className={`timeline__item ${i % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}>
                <div className="timeline__content">
                  <span className="timeline__year">{m.year}</span>
                  <h3 className="timeline__title">{m.title}</h3>
                  <p className="timeline__desc">{m.desc}</p>
                </div>
                <div className="timeline__dot" />
              </div>
            ))}
            <div className="timeline__line" />
          </div>
        </div>
      </section> */}

      {/* ── TEAM ── */}
      {/* <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The Team</span>
            <h2 className="section-title">
              People Who Make It <span className="gradient-text">Happen</span>
            </h2>
          </div>
          <div className="about-team__grid">
            {team.map((m, i) => (
              <div key={i} className="about-team-card" style={{ '--card-color': m.color }}>
                <div className="about-team-card__avatar-wrap">
                  <div className="about-team-card__avatar">
                    <img src={m.image} alt={`${m.name} profile`} />
                  </div>
                  {m.founder && <span className="about-team-card__founder">Co-Founder</span>}
                </div>
                <h3 className="about-team-card__name">{m.name}</h3>
                <p className="about-team-card__role">{m.role}</p>
                <p className="about-team-card__bio">{m.bio}</p>
                <div className="about-team-card__skills">
                  {m.skills.map(s => (
                    <span key={s} className="about-team-card__skill">{s}</span>
                  ))}
                </div>
                <div className="about-team-card__links">
                  <a href={m.linkedin} target="_blank" rel="noreferrer" className="about-team-card__link">
                    LinkedIn
                  </a>
                  <a href={m.github} target="_blank" rel="noreferrer" className="about-team-card__link">
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── VALUES ── */}
      <section className="section" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What Drives Us</span>
            <h2 className="section-title">
              Our Core <span className="gradient-text">Values</span>
            </h2>
          </div>
          <div className="about-values__grid">
            {values.map((v, i) => (
              <div key={i} className="about-value-card">
                <span className="about-value-card__icon"><SiteIcon name={v.icon} size={30} /></span>
                <h3 className="about-value-card__title">{v.title}</h3>
                <p className="about-value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINING CTA ── */}
      {/* ── WHY CHOOSE US ── */}
      <section className="section about-compare">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">
              Why Xanvoraa <span className="gradient-text">Stands Apart</span>
            </h2>
            <p className="section-subtitle">
              A reliable technology partner gives you more than code — you get clarity, accountability and long-term support.
            </p>
          </div>

          <div className="about-compare__table-wrap">
            <div className="compare-table about-compare__table">
              <div className="compare-table__header">
                <div className="compare-table__col compare-table__col--feature">What You Get</div>
                <div className="compare-table__col compare-table__col--us">Xanvoraa</div>
                <div className="compare-table__col">Freelancer</div>
                <div className="compare-table__col">Typical Agency</div>
              </div>
              {[
                ['Clear fixed-scope proposal', 'Included', 'Varies', 'Included'],
                ['Dedicated project ownership', 'Included', 'Limited', 'Varies'],
                ['On-time milestone tracking', 'Included', 'Varies', 'Included'],
                ['Direct technical communication', 'Included', 'Included', 'Limited'],
                ['Post-launch support', 'Included', 'Limited', 'Extra Cost'],
                ['Complete source-code handover', 'Included', 'Varies', 'Varies'],
                ['Flexible startup-friendly approach', 'Included', 'Included', 'Limited'],
                ['Local support from Jabalpur', 'Included', 'Limited', 'Limited'],
              ].map(([feature, xanvoraa, freelancer, agency], index) => (
                <div key={feature} className={'compare-table__row ' + (index % 2 === 0 ? 'compare-table__row--alt' : '')}>
                  <div className="compare-table__col compare-table__col--feature">{feature}</div>
                  <div className="compare-table__col compare-table__col--us">
                    <span className="about-compare__yes">{xanvoraa}</span>
                  </div>
                  <div className="compare-table__col">
                    <span className={freelancer === 'Included' ? 'about-compare__yes' : 'about-compare__maybe'}>{freelancer}</span>
                  </div>
                  <div className="compare-table__col">
                    <span className={agency === 'Included' ? 'about-compare__yes' : 'about-compare__maybe'}>{agency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* TEMPORARILY DISABLED: ABOUT TRAINING COMING SOON - remove false wrapper when needed */}
      {SHOW_TRAINING_CTA && (
      <section className="section">
        <div className="container">
          <div className="home-training__card">
            <div className="home-training__badge">Coming Soon — 2025</div>
            <h2 className="home-training__title">
              🎓 Xanvoraa Technologies Training Center
            </h2>
            <p className="home-training__desc">
              Offline coding bootcamp in Jabalpur. Learn web development, mobile apps and AI from the same team that builds real products. Job-ready in 3–6 months.
            </p>
            <a
              href="https://wa.me/917067694391?text=Hi! I want to join Xanvoraa Technologies Training Center waitlist."
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

      {/* ── CTA ── */}
      <section className="section" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="about-cta__inner">
            <h2 className="about-cta__title">
              Let's build something<br />
              <span className="gradient-text">great together.</span>
            </h2>
            <p className="about-cta__sub">Free consultation · Quick response · Local team</p>
            <div className="about-cta__actions">
              <Link to="/contact" className="btn-primary">Get In Touch</Link>
              <Link to="/portfolio" className="btn-outline">See Our Work →</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
