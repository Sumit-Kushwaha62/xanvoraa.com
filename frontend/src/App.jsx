import { useLayoutEffect, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Career from './pages/Career';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FloatingWhatsApp from './components/FloatingWhatsApp'
import PixelAI from './components/PixelAI'
import ScrollToTop from './components/ScrollToTop';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { useTheme } from './ThemeContext';
import './App.css';
import './style.css';
import './admin.css';
// import './style1.css';


function ThemeRouteSync() {
  const { pathname } = useLocation()
  const { setPublicThemeEnabled } = useTheme()

  useLayoutEffect(() => {
    setPublicThemeEnabled(!pathname.startsWith('/admin'))
  }, [pathname, setPublicThemeEnabled])

  useEffect(() => {
    // Wait a brief moment to ensure DOM/Helmet has updated before dispatching prerender event
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('prerender-trigger'))
    }, 150)
    return () => clearTimeout(timer)
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeRouteSync />
      <AdminAuthProvider>
        <Routes>
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

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/career" element={<Career />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<div className="container section"><h1>404 - Not Found</h1></div>} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
