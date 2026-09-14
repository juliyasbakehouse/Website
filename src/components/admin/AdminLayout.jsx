import { ArrowSquareOut, ArrowUp, Quotes, SignOut, SquaresFour, Tag } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'

const NAV = [
  { to: '/admin', label: 'Products', icon: SquaresFour, exact: true },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/testimonials', label: 'Reviews', icon: Quotes },
]

export default function AdminLayout({ title, subtitle, actions, children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    function onScroll() {
      setShowBackToTop(el.scrollTop > 300)
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  function scrollToTop() {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0a0a0c] text-[#f4ecdd] md:flex-row">
      <aside className="flex shrink-0 flex-col border-white/10 md:h-full md:w-64 md:border-r">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:border-b-0">
          <Link to="/admin" className="font-display text-lg text-[#e8c887]">
            Bakehouse
            <span className="ml-1.5 text-xs font-sans font-normal text-[#948a79]">Admin</span>
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-col md:overflow-visible">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to)
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-[#cda45e]/12 text-[#e8c887]' : 'text-[#948a79] hover:bg-white/5 hover:text-[#cabfab]'
                }`}
              >
                <Icon size={17} weight={active ? 'fill' : 'regular'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto hidden flex-col gap-1 border-t border-white/10 px-3 py-3 md:flex">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#948a79] transition-colors hover:bg-white/5 hover:text-[#cabfab]"
          >
            <ArrowSquareOut size={17} />
            View site
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#948a79] transition-colors hover:bg-white/5 hover:text-[#cabfab]"
          >
            <SignOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main ref={mainRef} className="relative flex-1 overflow-y-auto px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl text-[#f4ecdd] md:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm text-[#948a79]">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </main>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#cda45e] text-[#181109] shadow-lg shadow-black/40 transition-all duration-200 hover:bg-[#e8c887] ${
          showBackToTop ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <ArrowUp size={18} weight="bold" />
      </button>
    </div>
  )
}
