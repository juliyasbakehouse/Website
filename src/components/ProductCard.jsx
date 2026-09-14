import { Link } from 'react-router-dom'
import ImagePlaceholder from './ImagePlaceholder.jsx'
import Reveal from './Reveal.jsx'

export default function ProductCard({ item, delay = 0 }) {
  return (
    <Reveal delay={delay} className="group h-full">
      <Link
        to={`/menu/${item.slug}`}
        className="flex h-full flex-col rounded-[1.75rem] border border-(--color-line) bg-(--color-bg-raised) p-2 transition-colors duration-300 hover:border-(--color-gold)/40"
      >
        <div className="relative overflow-hidden rounded-[1.4rem]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
              className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="aspect-4/3 w-full" />
          )}
          {item.tag && (
            <span className="absolute left-3 top-3 rounded-full bg-(--color-bg)/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--color-gold-bright) backdrop-blur">
              {item.tag}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl text-(--color-ink)">{item.name}</h3>
            <span className="shrink-0 font-display text-lg text-(--color-gold-bright)">{item.price}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-(--color-ink-faint)">{item.desc}</p>
          <p className="mt-auto pt-3 text-xs uppercase tracking-[0.14em] text-(--color-ink-faint)/80">
            {item.serves}
          </p>
        </div>
      </Link>
    </Reveal>
  )
}
