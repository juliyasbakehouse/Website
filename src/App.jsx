import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import RequireAuth from './components/admin/RequireAuth.jsx'
import Footer from './components/Footer.jsx'
import Nav from './components/Nav.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminProductForm from './pages/admin/AdminProductForm.jsx'
import AdminTestimonials from './pages/admin/AdminTestimonials.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import Product from './pages/Product.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function SiteLayout({ children }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-(--color-bg)">
      <div className="noise-overlay" aria-hidden="true" />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <SiteLayout>
                <Home />
              </SiteLayout>
            }
          />
          <Route
            path="/menu"
            element={
              <SiteLayout>
                <Menu />
              </SiteLayout>
            }
          />
          <Route
            path="/menu/:slug"
            element={
              <SiteLayout>
                <Product />
              </SiteLayout>
            }
          />
          <Route
            path="/about"
            element={
              <SiteLayout>
                <About />
              </SiteLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <SiteLayout>
                <Contact />
              </SiteLayout>
            }
          />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RequireAuth>
                <AdminCategories />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <RequireAuth>
                <AdminProductForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/products/:slug/edit"
            element={
              <RequireAuth>
                <AdminProductForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <RequireAuth>
                <AdminTestimonials />
              </RequireAuth>
            }
          />
        </Routes>
      </ToastProvider>
    </DataProvider>
  )
}
