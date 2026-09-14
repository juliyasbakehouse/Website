import { Heart, Leaf, Sparkle } from '@phosphor-icons/react'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'

const VALUES = [
  {
    icon: Heart,
    title: 'Made by hand',
    desc: 'No shortcuts, no premixes. Every rose, drip, and layer is shaped by hand in our kitchen.',
  },
  {
    icon: Leaf,
    title: 'Real ingredients',
    desc: 'Couverture chocolate, fresh cream, and seasonal fruit. Nothing artificial goes into a Bakehouse cake.',
  },
  {
    icon: Sparkle,
    title: 'Made for the moment',
    desc: 'Every commission is designed around your event, not pulled off a shelf.',
  },
]

const STATS = [
  { value: '8+', label: 'Years baking' },
  { value: '500+', label: 'Cakes delivered' },
  { value: '4.9/5', label: 'Average client rating' },
  { value: '48hr', label: 'Typical turnaround' },
]

export default function About() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <section className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Our story</p>
            <h1 className="text-balance text-4xl leading-tight text-(--color-ink) md:text-6xl">
              A kitchen built around one cake at a time
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-(--color-ink-dim)">
              Juliya&rsquo;s Bakehouse started as a home kitchen experiment: could a cake made entirely by hand,
              without shortcuts, still be ready in time for a Tuesday birthday party? Years later, that same
              question still shapes every order &mdash; small batches, real ingredients, and enough time to finish
              every detail properly.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <img
              src="/gallery/close-pour.jpg"
              alt="Ganache being poured by hand over a Bakehouse cake"
              className="aspect-4/5 w-full rounded-[2rem] object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <Reveal className="mx-auto mb-14 max-w-lg text-center">
          <h2 className="text-balance text-3xl text-(--color-ink) md:text-5xl">What we believe in</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <div className="flex flex-col items-start gap-4 rounded-[1.5rem] border border-(--color-line) bg-(--color-bg-raised) p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-bg-raised-2) text-(--color-gold)">
                  <v.icon size={22} weight="light" />
                </span>
                <h3 className="font-display text-xl text-(--color-ink)">{v.title}</h3>
                <p className="text-sm leading-relaxed text-(--color-ink-faint)">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-(--color-line) bg-(--color-bg-raised)">
        <div className="container-page grid grid-cols-2 gap-8 py-16 md:grid-cols-4 md:py-20">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <p className="font-display text-4xl text-(--color-gold-bright) md:text-5xl">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-(--color-ink-faint)">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <h2 className="text-balance text-3xl text-(--color-ink) md:text-5xl">From the kitchen</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2 md:row-span-2">
            <img
              src="/gallery/tiered-cake-truffles.jpg"
              alt="Two-tier chocolate cake with gold dragees and truffles"
              className="aspect-4/3 h-full w-full rounded-[1.75rem] object-cover md:aspect-auto"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <img
              src="/gallery/rose-and-citrus.jpg"
              alt="Chocolate rose and candied citrus detail on a cake"
              className="aspect-4/3 w-full rounded-[1.75rem] object-cover"
            />
          </Reveal>
          <Reveal delay={0.14}>
            <img
              src="/gallery/cocoa-burst.jpg"
              alt="Cocoa powder bursting around a fresh cake tier"
              className="aspect-4/3 w-full rounded-[1.75rem] object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-8">
        <Reveal className="flex flex-col items-center gap-6 rounded-[2rem] border border-(--color-line) bg-(--color-bg-raised) px-6 py-16 text-center md:py-20">
          <h2 className="text-balance text-3xl text-(--color-ink) md:text-5xl">Let&rsquo;s bake something together</h2>
          <p className="max-w-md text-base text-(--color-ink-dim)">
            Browse the menu for inspiration, or reach out directly with your event date and vision.
          </p>
          <Button to="/contact" variant="gold">
            Order now
          </Button>
        </Reveal>
      </section>
    </div>
  )
}
