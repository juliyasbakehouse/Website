import { asset } from '../lib/asset.js'

export default function Logo({ className = '', height }) {
  return (
    <img
      src={asset('brand/logo-light.svg')}
      alt="Juliya's Bakehouse"
      style={height ? { height } : undefined}
      className={height ? className : className || 'h-10 w-auto'}
    />
  )
}
