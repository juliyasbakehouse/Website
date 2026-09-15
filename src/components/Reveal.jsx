import { motion, useReducedMotion } from 'motion/react'
import { useContext } from 'react'
import { SliderContext } from './MobileSlider.jsx'

export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 24,
  className = '',
  amount = 0.1,
  once = true,
}) {
  const prefersReduced = useReducedMotion()
  const inMobileSlider = useContext(SliderContext)
  const reduce = prefersReduced || inMobileSlider
  const MotionTag = motion[Tag] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}
