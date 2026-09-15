import { CaretLeft, MagnifyingGlassPlus } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Reveal from '../components/Reveal.jsx'
import { findProductBySlug, getCategoryItems, useCatalog } from '../context/DataContext.jsx'

export default function Product() {
  const { slug } = useParams()
  const { categories: categoryMeta, products, loading } = useCatalog()
  const item = findProductBySlug(products, slug)
  const [active, setActive] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [prevSlug, setPrevSlug] = useState(slug)
  if (slug !== prevSlug) {
    setPrevSlug(slug)
    setActive(0)
    setLightboxIndex(null)
  }

  if (loading) {
    return (
      <div className="container-page pt-28 pb-24 md:pt-36 md:pb-32">
        <p className="text-(--color-ink-faint)">Loading&hellip;</p>
      </div>
    )
  }

  if (!item) {
    return <Navigate to="/menu" replace />
  }

  const activeImage = item.images[active] ?? item.images[0]
  const categories = item.categories.map((id) => categoryMeta.find((c) => c.id === id)).filter(Boolean)
  const primaryCategory = categories[0]
  const related = getCategoryItems(products, primaryCategory.id)
    .filter((i) => i.slug !== item.slug)
    .slice(0, 3)

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <section className="container-page mb-10 md:mb-14">
        <Reveal>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm text-(--color-ink-faint) transition-colors hover:text-(--color-gold)"
          >
            <CaretLeft size={14} weight="bold" />
            Back to menu
          </Link>
        </Reveal>
      </section>

      <section className="container-page">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem]">
              {activeImage ? (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(active)}
                  className="group block w-full cursor-zoom-in"
                  aria-label={`Open ${item.name} photo full screen`}
                >
                  <img
                    src={activeImage}
                    alt={item.name}
                    style={active === 0 && item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                    className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-(--color-bg)/80 px-3 py-1.5 text-xs text-(--color-ink-dim) backdrop-blur">
                    <MagnifyingGlassPlus size={14} />
                    Tap to zoom
                  </span>
                </button>
              ) : (
                <ImagePlaceholder className="aspect-4/3 w-full" />
              )}
              {item.tag && (
                <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-(--color-bg)/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--color-gold-bright) backdrop-blur">
                  {item.tag}
                </span>
              )}
            </div>

            {item.images.length > 1 && (
              <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
                {item.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show photo ${i + 1} of ${item.images.length}`}
                    aria-current={i === active}
                    className={`shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                      i === active ? 'border-(--color-gold)' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="aspect-4/3 w-20 object-cover md:w-24" />
                  </button>
                ))}
              </div>
            )}

            <Lightbox
              images={item.images}
              index={lightboxIndex}
              alt={item.name}
              onClose={() => setLightboxIndex(null)}
              onIndexChange={(i) => {
                setLightboxIndex(i)
                setActive(i)
              }}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">{categories.map((c) => c.label).join(' · ')}</p>
            <h1 className="text-balance text-4xl leading-tight text-(--color-ink) md:text-5xl">{item.name}</h1>
            <p className="mt-5 font-display text-3xl text-(--color-gold-bright)">{item.price}</p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-(--color-ink-dim)">{item.desc}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-(--color-ink-faint)">{item.serves}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button to="/contact" variant="gold">
                Order now
              </Button>
              <Button href="tel:+919778015944" variant="ghost" icon={false}>
                Call to enquire
              </Button>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-(--color-ink-faint)">
              Price is a starting guide. Custom sizes, flavours, and dietary swaps are always available on
              request.
            </p>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page mt-24 md:mt-32">
          <Reveal className="mb-10">
            <h2 className="text-balance text-2xl text-(--color-ink) md:text-3xl">More from {primaryCategory.label}</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((relatedItem) => (
              <Reveal key={relatedItem.slug}>
                <Link
                  to={`/menu/${relatedItem.slug}`}
                  className="block rounded-[1.75rem] border border-(--color-line) bg-(--color-bg-raised) p-2 transition-colors duration-300 hover:border-(--color-gold)/40"
                >
                  <div className="overflow-hidden rounded-[1.4rem]">
                    {relatedItem.image ? (
                      <img
                        src={relatedItem.image}
                        alt={relatedItem.name}
                        style={relatedItem.imagePosition ? { objectPosition: relatedItem.imagePosition } : undefined}
                        className="aspect-4/3 w-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder className="aspect-4/3 w-full" />
                    )}
                  </div>
                  <div className="px-3 pb-3 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg text-(--color-ink)">{relatedItem.name}</h3>
                      <span className="shrink-0 font-display text-base text-(--color-gold-bright)">
                        {relatedItem.price}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
