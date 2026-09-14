import { motion, useReducedMotion } from 'motion/react'

export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 24,
  className = '',
  amount = 0.3,
  once = true,
}) {
  const reduce = useReducedMotion()
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
