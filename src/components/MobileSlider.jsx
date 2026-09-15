import { Children, createContext, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const MOBILE_QUERY = '(max-width: 767px)'

// Slides clipped by the horizontal scroller never intersect the viewport, so
// scroll reveals inside a slide would stay invisible until swiped to.
export const SliderContext = createContext(false)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

export default function MobileSlider({ children, desktopClassName = '', interval = 5000, label = 'slide' }) {
  const slides = Children.toArray(children)
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [touching, setTouching] = useState(false)
  const isMobile = useIsMobile()
  const reduce = useReducedMotion()

  const goTo = (i) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: i * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    if (!isMobile || reduce || touching || slides.length < 2) return
    const id = setTimeout(() => goTo((active + 1) % slides.length), interval)
    return () => clearTimeout(id)
  })

  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    const i = Math.round(track.scrollLeft / track.clientWidth)
    if (i !== active) setActive(i)
  }

  return (
    <SliderContext.Provider value={isMobile}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onTouchStart={() => setTouching(true)}
        onTouchEnd={() => setTouching(false)}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:overflow-visible ${desktopClassName}`}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.key ?? i}
            className="w-full shrink-0 snap-center px-1 md:w-auto md:px-0"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="mt-8 flex justify-center gap-2 md:hidden">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${label} ${i + 1} of ${slides.length}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-(--color-gold)' : 'w-2 bg-(--color-line-strong)'
              }`}
            />
          ))}
        </div>
      )}
    </SliderContext.Provider>
  )
}
