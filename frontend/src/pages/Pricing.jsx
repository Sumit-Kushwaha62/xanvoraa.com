import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Bot, Building2, Check, Globe2, Gauge,
  MessageCircle, Palette, PanelsTopLeft, Search, ShieldCheck,
  ShoppingCart, Smartphone, Wrench,
} from 'lucide-react'
import PageHeroVideo from '../components/PageHeroVideo'
import pageHeroVideo from '../assets/bg_pricing_page.mp4'

const whatsappNumber = '917067694391'

const packages = [
  {
    name: 'Launch',
    eyebrow: 'For a strong online start',
    price: '₹5,999',
    note: 'one-time, starting from',
    color: '#00D4AA',
    description: 'A polished business website with everything needed to establish trust and generate enquiries.',
    features: ['Up to 5 responsive pages', 'Professional UI design', 'Contact & WhatsApp integration', 'Basic technical SEO', '2 revision rounds', '3–4 week delivery'],
    cta: 'Choose Launch',
  },
  {
    name: 'Growth',
    eyebrow: 'For growing businesses',
    price: '₹9,999',
    note: 'one-time, starting from',
    color: '#6C63FF',
    description: 'A conversion-focused website with custom design, content management and stronger lead generation.',
    features: ['Up to 10 responsive pages', 'Custom UI/UX system', 'CMS or admin panel', 'Blog & advanced lead forms', 'Analytics & advanced SEO setup', '3 revision rounds', '5–6 week delivery'],
    cta: 'Choose Growth',
    popular: true,
  },
  {
    name: 'Scale',
    eyebrow: 'For complex digital products',
    price: 'Custom Quote',
    note: 'scoped around your goals',
    color: '#FF6B6B',
    description: 'Custom software, mobile apps, ERP and AI solutions designed around business workflows and scale.',
    features: ['Custom features & workflows', 'Multiple roles and permissions', 'Third-party integrations', 'Advanced automation', 'Dedicated project manager', 'Phased delivery plan'],
    cta: 'Discuss Your Project',
  },
]

const servicePrices = [
  { icon: Globe2, name: 'Landing Page', price: '₹2,999+', detail: 'High-converting single-page experience' },
  { icon: PanelsTopLeft, name: 'Business Website', price: '₹5,999+', detail: 'Professional multi-page company website' },
  { icon: ShoppingCart, name: 'E-commerce Website', price: '₹29,999+', detail: 'Catalog, payments and order management' },
  { icon: Gauge, name: 'Custom Web Application', price: '₹49,999+', detail: 'Dashboards, portals and business workflows' },
  { icon: Smartphone, name: 'Mobile Application', price: '₹19,999+', detail: 'Cross-platform Android and iOS app' },
  { icon: Building2, name: 'Hospital / School ERP', price: '₹49,999+', detail: 'Role-based operational management system' },
  { icon: Bot, name: 'AI Chatbot & Automation', price: '₹9,999+', detail: 'Custom assistants and workflow automation' },
  { icon: MessageCircle, name: 'AI Voice Agent', price: '₹9,999+', detail: 'Calling workflows with CRM integration' },
  { icon: Palette, name: 'Wordpress Development', price: '₹9,999+', detail: 'Research-led product and interface design' },
  { icon: Wrench, name: 'Maintenance & Support', price: '₹999/mo+', detail: 'Updates, monitoring and priority assistance' },
]

const maintenancePlans = [
  { name: 'Essential Care', price: '₹1,999', ideal: 'Business websites', features: ['Security updates', 'Cloud backups', 'Uptime monitoring', '5 support hours / month'] },
  { name: 'Business Care', price: '₹4,999', ideal: 'E-commerce & web apps', features: ['Everything in Essential', 'Performance monitoring', '10 support hours / month', 'Monthly health report'], popular: true },
  { name: 'Priority Care', price: '₹9,999+', ideal: 'ERP, apps & critical systems', features: ['Priority response', 'Proactive maintenance', '15 support hours / month', 'Dedicated technical contact'] },
]

