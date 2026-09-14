import Button from '../components/Button.jsx'
import Hero from '../components/Hero.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { useCatalog } from '../context/DataContext.jsx'

const PROCESS = [
  {
    image: '/gallery/process-planning.png',
    step: '01',
    title: 'Tell us the occasion',
    desc: 'Share the date, guest count, and flavours you love. We reply within a day with options.',
  },
  {
    image: '/gallery/process-baking.png',
    step: '02',
    title: 'We design & bake',
    desc: 'Every tier is baked fresh and finished by hand, two to three days before your event.',
  },
  {
    image: '/gallery/process-delivery.png',
    step: '03',
    title: 'Delivered on time',
    desc: 'Chilled delivery or studio pickup, timed to arrive picture-perfect for your event.',
  },
]

const FEATURED_SLUGS = ['first-birthday-fairy-cake', 'angel-wings-christening-cake', 'milestone-chapter-cake']

export default function Home() {
  const { products, testimonials } = useCatalog()
  const featured = FEATURED_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean)

  return (
    <>
      <Hero />

      <section className="container-page py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <img
              src="/gallery/golden-drape-50th-cake.png"
              alt="A Bakehouse cake finished by hand"
              className="aspect-4/3 w-full rounded-[2rem] object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-balance text-3xl leading-tight text-(--color-ink) md:text-5xl">
              Baked in small batches, finished the same day it&rsquo;s picked up
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-(--color-ink-dim)">
              Juliya&rsquo;s Bakehouse is a home-grown patisserie built around one idea: dessert should be an
              occasion. Every cake is baked to order, never from a freezer, and finished by hand the morning it
              leaves the kitchen.
            </p>
            <div className="mt-8">
              <Button to="/about" variant="ghost">
                Our story
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">Fan favourites</p>
            <h2 className="text-balance text-3xl text-(--color-ink) md:text-5xl">A few of our favourites</h2>
          </div>
          <Button to="/menu" variant="ghost" className="shrink-0">
            View full menu
          </Button>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((item, i) => (
            <ProductCard key={item.slug} item={item} delay={i * 0.08} />
          ))}
        </div>
      </section>

      <section className="border-y border-(--color-line) bg-(--color-bg-raised)">
        <div className="container-page py-20 md:py-28">
          <Reveal className="mx-auto mb-16 max-w-lg text-center">
            <h2 className="text-balance text-3xl text-(--color-ink) md:text-5xl">How an order comes together</h2>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {PROCESS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="flex flex-col gap-4">
                  <img src={step.image} alt="" className="h-40 w-full object-contain" />
                  <div className="flex items-center justify-between border-t border-(--color-line-strong) pt-6">
                    <span className="font-display text-2xl text-(--color-gold-dim)">{step.step}</span>
                  </div>
                  <h3 className="font-display text-xl text-(--color-ink)">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-(--color-ink-faint)">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <Reveal className="mb-12 text-center">
          <h2 className="text-balance text-3xl text-(--color-ink) md:text-5xl">What clients are saying</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <figure className="flex h-full flex-col justify-between rounded-[1.5rem] border border-(--color-line) bg-(--color-bg-raised) p-7">
                <blockquote className="font-display text-lg leading-snug text-(--color-ink)">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm text-(--color-ink-faint)">
                  <span className="font-semibold text-(--color-ink-dim)">{t.name}</span> &middot; {t.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img
          src="/gallery/floral-communion-cake.png"
          alt="A finished Bakehouse celebration cake"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/30" />
        <div className="container-page relative flex flex-col items-center gap-6 py-28 text-center md:py-36">
          <Reveal>
            <h2 className="text-balance text-4xl text-(--color-ink) md:text-6xl">
              Ready to plan your cake?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-base text-(--color-ink-dim)">
              Tell us your date and flavours, and we&rsquo;ll send a design and quote within a day.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Button to="/contact" variant="gold">
              Order now
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
