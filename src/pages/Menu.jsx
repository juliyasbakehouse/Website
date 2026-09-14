import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { CATEGORIES } from '../data/menu.js'

export default function Menu() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id)
  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0]

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <section className="container-page mb-14 md:mb-20">
        <Reveal>
          <p className="eyebrow mb-4">The menu</p>
          <h1 className="max-w-2xl text-balance text-4xl leading-tight text-(--color-ink) md:text-6xl">
            Cakes, pastries, and custom commissions
          </h1>
          <p className="mt-5 max-w-lg text-base text-(--color-ink-dim)">
            Every item below is baked to order. Prices are a starting guide &mdash; custom sizes, flavours, and
            dietary swaps are always available on request.
          </p>
        </Reveal>
      </section>

      <div className="container-page mb-10 flex flex-wrap gap-2 md:mb-14">
        {CATEGORIES.map((cat) => (
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

      <section className="container-page">
        <Reveal key={active.id} className="mb-8 max-w-xl">
          <p className="text-sm leading-relaxed text-(--color-ink-faint)">{active.blurb}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {active.items.map((item, i) => (
            <ProductCard key={item.name} item={item} delay={i * 0.06} />
          ))}
        </div>
      </section>
    </div>
  )
}
