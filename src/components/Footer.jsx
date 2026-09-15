import { InstagramLogo, MapPin, Phone } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-(--color-line) bg-(--color-bg-raised)">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          <Logo height={110} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-(--color-ink-faint)">
            Handcrafted celebration cakes and chocolate patisserie, baked to order in small batches.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/juliya_s_bakehouse/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-line-strong) text-(--color-ink-dim) transition-colors duration-200 hover:border-(--color-gold)/60 hover:text-(--color-gold)"
            >
              <InstagramLogo size={17} />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="flex flex-col gap-3 text-sm text-(--color-ink-dim)">
            <li>
              <NavLink to="/menu" className="transition-colors hover:text-(--color-gold-bright)">
                Menu
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="transition-colors hover:text-(--color-gold-bright)">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="transition-colors hover:text-(--color-gold-bright)">
                Order &amp; Contact
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Order With Us</p>
          <ul className="flex flex-col gap-3 text-sm text-(--color-ink-dim)">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-(--color-gold)" />
              <span>Mulanthuruthy, Kochi, Kerala. Home bakery, orders only.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-(--color-gold)" />
              <a href="tel:+919778015944" className="transition-colors hover:text-(--color-gold-bright)">
                +91 97780 15944
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <InstagramLogo size={16} className="mt-0.5 shrink-0 text-(--color-gold)" />
              <a
                href="https://www.instagram.com/juliya_s_bakehouse/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-(--color-gold-bright)"
              >
                @juliya_s_bakehouse
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-(--color-line)">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-(--color-ink-faint) md:flex-row">
          <p>&copy; {new Date().getFullYear()} Juliya&rsquo;s Bakehouse. All rights reserved.</p>
          <p>Menu items and prices are illustrative. DM or call to confirm current offerings.</p>
        </div>
      </div>
    </footer>
  )
}
