import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { getCategoryItems, useCatalog } from '../context/DataContext.jsx'

export default function Menu() {
  const { categories, products, loading } = useCatalog()
  const [activeId, setActiveId] = useState(null)

  const nonEmptyCategories = useMemo(
    () => categories.filter((cat) => getCategoryItems(products, cat.id).length > 0),
    [categories, products],
  )

  useEffect(() => {
    if (!activeId && nonEmptyCategories.length > 0) {
      setActiveId(nonEmptyCategories[0].id)
    }
  }, [activeId, nonEmptyCategories])

  const active = nonEmptyCategories.find((c) => c.id === activeId) ?? nonEmptyCategories[0]
  const activeItems = active ? getCategoryItems(products, active.id) : []

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <section className="container-page mb-10 md:mb-14">
        <Reveal className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="eyebrow mb-4">The menu</p>
            <h1 className="text-balance text-4xl leading-tight text-(--color-ink) md:text-5xl lg:text-6xl">
              Cakes, pastries, and custom commissions
            </h1>
          </div>
          <p className="max-w-lg text-base text-(--color-ink-dim) md:pb-2">
            Every item below is baked to order. Prices are a starting guide. Custom sizes, flavours, and
            dietary swaps are always available on request.
          </p>
        </Reveal>
      </section>

      {loading || !active ? (
        <section className="container-page">
          <p className="text-(--color-ink-faint)">Loading the menu&hellip;</p>
        </section>
      ) : (
        <>
          <div className="container-page mb-8 md:mb-10">
            <div className="flex flex-col gap-4 border-t border-(--color-line) pt-8 md:flex-row md:items-center md:justify-between md:gap-10">
              <div className="flex flex-wrap gap-2">
                {nonEmptyCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveId(cat.id)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      activeId === cat.id
                        ? 'border-(--color-gold) bg-(--color-gold) text-[#181109]'
                        : 'border-(--color-line-strong) text-(--color-ink-dim) hover:text-(--color-ink)'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <Reveal key={active.id} className="max-w-sm md:text-right">
                <p className="text-sm leading-relaxed text-(--color-ink-faint)">{active.blurb}</p>
              </Reveal>
            </div>
          </div>

          <section className="container-page">
            <div className="grid gap-6 md:grid-cols-3">
              {activeItems.map((item, i) => (
                <ProductCard key={item.slug} item={item} delay={i * 0.06} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
