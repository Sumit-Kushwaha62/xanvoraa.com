import { createElement, lazy, Suspense, useLayoutEffect, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp'
import PixelAI from './components/PixelAI'
import ScrollToTop from './components/ScrollToTop';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { useTheme } from './ThemeContext';
import './App.css';
import './style.css';

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const About = lazy(() => import('./pages/About'))
const Career = lazy(() => import('./pages/Career'))
const Contact = lazy(() => import('./pages/Contact'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const ProtectedAdminRoute = lazy(() => import('./admin/ProtectedAdminRoute'))
const AdminLogin = lazy(() => import('./admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))


function ThemeRouteSync() {
  const { pathname } = useLocation()
  const { setPublicThemeEnabled } = useTheme()

  useLayoutEffect(() => {
    setPublicThemeEnabled(!pathname.startsWith('/admin'))
  }, [pathname, setPublicThemeEnabled])

  return null
}

function PrerenderReady() {
  const { pathname } = useLocation()
  useEffect(() => {
    const timer = window.setTimeout(() => {
      document.dispatchEvent(new Event('prerender-trigger'))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [pathname])
  return null
}

function GAPageviewTracker() {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (pathname.startsWith('/admin') || !window.gtag) return

    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname])

  return null
}

function PublicLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main style={{ marginTop: '80px' }}> {/* Space for fixed navbar */}
        <Outlet />
      </main>
      <Footer />
      <PixelAI />
      <FloatingWhatsApp />
    </div>
  );
}

function AdminLayout() {
  return createElement(AdminAuthProvider, null, createElement(Outlet))
}

function RouteFallback() {
  return createElement('main', { className: 'route-loading', 'aria-label': 'Loading page' })
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeRouteSync />
      <GAPageviewTracker />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            {/* <Route path="/pricing" element={<Pricing />} /> */}
            <Route path="/pricing" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/career" element={<Career />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<div className="container section"><h1>404 - Not Found</h1></div>} />
          </Route>
        </Routes>
        <PrerenderReady />
      </Suspense>
    </Router>
  );
}

export default App;
