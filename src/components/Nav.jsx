import { InstagramLogo, List, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from './Button.jsx'
import Logo from './Logo.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
        <nav
          className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-4 py-2 transition-colors duration-300 md:px-6 ${
            scrolled
              ? 'border-(--color-line-strong) bg-(--color-bg)/95'
              : 'border-(--color-line) bg-(--color-bg)/60'
          }`}
        >
          <NavLink
            to="/"
            aria-label="Juliya's Bakehouse home"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <Logo className="h-14 md:h-16" />
            <span className="font-display text-xl leading-none text-(--color-ink) md:text-2xl">
              Juliya&rsquo;s <span className="italic text-(--color-gold-bright)">Bakehouse</span>
            </span>
          </NavLink>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-(--color-bg-raised-2) text-(--color-gold-bright)'
                      : 'text-(--color-ink-dim) hover:text-(--color-ink)'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:block">
            <Button to="/contact" variant="gold" className="!py-1.5 !pl-5 text-xs">
              Order now
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-(--color-ink) md:hidden"
          >
            <List size={20} className={`absolute transition-all duration-300 ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
            <X size={20} className={`absolute transition-all duration-300 ${open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-(--color-bg)/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="container-page flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 font-display text-4xl ${isActive ? 'text-(--color-gold-bright)' : 'text-(--color-ink)'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * LINKS.length, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex items-center gap-6"
              >
                <Button to="/contact" variant="gold" onClick={() => setOpen(false)}>
                  Order now
                </Button>
                <a
                  href="https://www.instagram.com/juliya_s_bakehouse/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-(--color-line-strong) text-(--color-ink-dim) transition-colors hover:text-(--color-gold)"
                >
                  <InstagramLogo size={18} />
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
