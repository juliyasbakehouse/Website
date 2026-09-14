import { Clock, InstagramLogo, MapPin, Phone } from '@phosphor-icons/react'
import { useState } from 'react'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import { asset } from '../lib/asset.js'

const OCCASIONS = ['Birthday', 'Wedding', 'Corporate event', 'Anniversary', 'Just because']

const initialForm = { name: '', email: '', date: '', occasion: OCCASIONS[0], message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!form.message.trim()) errors.message = 'Tell us a little about your cake.'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      // NOTE: no backend is wired up yet — connect this to an email/service
      // endpoint (e.g. Formspree, a serverless function) before launch.
      setSubmitted(true)
    }
  }

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <section className="container-page mb-16 md:mb-20">
        <Reveal>
          <p className="eyebrow mb-4">Order &amp; contact</p>
          <h1 className="max-w-2xl text-balance text-4xl leading-tight text-(--color-ink) md:text-6xl">
            Let&rsquo;s plan your cake
          </h1>
          <p className="mt-5 max-w-lg text-base text-(--color-ink-dim)">
            Tell us your date, guest count, and flavours in mind. We reply to every enquiry within one business
            day.
          </p>
        </Reveal>
      </section>

      <section className="container-page grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
        <Reveal>
          {submitted ? (
            <div className="rounded-[1.75rem] border border-(--color-gold)/40 bg-(--color-bg-raised) p-10 text-center">
              <h2 className="font-display text-2xl text-(--color-ink)">Thank you, {form.name.split(' ')[0]}!</h2>
              <p className="mt-3 text-sm leading-relaxed text-(--color-ink-dim)">
                Your enquiry has been recorded. We&rsquo;ll reach out at {form.email} within one business day to
                talk flavours and design.
              </p>
              <Button
                type="button"
                variant="ghost"
                className="mt-6"
                icon={false}
                onClick={() => {
                  setForm(initialForm)
                  setSubmitted(false)
                }}
              >
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-(--color-ink-dim)">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className="rounded-xl border border-(--color-line-strong) bg-(--color-bg-raised) px-4 py-3 text-sm text-(--color-ink) outline-none transition-colors focus:border-(--color-gold)"
                    placeholder="Ananya Rao"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-(--color-ink-dim)">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className="rounded-xl border border-(--color-line-strong) bg-(--color-bg-raised) px-4 py-3 text-sm text-(--color-ink) outline-none transition-colors focus:border-(--color-gold)"
                    placeholder="you@email.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="date" className="text-sm font-medium text-(--color-ink-dim)">
                    Event date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                    className="rounded-xl border border-(--color-line-strong) bg-(--color-bg-raised) px-4 py-3 text-sm text-(--color-ink) outline-none transition-colors focus:border-(--color-gold) [color-scheme:dark]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="occasion" className="text-sm font-medium text-(--color-ink-dim)">
                    Occasion
                  </label>
                  <select
                    id="occasion"
                    value={form.occasion}
                    onChange={(e) => update('occasion', e.target.value)}
                    className="rounded-xl border border-(--color-line-strong) bg-(--color-bg-raised) px-4 py-3 text-sm text-(--color-ink) outline-none transition-colors focus:border-(--color-gold)"
                  >
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-(--color-ink-dim)">
                  Tell us about your cake
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className="resize-none rounded-xl border border-(--color-line-strong) bg-(--color-bg-raised) px-4 py-3 text-sm text-(--color-ink) outline-none transition-colors focus:border-(--color-gold)"
                  placeholder="Guest count, flavours, colours, any inspiration photos you have in mind..."
                />
                {errors.message && (
                  <p id="message-error" className="text-xs text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button type="submit" variant="gold" className="self-start">
                Send enquiry
              </Button>
            </form>
          )}
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-6">
          <div className="rounded-[1.75rem] border border-(--color-line) bg-(--color-bg-raised) p-7">
            <p className="eyebrow mb-5">Reach us directly</p>
            <ul className="flex flex-col gap-4 text-sm text-(--color-ink-dim)">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-(--color-gold)" />
                <span>Mulanthuruthy, Kochi, Kerala &mdash; home bakery, orders only</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-(--color-gold)" />
                <a href="tel:+919778015944" className="transition-colors hover:text-(--color-gold-bright)">
                  +91 97780 15944
                </a>
              </li>
              <li className="flex items-start gap-3">
                <InstagramLogo size={18} className="mt-0.5 shrink-0 text-(--color-gold)" />
                <a
                  href="https://www.instagram.com/juliya_s_bakehouse/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-(--color-gold-bright)"
                >
                  @juliya_s_bakehouse
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-(--color-gold)" />
                <span>Orders by call or Instagram DM &mdash; no walk-in counter.</span>
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-(--color-line)">
            <img
              src={asset('gallery/kids-birthday-cars.png')}
              alt="A personalized Bakehouse cake"
              className="aspect-square w-full object-cover"
            />
          </div>
        </Reveal>
      </section>
    </div>
  )
}