const faqs = [
  { q: 'Are these the final project prices?', a: 'These are starting prices for clearly defined scopes. Your final quote depends on features, integrations, content, timeline and complexity. You receive a written scope and fixed milestone quote before development starts.' },
  { q: 'How does the payment schedule work?', a: 'Our standard structure is 40% to book the project, 30% after design or prototype approval, 20% at development completion and 10% at deployment. Longer projects can use monthly milestones.' },
  { q: 'Is the initial consultation free?', a: 'Yes, a 20–30 minute consultation is free. Detailed workflows, technical architecture and specification documents are covered under paid discovery, starting at ₹4,999.' },
  { q: 'What is included in maintenance?', a: 'Maintenance covers agreed support hours, updates, backups, monitoring and bug fixes. New modules, redesigns and major features are quoted separately.' },
  { q: 'Who pays for hosting, APIs and AI usage?', a: 'Hosting, third-party subscriptions, calling and AI API usage are billed separately or at actual usage plus the agreed management margin. This keeps billing transparent as usage changes.' },
  { q: 'Will I own the source code?', a: 'Yes. After final payment, the agreed source code, database and handover documentation belong to you, subject to any third-party licence terms.' },
]

function whatsappLink(message) {
  return 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message)
}

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="pricing-page">
      <section className="page-hero">
        <PageHeroVideo src={pageHeroVideo} />
        <div className="page-hero__orb page-hero__orb--1" />
        <div className="page-hero__orb page-hero__orb--2" />
        <div className="container">
          <span className="section-tag">Flexible & Transparent Pricing</span>
          <h1 className="page-hero__title">
            Pricing Built Around<br />
            <span className="gradient-text">Your Business Goals</span>
          </h1>
          <p className="page-hero__sub">
            Start with a clear package or get a tailored quote for complex software, apps and AI solutions.
          </p>
          <div className="page-hero__actions" data-hero-actions="pricing">
            <Link to="/contact" className="btn-primary">Get Custom Quote</Link>
            <a href="#pricing-plans" className="btn-outline">Explore Pricing <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="section pricing-packages" id="pricing-plans">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Website Packages</span>
            <h2 className="section-title">Choose a Clear <span className="gradient-text">Starting Point</span></h2>
            <p className="section-subtitle">Simple packages for common requirements. Complex products receive a tailored scope and quote.</p>
          </div>

          <div className="pricing-grid">
            {packages.map((plan) => (
              <article key={plan.name} className={'pricing-card ' + (plan.popular ? 'pricing-card--popular' : '')} style={{ '--card-color': plan.color }}>
                {plan.popular && <div className="pricing-card__badge">Most Popular</div>}
                <div className="pricing-card__header">
                  <span className="pricing-card__eyebrow">{plan.eyebrow}</span>
                  <h3 className="pricing-card__name">{plan.name}</h3>
                  <p className="pricing-card__tagline">{plan.description}</p>
                  <div className="pricing-card__price">
                    <span className="pricing-card__amount">{plan.price}</span>
                  </div>
                  <span className="pricing-card__note">{plan.note}</span>
                </div>
                <div className="pricing-card__body">
                  <ul className="pricing-card__features">
                    {plan.features.map((feature) => (
                      <li key={feature} className="pricing-card__feature pricing-card__feature--yes">
                        <Check className="pricing-card__check-icon" size={17} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pricing-card__footer">
                  <a href={whatsappLink('Hi! I am interested in the ' + plan.name + ' package.')} target="_blank" rel="noreferrer" className={plan.popular ? 'btn-primary' : 'btn-outline'}>
                    {plan.cta} <ArrowRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="pricing-note">
            <ShieldCheck size={18} />
            All amounts are starting prices. Final pricing is confirmed after scope, integrations and timeline review.
          </div>
        </div>
      </section>

      <section className="section pricing-services">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Service Price Guide</span>
            <h2 className="section-title">Starting Prices Across <span className="gradient-text">Our Services</span></h2>
            <p className="section-subtitle">A practical budget guide before we prepare your detailed proposal.</p>
          </div>
          <div className="pricing-services__grid">
            {servicePrices.map(({ icon: Icon, name, price, detail }) => (
              <article className="pricing-service-card" key={name}>
                <div className="pricing-service-card__icon"><Icon size={22} /></div>
                <div className="pricing-service-card__content">
                  <h3>{name}</h3>
                  <p>{detail}</p>
                </div>
                <strong>{price}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing-strategy-section">
        <div className="container">
          <div className="pricing-strategy-grid">
            <div className="pricing-strategy-card">
              <div className="pricing-strategy-card__icon"><Search size={25} /></div>
              <span className="section-tag">Paid Discovery</span>
              <h2>Clarity before development</h2>
              <p>We map workflows, requirements, integrations and technical architecture before estimating complex products.</p>
              <div className="pricing-strategy-card__price">₹4,999 <span>small projects</span></div>
              <div className="pricing-strategy-card__price">₹9,999–₹24,999 <span>custom software</span></div>
              <small>Discovery cost can be adjusted in the final invoice when the project proceeds with us.</small>
            </div>

            <div className="pricing-strategy-card pricing-strategy-card--ai">
              <div className="pricing-strategy-card__icon"><Bot size={25} /></div>
              <span className="section-tag">AI Hybrid Pricing</span>
              <h2>Predictable setup, transparent usage</h2>
              <p>AI and voice solutions combine a one-time implementation fee with ongoing management and actual usage.</p>
              <div className="pricing-formula">
                <span>Setup fee</span><b>+</b><span>Monthly management</span><b>+</b><span>API / call usage</span>
              </div>
              <small>Third-party usage is billed separately or at actual cost plus the agreed 15–25% management margin.</small>
            </div>
          </div>

          {/* Payment milestones - temporarily hidden
          <div className="pricing-process">
            <div className="pricing-process__intro">
              <span className="section-tag">Payment Milestones</span>
              <h2>Pay as the project progresses</h2>
              <p>Every milestone is connected to a visible deliverable.</p>
            </div>
            {[
              { value: '40%', label: 'Project booking', icon: CreditCard },
              { value: '30%', label: 'Design approval', icon: Palette },
              { value: '20%', label: 'Development complete', icon: Gauge },
              { value: '10%', label: 'Final deployment', icon: Rocket },
            ].map(({ value, label, icon: Icon }, index) => (
              <div className="pricing-process__step" key={label}>
                <span className="pricing-process__number">0{index + 1}</span>
                <Icon size={21} />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          */}
        </div>
      </section>

      <section className="section pricing-maintenance">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Ongoing Support</span>
            <h2 className="section-title">Protect Your <span className="gradient-text">Investment</span></h2>
            <p className="section-subtitle">Optional monthly care plans for security, reliability and responsive support.</p>
          </div>
          <div className="maintenance-grid">
            {maintenancePlans.map((plan) => (
              <article className={'maintenance-card ' + (plan.popular ? 'maintenance-card--popular' : '')} key={plan.name}>
                {plan.popular && <span className="maintenance-card__badge">Recommended</span>}
                <h3>{plan.name}</h3>
                <p>{plan.ideal}</p>
                <div className="maintenance-card__price">{plan.price}<span>/month</span></div>
                <ul>
                  {plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}
                </ul>
                <a href={whatsappLink('Hi! I want to know more about the ' + plan.name + ' maintenance plan.')} target="_blank" rel="noreferrer">Discuss Plan <ArrowRight size={16} /></a>
              </article>
            ))}
          </div>
          <p className="maintenance-note">New modules, redesigns and major features are quoted separately from maintenance.</p>
        </div>
      </section>

      <section className="section pricing-faq">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Pricing, Without the <span className="gradient-text">Confusion</span></h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className={'faq-item ' + (openFaq === index ? 'faq-item--open' : '')} key={faq.q}>
                <button className="faq-item__q" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {faq.q}
                  <span className={'faq-item__arrow ' + (openFaq === index ? 'faq-item__arrow--open' : '')}>↓</span>
                </button>
                <div className="faq-item__a"><p>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing-final-cta">
        <div className="container">
          <div className="pricing-final-cta__inner">
            <div>
              <span className="section-tag">Not Sure Where to Start?</span>
              <h2>Tell us your goal. We will recommend the right scope.</h2>
              <p>Free 20–30 minute consultation · Clear proposal · No hidden costs</p>
            </div>
            <div className="pricing-final-cta__actions">
              <Link to="/contact" className="btn-primary">Get Custom Quote <ArrowRight size={18} /></Link>
              <a href={whatsappLink('Hi! I need help choosing the right package for my project.')} target="_blank" rel="noreferrer" className="btn-outline">
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}