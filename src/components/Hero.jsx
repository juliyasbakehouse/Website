import Button from './Button.jsx'
import Reveal from './Reveal.jsx'
import { asset } from '../lib/asset.js'

export default function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col bg-(--color-bg) md:flex-row md:items-center md:gap-8 md:px-6 lg:px-12">
      <div className="relative h-[48vh] shrink-0 overflow-hidden md:h-[76vh] md:w-1/2 md:rounded-[2rem]">
        <img
          src={asset('gallery/hero-chocolate-cake.png')}
          alt="A rich chocolate ganache cake with piped rosettes and chocolate shards"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_28px_var(--color-bg)] md:rounded-[2rem] md:shadow-[inset_0_0_90px_36px_var(--color-bg)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-(--color-bg) to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-r from-transparent to-(--color-bg) md:block lg:w-40" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-(--color-bg) to-transparent"
        aria-hidden="true"
      />

      <div className="flex flex-1 items-center px-6 py-14 md:px-4 lg:px-6">
        <Reveal className="max-w-xl">
          <p className="eyebrow mb-5">Small-batch &middot; Hand-finished</p>
          <h1 className="text-balance text-5xl leading-[1.05] text-(--color-ink) md:text-6xl lg:text-7xl">
            A cake worth <em className="text-(--color-gold-bright) not-italic italic">celebrating</em>
          </h1>
          <p className="mt-6 max-w-md text-base text-(--color-ink-dim) md:text-lg">
            Layered, hand-finished, and baked to order for your next celebration.
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
