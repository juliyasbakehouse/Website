import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const PAGE_SIZE = 3
const AUTO_ADVANCE_MS = 7000

export default function TestimonialsCarousel({ testimonials }) {
  const pageCount = Math.ceil(testimonials.length / PAGE_SIZE)
  const [page, setPage] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (pageCount <= 1) return
    const id = setInterval(() => setPage((p) => (p + 1) % pageCount), AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [pageCount])

  const items = Array.from({ length: Math.min(PAGE_SIZE, testimonials.length) }, (_, i) => {
    const idx = (page * PAGE_SIZE + i) % testimonials.length
    return testimonials[idx]
  })

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 md:grid-cols-3"
        >
          {items.map((t) => (
            <figure
              key={t.id}
              className="flex h-full flex-col justify-between rounded-[1.5rem] border border-(--color-line) bg-(--color-bg-raised) p-7"
            >
              <blockquote className="font-display text-lg leading-snug text-(--color-ink)">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-(--color-ink-faint)">
                <span className="font-semibold text-(--color-ink-dim)">{t.name}</span> &middot; {t.role}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </AnimatePresence>

      {pageCount > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Show reviews, set ${i + 1} of ${pageCount}`}
              aria-current={i === page}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === page ? 'w-6 bg-(--color-gold)' : 'w-2 bg-(--color-line-strong) hover:bg-(--color-gold-dim)'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
