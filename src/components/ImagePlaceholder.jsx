import { Cake } from '@phosphor-icons/react'

export default function ImagePlaceholder({ className = '' }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-(--color-bg-raised-2) via-(--color-bg-raised) to-(--color-bg) ${className}`}
    >
      <Cake size={36} weight="thin" className="text-(--color-gold-dim)" />
    </div>
  )
}
