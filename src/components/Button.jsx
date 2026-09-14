import { ArrowUpRight } from '@phosphor-icons/react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const base =
  'group inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-semibold tracking-wide transition-colors duration-300 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2'

const variants = {
  primary:
    'bg-(--color-cognac) text-(--color-ink) hover:bg-(--color-cognac-light) shadow-[0_8px_24px_-8px_rgba(138,74,38,0.6)]',
  gold: 'bg-(--color-gold) text-[#181109] hover:bg-(--color-gold-bright) shadow-(--shadow-gold)',
  ghost:
    'bg-transparent text-(--color-ink) border border-(--color-line-strong) hover:border-(--color-gold)/60 pr-6',
}

const PULL_FACTOR = 0.35
const SPRING = { stiffness: 300, damping: 20, mass: 0.5 }

export default function Button({ to, href, children, variant = 'primary', className = '', icon = true, ...props }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  function handleMouseMove(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * PULL_FACTOR)
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * PULL_FACTOR)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight size={16} weight="bold" />
        </span>
      )}
    </>
  )

  const cls = `${base} ${variants[variant]} ${icon ? '' : 'px-6'} ${className}`

  const magneticProps = reduceMotion
    ? {}
    : { style: { x, y }, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }

  if (to) {
    return (
      <MotionLink ref={ref} to={to} className={cls} {...magneticProps} {...props}>
        {content}
      </MotionLink>
    )
  }
  if (href) {
    return (
      <motion.a ref={ref} href={href} className={cls} {...magneticProps} {...props}>
        {content}
      </motion.a>
    )
  }
  return (
    <motion.button ref={ref} type="button" className={cls} {...magneticProps} {...props}>
      {content}
    </motion.button>
  )
}
