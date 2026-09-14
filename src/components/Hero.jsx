import Button from './Button.jsx'
import Reveal from './Reveal.jsx'

export default function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-(--color-bg)">
      <img
        src="/gallery/chocolate-drip-cake.jpg"
        alt="Dark chocolate cake finished with hand-piped chocolate roses and candied citrus"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/55" />

      <div className="container-page relative z-10">
        <Reveal className="max-w-xl">
          <p className="eyebrow mb-5">Small-batch &middot; Hand-finished</p>
          <h1 className="text-balance text-5xl leading-[1.05] text-(--color-ink) md:text-7xl">
            A cake worth <em className="text-(--color-gold-bright) not-italic italic">watching</em>
          </h1>
          <p className="mt-6 max-w-md text-base text-(--color-ink-dim) md:text-lg">
            Dark chocolate, hand-piped roses, and citrus, layered to order for your next celebration.
          </p>
          <div className="mt-9">
            <Button to="/menu" variant="gold">
              Explore the menu
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
